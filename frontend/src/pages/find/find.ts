import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { EventPage } from '../event/event';

@Component({
  selector: 'page-find',
  templateUrl: 'find.html'
})
export class FindPage {

  constructor(public navCtrl: NavController) {

  }

  openEvent(id) {
    this.navCtrl.push(EventPage, {
      id: id
    });
  }

}
