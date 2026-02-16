import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderIssuePage } from './order-issue.page';

describe('OrderIssuePage', () => {
  let component: OrderIssuePage;
  let fixture: ComponentFixture<OrderIssuePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderIssuePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
