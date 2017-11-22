import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { FindPage } from '../find/find';
import { BrowsePage } from '../browse/browse';
import { GoingPage } from '../going/going';
import { UpdatesPage } from '../updates/updates';
import { ProfilePage } from '../profile/profile';
import { CreateEventPage } from '../createevent/createevent';
import { ScoreboardPage } from '../scoreboard/scoreboard';

import { TokenProvider } from '../../providers/token/token';

import { ToastController } from 'ionic-angular'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  token = undefined;

  tab1Root = FindPage;
  tab2Root = BrowsePage;
  tab3Root = GoingPage;
  tab4Root = UpdatesPage;
  tab5Root = ProfilePage;
  tab6Root = CreateEventPage;
  tab7Root = ScoreboardPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private tc:ToastController, private tokenProvider: TokenProvider) {
  }

  logout(){
    this.tokenProvider.deleteToken().then(() => {
      let toast = this.tc.create({
        message : "Goodbye",
        duration : 2500,
        position : 'bottom'
      });
      toast.present();
      this.navCtrl.push(LoginPage).then(() => {
        this.navCtrl.remove(0);
      });
    });
  }

}
