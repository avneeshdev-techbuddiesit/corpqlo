import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from "ngx-spinner";

import { RecipeDetailsPage } from './recipe-details.page';

const routes: Routes = [
  {
    path: '',
    component: RecipeDetailsPage
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
  declarations: [RecipeDetailsPage]
})
export class RecipeDetailsPageModule {}
