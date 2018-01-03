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
import { SokujobAPIService } from '../../providers/http/sokujob-api.service';

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
  public cat: string = "CAT1";
  public createAt: string = "";
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
    private alertCtrl: AlertController,
    private http: SokujobAPIService
  ) {
    this.seatId = this.navParams.get('seatId');
    let day = new Date();
    this.createAt = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
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

  public saveData() {
    console.log("saveData: this.cat", this.cat);
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
                  this.sql.insertReport(this.seatId, this.report, this.base64Image, 0, this.createAt);
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

          this.http.post("", {
            seat: this.seatId,
            status: "raised",
            case: this.cat,
            w_o: "",
            comment: this.report
          }).subscribe(
            () => { },
            () => { }
            );

          this.sql.insertReport(this.seatId, this.report, this.base64Image, 1, this.createAt);
          this.navCtrl.push(ListPage);
        },
        500
      );
    }
  }


}
