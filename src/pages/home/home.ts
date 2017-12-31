import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { ReportPage } from '../report/report';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public seatBlockA = {
    seatList: ["A", "B", "C", "D"],
    seatRow: 4,
    rowStart: 1
  };

  public seatBlockB = {
    seatList: ["A", "B", "C", "D", "E", "F"],
    seatRow: 38,
    rowStart: 10
  };
  constructor(
    public navCtrl: NavController, 
    private loading:LoadingProvider) {

  }

  public createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  public reportSeat(seatId){
    console.log("HomePage:reportSeat seatId", seatId);
    this.loading.startLoading();
    setTimeout(
      ()=> {
        this.loading.close();
        this.navCtrl.push(ReportPage);
      },
      500
    );
  }

}
