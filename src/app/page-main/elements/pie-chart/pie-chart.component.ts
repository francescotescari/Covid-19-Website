import {Component, Input, OnInit} from '@angular/core';
import {COLOR_CRD} from '../../data';
import {Observable} from 'rxjs';
import {CountriesEntryModel} from '../../countries-entry.model';
import {SingleDataSet} from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  data: SingleDataSet;
  @Input('dataSource') dataSource: Observable<SingleDataSet>;
  @Input('labels') labels;
  colors = [{
    backgroundColor: COLOR_CRD,
    borderColor: COLOR_CRD
  }];


  ngOnInit(): void {
    this.dataSource.subscribe(next => this.data = next);
  }


}
