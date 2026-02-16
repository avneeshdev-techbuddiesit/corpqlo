import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';

import { IonicModule } from '@ionic/angular';

import { OrderCancelPage } from './order-cancel.page';

const routes: Routes = [
  {
    path: '',
    component: OrderCancelPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FooterTabsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderCancelPage]
})
export class OrderCancelPageModule {}
