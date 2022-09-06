import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DoctorsService } from '../../../shared/doctors.service';

import { Doctor } from '../../../shared/doctor.model';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css'],
})
export class DoctorListComponent implements OnInit, OnDestroy {
  doctors: Doctor[] = [];

  private doctorsSub: Subscription;

  constructor(public doctorService: DoctorsService) {}

  ngOnInit() {
    this.doctorService.getDoctors();
    this.doctorsSub = this.doctorService
      .getDoctorUpdateListener()
      .subscribe((doctors: Doctor[]) => {
        this.doctors = doctors.sort((a, b) => a.name.localeCompare(b.name));
      });
  }
  ngOnDestroy() {
    this.doctorsSub.unsubscribe();
  }

  onDelete(doctorId: string) {
    this.doctorService.deleteDoctor(doctorId);
  }
}
