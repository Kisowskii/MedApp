import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Doctor } from '../../admin/doctors/doctors-models/doctor.model';
import { DoctorsService } from '../../admin/doctors/doctors.service';

@Component({
  selector: 'app-doctor-edit',
  templateUrl: './doctor-edit.component.html',
  styleUrls: ['./doctor-edit.component.css'],
})
export class DoctorEditComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  specjalisations: any = [];
  docConvertSpec: any = [];
  private doctorId: string;
  doctor: Doctor;

  constructor(
    public doctorsService: DoctorsService,
    public route: ActivatedRoute
  ) {}

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.specjalisations.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(spec: []): void {
    const index = this.specjalisations.indexOf(spec);

    if (index >= 0) {
      this.specjalisations.splice(index, 1);
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.doctorId = paramMap.get('doctorId');
      this.doctorsService.getDoctor(this.doctorId).subscribe((doctorData) => {
        if (doctorData.specjalizations) {
          doctorData.specjalizations.forEach((spec) => {
            this.docConvertSpec.push(Object.values(spec));
          });
        }
        this.doctor = {
          id: doctorData._id,
          login: doctorData.login,
          password: doctorData.password,
          name: doctorData.name,
          lastname: doctorData.lastname,
          city: doctorData.city,
          specjalizations: this.docConvertSpec,
          visits: doctorData.visits,
        };
      });
    });
  }

  onSaveDoctor(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.doctorsService.updateDoctor(
      this.doctorId,
      form.value.login,
      form.value.password,
      form.value.name,
      form.value.lastname,
      form.value.city.toUpperCase(),
      this.specjalisations,
      this.doctor.visits
    );

    this.specjalisations = [];
    form.resetForm();
  }
}
