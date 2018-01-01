import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

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
  public base64Image: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public platform: Platform,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
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
      console.log("ReportPage:takePicture success imageData", imagePath);
      this.base64Image = imagePath;
      if (this.platform.is('android')) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            this.base64Image = filePath;
          });
      } else {
        this.base64Image = imagePath;
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
  private copyFileToLocalDir(namePath, currentName, newpath,  newFileName) {
    console.log("ReportPage:copyFileToLocalDir namePath, currentName, newFileName", namePath, currentName, newFileName, cordova.file.dataDirectory);
    this.file.copyFile(namePath, currentName, newpath, newFileName).then(success => {
      console.log("ReportPage:copyFileToLocalDir success imageData", newFileName);
      this.base64Image = newpath + newFileName;
    }, error => {
      console.log("ReportPage:copyFileToLocalDir error", error);
    });
  }

}
