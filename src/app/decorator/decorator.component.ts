import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-decorator',
  templateUrl: './decorator.component.html',
  styleUrls: ['./decorator.component.css']
})
export class DecoratorComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.newFirstname = "";
    this.newLastname = "";
    this.newAddress = "";
    this.newEmail = "";
    this.newContact = "";
    this.newCreditCard = "";
    this.newProfilePicture = new File([], "");
    this.cardType = "";

    this.errorMessage = "";
    this.errorImageFormat = false;
    this.errorImageSize = false;

    const storedUsername = localStorage.getItem("logged");

    if (storedUsername) {
      this.userService.getByUsername(JSON.parse(storedUsername)).subscribe(
        user => this.decorator = user
      );
    }
  }

  profilePicturesURL: string = "http://localhost:4000/uploads/";

  decorator: User = new  User();

  newFirstname: string = "";
  newLastname: string = "";
  newAddress: string = "";
  newEmail: string = "";
  newContact: string = "";
  newCreditCard: string = "";
  newProfilePicture: File = new File([], "");

  errorMessage: string = "";

  errorImageSize: boolean = false;
  errorImageFormat: boolean = false;

  cardType: string = "";

  dinersRegEx: RegExp = /^(30[0-3]|36|38)\d{12}$/;
  masterCardRegEx: RegExp = /^5[1-5]\d{14}$/;
  visaRegEx: RegExp = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;

  changeFirstname(): void {
    if (this.newFirstname == "") {
      this.errorMessage = "You need to enter the firstname first";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else {
      this.userService.changeFirstname(this.decorator.id, this.newFirstname).subscribe(() => this.ngOnInit());
    }
  }

  changeLastname(): void {
    if (this.newLastname == "") {
      this.errorMessage = "You need to enter the lastname first";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else {
      this.userService.changeLastname(this.decorator.id, this.newLastname).subscribe(() => this.ngOnInit());
    }
  }

  changeAddress(): void {
    if (this.newAddress == "") {
      this.errorMessage = "You need to enter the address first";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else {
      this.userService.changeAddress(this.decorator.id, this.newAddress).subscribe(() => this.ngOnInit());
    }
  }

  changeEmail(): void {
    if (this.newEmail == "") {
      this.errorMessage = "You need to enter the email first";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else {
      this.userService.changeEmail(this.decorator.id, this.newEmail).subscribe(response => {
        if (response.message) {
          this.errorMessage = response.message;
          setTimeout(() => this.ngOnInit(), 2000);
        }
        else {
          this.ngOnInit();
        }
      });
    }
  }

  changeContact(): void {
    if (this.newContact == "") {
      this.errorMessage = "You need to enter the contact first";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else {
      this.userService.changeContact(this.decorator.id, this.newContact).subscribe(() => this.ngOnInit());
    }
  }

  changeCreditCard(): void {
    if (this.newCreditCard == "") {
      this.errorMessage = "You need to enter the credit card first";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else if (this.checkCardType() == false) {
      this.errorMessage = "Invalid credit card number";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else {
      this.userService.changeCreditCard(this.decorator.id, this.newCreditCard).subscribe(() => this.ngOnInit());
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.[0]) {
      const file = fileInput.files[0];

      if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
        this.errorMessage = "File must be a jpg or png format";
        this.errorImageFormat = true;
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const width = img.width;
        const height = img.height;

        if (width < 100 || height < 100 || width > 300 || height > 300) {
          this.errorMessage = "Image must be between 100x100 and 300x300 pixels";
          this.errorImageSize = true;
        }
        else {
          this.errorMessage = "";
          this.errorImageFormat = false;
          this.errorImageSize = false;
          this.newProfilePicture = file;
        }

        URL.revokeObjectURL(img.src);
      };
    }
  }

  changeProfilePicture(): void {
    if (this.errorImageFormat) {
      this.errorMessage = "File must be a jpg or png format";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else if (this.errorImageSize) {
      this.errorMessage = "Image must be between 100x100 and 300x300 pixels";
      setTimeout(() => this.errorMessage = "", 2000);
    }
    else {
      this.errorMessage = "";
      this.userService.changeProfilePicture(this.decorator.id, this.newProfilePicture).subscribe(
        () => this.ngOnInit()
      );
    }
  }

  checkCardType(): boolean {
    if (this.dinersRegEx.test(this.newCreditCard)) {
      this.cardType = "assets/diners.png";
    }
    else if (this.masterCardRegEx.test(this.newCreditCard)) {
      this.cardType = "assets/mastercard.png";
    }
    else if (this.visaRegEx.test(this.newCreditCard)) {
      this.cardType = "assets/visa.png";
    }
    else {
      this.cardType = "";
      return false;
    }
    return true;
  }

  logout(): void {
    localStorage.removeItem("logged");
    this.router.navigate([""]); 
  }
}
