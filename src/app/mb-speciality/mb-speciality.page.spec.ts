import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MbSpecialityPage } from './mb-speciality.page';

describe('MbSpecialityPage', () => {
  let component: MbSpecialityPage;
  let fixture: ComponentFixture<MbSpecialityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MbSpecialityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MbSpecialityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
