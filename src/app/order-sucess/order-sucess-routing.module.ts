import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderSucessPage } from './order-sucess.page';

const routes: Routes = [
  {
    path: '',
    component: OrderSucessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderSucessPageRoutingModule {}
