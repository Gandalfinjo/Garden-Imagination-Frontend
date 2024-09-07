import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Admin } from "../models/admin";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { Registration } from "../models/registration";
import { DomSanitizer } from "@angular/platform-browser";
import * as CryptoJS from "crypto-js";
import { Service } from "../models/service";
import { FirmService } from "../services/firm.service";
import { Firm } from "../models/firm";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

  admin: Admin = new Admin();

  owners: User[] = [];
  decorators: User[] = [];
  firms: Firm[] = [];

  newUsername: string = "";
  newPassword: string = "";
  newFirstname: string = "";
  newLastname: string = "";
  newGender: string = "";
  newAddress: string = "";
  newContact: string = "";
  newEmail: string = "";
  newProfilePicture: File = new File([], "");
  newCreditCard: string = "";

  errorMessage: string = "";
  errorMessageDecorator: string = "";
  successMessage: string = "";

  errorImageSize: boolean = false;
  errorImageFormat: boolean = false;
  errorImageSizeDecorator: boolean = false;
  errorImageFormatDecorator: boolean = false;

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

  passwordRegEx: RegExp = /^(?=.{6,10}$)(?=[a-zA-Z])(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$^&*]).*$/;

  dinersRegEx: RegExp = /^(30[0-3]|36|38)\d{12}$/;
  masterCardRegEx: RegExp = /^5[1-5]\d{14}$/;
  visaRegEx: RegExp = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;

  isOwner: boolean = false;

  selectedUser: User = new User();

  pendingRegistrations: Registration[] = [];
  pendingProfilePictures: File[] = [];
  pendingProfilePicturesURL: any[] = [];

  firmName: string = "";
  firmAddress: string = "";
  firmServices: Service[] = [];
  firmContact: string = "";
  firmDecorators: User[] = [];
  firmWorkingHoursStart: string = "";
  firmWorkingHoursEnd: string = "";
  firmHolidayStart: string = "";
  firmHolidayEnd: string = "";

  decoratorsNoFirm: User[] = [];

  firmServiceToAdd: Service = new Service();
  firmDecoratorToAdd: User = new User();

  firmErrorMessage: string = "";

  constructor(
    private userService: UserService,
    private firmService: FirmService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const loggedAdmin = localStorage.getItem("loggedAdmin");

    this.resetFields();

    if (loggedAdmin) {
      this.admin = JSON.parse(loggedAdmin);

      this.userService.getAllOwners().subscribe(owners => this.owners = owners);
      this.userService.getAllDecorators().subscribe(
        decorators => {
          this.decorators = decorators;
          this.firmService.getAllFirms().subscribe(
            firms => {
              this.firms = firms;

              const decoratorIdsInFirms = new Set<number>();

              if (this.firms.length > 0) {
                for (const firm of this.firms) {
                  if (firm.decorators && firm.decorators.length > 0) {
                    for (const decorator of firm.decorators) {
                      decoratorIdsInFirms.add(decorator.id);
                    }
                  }
                }
              }
              
              if (decoratorIdsInFirms.size == 0) {
                this.decoratorsNoFirm = [...this.decorators];
              }
              else {
                this.decoratorsNoFirm = this.decorators.filter(decorator => 
                  !decoratorIdsInFirms.has(decorator.id)
                );
              }
            }
          );
        }
      );

      const storedRegistrations = localStorage.getItem("Pending Registrations");

      if (storedRegistrations) {
        this.pendingRegistrations = JSON.parse(storedRegistrations);
        this.pendingRegistrations.forEach(registration => {
          const fullProfilePictureName = registration.profilePictureName;
          const dotIndex = fullProfilePictureName?.lastIndexOf(".");
          const profilePictureName = fullProfilePictureName?.substring(0, dotIndex);
          const extension = dotIndex ? fullProfilePictureName?.substring(dotIndex + 1) : "";
          const file = profilePictureName ? this.convertBase64ToFile(registration.profilePicture, registration.profilePictureName, "image/" + extension) : new File([], "");

          this.pendingProfilePictures[this.pendingRegistrations.indexOf(registration)] = file;

          const objectURL = URL.createObjectURL(file);
          this.pendingProfilePicturesURL[this.pendingRegistrations.indexOf(registration)] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        });
      }
      else {
        this.pendingRegistrations = [];
      }
    }
  }

  resetFields(): void {
    this.newUsername = "";
    this.newPassword = "";
    this.newFirstname = "";
    this.newLastname = "";
    this.newGender = "";
    this.newAddress = "";
    this.newContact = "";
    this.newEmail = "";
    this.newProfilePicture = new File([], "");
    this.newCreditCard = "";
    this.errorMessage = "";
    this.errorMessageDecorator = "";
    this.errorImageFormat = false;
    this.errorImageSize = false;
    this.errorImageFormatDecorator = false;
    this.errorImageSizeDecorator = false;
    this.isOwner = false;

    this.username = "";
    this.password = "";
    this.firstname = "";
    this.lastname = "";
    this.gender = "";
    this.address = "";
    this.contact = "";
    this.email = "";
    this.profilePicture = new File([], "");
    this.creditCard = "";
    this.successMessage = "";
    this.cardType = "";

    this.firmName = "";
    this.firmAddress = "";
    this.firmServices = [];
    this.firmContact = "";
    this.firmDecorators = [];
    this.firmWorkingHoursStart = "";
    this.firmWorkingHoursEnd = "";
    this.firmHolidayStart = "";
    this.firmHolidayEnd = "";

    this.decoratorsNoFirm = [];
    this.firmServiceToAdd = new Service();
    this.firmDecoratorToAdd = new User();
  
    this.firmErrorMessage = "";
  }

  activateUser(id: number): void {
    this.userService.activateUser(id).subscribe(() => this.ngOnInit());
  }

  deactivateUser(id: number): void {
    this.userService.deactivateUser(id).subscribe(() => this.ngOnInit());
  }

  openModal(user: User): void {
    if (user.type == "owner") {
      this.isOwner = true;
    }
    else {
      this.isOwner = false;
    }

    this.selectedUser = user;
  }

  openLastnameModal(user: User): void {
    if (user.type == "owner") {
      this.isOwner = true;
    }
    else {
      this.isOwner = false;
    }

    this.selectedUser = user;
  }

  changeUsername(id: number): void {
    this.userService.changeUsername(id, this.newUsername).subscribe(response => {
      if (response.message) {
        this.errorMessage = response.message;
        setTimeout(() => this.ngOnInit(), 2000);
      }
      else {
        this.ngOnInit();
      }
    });
  }

  changePassword(username: string): void {
    if (this.newPassword == "") this.errorMessage = "Missing fields";
    else if (!this.passwordRegEx.test(this.newPassword)) this.errorMessage = "Password must be 6-10 characters long, start with a letter, contain at least 1 uppercase letter, at least 3 lowercase letters, at least 1 number, and at least 1 special character (!@#$^&*).";
    else if (this.selectedUser.password == CryptoJS.SHA256(this.newPassword).toString()) this.errorMessage = "You used the old password";
    else {
      this.userService.changePassword(username, CryptoJS.SHA256(this.newPassword).toString()).subscribe(
        () => this.ngOnInit()
      );
    }
  }

  changeFirstname(id: number): void {
    this.userService.changeFirstname(id, this.newFirstname).subscribe(() => this.ngOnInit());
  }

  changeLastname(id: number): void {
    this.userService.changeLastname(id, this.newLastname).subscribe(() => this.ngOnInit());
  }

  changeGender(id: number): void {
    this.userService.changeGender(id, this.newGender).subscribe(() => this.ngOnInit());
  }

  changeAddress(id: number): void {
    this.userService.changeAddress(id, this.newAddress).subscribe(() => this.ngOnInit());
  }

  changeContact(id: number): void {
    this.userService.changeContact(id, this.newContact).subscribe(() => this.ngOnInit());
  }

  changeEmail(id: number): void {
    this.userService.changeEmail(id, this.newEmail).subscribe(response => {
      if (response.message) {
        this.errorMessage = response.message;
        setTimeout(() => this.ngOnInit(), 2000);
      }
      else {
        this.ngOnInit();
      }
    });
  }

  changeProfilePicture(id: number): void {
    if (this.errorImageFormat) {
      this.errorMessage = "File must be a jpg or png format";
      setTimeout(() => this.ngOnInit(), 2000);
    }
    else if (this.errorImageSize) {
      this.errorMessage = "Image must be between 100x100 and 300x300 pixels";
      setTimeout(() => this.ngOnInit(), 2000);
    }
    else {
      this.errorMessage = "";
      this.userService.changeProfilePicture(id, this.newProfilePicture).subscribe(
        () => this.ngOnInit()
      );
    }
  }

  changeCreditCard(id: number): void {
    this.userService.changeCreditCard(id, this.newCreditCard).subscribe(() => this.ngOnInit());
  }

  acceptRegistration(registration: Registration): void {
    const user = {
      id: registration.id,
      username: registration.username,
      password: registration.password,
      firstname: registration.firstname,
      lastname: registration.lastname,
      type: registration.type,
      gender: registration.gender,
      address: registration.address,
      contact: registration.contact,
      email: registration.email,
      profilePicture: this.pendingProfilePictures[this.pendingRegistrations.indexOf(registration)],
      creditCard: registration.creditCard,
      status: "active"
    };

    this.userService.register(user).subscribe(response => {
      if (response.message) {
        this.errorMessage = response.message;
      }
      else {
        this.pendingRegistrations = this.pendingRegistrations.filter(reg => reg !== registration);
        localStorage.removeItem("Pending Registrations");
        localStorage.setItem("Pending Registrations", JSON.stringify(this.pendingRegistrations));
        this.ngOnInit();
      }
    });
  }

  rejectRegistration(registration: Registration): void {
    const user = {
      id: registration.id,
      username: registration.username,
      password: registration.password,
      firstname: registration.firstname,
      lastname: registration.lastname,
      type: registration.type,
      gender: registration.gender,
      address: registration.address,
      contact: registration.contact,
      email: registration.email,
      profilePicture: this.pendingProfilePictures[this.pendingRegistrations.indexOf(registration)],
      creditCard: registration.creditCard,
      status: "deactivated"
    };

    this.userService.register(user).subscribe(response => {
      if (response.message) {
        this.errorMessage = response.message;
      }
      else {
        this.pendingRegistrations = this.pendingRegistrations.filter(reg => reg !== registration);
        localStorage.removeItem("Pending Registrations");
        localStorage.setItem("Pending Registrations", JSON.stringify(this.pendingRegistrations));
        this.ngOnInit();
      }
    });
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

  
  validateFields(): boolean {
    if (this.errorImageFormatDecorator) {
      this.errorMessageDecorator = "File must be a jpg or png format";
      return false;
    }
    else if (this.errorImageSizeDecorator) {
      this.errorMessageDecorator = "Image must be between 100x100 and 300x300 pixels";
      return false;
    }
    else if (!this.username || !this.password || !this.firstname || !this.lastname || !this.gender ||
      !this.address || !this.contact || !this.email || !this.creditCard) {
      this.errorMessageDecorator = "Missing fields";
      return false;
    }
    else if (!this.passwordRegEx.test(this.password)) {
      this.errorMessageDecorator = "Password must be 6-10 characters long, start with a letter, contain at least 1 uppercase letter, at least 3 lowercase letters, at least 1 number, and at least 1 special character (!@#$^&*).";
      return false;
    }
    else if (!this.checkCardType()) {
      this.errorMessageDecorator = "Invalid credit card number";
      return false;
    }

    this.errorMessageDecorator = "";
    return true;
  }

  addDecorator() {
    if (!this.validateFields()) return;

    const defaultProfilePicturePath = "assets/default_profile_picture.png";

    if (this.profilePicture && this.profilePicture.type !== "") {
      const user: User = {
        id: 0,
        username: this.username,
        password: CryptoJS.SHA256(this.password).toString(),
        firstname: this.firstname,
        lastname: this.lastname,
        type: "decorator",
        gender: this.gender,
        address: this.address,
        contact: this.contact,
        email: this.email,
        profilePicture: this.profilePicture,
        creditCard: this.creditCard,
        status: "active"
      };

      this.userService.existsByUsernameOrEmail(user).subscribe(
        response => {
          if (response.message === "Username is already used" || response.message === "Email is already used") {
            this.errorMessageDecorator = response.message;
          }
          else {
            this.userService.register(user).subscribe(
              () => {
                this.successMessage = "Successfully added a decorator";
                setTimeout(() => this.ngOnInit(), 2000);
              }
            );
          }
        }
      );
    }
    else {
      fetch(defaultProfilePicturePath).then(response => response.blob()).then(blob => {
        const defaultFile = new File([blob], "default_profile_picture.png", { type: blob.type });
        this.profilePicture = defaultFile;

        const user: User = {
          id: 0,
          username: this.username,
          password: CryptoJS.SHA256(this.password).toString(),
          firstname: this.firstname,
          lastname: this.lastname,
          type: "decorator",
          gender: this.gender,
          address: this.address,
          contact: this.contact,
          email: this.email,
          profilePicture: this.profilePicture,
          creditCard: this.creditCard,
          status: "active"
        };

        this.userService.existsByUsernameOrEmail(user).subscribe(
          response => {
            if (response.message === "Username is already used" || response.message === "Email is already used") {
              this.errorMessageDecorator = response.message;
            }
            else {
              this.userService.register(user).subscribe(
                () => {
                  this.successMessage = "Successfully added a decorator";
                  setTimeout(() => this.ngOnInit(), 2000);
                }
              );
            }
          }
        );
      });
    }
  }

  addService() {
    if (this.firmServiceToAdd.service == "" || this.firmServiceToAdd.price == 0) this.firmErrorMessage = "Missing service parameters";
    else {
      this.firmServices.push(this.firmServiceToAdd);
      this.firmServiceToAdd = new Service();
    }
  }

  addDecoratorToFirm(decorator: User) {
    this.firmDecorators.push(decorator);
    this.decoratorsNoFirm = this.decoratorsNoFirm.filter(d => d.id != decorator.id);
  }
  
  addFirm() {
    if (this.firmName == "" || this.firmAddress == "" || this.firmContact == "" || this.firmServices.length == 0) this.firmErrorMessage = "Missing fields";
    else if (this.firmDecorators.length < 2) this.firmErrorMessage = "You must add atleast 2 decorators";
    else {
      const firm = {
        id: 0,
        name: this.firmName,
        address: this.firmAddress,
        services: this.firmServices,
        decorators: this.firmDecorators,
        contact: this.firmContact,
        workingHoursStart: this.firmWorkingHoursStart,
        workingHoursEnd: this.firmWorkingHoursEnd,
        holidayStart: this.firmHolidayStart,
        holidayEnd: this.firmHolidayEnd,
        averageGrade: 0.0
      };
      console.log(firm);

      this.firmService.addFirm(firm).subscribe(
        () => this.ngOnInit()
      );
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

  onFileSelectedDecorator(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.[0]) {
      const file = fileInput.files[0];

      if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
        this.errorMessageDecorator = "File must be a jpg or png format";
        this.errorImageFormatDecorator = true;
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const width = img.width;
        const height = img.height;

        if (width < 100 || height < 100 || width > 300 || height > 300) {
          this.errorMessageDecorator = "Image must be between 100x100 and 300x300 pixels";
          this.errorImageSizeDecorator = true;
        }
        else {
          this.errorMessageDecorator = "";
          this.errorImageFormatDecorator = false;
          this.errorImageSizeDecorator = false;
          this.profilePicture = file;
        }

        URL.revokeObjectURL(img.src);
      };
    }
  }

  convertBase64ToFile(base64Data: string, filename: string | undefined, mimeType: string): File {
    const byteString = atob(base64Data);
    const byteNumbers = new Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return filename ? new File([byteArray], filename, { type: mimeType }) : new File([], "");
  }

  logout(): void {
    localStorage.removeItem("loggedAdmin");
    this.router.navigate(["admin-login"]);
  }
}
