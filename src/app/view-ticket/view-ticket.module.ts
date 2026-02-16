import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from "ngx-spinner";

import { ViewTicketPage } from './view-ticket.page';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';


const routes: Routes = [
  {
    path: '',
    component: ViewTicketPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
        IonicModule,
    FooterTabsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewTicketPage]
})
export class ViewTicketPageModule {}
