import { Component } from "@angular/core";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import * as CryptoJS from "crypto-js";
import { User } from "../models/user";
import { Registration } from "../models/registration";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent {
  captcha: string = "";
  username: string = "";
  password: string = "";
  firstname: string = "";
  lastname: string = "";
  gender: string = "";
  address: string = "";
  contact: string = "";
  email: string = "";
  profilePicture: File = new File([], "");
  creditCard: string = "";
  cardType: string = "";

  errorMessage = "";
  successMessage = "";

  errorImageSize: boolean = false;
  errorImageFormat: boolean = false;

  passwordRegEx: RegExp = /^(?=.{6,10}$)(?=[a-zA-Z])(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$^&*]).*$/;

  dinersRegEx: RegExp = /^(30[0-3]|36|38)\d{12}$/;
  masterCardRegEx: RegExp = /^5[1-5]\d{14}$/;
  visaRegEx: RegExp = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;

  constructor(private service: UserService, private router: Router) { }

  resolved(captchaResponse: string): void {
    this.captcha = captchaResponse;
  }

  checkCardType(): boolean {
    if (this.dinersRegEx.test(this.creditCard)) {
      this.cardType = "assets/diners.png";
    }
    else if (this.masterCardRegEx.test(this.creditCard)) {
      this.cardType = "assets/mastercard.png";
    }
    else if (this.visaRegEx.test(this.creditCard)) {
      this.cardType = "assets/visa.png";
    }
    else {
      this.cardType = "";
      return false;
    }
    return true;
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
          this.profilePicture = file;
        }

        URL.revokeObjectURL(img.src);
      };
    }
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Data = reader.result?.toString().split(",")[1];
        if (base64Data) {
          resolve(base64Data);
        }
        else {
          reject("File conversion failed");
        }
      };

      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  validateFields(): boolean {
    if (this.errorImageFormat) {
      this.errorMessage = "File must be a jpg or png format";
      return false;
    }
    else if (this.errorImageSize) {
      this.errorMessage = "Image must be between 100x100 and 300x300 pixels";
      return false;
    }
    else if (!this.username || !this.password || !this.firstname || !this.lastname || !this.gender ||
      !this.address || !this.contact || !this.email || !this.creditCard) {
      this.errorMessage = "Missing fields";
      return false;
    }
    else if (!this.passwordRegEx.test(this.password)) {
      this.errorMessage = "Password must be 6-10 characters long, start with a letter, contain at least 1 uppercase letter, at least 3 lowercase letters, at least 1 number, and at least 1 special character (!@#$^&*).";
      return false;
    }
    else if (!this.checkCardType()) {
      this.errorMessage = "Invalid credit card number";
      return false;
    }
    else if (!this.captcha) {
      this.errorMessage = "Please complete the reCAPTCHA";
      return false;
    }

    this.errorMessage = "";
    return true;
  }

  prepareRegistration(profilePictureBase64: string): Registration {
    console.log(this.profilePicture?.name);
    return {
      id: 0,
      username: this.username,
      password: CryptoJS.SHA256(this.password).toString(),
      firstname: this.firstname,
      lastname: this.lastname,
      type: "owner",
      gender: this.gender,
      address: this.address,
      contact: this.contact,
      email: this.email,
      profilePicture: profilePictureBase64,
      profilePictureName: this.profilePicture?.name,
      creditCard: this.creditCard,
      status: ""
    };
  }

  handleRegistration(user: User, registration: Registration): void {
    this.service.existsByUsernameOrEmail(user).subscribe(response => {
      if (response.message === "Username is already used" || response.message === "Email is already used") {
        this.errorMessage = response.message;
      }
      else {
        this.errorMessage = "";
        const registrations: Registration[] = JSON.parse(localStorage.getItem("Pending Registrations") || "[]");
        registrations.push(registration);
        localStorage.setItem("Pending Registrations", JSON.stringify(registrations));
        this.successMessage = "Successfully created a registration request";
        setTimeout(() => this.router.navigate([""]), 2000);
      }
    });
  }

  register(): void {
    if (!this.validateFields()) return;

    const user: User = {
      id: 0,
      username: this.username,
      password: CryptoJS.SHA256(this.password).toString(),
      firstname: this.firstname,
      lastname: this.lastname,
      type: "owner",
      gender: this.gender,
      address: this.address,
      contact: this.contact,
      email: this.email,
      profilePicture: this.profilePicture,
      creditCard: this.creditCard,
      status: ""
    };

    const defaultProfilePicturePath = "assets/default_profile_picture.png";

    if (this.profilePicture && this.profilePicture.type !== "") {
      this.convertFileToBase64(this.profilePicture).then(base64Data => {
        const registration = this.prepareRegistration(base64Data);
        this.handleRegistration(user, registration);
      });
    }
    else {
      fetch(defaultProfilePicturePath).then(response => response.blob()).then(blob => {
        const defaultFile = new File([blob], "default_profile_picture.png", { type: blob.type });
        this.profilePicture = defaultFile;

        this.convertFileToBase64(defaultFile).then(base64Data => {
          const registration = this.prepareRegistration(base64Data);
          this.handleRegistration(user, registration);
        });
      }).catch(error => {
        console.error("Error loading default profile picture:", error);
        const registration = this.prepareRegistration("");
        this.handleRegistration(user, registration);
      });
    }
  }
}
