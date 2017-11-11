import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoingPage } from './going';

@NgModule({
  declarations: [
    GoingPage,
  ],
  imports: [
    IonicPageModule.forChild(GoingPage),
  ],
})
export class GoingPageModule {}
