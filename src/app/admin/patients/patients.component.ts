import { Component } from '@angular/core';

import { DoctorsService } from '../../shared/doctors.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
})
export class PatientsComponent  {
  constructor(public doctorService: DoctorsService) {}

}
