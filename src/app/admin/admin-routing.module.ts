import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { PatientsComponent } from './patients/patients.component';

import { AuthGuard } from '../auth/auth.guard';

const adminRoutes: Routes = [
  {
    path: ':adminId',
    component: AdminComponent,

    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'doctors', component: DoctorsComponent },
          { path: 'patient', component: PatientsComponent },
        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
