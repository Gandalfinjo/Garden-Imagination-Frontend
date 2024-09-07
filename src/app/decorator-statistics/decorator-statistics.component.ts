import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgChartOptions } from 'ag-charts-community';
import { AppointmentService } from '../services/appointment.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { forkJoin, switchMap, map } from 'rxjs';
import { FirmService } from '../services/firm.service';
import { Firm } from '../models/firm';

@Component({
  selector: 'app-decorator-statistics',
  templateUrl: './decorator-statistics.component.html',
  styleUrls: ['./decorator-statistics.component.css'],
})
export class DecoratorStatisticsComponent implements OnInit {
  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private firmService: FirmService
  ) { }

  ngOnInit(): void {
    const storedUsername = localStorage.getItem("logged");
    
    if (storedUsername) {
      const username = JSON.parse(storedUsername);

      this.userService.getByUsername(username).pipe(
        switchMap(user => {
          this.decorator = user;

          return this.firmService.getDecoratorFirm(user.username).pipe(
            switchMap(firm => {
              this.firm = firm;
              const decoratorObservables = firm.decorators.map(decorator =>
                this.appointmentService.getDecoratorAppointments(decorator.username).pipe(
                  map(appointments => ({
                    decorator: decorator.username,
                    jobs: appointments.length
                  }))
                )
              );

              return forkJoin(decoratorObservables).pipe(
                switchMap(decoratorData => {
                  this.pieChartData = decoratorData;
                  this.pieChartOptions = {
                    title: {
                      text: "Job Distribution Among Decorators"
                    },
                    subtitle: {
                      text: "A pie chart showing job distribution"
                    },
                    data: this.pieChartData,
                    series: [{ type: "pie", angleKey: "jobs", legendItemKey: "decorator" }],
                    legend: {
                      position: "right"
                    }
                  };

                  const observables = [];
                  for (let month = 1; month <= 12; month++) {
                    const monthStr = month.toString().padStart(2, '0');
                    observables.push(this.appointmentService.getDecoratorMonthlyAppointments(user.username, monthStr));
                  }

                  return forkJoin(observables);
                })
              );
            })
          );
        })
      ).subscribe(
        counts => {
          this.barChartOptions = {
            title: {
              text: "Number of Jobs per Month"
            },
            subtitle: {
              text: "A bar chart showing job counts by month"
            },
            data: [
              { month: "Jan", jobs: counts[0] },
              { month: "Feb", jobs: counts[1] },
              { month: "Mar", jobs: counts[2] },
              { month: "Apr", jobs: counts[3] },
              { month: "May", jobs: counts[4] },
              { month: "Jun", jobs: counts[5] },
              { month: "Jul", jobs: counts[6] },
              { month: "Aug", jobs: counts[7] },
              { month: "Sep", jobs: counts[8] },
              { month: "Oct", jobs: counts[9] },
              { month: "Nov", jobs: counts[10] },
              { month: "Dec", jobs: counts[11] }
            ],
            series: [{ type: "bar", xKey: "month", yKey: "jobs" }],
            axes: [
              { type: "category", position: "bottom", title: { text: "Month" } },
              { type: "number", position: "left", title: { text: "Number of Jobs" } }
            ]
          };

          this.appointmentService.getDailyAppointments(this.firm.id).subscribe(
            data => this.histogramData = data
          );
        },
        error => {
          console.error("Error fetching data", error);
        }
      );
    }
  }

  firm: Firm = new Firm();

  decorator: User = new User();

  barChartOptions: AgChartOptions = { };

  pieChartData: any[] = [];
  pieChartOptions: AgChartOptions = { }

  histogramData: any[] = [];
  histogramChartOptions: AgChartOptions = {
    title: {
      text: "Average Number of Jobs by Day of the Week (Last 24 Months)"
    },
    subtitle: {
      text: "A histogram showing average monthly jobs by weekday"
    },
    data: [
      { day: "Mon", avgJobs: 25 },
      { day: "Tue", avgJobs: 30 },
      { day: "Wed", avgJobs: 35 },
      { day: "Thu", avgJobs: 28 },
      { day: "Fri", avgJobs: 22 },
      { day: "Sat", avgJobs: 18 },
      { day: "Sun", avgJobs: 20 }
    ],
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
  }

  logout(): void {
    localStorage.removeItem("logged");
    this.router.navigate([""]); 
  }
}
