import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { TokenProvider } from '../../providers/token/token'

import { config } from '../../config'

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
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private http:HttpClient, private tokenProvider:TokenProvider) {
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
    console.log(this.username);
    console.log(this.password);
    this.http.post(config.ACCOUNTS_URL + '/login', {
      username : this.username,
      password : this.password
    }, {
      //headers : new HttpHeaders().set('Authorization', 'Basic ' + btoa(config.CLIENT_ID + ':' + config.CLIENT_SECRET))
    }).subscribe((data: any) => {
      this.tokenProvider.setToken(data.token);
      this.onLoginSuccess();
    }, (err) => {
      console.log(err);
    });
  }

}
