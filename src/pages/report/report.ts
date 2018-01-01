import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { SqliteProvider } from '../../providers/sqlite/sqlite';
import { ListPage } from '../list/list';
import { LoadingProvider } from '../../providers/loading/loading';

declare var cordova: any;

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  public imagePath: string = null;
  private seatId: string;
  private report: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public platform: Platform,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    private sql: SqliteProvider,
    private loading: LoadingProvider
  ) {
    this.seatId = this.navParams.get('seatId');
  }

  ionViewDidLoad() {
    this.takePicture();
  }

  public takePicture() {
    let options: CameraOptions;
    if (this.platform.is('ios')) {
      // This will only print when on iOS
      options = {
        quality: 50,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
    } else if (this.platform.is('android')) {
      options = {
        quality: 50,
        destinationType: this.camera.DestinationType.NATIVE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
    }

    this.camera.getPicture(options).then((imagePath) => {
      if (this.platform.is('android')) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath: string = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.length);

            let newPath = correctPath.replace("cache/", "files/");
            this.copyFileToLocalDir(correctPath, currentName, newPath, this.createFileName());
          });
      } else {
        let correctPath: string = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.length);

        let newPath = correctPath.replace("cache/", "files/");
        this.copyFileToLocalDir(correctPath, currentName, newPath, this.createFileName());
      }
    }, (err) => {
      // Handle error
      console.log("ReportPage:takePicture error", err);
    });
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newpath, newFileName) {
    this.file.copyFile(namePath, currentName, newpath, newFileName).then(success => {
      this.imagePath = newpath + newFileName;
    }, error => {
      console.log("ReportPage:copyFileToLocalDir error", error);
    });
  }

  public saveData() {
    this.loading.startLoading();
    setTimeout(
      () => {
        this.loading.close();
        let day = new Date();
        let createAt: string = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate() + ' ' + day.getHours() + ' ' + day.getMinutes();
        this.sql.insertReport(this.seatId, this.report, this.imagePath, 0, createAt);
        this.navCtrl.push(ListPage);
      },
      500
    );

  }

}
