import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdatesPage } from './updates';

@NgModule({
  declarations: [
    UpdatesPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdatesPage),
  ],
})
export class UpdatesPageModule {}
