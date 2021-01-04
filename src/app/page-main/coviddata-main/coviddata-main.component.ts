import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CoviddataModel} from '../section/coviddata.model';
import {CountriesEntryModel} from '../countries-entry.model';
import {map} from 'rxjs/operators';
import {CoviddataService} from '../../coviddata.service';
import {Label, SingleDataSet} from 'ng2-charts';
import {Router} from '@angular/router';

@Component({
  selector: 'app-coviddata-main',
  templateUrl: './coviddata-main.component.html',
  styleUrls: ['./coviddata-main.component.css']
})
export class CoviddataMainComponent implements OnInit, AfterContentInit {

  @Input('dataSource') dataSource: Observable<CountriesEntryModel>;
  summaryTableObservable: Observable<object>;
  pieChartData: Observable<SingleDataSet>;
  pieChartLabels: Label[] = ['Total Cases', 'Total recovered', 'Total deaths'];

  countryName: string;
  countrySlug: string;
  loading = true;

  constructor(public router: Router) {
  }

  ngOnInit(): void {
    this.dataSource.subscribe(value => {
      this.countryName = value.Country;
    });
    this.summaryTableObservable = this.dataSource.pipe(map(value => CoviddataService.CovidDataMapper(value)));
    this.pieChartData = this.dataSource.pipe(map(value => [value.TotalConfirmed, value.TotalRecovered, value.TotalDeaths]));
  }


  ngAfterContentInit(): void {
    this.dataSource.subscribe(next => this.loading = false);
  }

}
