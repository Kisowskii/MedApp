import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsComponent } from '../../shared/patients-visit/patients.component';
import { CanDeactivateGuard } from '../../can-deactivate.guard';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { AuthGuard } from '../../auth/auth.guard';
import { PatientEditComponent } from '../../shared/patients-visit/patient-edit/patient-edit.component';

const patientsRoutes: Routes = [
  {
    path: 'admin/patients/list',
    component: PatientsListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'admin/patients/creating', component: PatientEditComponent },
  {
    path: 'admin/patients/list/visit/:patientId/edit',
    component: PatientEditComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/patients/list/visit/:patientId',
    component: PatientsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(patientsRoutes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
