import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { DoctorsModule } from './admin/doctors/doctors.module';
import { PatientsModule } from './admin/patients/patients.module';

import { Router } from '@angular/router';
import { SharedModule } from './shared/shared/shared.module';

@NgModule({

  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    PatientsModule,
    DoctorsModule,
    SharedModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {}
}
