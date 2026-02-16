import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketListingPage } from './ticket-listing.page';

describe('TicketListingPage', () => {
  let component: TicketListingPage;
  let fixture: ComponentFixture<TicketListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
