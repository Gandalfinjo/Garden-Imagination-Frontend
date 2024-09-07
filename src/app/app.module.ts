import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OwnerComponent } from './owner/owner.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ModalComponent } from './modal/modal.component';
import { DecoratorComponent } from './decorator/decorator.component';
import { OwnerFirmsComponent } from './owner-firms/owner-firms.component';
import { OwnerFirmsDetailsComponent } from './owner-firms-details/owner-firms-details.component';
import { OwnerAppointmentsComponent } from './owner-appointments/owner-appointments.component';
import { OwnerMaintenanceComponent } from './owner-maintenance/owner-maintenance.component';
import { DecoratorAppointmentsComponent } from './decorator-appointments/decorator-appointments.component';
import { DecoratorMaintenanceComponent } from './decorator-maintenance/decorator-maintenance.component';
import { DecoratorStatisticsComponent } from './decorator-statistics/decorator-statistics.component';
import { AgChartsModule } from 'ag-charts-angular';
import { HistogramComponent } from './histogram/histogram.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    OwnerComponent,
    AdminComponent,
    AdminLoginComponent,
    ChangePasswordComponent,
    ModalComponent,
    DecoratorComponent,
    OwnerFirmsComponent,
    OwnerFirmsDetailsComponent,
    OwnerAppointmentsComponent,
    OwnerMaintenanceComponent,
    DecoratorAppointmentsComponent,
    DecoratorMaintenanceComponent,
    DecoratorStatisticsComponent,
    HistogramComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RecaptchaModule,
    AgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
