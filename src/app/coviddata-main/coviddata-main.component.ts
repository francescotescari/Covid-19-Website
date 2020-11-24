import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CoviddataModel} from '../section/coviddata.model';
import {CountriesEntryModel} from '../countries-entry.model';
import {map} from 'rxjs/operators';
import {CoviddataService} from '../coviddata.service';

@Component({
  selector: 'app-coviddata-main',
  templateUrl: './coviddata-main.component.html',
  styleUrls: ['./coviddata-main.component.css']
})
export class CoviddataMainComponent implements OnInit {

  @Input('dataSource') dataSource: Observable<CountriesEntryModel>;
  summaryTableObservable: Observable<object>;

  countryName: string;
  countrySlug: string;

  constructor() { }

  ngOnInit(): void {
    this.dataSource.subscribe(value => {
      this.countryName = value.Country;
    });
    this.summaryTableObservable = this.dataSource.pipe(map(value => CoviddataService.CovidDataMapper(value)));
  }

}
