import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgxSpinnerModule } from "ngx-spinner";

import { IonicModule } from '@ionic/angular';

import { StoreLocationPage } from './store-location.page';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';


const routes: Routes = [
  {
    path: '',
    component: StoreLocationPage
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
  declarations: [StoreLocationPage]
})
export class StoreLocationPageModule {}
