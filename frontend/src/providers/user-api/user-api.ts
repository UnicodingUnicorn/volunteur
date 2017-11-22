import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

import { TokenProvider } from '../token/token';
import { UserProvider } from '../user/user';

import { CONFIG_TOKEN, ApplicationConfig } from '../../config';

/*
  Generated class for the UserApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserApiProvider {

  constructor(public http: HttpClient, private tokenProvider:TokenProvider, private userProvider:UserProvider, private tc:ToastController, @Inject(CONFIG_TOKEN) private config:ApplicationConfig) {
    console.log('Hello UserApiProvider Provider');
  }

  login(username:string, password:string){
    return new Promise((resolve) => {
      this.http.post(this.config.VOLUNTEERS_URL + '/login', {
        username : username,
        password : password
      }, {
        headers : new HttpHeaders().set('Authorization', 'Basic ' + btoa(this.config.CLIENT_ID + ':' + this.config.CLIENT_SECRET))
      }).subscribe((data: any) => {
        this.tokenProvider.setToken(data.token);
        this.getUserByToken();
        resolve();
      }, (res) => {
        console.log(res);
        let toast = this.tc.create({
          message : res.error.message,
          duration : 2500,
          position : 'bottom'
        });
        toast.present();
      });
    });
  }

  getUserByToken(){
    return new Promise((resolve) => {
      this.http.get(this.config.VOLUNTEERS_URL + '/user?token=' + this.tokenProvider.getToken(), {
        headers : new HttpHeaders().set('Authorization', 'Basic ' + btoa(this.config.CLIENT_ID + ':' + this.config.CLIENT_SECRET))
      }).subscribe((data: any) => {
        data.user.score = data.user.score || 0;
        data.user.attended_events = [];
        for(var i = 0; i < data.user.events.length; i++){
          this.http.get(this.config.EVENTS_URL + "/event/" + data.user.events[i]).subscribe((data2:any) => {
            data.user.attended_events.push(data2.event);
          });
        }
        //resolve(data.user);
        this.userProvider.setUser(data.user);
        resolve();
      }, (err) => {
        console.log(err);
      });
    });
  }

  createUser(user:any){
    return new Promise((resolve) => {
      this.http.post(this.config.VOLUNTEERS_URL + '/user', {
        username : user.username,
        name : user.name,
        password : user.password,
        bio : user.bio
      }, {
        headers : new HttpHeaders().set('Authorization', 'Basic ' + btoa(this.config.CLIENT_ID + ':' + this.config.CLIENT_SECRET))
      }).subscribe((data: any) => {
        resolve();
      }, (err) => {
        let toast = this.tc.create({
          message : err.message,
          duration : 2500,
          position : 'bottom'
        });
        toast.present();
      });
    });
  }

  getAllScores(){
    return new Promise((resolve) => {
      this.http.get(this.config.VOLUNTEERS_URL + '/scores', {
        headers : new HttpHeaders().set('Authorization', 'Basic ' + btoa(this.config.CLIENT_ID + ':' + this.config.CLIENT_SECRET))
      }).subscribe((data:any) => {
        resolve(data.users);
      });
    });
  }
}
