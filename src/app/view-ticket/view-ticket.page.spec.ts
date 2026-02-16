import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTicketPage } from './view-ticket.page';

describe('ViewTicketPage', () => {
  let component: ViewTicketPage;
  let fixture: ComponentFixture<ViewTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTicketPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
