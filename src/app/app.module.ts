import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ReportPage } from '../pages/report/report';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingProvider } from '../providers/loading/loading';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SQLite } from '@ionic-native/sqlite';
import { SqliteProvider } from '../providers/sqlite/sqlite';
import { NetworkCheckingProvider } from '../providers/network-checking/network-checking';
import { HttpProvider } from '../providers/http/http';
import { SokujobAPIService } from '../providers/http/sokujob-api.service';
import { CacheService } from '../providers/http/cache.service';
import { SKLocalStorageService } from '../providers/http/sk-local-storage.service';
import { HttpHandleService } from '../providers/http/http-handle.service';
import { HttpService } from '../providers/http/http.service';
import { HttpResponseService } from '../providers/http/http-response.service';
import { HttpModule, JsonpModule } from '@angular/http';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ReportPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ReportPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    LoadingProvider,
    File,
    Transfer,
    FilePath,
    AndroidPermissions,
    SQLite,
    SqliteProvider,
    Network,
    NetworkCheckingProvider,
    HttpProvider,
    SokujobAPIService,
    CacheService,
    SKLocalStorageService,
    HttpHandleService,
    HttpResponseService,
    HttpService
  ]
})
export class AppModule {}
