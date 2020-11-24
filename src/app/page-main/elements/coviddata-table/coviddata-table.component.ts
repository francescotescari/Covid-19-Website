import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-coviddata-table',
  templateUrl: './coviddata-table.component.html',
  styleUrls: ['./coviddata-table.component.css']
})
export class CoviddataTableComponent {

  @Input('dataSource') dataSource: Observable<object>;

}
