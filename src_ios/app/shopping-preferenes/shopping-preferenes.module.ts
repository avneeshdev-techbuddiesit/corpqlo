import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";

import { IonicModule } from '@ionic/angular';

import { ShoppingPreferenesPage } from './shopping-preferenes.page';

const routes: Routes = [
  {
    path: '',
    component: ShoppingPreferenesPage
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
  declarations: [ShoppingPreferenesPage]
})
export class ShoppingPreferenesPageModule {}
