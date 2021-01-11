import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {
  CovidDiffEntry,
  DatedCovidDiffEntry,
  DatedCovidSimpleEntry,
  simpleToDiffMapper,
  simpleToDiffMapperDated
} from '../../covid-data-models';
import {map} from 'rxjs/operators';
import {CovidDataService} from '../../covid-data.service';
import {Label, SingleDataSet} from 'ng2-charts';
import {Router} from '@angular/router';

@Component({
  selector: 'app-coviddata-main',
  templateUrl: './covid-data-main.component.html',
  styleUrls: ['./covid-data-main.component.css']
})
export class CovidDataMainComponent implements OnInit, AfterContentInit {

  @Input('dataSource') dataSource: Observable<DatedCovidSimpleEntry[]>;
  @Input('countryName') countryName: string;
  summaryTableObservable: Observable<object>;
  pieChartData: Observable<SingleDataSet>;
  pieChartLabels: Label[] = ['Total Cases', 'Total recovered', 'Total deaths'];
  diffDataSource: Observable<DatedCovidDiffEntry[]>;

  countrySlug: string;
  loading = true;

  constructor(public router: Router) {
  }

  ngOnInit(): void {
    this.summaryTableObservable = this.dataSource.pipe(map(value => {
      const diff = simpleToDiffMapper(value);
      return CovidDataService.CovidDataMapper(diff[diff.length - 1]);
    }));
    this.pieChartData = this.dataSource.pipe(map(value => {
      const lastValue = value[value.length - 1];
      return [lastValue.Confirmed, lastValue.Recovered, lastValue.Deaths];
    }));
    this.diffDataSource = this.dataSource.pipe(map(simpleToDiffMapperDated));
  }


  ngAfterContentInit(): void {
    this.dataSource.subscribe(next => this.loading = false);
  }

}
