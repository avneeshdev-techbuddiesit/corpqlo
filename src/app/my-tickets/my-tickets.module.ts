import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from "ngx-spinner";
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';

import { MyTicketsPage } from './my-tickets.page';

const routes: Routes = [
  {
    path: '',
    component: MyTicketsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
        FormsModule,
    FooterTabsModule,
    NgxSpinnerModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyTicketsPage]
})
export class MyTicketsPageModule {}
