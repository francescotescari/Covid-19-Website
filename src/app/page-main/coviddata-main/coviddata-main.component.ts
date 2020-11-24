import {Component, Input, OnInit} from '@angular/core';
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
export class CoviddataMainComponent implements OnInit {

  @Input('dataSource') dataSource: Observable<CountriesEntryModel>;
  summaryTableObservable: Observable<object>;
  pieChartData: SingleDataSet;
  pieChartLabels: Label[] = ['Total Cases', 'Total recovered', 'Total deaths'];

  countryName: string;
  countrySlug: string;

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.dataSource.subscribe(value => {
      this.countryName = value.Country;
    });
    this.summaryTableObservable = this.dataSource.pipe(map(value => CoviddataService.CovidDataMapper(value)));
    this.dataSource.subscribe(value => this.pieChartData = [value.TotalConfirmed, value.TotalRecovered, value.TotalDeaths]);
  }

}
