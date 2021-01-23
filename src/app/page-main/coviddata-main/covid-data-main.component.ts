import {AfterContentInit, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
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

const emptyDataEntry: CovidDiffEntry = {
  NewRecovered: 0,
  NewDeaths: 0,
  NewConfirmed: 0,
  TotalDeaths: 0,
  TotalRecovered: 0,
  TotalConfirmed: 0,

};


@Component({
  selector: 'app-coviddata-main',
  templateUrl: './covid-data-main.component.html',
  styleUrls: ['./covid-data-main.component.css']
})
export class CovidDataMainComponent implements OnInit, AfterContentInit {

  @Input() summarySource: Observable<CovidDiffEntry>;
  @Input() dataSource: Observable<DatedCovidSimpleEntry[]>;
  @Input() countryData: Observable<ApiCountryModel>;
  slugData: Observable<string>;
  country: ApiCountryModel;
  summaryTableObservable: Observable<object>;
  pieChartData: Observable<SingleDataSet>;
  pieChartLabels: Label[] = ['Total Cases', 'Total recovered', 'Total deaths'];
  diffDataSource: Observable<DatedCovidDiffEntry[]>;



  countrySlug: string;
  private loaded: Subject<void>;

  constructor(public router: Router, private loadManager: LoadmanagerService) {
  }



  ngOnInit(): void {
    this.loaded = this.loadManager.registerLoader();
    if (this.summarySource == null){
      this.summarySource = this.dataSource.pipe(map(value => {
        const diff = simpleToDiffMapper(value);
        return diff.length > 0 ? diff[diff.length - 1] : emptyDataEntry;
      }));
    }
    this.summaryTableObservable = this.summarySource.pipe(map(CovidDataService.CovidDataMapper));
    this.pieChartData = this.summarySource.pipe(map(value => {
      return [value.TotalConfirmed, value.TotalRecovered, value.TotalDeaths];
    }));
    this.diffDataSource = this.dataSource.pipe(map(simpleToDiffMapperDated));
    this.countryData.subscribe(country => {
      this.country = country;
    });
    this.slugData = this.countryData.pipe(map(value => value.Slug));
  }


  ngAfterContentInit(): void {
    this.dataSource.subscribe({next: next => this.loaded.complete(), error: err => this.loaded.complete()});
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
