import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPreferencePage } from './add-preference.page';

describe('AddPreferencePage', () => {
  let component: AddPreferencePage;
  let fixture: ComponentFixture<AddPreferencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPreferencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPreferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
