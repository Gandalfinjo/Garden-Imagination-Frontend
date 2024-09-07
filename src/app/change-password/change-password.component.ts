import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  constructor(private userService: UserService, private router: Router) { }

  username: string = "";
  currentPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";

  errorMessage: string = "";

  passwordRegEx = /^(?=.{6,10}$)(?=[a-zA-Z])(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$^&*]).*$/;

  changePassword() {
    if (this.username == "" || this.currentPassword == "" || this.newPassword == "" || this.confirmPassword == "") this.errorMessage = "Missing fields";
    else if (!this.passwordRegEx.test(this.newPassword)) this.errorMessage = "Password must be 6-10 characters long, start with a letter, contain at least 1 uppercase letter, at least 3 lowercase letters, at least 1 number, and at least 1 special character (!@#$^&*).";
    else {
      this.userService.existsByUsername(this.username).subscribe(
        response => {
          if (response.message) this.errorMessage = response.message;
          else if (response.user) {
            if (response.user.password != CryptoJS.SHA256(this.currentPassword).toString()) this.errorMessage = "Wrong password";
            else if (this.currentPassword == this.newPassword) this.errorMessage = "You used the old password";
            else if (this.newPassword != this.confirmPassword) this.errorMessage = "Passwords not matching";
            else {
              this.userService.changePassword(this.username, CryptoJS.SHA256(this.newPassword).toString()).subscribe(
                () => this.router.navigate(["login"])
              );
            }
          }
        }
      );
    }
  }
}
