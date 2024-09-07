import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../models/admin';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  backend: string = "http://localhost:4000/admins";

  login(username: string, password: string): Observable<Admin> {
    return this.http.post<Admin>(`${this.backend}/login`, { username: username, password: password });
  }
}
