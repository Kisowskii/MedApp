import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  FullCalendarElement,
  defineFullCalendarElement,
} from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { Doctor } from '../doctor.model';
import { Visit } from '../visit.model';
import { DoctorsService } from '../doctors.service';
import { AuthService } from '../../auth/auth.service';
import { PatientsService } from '../patients.service';
import { Patient } from '../patient.model';

defineFullCalendarElement();

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css'],
})
export class DoctorsComponent implements OnInit {
  @ViewChild('calendar') calendarRef: ElementRef<FullCalendarElement>;
  displayVisit = false;
  updatingVisitsPatients: Visit[] = [];
  updatingVisitsDoctors: Visit[] = [];
  calendarVisible = true;
  private doctorId: string;
  patientId: string;
  start: Date;
  end: Date;
  title: string;
  event: any;
  patient: Patient;
  doctor: Doctor;
  visits: Visit[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '16:00:00',
    weekends: false,
    initialView: 'timeGridWeek',
    initialEvents: INITIAL_EVENTS,
    locales: allLocales,
    locale: 'pl',
    slotDuration: '00:30',
    contentHeight: 'auto',
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,

    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  };
  currentEvents: EventApi[] = [];

  constructor(
    public authService: AuthService,
    public doctorsService: DoctorsService,
    public route: ActivatedRoute,
    public patientService: PatientsService
  ) {}
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Dodaj nazwisko pacjenta i przyczyne wizyty');

    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      const visit: Visit = {
        id: createEventId(),
        end: selectInfo.end,
        start: selectInfo.start,
        title: title,
      };

      const data = calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
      const addingVisits = this.visits.push(visit);
      return addingVisits;
    }
    return alert('Nie wpisano danych');
  }

  handleEventClick(clickInfo: EventClickArg) {

    this.patientId = clickInfo.event._def.publicId;
    this.start = new Date(clickInfo.event.start);
    this.end = new Date(clickInfo.event.end);
    this.title = clickInfo.event.title;
    this.event = clickInfo.event;
    if(this.patientId.length>10){
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
  }

    this.displayVisit = true;
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
  handleAddingEvents(events) {
    this.doctor.visits = events;
  }
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
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

          this.calendarRef.nativeElement.getApi().removeAllEvents();
          this.doctor.visits?.forEach((x) =>
            this.calendarRef.nativeElement.getApi().addEvent(x)
          );

          this.updatingVisitsDoctors = this.doctor.visits;
        });
    });
  }

  onSaveVisits() {
    let updatingVisits;
    if (this.doctor.visits) {
      updatingVisits = this.doctor.visits?.concat([...this.visits]);
    } else {
      updatingVisits = [...this.visits];
    }
    this.doctorsService.updateDoctor(
      this.doctorId,
      this.doctor.login,
      this.doctor.password,
      this.doctor.name,
      this.doctor.lastname,
      this.doctor.city,
      this.doctor.specjalizations,
      updatingVisits
    );
  }

  onDelete(doctorId: string) {
    this.doctorsService.deleteDoctor(doctorId);
    this.authService.logout();
  }

  onDeleteVisit() {
    if (confirm(`Czy na pewno chcesz odwołać to wydarzenie? '${this.title}'`)) {
      this.event.remove();

      this.updatingVisitsDoctors = this.updatingVisitsDoctors.filter((visit) => {
        let startVisit = new Date(visit.start);
        let endVisit = new Date(visit.end);


        return (
          this.patientId !== visit.id ||
          this.start.toISOString() !== startVisit.toISOString() ||
          this.end.toISOString() !== endVisit.toISOString()
        );
      });
      if(this.patientId.length>10){
      this.updatingVisitsPatients = this.patient.visits.filter((visit) => {
        let startVisit = new Date(visit.start);
        let endVisit = new Date(visit.end);

        return (
          this.doctorId !== visit.id ||
          this.start.toISOString() !== startVisit.toISOString() ||
          this.end.toISOString() !== endVisit.toISOString()
        );
      });
    }
      this.displayVisit = false;

      this.doctorsService.updateDoctor(
        this.doctorId,
        this.doctor.login,
        this.doctor.password,
        this.doctor.name,
        this.doctor.lastname,
        this.doctor.city,
        this.doctor.specjalizations,
        this.updatingVisitsDoctors
      );
      this.patientService.updatePatient(
        this.patientId,
        this.patient.login,
        this.patient.password,
        this.patient.name,
        this.patient.lastname,
        this.updatingVisitsPatients
      )
    }
  }

}
