import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { DoctorEditComponent } from './doctor-edit/doctor-edit.component';
import { DoctorsComponent } from './doctors.component';

const Doctorsroutes: Routes = [
  {
    path: ':doctorId',
    component: DoctorsComponent,

    canActivate: [AuthGuard],
  },
  {
    path: ':doctorId/edit',
    component: DoctorEditComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(Doctorsroutes)],
  exports: [RouterModule],
})
export class DoctorsRoutingModule {}
