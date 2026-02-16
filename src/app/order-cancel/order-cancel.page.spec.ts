import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCancelPage } from './order-cancel.page';

describe('OrderCancelPage', () => {
  let component: OrderCancelPage;
  let fixture: ComponentFixture<OrderCancelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCancelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCancelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
