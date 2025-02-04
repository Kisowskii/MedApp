import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorEditComponent } from '../../shared/doctors-visit/doctor-edit/doctor-edit.component';
import { AuthGuard } from '../../auth/auth.guard';
import { CanDeactivateGuard } from '../../can-deactivate.guard';

import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorsComponent } from '../../shared/doctors-visit/doctors.component';

const doctorsRoutes: Routes = [
  {
    path: 'admin/doctors/list',
    component: DoctorListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/doctors/creating',
    component: DoctorEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/doctors/list/plan/:doctorId/edit',
    component: DoctorEditComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'admin/doctors/list/plan/:doctorId',
    component: DoctorsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(doctorsRoutes)],
  exports: [RouterModule],
})
export class DoctorsRoutingModule {}
