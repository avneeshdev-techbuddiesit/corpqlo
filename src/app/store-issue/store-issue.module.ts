import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from "ngx-spinner";
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';
import { StoreIssuePage } from './store-issue.page';

const routes: Routes = [
  {
    path: '',
    component: StoreIssuePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule,
        IonicModule,
    FooterTabsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StoreIssuePage]
})
export class StoreIssuePageModule {}
