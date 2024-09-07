import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  backend: string = "http://localhost:4000/users";

  register(user: User): Observable<Response> {
    const formData = new FormData();

    formData.append("id", user.id.toString());
    formData.append("username", user.username);
    formData.append("password", user.password);
    formData.append("firstname", user.firstname);
    formData.append("lastname", user.lastname);
    formData.append("type", user.type);
    formData.append("gender", user.gender);
    formData.append("address", user.address);
    formData.append("contact", user.contact);
    formData.append("email", user.email);
    formData.append("profilePicture", user.profilePicture);
    formData.append("creditCard", user.creditCard);
    formData.append("status", user.status);

    return this.http.post<Response>(`${this.backend}/register`, formData, {
      headers: new HttpHeaders({
        "enctype": "multipart/form-data"
      })
    });
  }

  login(username: string, password: string, type: string): Observable<User> {
    return this.http.post<User>(`${this.backend}/login`, { username, password, type });
  }

  existsByUsername(username: string): Observable<Response> {
    return this.http.post<Response>(`${this.backend}/existsByUsername`, { username: username });
  }

  existsByUsernameOrEmail(user: User): Observable<Response> {
    return this.http.post<Response>(`${this.backend}/existsByUsernameOrEmail`, user);
  }

  getByUsername(username: string): Observable<User> {
    return this.http.post<User>(`${this.backend}/getByUsername`, { username: username });
  }

  getAllOwners(): Observable<User[]> {
    return this.http.get<User[]>(`${this.backend}/getAllOwners`);
  }

  getOwnersCount(): Observable<number> {
    return this.http.get<number>(`${this.backend}/getOwnersCount`);
  }

  getAllDecorators(): Observable<User[]> {
    return this.http.get<User[]>(`${this.backend}/getAllDecorators`);
  }

  getDecoratorsCount(): Observable<number> {
    return this.http.get<number>(`${this.backend}/getDecoratorsCount`);
  }

  activateUser(id: number): Observable<User> {
    return this.http.put<User>(`${this.backend}/activateUser/${id}`, {});
  }

  deactivateUser(id: number): Observable<User> {
    return this.http.put<User>(`${this.backend}/deactivateUser/${id}`, {});
  }

  changeUsername(id: number, username: string): Observable<Response> {
    return this.http.put<Response>(`${this.backend}/changeUsername/${id}`, { username: username });
  }

  changePassword(username: string, password: string): Observable<Response> {
    return this.http.put<Response>(`${this.backend}/changePassword`, { username: username, password: password });
  }

  changeFirstname(id: number, firstname: string): Observable<User> {
    return this.http.put<User>(`${this.backend}/changeFirstname/${id}/${firstname}`, {});
  }

  changeLastname(id: number, lastname: string): Observable<User> {
    return this.http.put<User>(`${this.backend}/changeLastname/${id}/${lastname}`, {});
  }

  changeGender(id: number, gender: string): Observable<User> {
    return this.http.put<User>(`${this.backend}/changeGender/${id}/${gender}`, {});
  }

  changeAddress(id: number, address: string): Observable<User> {
    return this.http.put<User>(`${this.backend}/changeAddress/${id}/${address}`, {});
  }

  changeContact(id: number, contact: string): Observable<User> {
    return this.http.put<User>(`${this.backend}/changeContact/${id}/${contact}`, {});
  }

  changeEmail(id: number, email: string): Observable<Response> {
    return this.http.put<Response>(`${this.backend}/changeEmail/${id}`, { email: email });
  }

  changeProfilePicture(id: number, profilePicture: File): Observable<User> {
    const formData = new FormData();

    formData.append("profilePicture", profilePicture);

    return this.http.put<User>(`${this.backend}/changeProfilePicture/${id}`, formData);
  }

  changeCreditCard(id: number, creditCard: string): Observable<User> {
    return this.http.put<User>(`${this.backend}/changeCreditCard/${id}`, { creditCard: creditCard });
  }

}
