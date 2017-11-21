import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { UserApiProvider } from '../../providers/user-api/user-api';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private tc:ToastController, private userApi:UserApiProvider) {
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
      this.userApi.createUser({
        username : this.username,
        name : this.name,
        password : this.password,
        bio : this.bio
      }).then(() => {
        let toast = this.tc.create({
          message : 'Account successfully created! Please login',
          duration : 2500,
          position : 'bottom'
        });
        toast.present();
        this.navCtrl.pop();
      });
    }
  }

}
