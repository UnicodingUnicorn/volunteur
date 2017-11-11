import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { FindPage } from '../pages/find/find';
import { BrowsePage } from '../pages/browse/browse';
import { GoingPage } from '../pages/going/going';
import { UpdatesPage } from '../pages/updates/updates';
import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TokenProvider } from '../providers/token/token';

@NgModule({
  declarations: [
    MyApp,
    FindPage,
    BrowsePage,
    GoingPage,
    UpdatesPage,
    ProfilePage,
    TabsPage,
    LoginPage
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
    FindPage,
    BrowsePage,
    GoingPage,
    UpdatesPage,
    ProfilePage,
    TabsPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TokenProvider
  ]
})
export class AppModule {}
