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
import { NetworkCheckingProvider } from '../../providers/network-checking/network-checking';
import { AlertController } from 'ionic-angular';

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
  public base64Image: string = null;
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
    private loading: LoadingProvider,
    private network: NetworkCheckingProvider,
    private alertCtrl: AlertController
  ) {
    this.seatId = this.navParams.get('seatId');
  }

  ionViewDidLoad() {
    this.takePicture();
  }

  public takePicture() {
    let options: CameraOptions;
    options = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false
    };


    this.camera.getPicture(options).then((imagePath) => {
      console.log("ReportPage:takePicture imagePath", imagePath);
      // this.base64Image = "data:image/jpeg;base64," + imagePath;
      if (this.platform.is('ios')) {
        this.base64Image = imagePath;
        this.base64Image = this.base64Image.replace(/^file:\/\//, '');
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

  public saveData() {
    if (!this.network.getNetworkStatus()) {
      let alert = this.alertCtrl.create({
        title: 'Confirm',
        message: 'Đang không có kết nối internet, lưu dữ liệu vào local!!',
        buttons: [
          {
            text: 'OK',
            role: 'ok',
            handler: () => {
              console.log('Cancel clicked');
              this.loading.startLoading();
              setTimeout(
                () => {
                  this.loading.close();
                  let day = new Date();
                  let createAt: string = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate() + ' ' + day.getHours() + ' ' + day.getMinutes();
                  this.sql.insertReport(this.seatId, this.report, this.base64Image, 0, createAt);
                  this.navCtrl.push(ListPage);
                },
                500
              );
            }
          }
        ]
      });
      alert.present();
    } else {
      this.loading.startLoading();
      setTimeout(
        () => {
          this.loading.close();
          let day = new Date();
          let createAt: string = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate() + ' ' + day.getHours() + ' ' + day.getMinutes();
          this.sql.insertReport(this.seatId, this.report, this.base64Image, 0, createAt);
          this.navCtrl.push(ListPage);
        },
        500
      );
    }


  }



}
