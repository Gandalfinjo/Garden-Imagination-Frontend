import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  backend: string = "http://localhost:4000/comments";

  getAverageGrade(firmId: number): Observable<number> {
    return this.http.get<number>(`${this.backend}/getAverageGrade/${firmId}`);
  }

  getFirmComments(firmId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.backend}/getFirmComments/${firmId}`);
  }

  getAppointmentComment(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.backend}/getAppointmentComment/${id}`);
  }

  leaveComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.backend}/leaveComment`, comment);
  }
}
