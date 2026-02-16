import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferFreindPage } from './refer-freind.page';

describe('ReferFreindPage', () => {
  let component: ReferFreindPage;
  let fixture: ComponentFixture<ReferFreindPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferFreindPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferFreindPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
