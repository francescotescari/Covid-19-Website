import {Component, Input, OnInit} from '@angular/core';
import {COLOR_CRD} from '../../data';
import {Observable} from 'rxjs';
import {SingleDataSet} from 'ng2-charts';
import {ChartOptions} from 'chart.js';

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
  pieChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      duration: 0,
    },
    hover: {
      animationDuration: 0,
    },
    responsiveAnimationDuration: 0
  };


  ngOnInit(): void {
    this.dataSource.subscribe(next => this.data = next);
  }


}
