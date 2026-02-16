import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseTicketPage } from './raise-ticket.page';

describe('RaiseTicketPage', () => {
  let component: RaiseTicketPage;
  let fixture: ComponentFixture<RaiseTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaiseTicketPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
