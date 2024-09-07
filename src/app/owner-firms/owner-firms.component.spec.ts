import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerFirmsComponent } from './owner-firms.component';

describe('OwnerFirmsComponent', () => {
  let component: OwnerFirmsComponent;
  let fixture: ComponentFixture<OwnerFirmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerFirmsComponent]
    });
    fixture = TestBed.createComponent(OwnerFirmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
