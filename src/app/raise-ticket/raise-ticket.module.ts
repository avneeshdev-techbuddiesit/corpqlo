import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";

import { IonicModule } from '@ionic/angular';

import { RaiseTicketPage } from './raise-ticket.page';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';


const routes: Routes = [
  {
    path: '',
    component: RaiseTicketPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
        FormsModule,
    FooterTabsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RaiseTicketPage]
})
export class RaiseTicketPageModule {}
