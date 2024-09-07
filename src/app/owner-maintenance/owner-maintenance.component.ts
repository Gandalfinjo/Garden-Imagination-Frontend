import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Appointment } from '../models/appointment';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { AppointmentService } from '../services/appointment.service';
import { FirmService } from '../services/firm.service';

@Component({
  selector: 'app-owner-maintenance',
  templateUrl: './owner-maintenance.component.html',
  styleUrls: ['./owner-maintenance.component.css']
})
export class OwnerMaintenanceComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    const storedUsername = localStorage.getItem("logged");

    if (storedUsername) {
      this.userService.getByUsername(JSON.parse(storedUsername)).subscribe(
        user => {
          this.owner = user;

          this.appointmentService.getOwnerFinishedAppointments(this.owner.username).subscribe(
            appointments => this.finishedAppointments = appointments
          );
          
          this.appointmentService.getAppointmentsMaintenance().subscribe(
            appointments => this.underMaintenanceAppointments = appointments
          );
        }
      );
    }
  }

  owner: User = new User();

  finishedAppointments: Appointment[] = [];
  underMaintenanceAppointments: Appointment[] = [];

  canRequestMaintenance(finishedDateTime: string): boolean {
    const finishedDate = new Date(finishedDateTime);
    const currentDate = new Date();

    const monthsDifference = (currentDate.getFullYear() - finishedDate.getFullYear()) * 12 + (currentDate.getMonth() - finishedDate.getMonth());

    return monthsDifference >= 6;
  }

  requestMaintentance(appointment: Appointment): void {
    const date = new Date();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const now = new Date(date.getTime() + twoHoursInMs).toISOString();

    this.appointmentService.requestMaintenance(appointment.id, "Pending maintenance", now).subscribe(
      () => this.ngOnInit()
    );
  }

  logout(): void {
    localStorage.removeItem("logged");
    this.router.navigate([""]);
  }
}
