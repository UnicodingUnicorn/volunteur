import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { EventPage } from '../event/event';
import { EventsApiProvider } from '../../providers/events-api/events-api'

@Component({
  selector: 'page-find',
  templateUrl: 'find.html'
})
export class FindPage {
  events = [];

  constructor(public navCtrl: NavController, private eventsApi:EventsApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindPage');
    this.eventsApi.getEvents().then((events) => {
      this.events = events;
    });
  }

  openEvent(id) {
    this.navCtrl.push(EventPage, {
      id: id
    });
  }

}
