import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from "ngx-spinner";
import { AddPreferencePage } from './add-preference.page';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';


const routes: Routes = [
  {
    path: '',
    component: AddPreferencePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule,
        IonicModule,
    FooterTabsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddPreferencePage]
})
export class AddPreferencePageModule {}
