import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Visit } from './visit.model';

import { Patient } from './patient.model';
@Injectable({ providedIn: 'root' })
export class PatientsService {
  private patients: Patient[] = [];
  private patientsUpdated = new Subject<Patient[]>();

  constructor(private http: HttpClient) {}

  getPatients() {
    this.http
      .get<{ message: string; patients: any }>(
        'http://localhost:3000/api/patients'
      )
      .pipe(
        map((patientData) => {
          return patientData.patients.map((patient) => {
            return {
              name: patient.name,
              lastname: patient.lastname,
              id: patient._id,
              visits: patient.visits,
            };
          });
        })
      )
      .subscribe((transDoc) => {
        this.patients = transDoc;
        this.patientsUpdated.next([...this.patients]);
      });
  }

  getPatient(id: string) {
    return this.http.get<{
      _id: string;
      login: string;
      password: string;
      name: string;
      lastname: string;
      visits: Visit[];
    }>('http://localhost:3000/api/patients/' + id);
  }

  getPatientUpdateListener() {
    return this.patientsUpdated.asObservable();
  }

  addPatient(name: string, lastname: string, login: string, password: string) {
    const patient: Patient = {
      id: null,
      login: login,
      password: password,
      name: name,
      lastname: lastname,
    };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/patients', patient)
      .subscribe(() => {
        this.patients.push(patient);
        this.patientsUpdated.next([...this.patients]);
      });
  }

  updatePatient(
    patientId: string,
    name: string,
    lastname: string,
    login: string,
    password: string,
    visit: Visit[]
  ) {
    const patient: Patient = {
      id: patientId,
      login: login,
      password: password,
      name: name,
      lastname: lastname,
      visits: visit,
    };
    this.http
      .put('http://localhost:3000/api/patients/' + patientId, patient)
      .subscribe((response) => {
        const updatedPatients = [...this.patients];
        const oldPatientIndex = updatedPatients.findIndex(
          (p) => p.id === patient.id
        );
        updatedPatients[oldPatientIndex] = patient;
        this.patients = updatedPatients;
        this.patientsUpdated.next([...this.patients]);
      });
  }

  deletePatient(patientId: string) {
    this.http
      .delete('http://localhost:3000/api/patients/' + patientId)
      .subscribe(() => {
        const updatedPatients = this.patients.filter(
          (post) => post.id !== patientId
        );
        this.patients = updatedPatients;
        this.patientsUpdated.next([...this.patients]);
      });
  }
}
