import {Component, Input, OnInit} from '@angular/core';
import {COLOR_CRD} from '../../data';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {

  @Input('data') data;
  @Input('labels') labels;
  colors = [{
    backgroundColor: COLOR_CRD,
    borderColor: COLOR_CRD
  }];


}
