import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";
import { IonicModule } from '@ionic/angular';

import { BasketDetailPagePage } from './basket-detail-page.page';

const routes: Routes = [
  {
    path: '',
    component: BasketDetailPagePage
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
  declarations: [BasketDetailPagePage]
})
export class BasketDetailPagePageModule {}
