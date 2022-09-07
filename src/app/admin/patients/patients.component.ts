import { Component } from '@angular/core';

import { DoctorsService } from '../../shared/doctors.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
})
export class PatientsComponent  {
  constructor(public doctorService: DoctorsService) {}

}
