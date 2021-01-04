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
import {ApiSummaryModel, CoviddataService} from '../coviddata.service';
import {map, tap} from 'rxjs/operators';
import {Observable, of, ReplaySubject} from 'rxjs';
import {CountriesEntryModel} from '../page-main/countries-entry.model';
import {Router} from '@angular/router';
import {LoadmanagerService} from '../loadmanager.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit, OnInit {
  globalDataSource: Observable<CountriesEntryModel>;
  countriesTableObservable: Observable<Array<CountriesEntryModel>>;
  private summaryObservable: ReplaySubject<ApiSummaryModel>;

  constructor(private apis: CoviddataService, public router: Router, private loadManager: LoadmanagerService) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.apis.fetchSummary().subscribe(this.summaryObservable);
    }, 3000);

  }

  ngOnInit(): void {
    this.summaryObservable = new ReplaySubject<ApiSummaryModel>();
    this.globalDataSource = this.summaryObservable.pipe(map(value => value.Global as CountriesEntryModel));
    this.countriesTableObservable = this.summaryObservable.pipe(map(value => CoviddataService.GlobalCountryDataMapper(value)));
    const sub = this.loadManager.registerLoader();
    this.summaryObservable.subscribe(value => sub.complete());
  }


}
