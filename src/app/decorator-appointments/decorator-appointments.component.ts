import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/appointment';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Firm } from '../models/firm';
import { FirmService } from '../services/firm.service';

@Component({
  selector: 'app-decorator-appointments',
  templateUrl: './decorator-appointments.component.html',
  styleUrls: ['./decorator-appointments.component.css']
})
export class DecoratorAppointmentsComponent implements OnInit {
  constructor(private appointmentService: AppointmentService, private userService: UserService, private firmService: FirmService, private router: Router) { }

  ngOnInit(): void {
    this.selectedAppointmentId = 0;
    this.rejectionComment = "";
    this.errorMessage = "";

    const storedUsername = localStorage.getItem("logged");

    if (storedUsername) {
      this.userService.getByUsername(JSON.parse(storedUsername)).subscribe(
        user => {
          this.decorator = user;

          this.firmService.getAllFirms().subscribe(
            firms => {
              this.firms = firms;

              let firmId = 0;

              for (let i = 0; i < this.firms.length; i++) {
                for (let j = 0; j < this.firms[i].decorators.length; j++) {
                  if (this.firms[i].decorators[j].id == this.decorator.id) {
                    firmId = this.firms[i].id;
                    break;
                  }
                }

                if (firmId != 0) break;
              }

              if (firmId != 0) {
                this.appointmentService.getFirmPendingAppointments(firmId).subscribe(
                  appointments => this.firmPendingAppointments = appointments
                );
              }
            }
          );

          this.appointmentService.getDecoratorAcceptedAppointments(this.decorator.username).subscribe(
            appointments => this.decoratorAcceptedAppointments = appointments
          );

          this.appointmentService.getDecoratorFinishedAppointments(this.decorator.username).subscribe(
            appointments => this.decoratorFinishedAppointments = appointments
          );
        }
      );
    }
  }

  decorator: User = new User();
  firms: Firm[] = [];

  firmPendingAppointments: Appointment[] = [];
  decoratorAcceptedAppointments: Appointment[] = [];
  decoratorFinishedAppointments: Appointment[] = [];
  
  selectedAppointmentId: number = 0;

  rejectionComment: string = "";

  gardenPhoto: File = new File([], "");

  errorMessage: string = "";

  openModal(id: number): void {
    this.selectedAppointmentId = id;
  }

  acceptAppointment(id: number): void {
    this.appointmentService.acceptAppointment(id, this.decorator.username).subscribe(
      () => this.ngOnInit()
    );
  }

  declineAppointment(id: number): void {
    if (this.rejectionComment == "") {
      this.errorMessage = "You need to provide a rejection comment";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else {
      this.errorMessage = "";
      this.appointmentService.declineAppointment(id, this.decorator.username, this.rejectionComment).subscribe(
        () => this.ngOnInit()
      );
    }
  }

  finishAppointment(id: number): void {
    this.appointmentService.finishAppointment(id).subscribe(
      () => {
        alert("You have 24 hours to attach a photo of the finished work");
        this.ngOnInit();
      }
    );
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.[0]) {
      const file = fileInput.files[0];

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        this.gardenPhoto = file;

        URL.revokeObjectURL(img.src);
      };
    }
  }

  attachPhoto(id: number): void {
    if (this.gardenPhoto.name != "") {
      this.appointmentService.attachPhoto(id, this.gardenPhoto).subscribe(
        () => this.ngOnInit()
      );
    }
  }
  
  logout(): void {
    localStorage.removeItem("logged");
    this.router.navigate([""]); 
  }
}
