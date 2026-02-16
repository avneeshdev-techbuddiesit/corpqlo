import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";
import { IonicModule } from '@ionic/angular';

import { OrderStoreIssueViewPage } from './order-store-issue-view.page';

const routes: Routes = [
  {
    path: '',
    component: OrderStoreIssueViewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderStoreIssueViewPage]
})
export class OrderStoreIssueViewPageModule {}
