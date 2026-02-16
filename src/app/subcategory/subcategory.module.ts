import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SubcategoryPage } from './subcategory.page';

import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';
const routes: Routes = [
  {
    path: '',
    component: SubcategoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
   
    FormsModule,
    IonicModule,
    FooterTabsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SubcategoryPage]
})
export class SubcategoryPageModule {}
