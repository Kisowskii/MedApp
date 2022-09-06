import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Patient } from '../../../shared/patient.model';
import { PatientsService } from '../../../shared/patients.service';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css'],
})
export class PatientsListComponent implements OnInit, OnDestroy {
  patients: Patient[] = [];

  private patientsSub: Subscription;

  constructor(public patientService: PatientsService) {}

  ngOnInit() {
    this.patientService.getPatients();
    this.patientsSub = this.patientService
      .getPatientUpdateListener()
      .subscribe((patients: Patient[]) => {
        this.patients = patients.sort((a, b) => a.name.localeCompare(b.name));
      });
  }
  ngOnDestroy() {
    this.patientsSub.unsubscribe();
  }

  onDelete(patientId: string) {
    this.patientService.deletePatient(patientId);
  }
}
