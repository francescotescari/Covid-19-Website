import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-coviddata-table',
  templateUrl: './coviddata-table.component.html',
  styleUrls: ['./coviddata-table.component.css']
})
export class CoviddataTableComponent implements OnInit {

  @Input('dataSource') dataSource: Observable<object>;
  ready = false;

  ngOnInit(): void {
    this.dataSource.subscribe(_ => this.ready = true);
  }

}
