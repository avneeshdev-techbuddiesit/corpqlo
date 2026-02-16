import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from "ngx-spinner";
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';

import { ReferFreindPage } from './refer-freind.page';

const routes: Routes = [
  {
    path: '',
    component: ReferFreindPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
        FormsModule,
    FooterTabsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReferFreindPage]
})
export class ReferFreindPageModule {}
