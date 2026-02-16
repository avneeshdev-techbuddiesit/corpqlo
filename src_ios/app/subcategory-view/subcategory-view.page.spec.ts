import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryViewPage } from './subcategory-view.page';

describe('SubcategoryViewPage', () => {
  let component: SubcategoryViewPage;
  let fixture: ComponentFixture<SubcategoryViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcategoryViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
