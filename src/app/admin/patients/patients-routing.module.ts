import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsComponent } from '../../patients/patients.component';
import { CanDeactivateGuard } from '../../can-deactivate.guard';
import { PatientsCreateComponent } from './patients-create/patients-create.component';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { AuthGuard } from '../../auth/auth.guard';

const patientsRoutes: Routes = [
  {
    path: 'admin/patients/list',
    component: PatientsListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'admin/patients/creating', component: PatientsCreateComponent },
  {
    path: 'admin/patients/list/edit/:patientId',
    component: PatientsCreateComponent,
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
