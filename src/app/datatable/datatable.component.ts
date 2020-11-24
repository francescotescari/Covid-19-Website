import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {
  observer;
  data = [];

  @Input('titles') titles?: Array<string>;

  ngOnInit(): void {
    this.observer = {
      next: data => this.handleData(data),
    };
  }

  bindTo(observable: Observable<any>): Observable<any> {
    return observable.pipe(
      tap(this.observer)
    );
  }

  protected handleData(data: any): void {
    if (this.titles && this.titles.length !== data[0].length) {
      throw Error('Invalid data shape');
    }
    this.data = data;
  }


}
