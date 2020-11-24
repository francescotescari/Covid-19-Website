import {Component, OnInit} from '@angular/core';
import {ApiSummaryModel, CoviddataService} from '../coviddata.service';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {CoviddataModel} from '../page-main/section/coviddata.model';
import {CountriesEntryModel} from '../page-main/countries-entry.model';


@Component({
  selector: 'app-countrypage',
  templateUrl: './countrypage.component.html',
  styleUrls: ['./countrypage.component.css']
})
export class CountrypageComponent implements OnInit {
  countryDataObservable: Observable<CountriesEntryModel>;
  countrySlug: string;

  constructor(private apis: CoviddataService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    const summaryObservable = new ReplaySubject<ApiSummaryModel>();
    this.countryDataObservable = summaryObservable.pipe(map(value => {
      if (!this.countrySlug) {
        throw Error('Country id not loaded');
      }
      return value.Countries.filter(e => e.Slug === this.countrySlug)[0];
    }));

    this.route.paramMap.subscribe(params => {
      this.countrySlug = params.get('country');
    });
    this.apis.fetchSummary().subscribe(summaryObservable);

  }


}
