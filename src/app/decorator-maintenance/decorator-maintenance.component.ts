import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/appointment';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-decorator-maintenance',
  templateUrl: './decorator-maintenance.component.html',
  styleUrls: ['./decorator-maintenance.component.css']
})
export class DecoratorMaintenanceComponent implements OnInit {
  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const storedUsername = localStorage.getItem("logged");

    if (storedUsername) {
      this.userService.getByUsername(JSON.parse(storedUsername)).subscribe(
        user => {
          this.decorator = user;

          this.appointmentService.getDecoratorMaintenance(user.username).subscribe(
            appointments => this.pendingMaintenance = appointments
          );
        }
      );
    }
  }

  decorator: User = new User();

  pendingMaintenance: Appointment[] = [];

  selectedAppointment: Appointment | null = null;

  maintenanceEnd: string = "";

  errorMessage: string = "";

  openModal(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }

  acceptMaintenance(appointment: Appointment | null): void {
    const date = new Date();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const now = new Date(date.getTime() + twoHoursInMs).toISOString();

    const date1 = new Date(now);
    const date2 = new Date(this.maintenanceEnd);

    if (date2 < date1) {
      this.errorMessage = "You cannot enter a date in the past";
      return;
    }

    this.errorMessage = "";

    this.appointmentService.getBusyDecorators(appointment!.firmId, now).subscribe(
      decorators => {
        if (decorators.includes(this.decorator.username)) {
          alert("You are already busy");
          this.ngOnInit();
        }
        else {
          this.appointmentService.acceptMaintenance(appointment!.id, now, this.maintenanceEnd).subscribe(
            () => this.ngOnInit()
          );
        }
      }
    );
  }

  rejectMaintenance(id: number): void {
    this.appointmentService.rejectMaintenance(id).subscribe(
      () => this.ngOnInit()
    );
  }

  logout(): void {
    localStorage.removeItem("logged");
    this.router.navigate([""]); 
  }
}
