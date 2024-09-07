import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  backend: string = "http://localhost:4000/appointments";

  makeAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.backend}/makeAppointment`, appointment);
  }

  getCurrentUserAppointments(user: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.backend}/getCurrentUserAppointments/${user}`);
  }

  getPastUserAppointments(user: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.backend}/getPastUserAppointments/${user}`);
  }

  cancelAppointment(id: number): Observable<Response> {
    return this.http.delete<Response>(`${this.backend}/cancelAppointment/${id}`);
  }

  getFirmPendingAppointments(id: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.backend}/getFirmPendingAppointments/${id}`);
  }

  acceptAppointment(id: number, decorator: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.backend}/acceptAppointment/${id}`, { decorator: decorator });
  }

  declineAppointment(id: number, decorator: string, rejectionComment: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.backend}/declineAppointment/${id}`, { decorator: decorator, rejectionComment: rejectionComment });
  }

  getDecoratorAcceptedAppointments(decorator: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.backend}/getDecoratorAcceptedAppointments/${decorator}`);
  }

  getDecoratorFinishedAppointments(decorator: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.backend}/getDecoratorFinishedAppointments/${decorator}`);
  }

  getDecoratorAppointments(decorator: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.backend}/getDecoratorAppointments/${decorator}`);
  }

  getAppointmentsLast24Hours(): Observable<number> {
    return this.http.get<number>(`${this.backend}/getAppointmentsLast24Hours`);
  }

  getAppointmentsLast7Days(): Observable<number> {
    return this.http.get<number>(`${this.backend}/getAppointmentsLast7Days`);
  }

  getAppointmentsLast30Days(): Observable<number> {
    return this.http.get<number>(`${this.backend}/getAppointmentsLast30Days`);
  }

  getTotalDecoratedGardens(): Observable<number> {
    return this.http.get<number>(`${this.backend}/getTotalDecoratedGardens`);
  }

  getLastThreeFinishedAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.backend}/getLastThreeFinishedAppointments`);
  }

  getOwnerFinishedAppointments(owner: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.backend}/getOwnerFinishedAppointments/${owner}`);
  }

  getBusyDecorators(firmId: number, datetime: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.backend}/getBusyDecorators/${firmId}/${datetime}`);
  }

  finishAppointment(id: number): Observable<Appointment> {
    const now = new Date();
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    return this.http.put<Appointment>(`${this.backend}/finishAppointment/${id}`, { finished: (new Date(now.getTime() + twoHoursInMs)).toISOString() });
  }

  attachPhoto(id: number, photo: File): Observable<Appointment> {
    const formData = new FormData();

    formData.append("photo", photo);

    return this.http.put<Appointment>(`${this.backend}/attachPhoto/${id}`, formData);
  }

  getDecoratorMonthlyAppointments(decorator: string, month: string): Observable<number> {
    return this.http.get<number>(`${this.backend}/getDecoratorMonthlyAppointments/${decorator}/${month}`);
  }

  getDailyAppointments(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.backend}/getDailyAppointments/${id}`);
  }

  requestMaintenance(id: number, status: string, maintenanceStart: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.backend}/requestMaintenance/${id}`, { status: status, maintenanceStart: maintenanceStart });
  }

  getAppointmentsMaintenance(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.backend}/getAppointmentsMaintenance`);
  }

  getDecoratorMaintenance(decorator: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.backend}/getDecoratorMaintenance/${decorator}`);
  }

  acceptMaintenance(id: number, maintenanceStart: string, maintenanceEnd: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.backend}/acceptMaintenance/${id}`, { maintenanceStart: maintenanceStart, maintenanceEnd: maintenanceEnd });
  }

  rejectMaintenance(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.backend}/rejectMaintenance/${id}`, {});
  }

  getNotAttachedPhotoAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.backend}/getNotAttachedPhotoAppointments`);
  }
}
