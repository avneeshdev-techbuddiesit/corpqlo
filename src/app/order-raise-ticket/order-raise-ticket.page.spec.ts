import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRaiseTicketPage } from './order-raise-ticket.page';

describe('OrderRaiseTicketPage', () => {
  let component: OrderRaiseTicketPage;
  let fixture: ComponentFixture<OrderRaiseTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRaiseTicketPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRaiseTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
