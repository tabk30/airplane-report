import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
/*
  Generated class for the SqliteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqliteProvider {
  private db: SQLiteObject = null;
  constructor(private sqlite: SQLite) {
    console.log('SqliteProvider:Hello SqliteProvider Provider');
    this.initFistTime();
  }

  initFistTime() {
    console.log('SqliteProvider:initFistTime');
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.db = db;
      this.db.executeSql(
        'CREATE TABLE IF NOT EXISTS REPORT'
        + '(id INTEGER PRIMARY KEY AUTOINCREMENT,'
        + 'seatId CHAR(10),'
        + 'report VARCHAR(1000),'
        + 'imagePath VARCHAR(100),'
        + 'upload INTEGER(1) NOT NULL,'
        + 'createAt VARCHAR(50) NOT NULL)',
        {})
        .then(() => console.log('SqliteProvider:initFistTime Create table report'))
        .catch(e => console.log('SqliteProvider:initFistTime Create table report error', e));
    }).catch(e => console.log('SqliteProvider:initFistTime Create table report error', e));
  }

  public insertReport(seatId, report, imagePath, upload, createAt) {
    if (this.db) {
      this.db.executeSql('INSERT INTO REPORT(seatId, report, imagePath, upload, createAt) VALUES(?,?,?,?,?)', [seatId, report, imagePath, upload, createAt])
        .then((success) => {
          console.log('SqliteProvider:insertReport success', success);
        }).catch((error) => {
          console.log('SqliteProvider:insertReport error', error);
        });
    }
  }

  public async getAllReport() {
    let reportList = [];
    if (this.db) {
      try{
        let responce = await this.db.executeSql('SELECT * FROM REPORT', []);
        if (responce.rows.length > 0) {
          for (var i = 0; i < responce.rows.length; i++) {
            reportList.push({ 
              id: responce.rows.item(i).id,
              seatId: responce.rows.item(i).seatId,
              report: responce.rows.item(i).report,
              imagePath: responce.rows.item(i).imagePath,
              upload: responce.rows.item(i).upload,
              createAt: responce.rows.item(i).createAt
            });
            console.log('SqliteProvider:getAllReport', responce.rows.item(i).id);
          }
        }
        return reportList;
      }catch(error){
        console.log('SqliteProvider:getAllReport error', error);
      };
    }
  }
  
}
