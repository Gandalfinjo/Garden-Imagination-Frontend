import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratorMaintenanceComponent } from './decorator-maintenance.component';

describe('DecoratorMaintenanceComponent', () => {
  let component: DecoratorMaintenanceComponent;
  let fixture: ComponentFixture<DecoratorMaintenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoratorMaintenanceComponent]
    });
    fixture = TestBed.createComponent(DecoratorMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
