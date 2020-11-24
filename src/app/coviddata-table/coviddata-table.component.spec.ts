import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoviddataTableComponent } from './coviddata-table.component';

describe('CoviddataTableComponent', () => {
  let component: CoviddataTableComponent;
  let fixture: ComponentFixture<CoviddataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoviddataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoviddataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
