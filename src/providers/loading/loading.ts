import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the LoadingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingProvider {
  private loading = null;
  constructor(public loadingCtrl: LoadingController) {
    console.log('Hello LoadingProvider Provider');
  }

  public startLoading(content?:string){
    if(!content) content = 'Please wait...';
    this.loading = this.loadingCtrl.create({
      content: content
    });
  
    this.loading.present();
  }

  public close(){
    if(this.loading){
      this.loading.dismiss();
    }
  }

}
