import { Injectable } from '@angular/core';
import { SKLocalStorageService } from './sk-local-storage.service';
import { md5 } from './md5';

@Injectable()
export class CacheService {

	constructor( private storage: SKLocalStorageService ) {
    console.log('[CacheService] constructor!');
  }

  set(group, key, object, store_time){
    if(!store_time)
      return;
    let store_data = {
    	ob: object,
    	store_time: store_time,
    	updated: new Date().getTime()
   	};
    this.storage.setObject(md5(key), store_data); 
    /*let group_keys = this.storage.getObject("G_" + md5(group), []);
    group_keys.push(key);
    this.storage.setObject("G_" + md5(group), group_keys);*/
	}

	get(key, livetime){
    let md5key = md5(key);
    let store_data = this.storage.getObject(md5key, null);
    if(store_data == null){
      return null;
    }else{
      if(livetime != undefined && new Date().getTime() - store_data.updated < livetime){
        return store_data.ob;
      }else if(new Date().getTime() - store_data.updated < store_data.store_time){
        return store_data.ob;
      }else{
        this.storage.setObject(md5key, null);
        return null;
      }
    }
	}

	clear(key){
    console.log("Clear " + key);
    this.storage.setObject(md5(key), null);
	}

	clearGroup(group){
    let group_keys = this.storage.getObject("G_" + md5(group), []);
    console.log("Clear " + group + ":" + group_keys.length + "items");
    for(let i =0; i< group_keys.length; i++){
      let key = group_keys[i];
      this.clear(key);
    }
    this.storage.setObject("G_" + md5(group), []);
	}
}