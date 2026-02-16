import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStoreIssueViewPage } from './order-store-issue-view.page';

describe('OrderStoreIssueViewPage', () => {
  let component: OrderStoreIssueViewPage;
  let fixture: ComponentFixture<OrderStoreIssueViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderStoreIssueViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderStoreIssueViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
