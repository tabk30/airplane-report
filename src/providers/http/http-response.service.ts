import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './http.service';
import { HttpMiddlewareLayer } from './http-middleware.interface';

@Injectable()
export class HttpResponseService implements HttpMiddlewareLayer {
	nextLayer: any;

	constructor( private HttpService: HttpService) {
    console.log('[HttpResponseService] constructor!');
    this.nextLayer = this.HttpService;
  }

  request(url: any, options?: any): Observable<Response> {
    return this.nextLayer.request(url, options);
  }

  public get(url: string, params?: any, options?: any): Observable<any> {
    return this.nextLayer.get(url, params, options)
    .map(response => {
      // console.log('HttpResponseService get map', response._body.result);
      return response._body.result;
    });
  }

  public post(url: string, params: any, options?: any): Observable<any> {
    return this.nextLayer.post(url, params, options)
    .map(response => {
    	response._body = this.formatJsonReponse(response._body)
      // console.log('HttpResponseService post map', response.json().result);
      return response.json().result;
    });
  }

  public uploadBlob(url: string, params: FormData, options?: any): Observable<any> {
    return this.nextLayer.uploadBlob(url, params, options)
    .map(response => {
    	response._body = this.formatJsonReponse(response._body)
      return response.json().result;
    });
  }

  private formatJsonReponse(response: string): string {
    let reponseFomat: string = response.replace('response(', '');
    reponseFomat = reponseFomat.substring(0, reponseFomat.length - 1);
    return reponseFomat;
  }
}