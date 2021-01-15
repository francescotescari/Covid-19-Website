import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {
  CovidDiffEntry,
  DatedCovidDiffEntry,
  DatedCovidSimpleEntry,
  simpleToDiffMapper,
  simpleToDiffMapperDated
} from '../../covid-data.models';
import {map} from 'rxjs/operators';
import {ApiCountryModel, CovidDataService} from '../../covid-data.service';
import {Label, SingleDataSet} from 'ng2-charts';
import {Router} from '@angular/router';
import {LoadmanagerService} from '../../loadmanager.service';
import {NewsEntry, NewsService} from '../../news.service';


@Component({
  selector: 'app-coviddata-main',
  templateUrl: './covid-data-main.component.html',
  styleUrls: ['./covid-data-main.component.css']
})
export class CovidDataMainComponent implements OnInit, AfterContentInit {

  @Input() dataSource: Observable<DatedCovidSimpleEntry[]>;
  @Input() countryData: Observable<ApiCountryModel>;
  slugData: Observable<string>;
  country: ApiCountryModel;
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
    this.countryData.subscribe(country => {
      this.country = country;
    });
    this.slugData = this.countryData.pipe(map(value => value.Slug));
  }


  ngAfterContentInit(): void {
    this.dataSource.subscribe(next => this.loading = false);
  }

  countryDisplayName(): string {
    if (this.country == null) {
      return '';
    }
    if (this.country.Slug == null) {
      return 'Worldwide';
    } else {
      return 'in ' + this.country.Country;
    }
  }


}
