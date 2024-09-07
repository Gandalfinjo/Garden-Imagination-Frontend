import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css']
})
export class HistogramComponent implements OnChanges {
  @Input() histogramData: any[] = [];

  histogramChartOptions: AgChartOptions = {
    title: {
      text: "Average Number of Jobs by Day of the Week (Last 24 Months)"
    },
    subtitle: {
      text: "A histogram showing average monthly jobs by weekday"
    },
    data: this.histogramData,
    series: [
      {
        type: "bar",
        xKey: "day",
        yKey: "avgJobs",
      }
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "Day of the Week" }
      },
      {
        type: "number",
        position: "left",
        title: { text: "Average Jobs" }
      }
    ]
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['histogramData']) {
      this.histogramChartOptions = {
        ...this.histogramChartOptions,
        data: this.histogramData
      };
    }
  }
}
