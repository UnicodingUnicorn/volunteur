import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';

import { EventsApiProvider } from '../../providers/events-api/events-api';

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  name:string = ""
  description:string = ""
  organisation:string = ""
  organiser:string = ""
  starttime:string = ""
  endtime:string = ""
  num_participants:number = 0
  max_participants:number = 10
  is_participating:boolean = false

  token = undefined;

  constructor(public navCtrl: NavController, public navParams: NavParams, private tc:ToastController, private events:Events, private eventsApi:EventsApiProvider) {
    this.name = this.navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
    this.eventsApi.getEvent(this.name).then((event:any) => {
      if(event != {}){
        this.description = event.description;
        this.organisation = event.organisation;
        this.organiser = event.organiser;
        this.starttime = event.starttime;
        this.endtime = event.endtime;
        this.num_participants = event.num_participants;
        this.max_participants = event.max_participants;
        this.is_participating = event.is_participating;
      }
    });
  }

  setGoing(bool) {
    if (!bool)
      return;
    this.eventsApi.addUser(this.name).then(() => {
      this.ionViewDidLoad();
      let toast = this.tc.create({
        message : 'Joined event!',
        duration : 2500,
        position : 'bottom'
      });
      toast.present();
    });
  }

}
