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
  organiser:string = ""
  starttime:string = ""
  endtime:string = ""
  num_participants:number = 0
  max_participants:number = 10
  is_participating:boolean = false

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
      this.organiser = data.event.organiser;
      this.starttime = data.event.starttime;
      this.endtime = data.event.endtime;
      this.num_participants = JSON.parse(data.event.participants).length;
      this.max_participants = data.event.max_participants;
      this.http.get(config.ACCOUNTS_URL + '/user/token/' + this.token, {
      }).subscribe((data: any) => {
        if (data.user.events.indexOf(this.name) >= 0) {
          this.is_participating = true;
        }
      });
    }, (err) => {
      console.log(err);
    });
  }

  setGoing(bool) {
    if (!bool) {
      return
    }
    this.http.post(config.EVENTS_URL + '/event/adduser', {
      name: this.name,
      token: this.token
    }).subscribe((data: any) => {
    }, (err) => {
      console.log(err);
    });
    this.ionViewDidLoad();
  }

}
