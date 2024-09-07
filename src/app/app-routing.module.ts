import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OwnerComponent } from './owner/owner.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { userGuard } from './guards/user.guard';
import { adminGuard } from './guards/admin.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DecoratorComponent } from './decorator/decorator.component';
import { OwnerFirmsComponent } from './owner-firms/owner-firms.component';
import { OwnerFirmsDetailsComponent } from './owner-firms-details/owner-firms-details.component';
import { OwnerAppointmentsComponent } from './owner-appointments/owner-appointments.component';
import { DecoratorAppointmentsComponent } from './decorator-appointments/decorator-appointments.component';
import { DecoratorMaintenanceComponent } from './decorator-maintenance/decorator-maintenance.component';
import { DecoratorStatisticsComponent } from './decorator-statistics/decorator-statistics.component';
import { OwnerMaintenanceComponent } from './owner-maintenance/owner-maintenance.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "change-password",
    component: ChangePasswordComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "admin-login",
    component: AdminLoginComponent
  },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: "owner",
    component: OwnerComponent,
    canActivate: [userGuard]
  },
  {
    path: "owner-firms",
    component: OwnerFirmsComponent,
    canActivate: [userGuard]
  },
  {
    path: "owner-appointments",
    component: OwnerAppointmentsComponent,
    canActivate: [userGuard]
  },
  {
    path: "owner-firms-details/:id",
    component: OwnerFirmsDetailsComponent,
    canActivate: [userGuard]
  },
  {
    path: "owner-maintenance",
    component: OwnerMaintenanceComponent,
    canActivate: [userGuard]
  },
  {
    path: "decorator",
    component: DecoratorComponent,
    canActivate: [userGuard]
  },
  {
    path: "decorator-appointments",
    component: DecoratorAppointmentsComponent,
    canActivate: [userGuard]
  },
  {
    path: "decorator-maintenance",
    component: DecoratorMaintenanceComponent,
    canActivate: [userGuard]
  },
  {
    path: "decorator-statistics",
    component: DecoratorStatisticsComponent,
    canActivate: [userGuard]
  },
  {
    path: "map",
    component: MapComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
