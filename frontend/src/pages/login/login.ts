import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { TokenProvider } from '../../providers/token/token'

import config from '../../config'

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

  username:string = 'meow';
  password:string = 'kitty';

  bgClass:string = Math.round(Math.random()) ? "bg-1" : "bg-2";

  constructor(public navCtrl: NavController, public navParams: NavParams, private http:HttpClient, private tokenProvider:TokenProvider, private tc:ToastController) {
    console.log(this.bgClass);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onLoginSuccess() {
    this.navCtrl.push(TabsPage).then(() => {
      this.navCtrl.remove(0)
    });
  }

  login(){
    this.http.post(config.ACCOUNTS_URL + '/login', {
      username : this.username,
      password : this.password
    }, {}).subscribe((data: any) => {
      this.tokenProvider.setToken(data.token);
      this.onLoginSuccess();
    }, (res) => {
      console.log(res);
      let toast = this.tc.create({
        message : res.error.message,
        duration : 2500,
        position : 'bottom'
      });
      toast.present();
    });
  }

  showSignup(){
    this.navCtrl.push(SignupPage);
  }

}
