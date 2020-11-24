import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoviddataMainComponent } from './coviddata-main.component';

describe('CoviddataMainComponent', () => {
  let component: CoviddataMainComponent;
  let fixture: ComponentFixture<CoviddataMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoviddataMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoviddataMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
