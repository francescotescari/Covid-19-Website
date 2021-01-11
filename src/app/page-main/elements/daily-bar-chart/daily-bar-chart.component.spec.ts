import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyBarChartComponent } from './daily-bar-chart.component';

describe('DailyBarChartComponent', () => {
  let component: DailyBarChartComponent;
  let fixture: ComponentFixture<DailyBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
