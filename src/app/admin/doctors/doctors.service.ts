import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Doctor } from './doctors-models/doctor.model';
import { Visit } from './doctors-models/doctors.visit.model';

@Injectable({ providedIn: 'root' })
export class DoctorsService {
  private doctors: Doctor[] = [];
  private doctorsUpdated = new Subject<Doctor[]>();

  private visitsUpdated = new Subject<Visit[]>();

  constructor(private http: HttpClient) {}

  getDoctors() {
    this.http
      .get<{ message: string; doctors: any }>(
        'http://localhost:3000/api/doctors'
      )
      .pipe(
        map((doctorData) => {
          return doctorData.doctors.map((doctor) => {
            return {
              name: doctor.name,
              lastname: doctor.lastname,
              city: doctor.city,
              specjalizations: doctor.specjalizations,
              id: doctor._id,
              visits: doctor.visits,
            };
          });
        })
      )
      .subscribe((transDoc) => {
        this.doctors = transDoc;
        this.doctorsUpdated.next([...this.doctors]);
      });
  }

  getDoctor(id: string) {
    return this.http.get<{
      _id: string;
      login: string;
      password: string;
      name: string;
      lastname: string;
      city: string;
      specjalizations: [];
      visits: Visit[];
    }>('http://localhost:3000/api/doctors/' + id);
  }

  getDoctorUpdateListener() {
    return this.doctorsUpdated.asObservable();
  }

  getVisitsUpdateListener() {
    return this.visitsUpdated.asObservable();
  }

  getArrayDoctors() {
    return this.doctors;
  }

  addDoctor(
    login: string,
    password: string,
    name: string,
    lastname: string,
    city: string,
    specjalizations: [],
    visits: Visit[]
  ) {
    const doctor: Doctor = {
      id: null,
      login: login,
      password: password,
      name: name,
      lastname: lastname,
      city: city,
      specjalizations: specjalizations,
      visits: null,
    };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/doctors', doctor)
      .subscribe(() => {
        this.doctors.push(doctor);
        this.doctorsUpdated.next([...this.doctors]);
      });
  }

  updateDoctor(
    doctorId: string,
    login: string,
    password: string,
    name: string,
    lastname: string,
    city: string,
    specjalizations: [],
    visits: Visit[]
  ) {
    const doctor: Doctor = {
      login: login,
      password: password,
      id: doctorId,
      name: name,
      lastname: lastname,
      city: city,
      specjalizations: specjalizations,
      visits: visits,
    };
    this.http
      .put('http://localhost:3000/api/doctors/' + doctorId, doctor)
      .subscribe((response) => {
        const updatedDoctors = [...this.doctors];
        const oldDoctorIndex = updatedDoctors.findIndex(
          (p) => p.id === doctor.id
        );
        updatedDoctors[oldDoctorIndex] = doctor;
        this.doctors = updatedDoctors;
        this.doctorsUpdated.next([...this.doctors]);
      });
  }

  deleteDoctor(doctorId: string) {
    this.http
      .delete('http://localhost:3000/api/doctors/' + doctorId)
      .subscribe(() => {
        const updatedDoctors = this.doctors.filter(
          (doctor) => doctor.id !== doctorId
        );
        this.doctors = updatedDoctors;
        this.doctorsUpdated.next([...this.doctors]);
      });
  }

  deleteVisit(
    doctorId: string,
    login: string,
    password: string,
    name: string,
    lastname: string,
    city: string,
    specjalizations: [],
    visits: Visit[]
  ) {
    const doctor: Doctor = {
      id: doctorId,
      login: login,
      password: password,
      name: name,
      lastname: lastname,
      city: city,
      specjalizations: specjalizations,
      visits: visits,
    };
    this.http.patch('http://localhost:3000/api/doctors/' + doctorId, doctor);
  }

  addVisit(
    doctorId: string,
    login: string,
    password: string,
    name: string,
    lastname: string,
    city: string,
    specjalizations: [],
    visits: Visit[]
  ) {
    const doctor: Doctor = {
      id: doctorId,
      login: login,
      password: password,
      name: name,
      lastname: lastname,
      city: city,
      specjalizations: specjalizations,
      visits: visits,
    };
    this.http
      .put('http://localhost:3000/api/doctors/' + doctorId, doctor)
      .subscribe((response) => {
        const updatedDoctors = [...this.doctors];
        const oldDoctorIndex = updatedDoctors.findIndex(
          (p) => p.id === doctor.id
        );
        updatedDoctors[oldDoctorIndex] = doctor;
        this.doctors = updatedDoctors;
        this.doctorsUpdated.next([...this.doctors]);
      });
  }
}
