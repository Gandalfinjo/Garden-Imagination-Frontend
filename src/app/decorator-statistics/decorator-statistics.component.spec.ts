import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratorStatisticsComponent } from './decorator-statistics.component';

describe('DecoratorStatisticsComponent', () => {
  let component: DecoratorStatisticsComponent;
  let fixture: ComponentFixture<DecoratorStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoratorStatisticsComponent]
    });
    fixture = TestBed.createComponent(DecoratorStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
