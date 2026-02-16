import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderSucessPage } from './order-sucess.page';

describe('OrderSucessPage', () => {
  let component: OrderSucessPage;
  let fixture: ComponentFixture<OrderSucessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSucessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSucessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
