import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Firm } from '../models/firm';
import { FirmService } from '../services/firm.service';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/appointment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService, private firmService: FirmService, private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.appointmentService.getTotalDecoratedGardens().subscribe(
      count => this.decoratedGardensCount = count
    );

    this.userService.getOwnersCount().subscribe(
      count => this.ownersCount = count
    );

    this.userService.getDecoratorsCount().subscribe(
      count => this.decoratorsCount = count
    );

    this.firmService.getAllFirms().subscribe(
      firms => {
        this.firms = firms;
        this.filteredFirms = firms;
      }
    );

    this.appointmentService.getAppointmentsLast24Hours().subscribe(
      count => this.appointmentsLast24HoursCount = count
    );

    this.appointmentService.getAppointmentsLast7Days().subscribe(
      count => this.appointmentsLast7DaysCount = count
    );

    this.appointmentService.getAppointmentsLast30Days().subscribe(
      count => this.appointmentsLast30DaysCount = count
    );

    this.appointmentService.getLastThreeFinishedAppointments().subscribe(
      appointments => this.lastThreeFinishedAppointments = appointments
    );

    this.appointmentService.getNotAttachedPhotoAppointments().subscribe(
      appointments => {
        this.notAttachedPhotoAppointments = appointments;

        appointments.forEach(appointment => {
          this.userService.getByUsername(appointment.decorator).subscribe(
            user => {
              this.userService.deactivateUser(user.id).subscribe();
            }
          );
        });
      }
    );
  }

  decoratedGardensCount: number = 0;
  ownersCount: number = 0;
  decoratorsCount: number = 0;
  appointmentsLast24HoursCount: number = 0;
  appointmentsLast7DaysCount: number = 0;
  appointmentsLast30DaysCount: number = 0;

  notAttachedPhotoAppointments: Appointment[] = [];

  lastThreeFinishedAppointments: Appointment[] = [];
  galleryURL: string = "http://localhost:4000/uploads/";

  firms: Firm[] = [];
  filteredFirms: Firm[] = [];

  sortOrder: { [key: string]: string } = { name: "", address: "" };

  sortData(column: string) {
    const order = this.sortOrder[column] === "asc" ? "desc" : "asc";
    this.sortOrder[column] = order;

    this.filteredFirms.sort((a, b) => {
      let valueA;
      let valueB;

      if (column == "name") {
        valueA = a.name;
        valueB = b.name;
      }
      else {
        valueA = a.address;
        valueB = b.address;
      }

      if (valueA < valueB) {
        return order === "asc" ? -1 : 1;
      }
      else if (valueA > valueB) {
        return order == "asc" ? 1 : -1;
      }
      else {
        return 0;
      }
    });
  }

  getSortIcon(column: string): string {
    if (this.sortOrder[column] === "desc") {
      return "bi bi-caret-up-fill";
    }
    else if (this.sortOrder[column] === "asc") {
      return "bi bi-caret-down-fill";
    }
    else {
      return "bi bi-caret-down";
    }
  }

  searchName: string = "";
  searchAddress: string = "";

  searchFirms(): void {
    this.filteredFirms = this.firms.filter(firm =>
      (!this.searchName || firm.name.toLowerCase().includes(this.searchName.toLowerCase())) &&
      (!this.searchAddress || firm.address.toLowerCase().includes(this.searchAddress.toLowerCase()))
    );
  }
}
