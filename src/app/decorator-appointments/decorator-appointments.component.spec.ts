import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratorAppointmentsComponent } from './decorator-appointments.component';

describe('DecoratorAppointmentsComponent', () => {
  let component: DecoratorAppointmentsComponent;
  let fixture: ComponentFixture<DecoratorAppointmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoratorAppointmentsComponent]
    });
    fixture = TestBed.createComponent(DecoratorAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
