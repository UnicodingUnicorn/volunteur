import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { TokenProvider } from '../../providers/token/token';

import config from '../../config'

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  name:string = ""
  description:string = ""
  organisation:string = ""
  starttime:string = ""
  endtime:string = ""

  token = undefined;

  constructor(public navCtrl: NavController, public navParams: NavParams, private events:Events, private http:HttpClient, private tokenProvider:TokenProvider) {
    this.token = tokenProvider.token;
    events.subscribe('token-update', (token) => {
      this.token = token;
    });
    this.name = this.navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
    this.http.get(config.EVENTS_URL + '/event/' + encodeURIComponent(this.name), {
      //headers : new HttpHeaders().set('Authorization', 'Basic ' + btoa(config.CLIENT_ID + ':' + config.CLIENT_SECRET))
    }).subscribe((data: any) => {
      this.description = data.event.description;
      this.organisation = data.event.organisation;
      this.starttime = data.event.starttime;
      this.endtime = data.event.endtime;
    }, (err) => {
      console.log(err);
    });
  }

}
