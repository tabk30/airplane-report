import { Injectable } from '@angular/core';
@Injectable()
export class SKLocalStorageService {
  constructor() { }

  public allStorage(): object {
    let values: object = {};
    let key, value;
    for (var i = 0; i <= localStorage.length - 1; i++) {
      key = localStorage.key(i);
      values[key] = localStorage.getItem(key);
    }
    return values;
  }
  public clearLocalstorage() {
    let allStorage: object = this.allStorage();
    for (var keyItem in allStorage) {
      if (keyItem.startsWith('G_')) {
        delete localStorage[keyItem];
      }
    };
  }
  public set(key: string, value: any): void {
    try {
      localStorage[key] = value;
    } catch (e) {
      this.clearLocalstorage();
      localStorage[key] = value;
    }
  }
  public get(key: string, defaultValue?: string):any {
    return localStorage[key] || defaultValue;
  }
  public setObject(key: string, value: object): void {
    try {
      localStorage[key] = JSON.stringify(value);
    } catch (e) {
      this.clearLocalstorage();
      localStorage[key] = JSON.stringify(value);
    }
  }
  public getObject(key: string, defaultValue?: any): any {
    let value = localStorage[key];
    if (typeof value != 'undefined' && value != 'undefined')
      return JSON.parse(value)
    else
      return defaultValue;
  }

  public removeItem(key: string): void {
    delete localStorage[key];
  }
}
