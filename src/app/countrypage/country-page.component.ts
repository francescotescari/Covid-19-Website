import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiSummaryModel, CovidDataService} from '../covid-data.service';
import {combineLatest, forkJoin, Observable, ReplaySubject, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ApiCountryCovidEntry, CountryDiffEntry, CovidDiffEntry, CovidSimpleEntry, DatedCovidSimpleEntry} from '../covid-data-models';
import {LoadmanagerService} from '../loadmanager.service';


@Component({
  selector: 'app-countrypage',
  templateUrl: './country-page.component.html',
  styleUrls: ['./country-page.component.css']
})
export class CountryPageComponent implements OnInit, AfterViewInit {
  countryDataObservable: Observable<ApiCountryCovidEntry[]>;
  private countryDataSubject: ReplaySubject<ApiCountryCovidEntry[]>;
  private countrySlugSubject: ReplaySubject<string>;
  countryName: string;

  constructor(private apis: CovidDataService, private route: ActivatedRoute, private loadManager: LoadmanagerService) {
  }

  ngOnInit(): void {
    this.countryDataSubject = new ReplaySubject<ApiCountryCovidEntry[]>();
    this.countrySlugSubject = new ReplaySubject<string>();
    this.route.paramMap.subscribe(value => this.countrySlugSubject.next(value.get('country')));
    this.countryDataObservable = this.countryDataSubject;
    const sub = this.loadManager.registerLoader();
    this.countryDataObservable.subscribe(value => sub.complete());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.countrySlugSubject.subscribe(value => {
        this.apis.fetchDailyCountry(value).subscribe(data => {
          this.countryName = data[0].Country;
          this.countryDataSubject.next(data);
        });
      });
    }, 0);
  }


}
