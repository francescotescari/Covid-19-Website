import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {DatedCovidDiffEntry, DatedCovidSimpleEntry} from '../../../covid-data.models';
import {Label} from 'ng2-charts';
import {map} from 'rxjs/operators';
import {ChartDataSets, ChartOptions} from 'chart.js';

@Component({
  selector: 'app-daily-bar-chart',
  templateUrl: './daily-bar-chart.component.html',
  styleUrls: ['./daily-bar-chart.component.css']
})
export class DailyBarChartComponent implements OnInit {

  @Input('dataSource') dataSource: Observable<DatedCovidDiffEntry[]>;
  public barChartData: ChartDataSets[];
  public barChartLabels: Label[];
  public barChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      duration: 0,
    },
    hover: {
      animationDuration: 0,
    },
    responsiveAnimationDuration: 0
  };

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource.pipe(map(value => {
      return value.slice(Math.max(0, value.length - 7));
    })).subscribe(value => {
      const labels = value.map((entry, index) => {
        if (entry.Date != null) {
          const date = new Date(Date.parse(entry.Date));
          return date.getDate() + '/' + (date.getMonth() + 1);
        } else {
          return null;
        }
      });
      if (labels.length > 0 && labels[0] != null){
        this.barChartLabels = labels;
      }
      this.barChartData = [
        {data: value.map(v => v.NewDeaths), label: 'New Deaths'},
        {data: value.map(v => v.NewRecovered), label: 'New Recovered'},
        {data: value.map(v => v.NewConfirmed), label: 'New Confirmed'},
      ];
    });
  }

}
