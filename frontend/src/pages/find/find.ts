import { Component, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { TokenProvider } from '../../providers/token/token'

import { EventPage } from '../event/event';
import { CONFIG, CONFIG_TOKEN, ApplicationConfig } from '../../config';

@Component({
  selector: 'page-find',
  templateUrl: 'find.html'
})
export class FindPage {
  events = [];

  constructor(public navCtrl: NavController, private http:HttpClient, @Inject(CONFIG_TOKEN) private config : ApplicationConfig) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindPage');
    this.http.get(this.config.EVENTS_URL + "/events").subscribe((data:any) => {
      this.events = data.events;
      console.log(this.events);
    });
  }

  openEvent(id) {
    this.navCtrl.push(EventPage, {
      id: id
    });
  }

}
