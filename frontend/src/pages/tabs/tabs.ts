import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { FindPage } from '../find/find';
import { BrowsePage } from '../browse/browse';
import { GoingPage } from '../going/going';
import { UpdatesPage } from '../updates/updates';
import { ProfilePage } from '../profile/profile';
import { CreateEventPage } from '../createevent/createevent';
import { ScoreboardPage } from '../scoreboard/scoreboard';

import { TokenProvider } from '../../providers/token/token'

import { Events } from 'ionic-angular'

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public tokenProvider: TokenProvider, private events: Events) {
    events.subscribe('token-update', (token) => {
      this.token = token;
    });
  }

}
