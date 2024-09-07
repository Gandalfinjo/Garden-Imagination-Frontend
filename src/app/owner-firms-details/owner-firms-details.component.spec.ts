import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerFirmsDetailsComponent } from './owner-firms-details.component';

describe('OwnerFirmsDetailsComponent', () => {
  let component: OwnerFirmsDetailsComponent;
  let fixture: ComponentFixture<OwnerFirmsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerFirmsDetailsComponent]
    });
    fixture = TestBed.createComponent(OwnerFirmsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
