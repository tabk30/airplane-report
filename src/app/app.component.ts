import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ReportPage } from '../pages/report/report';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { NetworkCheckingProvider } from '../providers/network-checking/network-checking';
import { ToastController } from 'ionic-angular';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  private toast;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private androidPermissions: AndroidPermissions,
    private network:NetworkCheckingProvider,
    private toastCtrl: ToastController
  ) {
    this.toast = this.toastCtrl.create({
      message: 'Đồng bộ dữ liệu',
      duration: 10000,
      position: 'bottom'
    });
    this.toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    this.initializeApp();
    this.getAndroidPermission();
    this.network.onNetworkStatusChange.subscribe(
      (data)=>{
        console.log("MyApp:onNetworkStatusChange", data);
        if(data.status == 'connected'){
          this.toast.present();
        }
      }
    );

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Report', component: HomePage },
      { title: 'Report List', component: ListPage }
    ];

  }

  public getAndroidPermission(){
    if(this.platform.is("android")){
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      );
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
