import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { CONFIG, CONFIG_TOKEN, ApplicationConfig } from '../../config';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  username:string = "";
  name:string = "";
  password:string = "";
  passwordConfirm:string = "";
  bio:string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private tc:ToastController, private http:HttpClient, @Inject(CONFIG_TOKEN) private config:ApplicationConfig) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signup() {
    if(this.password != this.passwordConfirm){
      this.password = "";
      this.passwordConfirm = "";
      let toast = this.tc.create({
        message : 'Passwords do not match, please recheck',
        duration : 2500,
        position : 'bottom'
      });
      toast.present();
    }else{
      this.http.post(this.config.VOLUNTEERS_URL + '/user/new', {
        username : this.username,
        name : this.name,
        password : this.password,
        bio : this.bio
      }, {}).subscribe((data: any) => {
        let toast = this.tc.create({
          message : 'Account successfully created! Please login',
          duration : 2500,
          position : 'bottom'
        });
        toast.present();
        this.navCtrl.pop();
      }, (err) => {
        let toast = this.tc.create({
          message : err.message,
          duration : 2500,
          position : 'bottom'
        });
        toast.present();
      });
    }
  }

}
