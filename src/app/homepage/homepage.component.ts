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
  CountryDiffEntry,
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
  globalDataSource: Observable<DatedCovidSimpleEntry[]>;
  countriesTableObservable: Observable<CountryDiffEntry[]>;
  private summaryObservable: ReplaySubject<ApiSummaryModel>;
  countryData: Observable<ApiCountryModel> = of(WWCountry);

  constructor(private apis: CovidDataService, public router: Router, private loadManager: LoadmanagerService) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.apis.fetchSummary().subscribe(this.summaryObservable);
    }, 0);

  }

  ngOnInit(): void {
    this.summaryObservable = new ReplaySubject<ApiSummaryModel>();
    this.globalDataSource = this.summaryObservable.pipe(map(value => {
      return diffToSimpleMapperDated([value.Global as DatedCovidDiffEntry]);
    }));
    this.countriesTableObservable = this.summaryObservable.pipe(map(value => CovidDataService.GlobalCountryDataMapper(value)));
    const sub = this.loadManager.registerLoader();
    this.summaryObservable.subscribe(value => sub.complete());
  }

  onCountryClick(country): void {
    this.loadManager.rerouteAfterLoad(['/country/', country]);
  }


}
