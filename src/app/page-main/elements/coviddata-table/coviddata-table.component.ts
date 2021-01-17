import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {tap} from 'rxjs/operators';
import {LoadmanagerService} from '../../../loadmanager.service';

@Component({
  selector: 'app-coviddata-table',
  templateUrl: './coviddata-table.component.html',
  styleUrls: ['./coviddata-table.component.css']
})
export class CoviddataTableComponent implements OnInit, AfterViewInit {

  @Input('dataSource') dataSource: Observable<object>;
  ready = false;
  private loaded: Subject<void>;

  constructor(private loadManager: LoadmanagerService) {
  }

  ngOnInit(): void {
    this.dataSource.subscribe(_ => this.ready = true);
    this.loaded = this.loadManager.registerLoader();
  }

  ngAfterViewInit(): void {
    this.dataSource.subscribe({
      next: value => this.loaded.complete(),
      error: err => this.loaded.complete()
    });
  }

}
