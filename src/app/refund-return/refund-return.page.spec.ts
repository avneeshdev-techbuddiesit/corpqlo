import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundReturnPage } from './refund-return.page';

describe('RefundReturnPage', () => {
  let component: RefundReturnPage;
  let fixture: ComponentFixture<RefundReturnPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundReturnPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundReturnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
