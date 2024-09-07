import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private service: UserService, private router: Router) { }

  username: string = "";
  password: string = "";
  type: string = "";

  message: string = "";

  login(): void {
    if (this.username == "" || this.password == "" || this.type == "") this.message = "Missing fields";
    else {
      this.service.login(this.username, CryptoJS.SHA256(this.password).toString(), this.type).subscribe(
        user => {
          if (user == null) this.message = "Wrong credentials";
          else {
            this.message = "";
            if (user.type == "owner") {
              localStorage.setItem("logged", JSON.stringify(user.username));
              this.router.navigate(["owner"]);
            }
            else {
              localStorage.setItem("logged", JSON.stringify(user.username));
              this.router.navigate(["decorator"]);
            }
          }
        }
      );
    }
  }
}
