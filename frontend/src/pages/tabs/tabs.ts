import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FindPage } from '../find/find';
import { BrowsePage } from '../browse/browse';
import { GoingPage } from '../going/going';
import { UpdatesPage } from '../updates/updates';
import { ProfilePage } from '../profile/profile';

//@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FindPage;
  tab2Root = BrowsePage;
  tab3Root = GoingPage;
  tab4Root = UpdatesPage;
  tab5Root = ProfilePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}
