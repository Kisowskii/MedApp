import { Component, OnDestroy, OnInit } from '@angular/core';

import { DoctorsService } from '../doctors/doctors.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
})
export class PatientsComponent implements OnInit {
  constructor(public doctorService: DoctorsService) {}
  ngOnInit() {}
}
