import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";
import { IonicModule } from '@ionic/angular';

import { MyAccountPage } from './my-account.page';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';
const routes: Routes = [
  {
    path: '',
    component: MyAccountPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    IonicModule,
    FooterTabsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyAccountPage]
})
export class MyAccountPageModule {}
