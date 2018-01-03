import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpHandleService } from './http-handle.service';
import { CacheService } from './cache.service';

@Injectable()
export class SokujobAPIService {
  
  nextLayer: any;

	constructor( private cache: CacheService, private http: HttpHandleService) {
    console.log('[SokujobAPIService] constructor!');
    this.nextLayer = this.http;
  }

  request(url: any, options?: any): Observable<Response> {
    return this.nextLayer.request(url, options);
  }

  public get(url: string, params?: any, options?: any, livetime?: any): Observable<any> {
  	let uri = this.getUri(url);
    let cached = (livetime == undefined || livetime < 0) ? null : this.cache.get(uri + JSON.stringify(params), livetime);
    console.log("SokujobAPIService uri: ", uri);
    if(cached != null) {
      
    	return new Observable( observer => {
    		observer.next(cached);
        observer.complete();
    	})
    } else {
    	return this.nextLayer.get(url, params, options)
	      .map(response => {
	        if (response && response.status == 'OK') {
	          this.cache.set(uri, uri + JSON.stringify(params), response, livetime);
            return response;
	        } else {
            throw response;
          }
	      });
	  }
  }

  public post(url: string, params: any, options?: any, livetime?: any): Observable<any> {
  	let uri = this.getUri(url);
    let cached = (livetime == undefined || livetime < 0) ? null : this.cache.get(uri + JSON.stringify(params), livetime);
    console.log("SokujobAPIService uri: ", uri);
    if(cached != null) {
    	return new Observable( observer => {
    		observer.next(cached);
        observer.complete();
    	})
    } else {
    	return this.nextLayer.post(url, params, options)
	      .map(response => {
	        if (response && response.status == 'OK') {
	          this.cache.set(uri, uri + JSON.stringify(params), response, livetime);
            return response;
	        } else {
            throw response;
          }
	      });
	  }
  }

  public uploadBlob(url: string, file, params: object, type?: string, options?: any): Observable<any> {
    
    let input = new FormData();
    for (var key in params) {
      if (params.hasOwnProperty(key))
        input.append(key, params[key]);
    }

    if(type && type == "convert_document") {
      input.append('doc', file);
    } else {
      input.append('file', file);
    }
    
    return this.nextLayer.uploadBlob(url, input, options)
      .map(response => {
        if (response && response.status == 'OK') {
          return response;
        }else {
          throw Observable.throw(response);  
        }
      });
  }

  private getUri(url: string): string {
    return "" + url;
  }
}