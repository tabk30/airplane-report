import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';


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
    public plt: Platform
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
    this.takePicture();
  }

  public takePicture() {
    let options: CameraOptions;
    if (this.plt.is('ios')) {
      // This will only print when on iOS
      options = {
        quality: 50,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
    } else if (this.plt.is('android')){
      options = {
        quality: 50,
        destinationType: this.camera.DestinationType.NATIVE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
    }


      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        console.log("ReportPage:takePicture success imageData", imageData);
        this.base64Image = imageData;
      }, (err) => {
        // Handle error
        console.log("ReportPage:takePicture error", err);
      });
  }

}
