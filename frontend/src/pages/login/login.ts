import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';

import { UserApiProvider } from '../../providers/user-api/user-api';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username:string = '';
  password:string = '';

  bgClass:string = Math.round(Math.random()) ? "bg-1" : "bg-2";

  constructor(public navCtrl: NavController, public navParams: NavParams, private userApi:UserApiProvider) {
    //console.log(this.bgClass);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onLoginSuccess() {
    this.navCtrl.push(TabsPage).then(() => {
      this.navCtrl.remove(0);
    });
  }

  login(){
    this.userApi.login(this.username, this.password).then(() => {
      this.onLoginSuccess();
    });
  }

  showSignup(){
    this.navCtrl.push(SignupPage);
  }

}
