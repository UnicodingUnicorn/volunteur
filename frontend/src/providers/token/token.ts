import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular'
import { Storage } from '@ionic/storage';

/*
  Generated class for the TokenProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TokenProvider {
  public token:string = undefined;

  constructor(public storage: Storage, public events: Events) {
    storage.ready().then(() => {
      storage.get('token').then((val) => {
        this.token = val;
        this.events.publish('token-update', this.token);
      });
    });
  }

  setToken(token){
    this.token = token;
    this.storage.set('token', token);
    this.events.publish('token-update', this.token);
  }

}
