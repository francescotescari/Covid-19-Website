import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {CountryDiffEntry} from '../../../covid-data.models';
import {LoadmanagerService} from '../../../loadmanager.service';

@Component({
  selector: 'app-countries-table',
  templateUrl: './countries-table.component.html',
  styleUrls: ['./countries-table.component.css']
})
export class CountriesTableComponent implements OnInit, AfterViewInit {

  @Input('dataSource') dataSource: Observable<CountryDiffEntry[]>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Output('countryClick') countryClick = new EventEmitter<string>();

  tableDataSource;
  private loaded: Subject<void>;

  constructor(private loadManager: LoadmanagerService) {
  }

  ngOnInit(): void {
    this.tableDataSource = new MatTableDataSource<CountryDiffEntry>();
    this.dataSource.subscribe({
      next: value => {
        this.tableDataSource.data = value;
      },
    });
    this.loaded = this.loadManager.registerLoader();
  }

  ngAfterViewInit(): void {
    this.tableDataSource.sort = this.sort;
    this.dataSource.subscribe({
      next: value => this.loaded.complete(),
      error: err => this.loaded.complete()
    });
  }


}
