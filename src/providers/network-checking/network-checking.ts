import { Injectable, Output, EventEmitter } from '@angular/core';
import { Network } from '@ionic-native/network';

/*
  Generated class for the NetworkCheckingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkCheckingProvider {
  @Output() onNetworkStatusChange: EventEmitter<object> = new EventEmitter();
  private networking:boolean = true;
  constructor(private network: Network) {
    console.log('Hello NetworkCheckingProvider Provider');
    // watch network for a disconnect
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('NetworkCheckingProvider:network was disconnected :-(');
      this.onNetworkStatusChange.emit({ status: "disconnect" });
      this.networking = false;
    });

    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('NetworkCheckingProvider:network connected!');
      this.networking = true;
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        this.onNetworkStatusChange.emit({ status: "connected" });
      }, 1000);
    });
  }

  public getNetworkStatus(){
    return this.networking;
  }

}
