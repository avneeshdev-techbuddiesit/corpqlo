import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from "ngx-spinner";

import { TicketListingPage } from './ticket-listing.page';

const routes: Routes = [
  {
    path: '',
    component: TicketListingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TicketListingPage]
})
export class TicketListingPageModule {}
