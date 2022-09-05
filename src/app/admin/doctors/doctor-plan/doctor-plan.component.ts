import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  defineFullCalendarElement,
  FullCalendarElement,
} from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { INITIAL_EVENTS, createEventId } from './event-utils';

import { DoctorsService } from '../doctors.service';
import { Doctor } from '../doctors-models/doctor.model';
import { Visit } from '../doctors-models/doctors.visit.model';

defineFullCalendarElement();

@Component({
  selector: 'app-doctor-plan',
  templateUrl: './doctor-plan.component.html',
  styleUrls: ['./doctor-plan.component.css'],
})
export class DoctorPlanComponent implements OnInit {
  @ViewChild('calendar') calendarRef: ElementRef<FullCalendarElement>;

  private mode = 'doctor';

  calendarVisible = true;
  private doctorId: string;
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
    public doctorsService: DoctorsService,
    public route: ActivatedRoute
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
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();

      // const visitId = clickInfo.event._def.defId;
      // this.doctorsService.deleteVisit(
      //   this.doctor.id,
      //   this.doctor.name,
      //   this.doctor.lastname,
      //   this.doctor.specjalizations,
      //   this.doctor.city,
      //   this.doctor.visits
      // );
    }
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
      const mat = this.doctorsService
        .getDoctor(this.doctorId)
        .subscribe((doctorData) => {
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
}
