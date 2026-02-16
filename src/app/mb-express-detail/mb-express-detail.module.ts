import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from "ngx-spinner";

import { MbExpressDetailPage } from './mb-express-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MbExpressDetailPage
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
  declarations: [MbExpressDetailPage]
})
export class MbExpressDetailPageModule {}
