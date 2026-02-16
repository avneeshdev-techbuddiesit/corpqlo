import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';
import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from "ngx-spinner";

import { OffersPage } from './offers.page';

const routes: Routes = [
  {
    path: '',
    component: OffersPage
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
  declarations: [OffersPage]
})
export class OffersPageModule {}
