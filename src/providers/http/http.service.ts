import { Injectable } from '@angular/core';
import {
  Http,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  Headers,
  Request,
  Jsonp
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpMiddlewareLayer } from './http-middleware.interface';

@Injectable()
export class HttpService implements HttpMiddlewareLayer {

	private jsonp: string = '?callback=JSONP_CALLBACK&';
  nextLayer: any;

	constructor( private http: Http, private jsonpRequest: Jsonp ) {
    console.log('[HttpService] constructor!');
    this.nextLayer = null; // this is the last layer of HttpMiddleware
  }

  /**
   * Performs any type of http request.
   * @param url
   * @param options
   * @returns {Observable<Response>}
   */
  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.request(url, options);
  }

  /**
   * Performs a request with `get` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  public get(url: string, params?: any, options?: RequestOptionsArgs): Observable<any> {
    let fullUrl: string = this.getFullUrl(url) + this.jsonp + this.serializeData(params);
    return this.jsonpRequest.get(fullUrl);
  }

  /**
   * Performs a request with `post` http method.
   * @param url
   * @param params
   * @param options
   * @returns {Observable<>}
   */
  public post(url: string, params: any, options?: RequestOptionsArgs): Observable<any> {
    return this.http.post(
      this.getFullUrl(url),
      this.serializeData(params),
      this.requestOptions(options)
    );
  }

  /**
   * Performs a upload file with `post` http method.
   * @param url
   * @param params
   * @param options
   * @returns {Observable<>}
   */
  public uploadBlob(url: string, params: FormData, options?: RequestOptionsArgs): Observable<any> {
    return this.http.post(
      this.getFullUrl(url),
      params
    );
  }

  /**
   * Build API url.
   * @param url
   * @returns {string}
   */
  private getFullUrl(url: string): string {
    return "http://cms.zoaz.info/x/vnairline/service.php?method=insert_line" + url;
  }

  private serializeData(data): string {
    // If this is not an object, defer to native stringification.
    if (!this.isObject(data)) {
      return ((data == null) ? "" : data.toString());
    }
    let buffer = [];
    // Serialize each key in the object.
    for (let name in data) {
      if (!data.hasOwnProperty(name)) {
        continue;
      }
      let value = data[name];
      buffer.push(
        encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value)
      );
    }
    // Serialize the buffer and clean it up for transportation.
    let source = buffer.join("&").replace(/%20/g, "+");
    // console.log("serializeData", source);
    return (source);
  }

  private isObject(x: any): x is Object {
    return x != null && typeof x === 'object';
  }

  /**
   * Request options.
   * @param options
   * @returns {RequestOptionsArgs}
   */
  private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      });
    }
    return options;
  }

}