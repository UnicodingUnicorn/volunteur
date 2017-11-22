import { Inject, Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { CONFIG_TOKEN, ApplicationConfig } from '../../config';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  private username:string = "";
  private name:string = "";
  private score:number = 0;
  private bio:string = "";
  private attended_events = [];

  constructor(private events:Events, @Inject(CONFIG_TOKEN) private config:ApplicationConfig) {
    console.log('Hello UserProvider Provider');
    var es = new EventSource(this.config.UPDATES_URL);
    es.onmessage = (e) => {
      var message = JSON.parse(e.data);
      if(message.type == 'score' && message.user == this.username){
        this.score = this.score + 1;
        this.events.publish("user:score", this.score);
      }
    };
  }

  public setUsername(username:string){
    this.username = username;
  }
  public getUsername(){
    return this.username;
  }

  public setName(name:string){
    this.name = name;
  }
  public getName(){
    return this.name;
  }

  public setScore(score:number){
    this.score = +score;
  }
  public getScore(){
    return this.score;
  }

  public setBio(bio:string){
    this.bio = bio;
  }
  public getBio(){
    return this.bio;
  }

  public getAttendedEvents(){
    return this.attended_events;
  }

  public setUser(user:any){
    this.username = user.username;
    this.name = user.name;
    this.score = +(user.score) || 0;
    this.bio = user.bio;
    this.attended_events = user.attended_events;
  }

}
