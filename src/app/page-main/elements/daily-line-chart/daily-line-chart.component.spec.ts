import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLineChartComponent } from './daily-line-chart.component';

describe('DailyLineChartComponent', () => {
  let component: DailyLineChartComponent;
  let fixture: ComponentFixture<DailyLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
