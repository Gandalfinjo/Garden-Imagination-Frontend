import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Appointment } from '../models/appointment';
import { AppointmentService } from '../services/appointment.service';
import { FirmService } from '../services/firm.service';
import { CommentService } from '../services/comment.service';
import { Comment } from '../models/comment';

@Component({
  selector: 'app-owner-appointments',
  templateUrl: './owner-appointments.component.html',
  styleUrls: ['./owner-appointments.component.css']
})
export class OwnerAppointmentsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private firmService: FirmService,
    private commentService: CommentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.selectedAppointmentId = 0;
    this.selectedFirmId = 0;
    this.newComment = "";
    this.newGrade = 0;

    const storedUsername = localStorage.getItem("logged");

    if (storedUsername) {
      this.userService.getByUsername(JSON.parse(storedUsername)).subscribe(
        user => {
          this.user = user;

          this.appointmentService.getCurrentUserAppointments(user.username).subscribe(
            appointments => this.currentAppointments = appointments
          );

          this.appointmentService.getPastUserAppointments(user.username).subscribe(
            appointments => {
              this.pastAppointments = appointments;

              appointments.forEach(appointment => {
                this.commentService.getAppointmentComment(appointment.id).subscribe(
                  comment => {
                    if (comment != null) {
                      this.allComments[comment.appointmentId] = comment;
                      console.log(this.allComments[comment.appointmentId]);
                    }
                  }
                );
              });
            }
          );

          this.firmService.getAllFirms().subscribe(
            firms => {
              firms.forEach(firm => {
                this.firmNames.push(firm.name);
              });
            }
          ); 
        }
      );
    }
  }

  user: User = new User();

  currentAppointments: Appointment[] = [];
  pastAppointments: Appointment[] = [];

  allComments: Comment[] = [];

  selectedAppointmentId: number = 0;
  selectedFirmId: number = 0;

  newComment: string = "";
  newGrade: number = 0;

  firmNames: string[] = [];
  
  errorMessage: string = "";

  openModal(id: number, firmId: number): void {
    this.selectedAppointmentId = id;
    this.selectedFirmId = firmId;
    this.newGrade = 0;
  }

  rate(grade: number): void {
    this.newGrade = grade;
  }

  leaveComment(id: number): void {
    if (this.newComment == "") {
      this.errorMessage = "You didn't leave a comment";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else if (this.newGrade == 0) {
      this.errorMessage = "You didn't leave a grade";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else {
      this.errorMessage = "";

      const comment = {
        id: 0,
        user: this.user.username,
        firmId: this.selectedFirmId,
        appointmentId: id,
        comment: this.newComment,
        grade: this.newGrade,
        userFirstname: "",
        userLastname: ""
      };

      this.commentService.leaveComment(comment).subscribe(
        () => this.ngOnInit()
      );
    }
  }

  cancelAppointment(appointment: Appointment): void {
    const now = new Date();
    const appointmentDate = new Date(appointment.datetime);

    const diffInMilliseconds = appointmentDate.getTime() - now.getTime();
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) alert("It's too late to cancel the appointment!");
    else {
      this.appointmentService.cancelAppointment(appointment.id).subscribe(
        response => {
          alert(response.message);
          this.ngOnInit();
        }
      );
    }
  }

  getStars(averageGrade: number): string {
    let stars = "";
    const fullStars = Math.floor(averageGrade);
    const halfStar = averageGrade % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars += "<i class='fas fa-star text-warning'></i>";
    }

    if (halfStar) {
      stars += "<i class='fas fa-star-half-alt text-warning'></i>";
    }

    for (let i = 0; i < emptyStars; i++) {
      stars += "<i class='far fa-star text-warning'></i>";
    }

    return stars;
  }

  logout(): void {
    localStorage.removeItem("logged");
    this.router.navigate([""]); 
  }
}
