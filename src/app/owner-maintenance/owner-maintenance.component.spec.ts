import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerMaintenanceComponent } from './owner-maintenance.component';

describe('OwnerMaintenanceComponent', () => {
  let component: OwnerMaintenanceComponent;
  let fixture: ComponentFixture<OwnerMaintenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerMaintenanceComponent]
    });
    fixture = TestBed.createComponent(OwnerMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
