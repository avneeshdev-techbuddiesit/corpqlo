import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";
import { IonicModule } from '@ionic/angular';

import { BlogListingPage } from './blog-listing.page';

const routes: Routes = [
  {
    path: '',
    component: BlogListingPage
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
  declarations: [BlogListingPage]
})
export class BlogListingPageModule {}
