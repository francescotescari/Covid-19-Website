import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {ApiCountryModel, ApiSummaryModel, CovidDataService, WWCountry} from '../covid-data.service';
import {map, tap} from 'rxjs/operators';
import {Observable, of, ReplaySubject} from 'rxjs';
import {Router} from '@angular/router';
import {LoadmanagerService} from '../loadmanager.service';
import {
  CountryDiffEntry, CovidDiffEntry,
  CovidSimpleEntry,
  DatedCovidDiffEntry,
  DatedCovidSimpleEntry,
  diffToSimpleMapperDated
} from '../covid-data.models';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit, OnInit {
  globalDataSource = new ReplaySubject<DatedCovidSimpleEntry[]>();
  countriesTableObservable: Observable<CountryDiffEntry[]>;
  private summarySubject = new ReplaySubject<ApiSummaryModel>();
  summaryDataSource: Observable<CovidDiffEntry>;
  countryData: Observable<ApiCountryModel> = of(WWCountry);

  constructor(private apis: CovidDataService, public router: Router, private loadManager: LoadmanagerService) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.apis.fetchSummary().subscribe(this.summarySubject);
      this.apis.fetchDailyWorld().pipe(map(value => diffToSimpleMapperDated(value as DatedCovidDiffEntry[]))).subscribe(this.globalDataSource);
    }, 0);

  }

  ngOnInit(): void {
    this.countriesTableObservable = this.summarySubject.pipe(map(value => CovidDataService.GlobalCountryDataMapper(value)));
    const sub = this.loadManager.registerLoader();
    this.summarySubject.subscribe(value => sub.complete());
    this.summaryDataSource = this.summarySubject.pipe(map(value => value.Global));
  }

  onCountryClick(country): void {
    this.loadManager.rerouteAfterLoad(['/country/', country]);
  }


}
