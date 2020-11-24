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
import {DatatableComponent} from '../datatable/datatable.component';
import {map, tap} from 'rxjs/operators';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {CountriesEntryModel} from '../countries-entry.model';
import {Router} from '@angular/router';
import {CoviddataModel} from '../section/coviddata.model';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  globalDataSource: Observable<CountriesEntryModel>;
  countriesTableObservable: Observable<Array<CountriesEntryModel>>;

  constructor(private apis: CoviddataService, public router: Router) {
  }

  ngOnInit(): void {
    const summaryObservable = new ReplaySubject<ApiSummaryModel>();
    this.apis.fetchSummary().subscribe(summaryObservable);
    this.globalDataSource = summaryObservable.pipe(map(value => value.Global as CountriesEntryModel));
    this.countriesTableObservable = summaryObservable.pipe(map(value => CoviddataService.GlobalCountryDataMapper(value)));

  }


}
