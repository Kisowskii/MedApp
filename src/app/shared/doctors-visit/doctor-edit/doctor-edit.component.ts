import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Doctor } from '../../doctor.model';
import { DoctorsService } from '../../doctors.service';

@Component({
  selector: 'app-doctor-edit',
  templateUrl: './doctor-edit.component.html',
  styleUrls: ['./doctor-edit.component.css'],
})
export class DoctorEditComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  specjalisations: any = [];

  private mode = 'create';
  private doctorId: string;
  doctor: Doctor;

  constructor(
    public doctorsService: DoctorsService,
    public route: ActivatedRoute
  ) {}

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.specjalisations.push(value);
    }
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
      if (paramMap.has('doctorId')) {
        this.mode = 'edit'
        this.doctorId = paramMap.get('doctorId');
        this.doctorsService.getDoctor(this.doctorId).subscribe((doctorData) => {
        this.doctor = {
          id: doctorData._id,
          login: doctorData.login,
          password: doctorData.password,
          name: doctorData.name,
          lastname: doctorData.lastname,
          city: doctorData.city,
          specjalizations: doctorData.specjalizations,
          visits: doctorData.visits,
        };
      });
     }else{
      this.mode = 'create';
      this.doctorId = null;
     }
    });
  }

  onSaveDoctor(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'edit') {
    this.doctorsService.updateDoctor(
      this.doctorId,
      form.value.login,
      form.value.password,
      form.value.name,
      form.value.lastname,
      form.value.city.toLowerCase(),
      this.specjalisations,
      this.doctor.visits
    );
  }else{
    this.doctorsService.addDoctor(
      form.value.login,
      form.value.password,
      form.value.name,
      form.value.lastname,
      form.value.city.toLowerCase(),
      form.value.specjalizations,
      form.value.visits,
    );
  }
    this.specjalisations = [];
    form.resetForm();
  }
}
