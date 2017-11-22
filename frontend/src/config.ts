import { InjectionToken } from '@angular/core'

//const HOST = "10.185.0.199";
const HOST = "192.168.99.100";
// const HOST = window.location.hostname;

export interface ApplicationConfig {
  CLIENT_ID : string,
  CLIENT_SECRET : string,
  VOLUNTEERS_URL : string,
  EVENTS_URL : string,
  UPDATES_URL : string
};

export const CONFIG : ApplicationConfig = {
  CLIENT_ID : "",
  CLIENT_SECRET : "",
  VOLUNTEERS_URL : "http://" + HOST + ":10202",
  EVENTS_URL : "http://" + HOST + ":10203",
  UPDATES_URL : "http://" + HOST + ":10206/updates"
}

export const CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');
