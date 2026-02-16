import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from "ngx-spinner";
import { SmartWayDetailPage } from './smart-way-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SmartWayDetailPage
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
  declarations: [SmartWayDetailPage]
})
export class SmartWayDetailPageModule {}
