import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirmService } from '../services/firm.service';
import { CommentService } from '../services/comment.service';
import { UserService } from '../services/user.service';
import { Firm } from '../models/firm';
import { Comment } from '../models/comment';
import { AppointmentService } from '../services/appointment.service';
import { User } from '../models/user';
import { Service } from '../models/service';

@Component({
  selector: 'app-owner-firms-details',
  templateUrl: './owner-firms-details.component.html',
  styleUrls: ['./owner-firms-details.component.css']
})
export class OwnerFirmsDetailsComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private firmService: FirmService, private commentService: CommentService, private userService: UserService, private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.datetime = "";
    this.squareMeters = 0;
    this.type = "";

    this.busyDecorators = [];

    this.poolSquareMeters = 0;
    this.greenSquareMeters = 0;
    this.chillSquareMeters = 0;
    this.fountainSquareMeters = 0;
    this.tables = 0;
    this.chairs = 0;

    this.shortDescription = "";
    this.selectedServices = [];

    this.layout = "";

    this.currentStep = 1;

    this.errorMessage = "";
    this.successMessage = "";

    const id = this.route.snapshot.paramMap.get("id");
    const storedUsername = localStorage.getItem("logged");

    if (id != null) {
      this.firmService.getById(id).subscribe(
        firm => {
          this.firm = firm;
          this.commentService.getFirmComments(this.firm.id).subscribe(
            comments => {
              this.comments = comments;

              this.comments.forEach(comment =>{
                this.userService.getByUsername(comment.user).subscribe(
                  user => {
                    comment.userFirstname = user.firstname;
                    comment.userLastname = user.lastname;
                  }
                );
              });
            }
          );
        }
      );
    }

    if (storedUsername) {
      this.userService.getByUsername(JSON.parse(storedUsername)).subscribe(
        user => this.user = user
      );
    }
  }

  ngAfterViewInit(): void {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    if (canvas) {
      canvas.addEventListener("click", (event) => this.drawShape(event));
    }
  }

  user: User = new User();

  firm: Firm = new Firm();
  comments: Comment[] = [];

  busyDecorators: string[] = [];

  currentStep: number = 1;

  datetime: string = "";
  squareMeters: number = 0;
  type: string = "";

  poolSquareMeters: number = 0;
  greenSquareMeters: number = 0;
  chillSquareMeters: number = 0;

  fountainSquareMeters: number = 0;
  tables: number = 0;
  chairs: number = 0;

  layout: string = "";

  shortDescription: string = "";
  selectedServices: Service[] = [];

  currentShape: string = "";
  shapes: any[] = [];

  errorMessage: string = "";
  successMessage: string = "";

  @ViewChild("canvas", { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  selectShape(shape: string) {
    this.currentShape = shape;
  }

  drawShape(event: MouseEvent) {
    console.log(this.currentShape);
    if (!this.currentShape) return;

    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext('2d');
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let shapeData;
    switch (this.currentShape) {
      case 'pool':
      case 'greenery':
        shapeData = { type: this.currentShape, x, y, width: 100, height: 100 }; // Example size
        context!.fillStyle = 'rgba(0, 0, 255, 0.3)';
        context!.fillRect(x, y, 100, 100);
        break;
      case 'table':
        shapeData = { type: this.currentShape, x, y, radius: 10 }; // Example radius
        context!.beginPath();
        context!.arc(x, y, 10, 0, 2 * Math.PI);
        context!.fillStyle = 'rgba(255, 0, 0, 0.3)';
        context!.fill();
        break;
      case 'fountain':
        shapeData = { type: this.currentShape, x, y, radius: 50 }; // Example radius
        context!.beginPath();
        context!.arc(x, y, 50, 0, 2 * Math.PI);
        context!.fillStyle = 'rgba(0, 255, 0, 0.3)';
        context!.fill();
        break;
      case 'deckChair':
        shapeData = { type: this.currentShape, x, y, width: 20, height: 40 }; // Example size
        context!.fillStyle = 'rgba(255, 255, 0, 0.3)';
        context!.fillRect(x, y, 20, 40);
        break;
    }
    
    if (shapeData) {
      this.shapes.push(shapeData);
    }
  }

  saveShapes() {
    const jsonData = JSON.stringify({ shapes: this.shapes });
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shapes.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const contents = (e.target as FileReader).result as string;
        this.loadJson(contents);
      };
      reader.readAsText(file);
    }
  }

  loadJson(jsonString: string): void {
    try {
      const json = JSON.parse(jsonString);
      this.layout = jsonString;
      this.drawShapes(json);
    } catch (error) {
      console.error("Error parsing JSON", error);
    }
  }

  drawShapes(data: any): void {
    const canvas = document.querySelector("canvas");
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas!.width, canvas!.height);

    data.shapes.forEach((shape: any) => {
      switch (shape.type) {
        case 'greenery':
          ctx.fillStyle = 'lightGreen';
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
          break;
        case 'pool':
          ctx.fillStyle = 'lightBlue';
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
          break;
        case 'fountain':
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
          ctx.fillStyle = 'lightBlue';
          ctx.fill();
          break;
        case 'table':
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
          ctx.fillStyle = 'brown';
          ctx.fill();
          break;
        case 'deckChair':
          ctx.fillStyle = 'grey';
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
          break;
        default:
          console.warn(`Unknown shape type: ${shape.type}`);
      }
    });
  }

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  compareTimes(time1: string, time2: string): number {
    const minutes1 = this.timeToMinutes(time1);
    const minutes2 = this.timeToMinutes(time2);

    if (minutes1 < minutes2) {
      return -1;
    }
    else if (minutes1 > minutes2) {
      return 1;
    }
    else {
      return 0;
    }
  }

  next(): void {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if (this.datetime == "" || this.squareMeters == 0 || this.type == "") this.errorMessage = "Missing fields";
    else if (this.datetime < new Date().toISOString()) this.errorMessage = "You cannot make an appointment in the past";
    else if (this.datetime.split("T")[0] >= this.firm.holidayStart && this.datetime.split("T")[0] <= this.firm.holidayEnd) this.errorMessage = `The firm is on holiday from ${this.firm.holidayStart} to ${this.firm.holidayEnd}`;
    else if (daysOfWeek[new Date(this.datetime).getDay()] == "Saturday" || daysOfWeek[new Date(this.datetime).getDay()] == "Sunday") this.errorMessage = "The firm doesn't work on weekends";
    else if (this.compareTimes(this.datetime.split("T")[1], this.firm.workingHoursStart) == -1  || this.compareTimes(this.datetime.split("T")[1], this.firm.workingHoursEnd) == 1) this.errorMessage = `The working hours are ${this.firm.workingHoursStart} - ${this.firm.workingHoursEnd}`;
    else {
      this.appointmentService.getBusyDecorators(this.firm.id, this.datetime).subscribe(
        decorators => {
          this.busyDecorators = decorators;

          if (this.firm.decorators.length == this.busyDecorators.length) this.errorMessage = "There are no available decorators for provided date and time";
          else {
            this.errorMessage = "";
            this.currentStep = 2;
          }
        }
      );
    }
  }

  back(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.currentStep = 1;
  }

  isChecked(service: Service): boolean {
    return this.selectedServices.some(selected => selected.service === service.service);
  }

  onCheckboxChange(service: Service, event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    if (checked) {
      this.selectedServices.push(service);
    }
    else {
      this.selectedServices = this.selectedServices.filter(selected => selected.service !== service.service);
    }
  }

  makeAppointment(): void {
    if (this.type == "private") {
      if (this.poolSquareMeters == 0 || this.greenSquareMeters == 0 || this.chillSquareMeters == 0 || this.selectedServices.length == 0) this.errorMessage = "Missing fields";
      else if (this.poolSquareMeters + this.greenSquareMeters + this.chillSquareMeters > this.squareMeters) this.errorMessage = "Total area of added sections is greater than provided total area";
      else {
        this.errorMessage = "";
  
        const appointment = {
          id: 0,
          user: this.user.username,
          firmId: this.firm.id,
          datetime: this.datetime,
          squareMeters: this.squareMeters,
          type: this.type,
          poolSquareMeters: this.poolSquareMeters,
          greenSquareMeters: this.greenSquareMeters,
          chillSquareMeters: this.chillSquareMeters,
          fountainSquareMeters: this.fountainSquareMeters,
          tables: this.tables,
          chairs: this.chairs,
          shortDescription: this.shortDescription,
          services: this.selectedServices,
          status: "pending",
          decorator: "",
          rejectionComment: "",
          photo: "",
          finishedDateTime: "",
          maintenanceStart: "",
          maintenanceEnd: "",
          layout: this.layout,
          createdAt: ""
        };
  
        this.appointmentService.makeAppointment(appointment).subscribe(
          () => {
            this.successMessage = "Successfully made an appointment";
            setTimeout(() => this.ngOnInit(), 2000);
          }
        );
      }
    } 
    else if (this.type == "restaurant") {
      if (this.fountainSquareMeters == 0 || this.greenSquareMeters == 0 || this.tables == 0 || this.chairs == 0 || this.selectedServices.length == 0) this.errorMessage = "Missing fields";
      else if (this.fountainSquareMeters + this.greenSquareMeters > this.squareMeters) this.errorMessage = "Total area of added sections is greater than provided total area";
      else {
        this.errorMessage = "";
        console.log(this.selectedServices);
  
        const appointment = {
          id: 0,
          user: this.user.username,
          firmId: this.firm.id,
          datetime: this.datetime,
          squareMeters: this.squareMeters,
          type: this.type,
          poolSquareMeters: this.poolSquareMeters,
          greenSquareMeters: this.greenSquareMeters,
          chillSquareMeters: this.chillSquareMeters,
          fountainSquareMeters: this.fountainSquareMeters,
          tables: this.tables,
          chairs: this.chairs,
          shortDescription: this.shortDescription,
          services: this.selectedServices,
          status: "pending",
          decorator: "",
          rejectionComment: "",
          photo: "",
          finishedDateTime: "",
          maintenanceStart: "",
          maintenanceEnd: "",
          layout: this.layout,
          createdAt: ""
        };
  
        this.appointmentService.makeAppointment(appointment).subscribe(
          () => {
            this.successMessage = "Successfully made an appointment";
            setTimeout(() => this.ngOnInit(), 2000);
          }
        );
      }
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
