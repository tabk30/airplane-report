import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SqliteProvider } from '../../providers/sqlite/sqlite';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  public reportList: Array<{seatId: string, report: string, imagePath:string, upload: number, createAt:string}> = new Array();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sql: SqliteProvider) {
      this.sql.getAllReport().then(
        (success)=>{
          console.log("ListPage:constructor ", success);
          for(let item of success){
            this.reportList.push(
              {
                seatId: item.seatId,
                report: item.report,
                imagePath: item.imagePath,
                upload: item.upload,
                createAt: item.createAt
              }
            );
          }
        }
      ).catch((error)=> {
        console.log("ListPage:constructor error", error);
      });
  }

}
