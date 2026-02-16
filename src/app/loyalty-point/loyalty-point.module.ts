import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";

import { IonicModule } from '@ionic/angular';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';
import { LoyaltyPointPage } from './loyalty-point.page';

const routes: Routes = [
  {
    path: '',
    component: LoyaltyPointPage
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
  declarations: [LoyaltyPointPage]
})
export class LoyaltyPointPageModule {}
