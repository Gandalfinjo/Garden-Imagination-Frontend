import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerAppointmentsComponent } from './owner-appointments.component';

describe('OwnerAppointmentsComponent', () => {
  let component: OwnerAppointmentsComponent;
  let fixture: ComponentFixture<OwnerAppointmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerAppointmentsComponent]
    });
    fixture = TestBed.createComponent(OwnerAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
