import { Observable } from 'rxjs/Observable';

export interface HttpMiddlewareLayer {
  nextLayer: any;
  get(url: string, params?: any, options?: any): Observable<any>;
  post(url: string, params: any, options?: any): Observable<any>;
};