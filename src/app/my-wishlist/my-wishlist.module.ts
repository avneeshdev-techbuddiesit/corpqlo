import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';

import { MyWishlistPage } from './my-wishlist.page';

const routes: Routes = [
  {
    path: '',
    component: MyWishlistPage
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
  declarations: [MyWishlistPage]
})
export class MyWishlistPageModule {}
