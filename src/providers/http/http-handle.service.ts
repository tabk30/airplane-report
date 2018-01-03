/**
 * Http Intercepter Service
 * TODO: Add Loader and Toasty Service currently using console log
 * for showing errors and response and request completion;
 */
import { Injectable } from '@angular/core';
import {
  RequestOptionsArgs,
  Response,
  Request
} from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { SKLocalStorageService } from './sk-local-storage.service';
import { HttpResponseService } from './http-response.service';
import { HttpMiddlewareLayer } from './http-middleware.interface';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';


@Injectable()
export class HttpHandleService implements HttpMiddlewareLayer {
  // public loading = new Subject<{ loading: boolean, hasError: boolean, hasMsg: string }>();
  public userSession = this.storage.getObject('userSession') || {accesskey: ''};
  private checkStatus: any;
  // Accesskey refresher
  private state = 'NONE_STATE';
  private listeners = [];
  private checkAppendApi = false;
  // HttpMiddlewareLayer implementation
  nextLayer: any;

  constructor(private storage: SKLocalStorageService,
              private HttpResponseService: HttpResponseService) {
    this.nextLayer = this.HttpResponseService;
    console.log('[HttpHandleService:constructor] hello');
  }

  /**
   * Performs any type of http request.
   * @param url
   * @param options
   * @returns {Observable<Response>}
   */
  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.nextLayer.request(url, options);
  }

  /**
   * Performs a request with `get` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  public get(url: string, params?: any, options?: RequestOptionsArgs): Observable<any> {
    this.requestInterceptor();
    return this.nextLayer.get(url, params, options)
      .catch(details => {
        return Observable.throw(new Error(details));
      })
      .do((response: Response) => {
        this.onSubscribeSuccess(response);
        // console.log('response', response);
        this.checkStatus = response;
        if (this.checkStatus.status !== 'OK' && this.checkAppendApi === false) {
          this.checkAppendApi = true;
          if (this.checkStatus !== undefined || this.checkStatus.error !== undefined || this.checkStatus.error.code === 'co-00019') {
            this.refreshAccesskey(params.accesskey, (isOK) => {
              if (isOK === true) {
                params.accesskey = this.usSession().accesskey;
                this.get(url, params, options);
              }
            });
          }
        }
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  /**
   * Performs a request with `post` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
  public post(url: string, params: any, options?: RequestOptionsArgs): Observable<any> {
    this.requestInterceptor();
    return this.nextLayer.post(url, params, options)
      .catch(details => {
        return Observable.throw(new Error(details));
      })
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
        this.checkStatus = res;
        if (this.checkStatus.status !== 'OK' && this.checkAppendApi === false) {
          this.checkAppendApi = true;
          if (this.checkStatus !== undefined || this.checkStatus.error !== undefined || this.checkStatus.error.code === 'co-00019') {
            this.refreshAccesskey(params.accesskey, (isOK) => {
              if (isOK === true) {
                params.accesskey = this.usSession().accesskey;
                this.post(url, params, options);
              }
            });
          }
          if (this.checkStatus.error.code === 'co-00005') {
            // this.Router.navigate(['/login']); must go to login page
          } else if (this.checkStatus.error.code === 'co-00008') {
            console.log('[m5] checklike error');
          } else if (this.checkStatus.error.code !== 'co-00019' || this.checkStatus.error.code !== 'co-00003') {
            console.log(this.checkStatus.error.message);
          }
        }
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  public uploadBlob(url: string, params: FormData, options?: RequestOptionsArgs): Observable<any> {
    return this.nextLayer.uploadBlob(url, params, options)
      .catch(details => {
        return Observable.throw(new Error(details));
      })
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  public refreshAccesskey(oldAccessKey, listener) {
    this.listeners.push(listener);
    if (oldAccessKey === this.usSession().accesskey) {
      if (this.state === 'NONE_STATE') {
        this.state = 'REFRESHING_STATE';
        this.resetToken()
          .subscribe((data) => {
            // console.log('resetToken', data);
            this.fireRefreshedAccesskeyEvent(true);
            this.state = 'NONE_STATE';
          }, (error) => {
            this.fireRefreshedAccesskeyEvent(false);
            this.state = 'NONE_STATE';
          });
      }
    } else {
      // just updatepdated
      this.fireRefreshedAccesskeyEvent(true);
    }
  }

  public resetToken(): Observable<any> {
    let login_data = this.storage.getObject('member_private');
    console.log('retake login_data', login_data);
    if (login_data !== null || login_data.login_id !== null || login_data.login_id !== '') {
      return this.login(login_data.login_id, login_data.login_data)
        .map((_user_session) => {
          // console.log('_user_session', _user_session);
          this.userSession = _user_session;
          this.storage.setObject('userSession', this.userSession);
          return this.userSession;
        }, (err) => {
          console.log(err);
        });
    }
  }

  public fireRefreshedAccesskeyEvent(isOK) {
    this.listeners.forEach(function (listener) {
      listener(isOK);
    });
    this.listeners = [];
  }

  public usSession() {
    if (this.storage.getObject('userSession') !== null && this.storage.getObject('userSession') !== undefined) {
      this.userSession = this.storage.getObject('userSession');
    }
    return this.userSession;
  }

  public login(username: string, password: string): Observable<any> {
    let userAgent = navigator.userAgent;
    let loginType = 3;
    let params = {
      login_id: username,
      password: password,
      login_type: loginType,
      user_agent: userAgent,
      device_id: ""
    };
    return this.get('user/login', params);
    // this.skApi.getApiLogin(params);
  }

  /**
   * Request interceptor.
   */
  private requestInterceptor(): void {
    console.log('Sending Request');
    // this.loaderService.showPreloader();
    // this.loading.next({
    //   loading: true, hasError: false, hasMsg: ''
    // });
  }

  /**
   * Response interceptor.
   */
  private responseInterceptor(): void {
    console.log('Request Complete');
    // this.loaderService.hidePreloader();
  }

  /**
   * onSubscribeSuccess
   * @param res
   */
  private onSubscribeSuccess(res: Response): void {
    // this.loading.next({
    //   loading: false, hasError: false, hasMsg: ''
    // });
  }

  /**
   * onSubscribeError
   * @param error
   */
  private onSubscribeError(error: any): void {
    console.log('Something Went wrong while subscribing', error);
    // this.dialog.open(ErrorComponent, {
    //   data: {
    //     title: 'エラー',
    //     content: error
    //   }
    // });
    // this.loaderService.popError();
    // this.loading.next({
    //   loading: false, hasError: true, hasMsg: 'Something went wrong'
    // });
  }

  /**
   * onFinally
   */
  private onFinally(): void {
    this.responseInterceptor();
  }
}
