import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserApiProvider } from '../../providers/user-api/user-api';

/**
 * Generated class for the ScoreboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scoreboard',
  templateUrl: 'scoreboard.html',
})
export class ScoreboardPage {
  private users:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userApi : UserApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScoreboardPage');
    this.userApi.getAllScores().then((users) => {
      this.users = users;
    });
  }

}
