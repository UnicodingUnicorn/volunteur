import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, Events } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { LoginPage } from '../pages/login/login';
import { FindPage } from '../pages/find/find';
import { BrowsePage } from '../pages/browse/browse';
import { GoingPage } from '../pages/going/going';
import { UpdatesPage } from '../pages/updates/updates';
import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { SignupPage } from '../pages/signup/signup';
import { EventPage } from '../pages/event/event';
import { CreateEventPage } from '../pages/createevent/createevent';
import { ScoreboardPage } from '../pages/scoreboard/scoreboard';

import { CONFIG, CONFIG_TOKEN, ApplicationConfig } from '../config'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from '@ionic-native/deeplinks';
import { TokenProvider } from '../providers/token/token';
import { UserProvider } from '../providers/user/user';
import { UserApiProvider } from '../providers/user-api/user-api';
import { EventsApiProvider } from '../providers/events-api/events-api';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    FindPage,
    BrowsePage,
    GoingPage,
    UpdatesPage,
    ProfilePage,
    TabsPage,
    EventPage,
    SignupPage,
    CreateEventPage,
    ScoreboardPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    FindPage,
    BrowsePage,
    GoingPage,
    UpdatesPage,
    ProfilePage,
    TabsPage,
    EventPage,
    SignupPage,
    CreateEventPage,
    ScoreboardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Deeplinks,
    TokenProvider,
    {provide : ErrorHandler, useClass : IonicErrorHandler},
    {provide : CONFIG_TOKEN, useValue : CONFIG},
    UserProvider,
    UserApiProvider,
    EventsApiProvider
  ]
})
export class AppModule {}
