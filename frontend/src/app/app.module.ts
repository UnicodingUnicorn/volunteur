import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
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
import { LoginPage } from '../pages/login/login';

import { EventPage } from '../pages/event/event';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from '@ionic-native/deeplinks';
import { TokenProvider } from '../providers/token/token';

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
    EventPage
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
    EventPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Deeplinks,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
    TokenProvider
  ]
})
export class AppModule {}
