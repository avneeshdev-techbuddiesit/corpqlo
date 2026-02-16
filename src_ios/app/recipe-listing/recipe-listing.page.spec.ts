import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeListingPage } from './recipe-listing.page';

describe('RecipeListingPage', () => {
  let component: RecipeListingPage;
  let fixture: ComponentFixture<RecipeListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
