import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firm } from '../models/firm';

@Injectable({
  providedIn: 'root'
})
export class FirmService {

  constructor(private http: HttpClient) { }

  backend: string = "http://localhost:4000/firms";

  addFirm(firm: Firm): Observable<Firm> {
    return this.http.post<Firm>(`${this.backend}/addFirm`, firm);
  }

  getAllFirms(): Observable<Firm[]> {
    return this.http.get<Firm[]>(`${this.backend}/getAllFirms`);
  }

  getById(id: string): Observable<Firm> {
    return this.http.get<Firm>(`${this.backend}/getById/${id}`);
  }

  getDecoratorFirm(decorator: string): Observable<Firm> {
    return this.http.get<Firm>(`${this.backend}/getDecoratorFirm/${decorator}`);
  }
}
