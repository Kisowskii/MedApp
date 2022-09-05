import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { CanDeactivateGuard } from '../../can-deactivate.guard';
import { DoctorCreatingComponent } from './doctor-creating/doctor-creating.component';

import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorPlanComponent } from './doctor-plan/doctor-plan.component';

const doctorsRoutes: Routes = [
  {
    path: 'admin/doctors/list',
    component: DoctorListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/doctors/creating',
    component: DoctorCreatingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/doctors/list/edit/:doctorId',
    component: DoctorCreatingComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'admin/doctors/list/plan/:doctorId',
    component: DoctorPlanComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(doctorsRoutes)],
  exports: [RouterModule],
})
export class DoctorsRoutingModule {}
