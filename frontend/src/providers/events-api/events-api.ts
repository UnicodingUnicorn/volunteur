import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { TokenProvider } from '../token/token';
import { UserProvider } from '../user/user';
import { CONFIG_TOKEN, ApplicationConfig } from '../../config';

/*
  Generated class for the EventsApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventsApiProvider {

  constructor(public http: HttpClient, private tokenProvider:TokenProvider, private userProvider:UserProvider, @Inject(CONFIG_TOKEN) private config:ApplicationConfig) {
    console.log('Hello EventsApiProvider Provider');
  }

  getEvents(){
    return new Promise((resolve) => {
      this.http.get(this.config.EVENTS_URL + "/events", {
        headers : new HttpHeaders().set('Authorization', 'Basic ' + btoa(this.config.CLIENT_ID + ':' + this.config.CLIENT_SECRET))
      }).subscribe((data:any) => {
        resolve(data.events);
      });
    });
  }

  getEvent(name:string){
    return new Promise((resolve) => {
      this.http.get(this.config.EVENTS_URL + '/event/' + encodeURIComponent(name), {
        headers : new HttpHeaders().set('Authorization', 'Basic ' + btoa(this.config.CLIENT_ID + ':' + this.config.CLIENT_SECRET))
      }).subscribe((data: any) => {
        data.event.num_participants = data.event.participants.length;
        if(data.event.participants.indexOf(this.userProvider.getUsername()) >= 0)
          data.event.is_participating = true;
        resolve(data.event);
      }, (err) => {
        console.log(err);
      });
    });
  }

  addUser(name:string){
    return new Promise((resolve) => {
      this.http.post(this.config.EVENTS_URL + '/event/adduser', {
        name: name,
        token: this.tokenProvider.getToken()
      }, {
        headers : new HttpHeaders().set('Authorization', 'Basic ' + btoa(this.config.CLIENT_ID + ':' + this.config.CLIENT_SECRET))
      }).subscribe((data: any) => {
        resolve();
      }, (err) => {
        console.log(err);
      });
    });
  }

  createEvent(event:any){
    return new Promise((resolve, reject) => {
      this.http.post(this.config.EVENTS_URL + '/event/new', {
        token : this.tokenProvider.getToken(),
        name : event.name,
        description : event.description,
        organisation : event.organisation,
        max_participants : event.max_participants,
        starttime : event.starttime,
        endtime : event.endtime
      }, {
        headers : new HttpHeaders().set('Authorization', 'Basic ' + btoa(this.config.CLIENT_ID + ':' + this.config.CLIENT_SECRET))
      }).subscribe((data: any) => {
        resolve();
      }, (res) => {
        reject(res.error.message);
      });
    });
  }

}
