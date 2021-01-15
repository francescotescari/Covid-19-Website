import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {CountryDiffEntry} from '../../../covid-data.models';

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

  ngOnInit(): void {
    this.tableDataSource = new MatTableDataSource<CountryDiffEntry>();
    this.dataSource.subscribe({
      next: value => {
        this.tableDataSource.data = value;
      },
    });
  }

  ngAfterViewInit(): void {
    this.tableDataSource.sort = this.sort;
  }


}
