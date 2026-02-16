import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrderListPage } from './order-list.page';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';

const routes: Routes = [
  {
    path: '',
    component: OrderListPage
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
  declarations: [OrderListPage]
})
export class OrderListPageModule {}
