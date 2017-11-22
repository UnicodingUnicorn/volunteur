import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  username = "";
  name = "";
  score = 0;
  bio = "";
  attended_events = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private events:Events, private zone:NgZone, private userProvider:UserProvider) {
    this.events.subscribe("user:score", (score) => {
      this.zone.run(() => {
        this.score = score;
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.username = this.userProvider.getUsername();
    this.name = this.userProvider.getName();
    this.score = this.userProvider.getScore();
    this.bio = this.userProvider.getBio();
    this.attended_events = this.userProvider.getAttendedEvents();


  }

}
