import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Doctor } from '../shared/doctor.model';
import { Visit } from '../shared/doctors.visit.model';
import { DoctorsService } from '../shared/doctors.service';
import { Patient } from '../shared/patient.model';
import { PatientsService } from '../shared/patients.service';
import { Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

const VisitsTable = [
  '07:00:00',
  '07:30:00',
  '08:00:00',
  '08:30:00',
  '09:00:00',
  '09:30:00',
  '10:00:00',
  '10:30:00',
  '11:00:00',
  '11:30:00',
  '12:00:00',
  '12:30:00',
  '13:00:00',
  '13:30:00',
  '14:00:00',
  '14:30:00',
  '15:00:00',
  '15:30:00',
];
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
})
export class PatientsComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  specSelect: string;
  citiesSelect: string[];
  postsPerPage = 10;
  currentPage = 1;
  today = new Date();
  doctors: Doctor[] = [];
  doctor: Doctor;
  patient: Patient;
  visits: Visit[] = [];
  visitsForPat: Visit[] = [];
  visitsForDoc: Visit[] = [];
  private patientId: string;
  displayDoctors = false;
  displayVisits = false;
  displaySearching = false;
  displaySeachingplace = false;
  displayVerify = false;
  displayMyVisits = false;
  displayDelete = false;
  updatingVisitsDoctors = [];
  updatingVisitsPatients = [];
  filteredVisits = [];
  avaibleVisits = [];
  FreeTermins = [];
  busyTermins = [];
  paginationVisits = [];
  cits = new FormControl('');
  cities: string[] = [];
  specjalizations = [];
  myVisits = [];
  private doctorsSub: Subscription;

  constructor(
    public patientService: PatientsService,
    public route: ActivatedRoute,
    public doctorService: DoctorsService
  ) {}

  onDisplayDoctors() {
    this.doctorService.getDoctors();
    this.doctorsSub = this.doctorService
      .getDoctorUpdateListener()
      .subscribe((doctors: Doctor[]) => {
        this.doctors = doctors.sort((a, b) => a.name.localeCompare(b.name));
      });
    this.displayDoctors = true;
    this.displayMyVisits = false;
    this.displaySeachingplace = false;
    this.displayVisits = false;
  }

  onDisplayMyVisits() {
    this.myVisits = [];
    this.displayDoctors = false;
    this.displayMyVisits = true;
    this.displaySeachingplace = false;
    this.displayVisits = false;

    if (this.updatingVisitsPatients.length < 1) {
      this.myVisits = this.patient.visits;
    } else {
      this.myVisits = this.updatingVisitsPatients;
    }
  }

  onDisplayFinding() {
    this.specjalizations = [];
    this.cities = [];
    this.displaySeachingplace = true;
    this.displayDoctors = false;
    this.displayMyVisits = false;
    this.doctors.forEach((doc) => {
      if (doc.specjalizations) {this.specjalizations.push(doc.specjalizations);}
      if (doc.city) {this.cities.push(doc.city);}
    });
    this.specjalizations = this.specjalizations
      .flat()
      .filter((el, i, a) => i === a.indexOf(el));
    this.cities = this.cities.filter((el, i, a) => i === a.indexOf(el));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.patientId = paramMap.get('patientId');
      this.patientService
        .getPatient(this.patientId)
        .subscribe((patientData) => {
          this.patient = {
            id: patientData._id,
            login: patientData.login,
            password: patientData.password,
            name: patientData.name,
            lastname: patientData.lastname,
            visits: patientData.visits,

          };
           this.updatingVisitsPatients=this.patient.visits;
        });
    });
    this.onDisplayDoctors();
  }
  ngOnDestroy() {
    this.doctorsSub.unsubscribe();
  }
  onCheckDate(form: NgForm) {
    if (form.value.date) {
      this.displaySearching = true;
    } else {
      this.displaySearching = false;
    }
  }
  onFindDoctor(form: NgForm) {
    this.patientService.updatePatient(
      this.patientId,
      this.patient.login,
      this.patient.password,
      this.patient.name,
      this.patient.lastname,
      this.updatingVisitsPatients
    );
    this.filteredVisits = [];
    this.avaibleVisits = [];
    this.FreeTermins = [];

    VisitsTable.forEach((hour) => {
      let FreeTermin = form.value.date.toString().replace(form.value.date.toString().slice(16, 24), hour);
      let FreeDates = new Date(FreeTermin);
      this.FreeTermins.push(FreeDates);
    });

    this.doctors = this.doctorService.getArrayDoctors().filter((doc) => {
      this.busyTermins = [];

      const checkTerminisBusy = (s) => {
        doc.visits.forEach((visit) => {
          let startTime = new Date(visit.start);
          let endTime = new Date(visit.end);
          if (startTime.getTime() <= s.getTime() && endTime.getTime() > s.getTime() && s.getTime()) {
              this.busyTermins.push(s.getTime());
          }
        });
      };

      if (
        !doc.visits ||
        doc.visits?.findIndex(
          (visit) => visit.start.toString().slice(0, 10) === this.FreeTermins[0].toISOString().slice(0, 10)) < 0 ||
        doc.visits?.findIndex((visit) => visit.end.toString().slice(0, 10) === this.FreeTermins[0].toISOString().slice(0, 10)) < 0
      ) {
        this.FreeTermins.forEach((termin) => {
          this.busyTermins.push(termin.getTime());
          this.avaibleVisits.push({
            id: doc.id,
            name: doc.name,
            lastname: doc.lastname,
            specjalizations: doc.specjalizations,
            visit: termin.toString(),
            city: doc.city,
            displayVisit: `${termin.toLocaleDateString()}  godzina: ${termin.toLocaleTimeString()}`,
          });
        });
      } else {
        doc.visits.forEach((visit) => {
          if (
            this.FreeTermins[0].toISOString().slice(0, 10) === visit.start.toString().slice(0, 10) ||
            this.FreeTermins[0].toISOString().slice(0, 10) === visit.end.toString().slice(0, 10)
          ) {
            this.FreeTermins.forEach((termin) => {
              checkTerminisBusy(termin);

              if (!this.busyTermins.includes(termin.getTime())) {
                this.busyTermins.push(termin.getTime());
                this.avaibleVisits.push({
                  id: doc.id,
                  name: doc.name,
                  lastname: doc.lastname,
                  specjalizations: doc.specjalizations,
                  visit: termin.toString(),
                  city: doc.city,
                  displayVisit: `${termin.toLocaleDateString()}  godzina:${termin.toLocaleTimeString()}`,
                });
              }
            });
          }
        });
      }
      this.displayVisits = true;

      this.filteredVisits = this.avaibleVisits
        .filter((visits) => {
          return (
            (visits.lastname === form.value.lastname ||
              form.value.lastname === '') &&
            (visits.specjalizations.includes(this.specSelect) ||
              this.specSelect === undefined) &&
            (this.citiesSelect === undefined ||
              this.citiesSelect.includes(visits.city) ||
              this.citiesSelect.length === 0)
          );
        })
        .sort((a, b) => a.visit.localeCompare(b.visit));
      this.paginationVisits = this.filteredVisits.slice(0, this.postsPerPage);
      return this.paginationVisits;
    });
  }

  onAddVisit(id: string, visit: string) {
    this.doctorService.getDoctor(id).subscribe((doctorData) => {
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

      this.patient = {
        id: this.patient.id,
        login: this.patient.login,
        password: this.patient.password,
        name: this.patient.name,
        lastname: this.patient.lastname,
        visits: this.updatingVisitsPatients,
      };

    this.displayVerify = true;
  }

  onVerifyVisit(id: string, visit: string) {
    const title = prompt('Podaj przyczyne wizyty');
    this.visitsForDoc = [];
    this.visitsForPat = [];
    this.updatingVisitsDoctors = [];
    this.updatingVisitsPatients = [];
    const visitStartDate = new Date(visit);
    const endTimeVisit = visitStartDate.getTime() + 1800000;
    const visitEndDate = new Date(endTimeVisit);

    this.visitsForDoc.push({
      title: `${this.patient.name} ${this.patient.lastname} ${title}`,
      start: visitStartDate,
      end: visitEndDate,
      id: this.patientId,
    });
    this.visitsForPat.push({
      title: `Doktor ${this.doctor.name} ${this.doctor.lastname} ${title}`,
      start: visitStartDate,
      end: visitEndDate,
      id: this.doctor.id,
    });

    if (this.patient.visits) {
      this.updatingVisitsPatients = this.patient.visits?.concat([
        ...this.visitsForPat,
      ]);
    } else {
      this.updatingVisitsPatients = this.visitsForPat;
    }

    if (this.doctor.visits) {
      this.updatingVisitsDoctors = this.doctor.visits?.concat([
        ...this.visitsForDoc,
      ]);
    } else {
      this.updatingVisitsDoctors = this.visitsForDoc;
    }

    this.patientService.updatePatient(
      this.patientId,
      this.patient.login,
      this.patient.password,
      this.patient.name,
      this.patient.lastname,
      this.updatingVisitsPatients
    );

    this.doctorService.updateDoctor(
      id,
      this.doctor.login,
      this.doctor.password,
      this.doctor.name,
      this.doctor.lastname,
      this.doctor.city,
      this.doctor.specjalizations,
      this.updatingVisitsDoctors
    );
    this.displayVerify = false;
    this.displayVisits = false;
  }
  OnCancel() {
    this.displayVerify = false;
    this.displayDelete = false;
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.paginationVisits = this.filteredVisits.slice(
      (this.currentPage - 1) * this.postsPerPage,
      this.currentPage * this.postsPerPage
    );
  }

  onRemoveVisit( id: string) {
    this.doctorService.getDoctor(id).subscribe((doctorData) => {
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
    this.patientService.getPatient(this.patientId).subscribe((patientData) => {
      this.patient = {
        id: patientData._id,
        login: patientData.login,
        password: patientData.password,
        name: patientData.name,
        lastname: patientData.lastname,
        visits: patientData.visits,
      };
    });
    this.displayDelete = true;
  }
  onDeleteVisit(title: any, start: any, end: any, id: string) {
    this.updatingVisitsPatients = [];
    this.updatingVisitsDoctors = [];

    this.updatingVisitsPatients = this.patient.visits.filter((visit) => {
      return (
        title !== visit.title ||
        id !== visit.id ||
        start !== visit.start ||
        end !== visit.end
      );
    });

    this.updatingVisitsDoctors = this.doctor.visits.filter((visit) => {
      return (
        this.patientId !== visit.id ||
        start !== visit.start ||
        end !== visit.end
      );
    });

    this.patientService.updatePatient(
      this.patientId,
      this.patient.login,
      this.patient.password,
      this.patient.name,
      this.patient.lastname,
      this.updatingVisitsPatients
    );

    this.doctorService.updateDoctor(
      this.doctor.id,
      this.doctor.login,
      this.doctor.password,
      this.doctor.name,
      this.doctor.lastname,
      this.doctor.city,
      this.doctor.specjalizations,
      this.updatingVisitsDoctors
    );
    this.displayDelete = false;
    this.onDisplayMyVisits()
  }
}
