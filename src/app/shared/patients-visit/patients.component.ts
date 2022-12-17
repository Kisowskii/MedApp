import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl,NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { filter,toarray,pipe,flatmap,distinct,map } from "powerseq";

import { Doctor } from '../doctor.model';
import { Visit } from '../visit.model';
import { DoctorsService } from '../doctors.service';
import { Patient } from '../patient.model';
import { PatientsService } from '../patients.service';


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
  postsPerPage:number = 10;
  currentPage:number = 1;
  doctors: Doctor[] = [];
  doctor: Doctor;
  patient: Patient;
  visits: Visit[] = [];
  private patientId: string;
  displayDoctors:boolean = false;
  displayVisits:boolean = false;
  displaySearching:boolean = false;
  displaySeachingplace:boolean = false;
  displayVerify:boolean = false;
  displayMyVisits:boolean = false;
  displayDelete:boolean = false;
  updatingVisitsDoctors:Visit[] = [];
  updatingVisitsPatients:Visit[] = [];
  filteredVisits = [];
  FreeTermins = [];
  busyTermins:Visit[]= [];
  paginationVisits = [];
  cits = new FormControl('');
  cities: string[] = [];
  specjalizations = [];
  myVisits:Visit[] = [];
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
      this.myVisits = this.patient?.visits
    } else {
      this.myVisits = this.updatingVisitsPatients;
    }
    this.myVisits = this.myVisits.map<Visit>((visit)=>{
      const sth = `${visit.start.toLocaleTimeString()} - ${visit.end.toLocaleTimeString()}`
      return { ...visit, displayDate: sth,      }
    }
    );
  }

  onDisplayFinding() {
    this.specjalizations = [];
    this.cities = [];
    this.displaySeachingplace = true;
    this.displayDoctors = false;
    this.displayMyVisits = false;
    this.displaySearching=false;
    for (const specializations of pipe(flatmap(this.doctors,doc=>doc.specjalizations),distinct() ,toarray())){
      this.specjalizations.push(specializations)
    };
    for (const cities of pipe(map(this.doctors,(doc=>doc.city)),distinct() ,toarray())){
      this.cities.push(cities)
    };
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
    this.FreeTermins = [];
    this.paginationVisits=[]
    this.busyTermins = [];

this.FreeTermins =  VisitsTable.map(hour=>new Date(`${form.value.date.toString().slice(0, 15)} ${hour}`));

    this.doctors = this.doctorService.getArrayDoctors().filter((doc) => {
      return (
        (doc.lastname === form.value.lastname ||
          form.value.lastname === '') &&
        (doc.specjalizations.includes(this.specSelect) ||
          this.specSelect === undefined) &&
        (this.citiesSelect === undefined ||
          this.citiesSelect.includes(doc.city) ||
          this.citiesSelect.length === 0)
      )});


      this.doctors.forEach(doc=>{
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
      doc.visits?.findIndex((visit) => visit.start.toString().slice(0, 10) === this.FreeTermins[0].toISOString().slice(0, 10)) < 0 ||
      doc.visits?.findIndex((visit) => visit.end.toString().slice(0, 10) === this.FreeTermins[0].toISOString().slice(0, 10)) < 0
        ) {
          this.FreeTermins.forEach((termin) => {
            this.busyTermins.push(termin.getTime());
            this.filteredVisits.push({
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
          this.FreeTermins.forEach((termin) => {
            checkTerminisBusy(termin);
            if (!this.busyTermins.includes(termin.getTime())) {
              this.busyTermins.push(termin.getTime());
              this.filteredVisits.push({
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
        this.displayVisits = true;
        this.filteredVisits = this.filteredVisits.sort((a, b) => a.visit.localeCompare(b.visit));
        this.paginationVisits = this.filteredVisits.slice(0, this.postsPerPage);
      })
  }

  onAddVisit(id: string) {
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
    this.updatingVisitsDoctors = [];
    this.updatingVisitsPatients = [];
    const visitStartDate = new Date(visit);
    const visitEndDate = new Date(visitStartDate.getTime() + 1800000);

    this.updatingVisitsDoctors.push({
      title: `${this.patient.name} ${this.patient.lastname} ${title}`,
      start: visitStartDate,
      end: visitEndDate,
      id: this.patientId,
    });
    this.updatingVisitsPatients.push({
      title: `Doktor ${this.doctor.name} ${this.doctor.lastname} ${title}`,
      start: visitStartDate,
      end: visitEndDate,
      id: this.doctor.id,
    });

    if (this.patient.visits) {
      this.updatingVisitsPatients = this.patient.visits?.concat([...this.updatingVisitsPatients]);
    } else {
      this.updatingVisitsPatients = this.updatingVisitsPatients;
    }
    if (this.doctor.visits) {
      this.updatingVisitsDoctors = this.doctor.visits?.concat([...this.updatingVisitsDoctors]);
    } else {
      this.updatingVisitsDoctors = this.updatingVisitsDoctors;
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

  onDeleteVisit(title: string, start: Date, end: Date, id: string) {
    this.updatingVisitsPatients = [];
    this.updatingVisitsDoctors = [];
    this.updatingVisitsPatients = this.patient.visits.filter((visit) => {
      return (title !== visit.title || id !== visit.id || start !== visit.start || end !== visit.end);
    });
    this.updatingVisitsDoctors = this.doctor.visits.filter((visit) => {
      return (this.patientId !== visit.id || start !== visit.start || end !== visit.end );
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
