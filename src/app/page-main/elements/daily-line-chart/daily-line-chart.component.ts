import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {DatedCovidDiffEntry, DatedCovidSimpleEntry} from '../../../covid-data.models';
import {Label} from 'ng2-charts';
import {map} from 'rxjs/operators';
import {ChartDataSets, ChartOptions} from 'chart.js';
import {LoadmanagerService} from '../../../loadmanager.service';

@Component({
  selector: 'app-daily-line-chart',
  templateUrl: './daily-line-chart.component.html',
  styleUrls: ['./daily-line-chart.component.css']
})
export class DailyLineChartComponent implements OnInit {

  @Input('dataSource') dataSource: Observable<DatedCovidSimpleEntry[]>;
  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  loaded = false;
  public lineChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      duration: 0,
    },
    hover: {
      animationDuration: 0,
    },
    responsiveAnimationDuration: 0,
    maintainAspectRatio: false
  };

  constructor(private loadManager: LoadmanagerService) {
  }

  ngOnInit(): void {
    const loaded = this.loadManager.registerLoader();
    this.dataSource.subscribe({
      next: value => {
        const labels = value.map((entry, index) => {
          if (entry.Date != null) {
            const date = new Date(entry.Date);
            return date.getDate() + '/' + (date.getMonth() + 1);
          } else {
            return null;
          }
        });
        if (labels.length > 0 && labels[0] != null) {
          this.lineChartLabels = labels;
        }
        this.lineChartData = [
          {data: value.map(v => v.Deaths), label: 'Deaths'},
          {data: value.map(v => v.Recovered), label: 'Recovered'},
          {data: value.map(v => v.Confirmed), label: 'Confirmed'},
        ];
        loaded.complete();
        this.loaded = true;
      },
      error: err => {
        loaded.complete();
        this.loaded = true;
      }
    });
  }

}
