import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiSummaryModel, CoviddataService} from '../coviddata.service';
import {combineLatest, forkJoin, Observable, ReplaySubject, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {CoviddataModel} from '../page-main/section/coviddata.model';
import {CountriesEntryModel} from '../page-main/countries-entry.model';
import {LoadmanagerService} from '../loadmanager.service';


@Component({
  selector: 'app-countrypage',
  templateUrl: './countrypage.component.html',
  styleUrls: ['./countrypage.component.css']
})
export class CountrypageComponent implements OnInit, AfterViewInit {
  countryDataObservable: Observable<CountriesEntryModel>;
  private countryDataSubject: ReplaySubject<ApiSummaryModel>;

  constructor(private apis: CoviddataService, private route: ActivatedRoute, private loadManager: LoadmanagerService) {
  }

  ngOnInit(): void {
    this.countryDataSubject = new ReplaySubject<ApiSummaryModel>();
    this.countryDataObservable = combineLatest([this.route.paramMap, this.countryDataSubject]).pipe(map(value => {
      return value[1].Countries.filter(e => e.Slug === value[0].get('country'))[0];
    }));
    const sub = this.loadManager.registerLoader();
    this.countryDataObservable.subscribe(value => sub.complete());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.apis.fetchSummary().subscribe(this.countryDataSubject);
    }, 0);
  }


}
