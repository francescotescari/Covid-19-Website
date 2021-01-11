import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidDataMainComponent } from './covid-data-main.component';

describe('CoviddataMainComponent', () => {
  let component: CovidDataMainComponent;
  let fixture: ComponentFixture<CovidDataMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidDataMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidDataMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
