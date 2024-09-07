import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  constructor(private adminService: AdminService, private router: Router) { }

  username: string = "";
  password: string = "";

  message: string = "";

  login(): void {
    if (this.username == "" || this.password == "") this.message = "Missing fields";
    else {
      this.adminService.login(this.username, CryptoJS.SHA256(this.password).toString()).subscribe(
        admin => {
          if (admin == null) this.message = "Wrong credentials";
          else {
            this.message = "";
            localStorage.setItem("loggedAdmin", JSON.stringify(admin));
            this.router.navigate(["admin"]);
          }
        }
      );
    }
  }
}
