import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientsComponent } from './patients.component';

const Patientroutes: Routes = [
  {
    path: ':patientId',
    component: PatientsComponent,

    canActivate: [AuthGuard],
  },
  {
    path: ':patientId/edit',
    component: PatientEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(Patientroutes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
