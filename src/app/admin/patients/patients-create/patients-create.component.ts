import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Patient } from '../patients-models/patient.model';

import { PatientsService } from '../patients.service';
@Component({
  selector: 'app-patients-create',
  templateUrl: './patients-create.component.html',
  styleUrls: ['./patients-create.component.css'],
})
export class PatientsCreateComponent implements OnInit {
  addOnBlur = true;

  private mode = 'create';
  private patientId: string;
  patient: Patient;

  constructor(
    public patientsService: PatientsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('patientId')) {
        this.mode = 'edit';
        this.patientId = paramMap.get('patientId');
        this.patientsService
          .getPatient(this.patientId)
          .subscribe((patientData) => {
            this.patient = {
              id: patientData._id,
              login: patientData.login,
              password: patientData.password,
              name: patientData.name,
              lastname: patientData.lastname,
            };
          });
      } else {
        this.mode = 'create';
        this.patientId = null;
      }
    });
  }

  onSavePatient(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.patientsService.addPatient(
        form.value.name,
        form.value.lastname,
        form.value.login,
        form.value.password
      );
    } else {
      this.patientsService.updatePatient(
        this.patientId,
        form.value.name,
        form.value.lastname,
        form.value.login,
        form.value.password,
        null
      );
    }

    form.resetForm();
  }
}
