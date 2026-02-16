import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOrdertypePage } from './select-ordertype.page';

describe('SelectOrdertypePage', () => {
  let component: SelectOrdertypePage;
  let fixture: ComponentFixture<SelectOrdertypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOrdertypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOrdertypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
