import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { StartingPageComponent } from '../starting-page/starting-page.component';
import { DoctorsComponent } from './doctors-visit/doctors.component';
import { PatientsComponent } from './patients-visit/patients.component';
import { AdminComponent } from '../admin/admin.component';
import { Router, RouterModule } from '@angular/router';
import { AuthModule } from '../auth/auth.module';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { PatientsModule } from '../admin/patients/patients.module';
import { DoctorsModule } from '../admin/doctors/doctors.module';



@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HeaderComponent,StartingPageComponent, DoctorsComponent,
    PatientsComponent,AdminComponent,],
  imports: [
CommonModule,
    BrowserModule,
    MatGridListModule,
     MatDatepickerModule,
    RouterModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MatPaginatorModule,
    AuthModule,
    PatientsModule,
    DoctorsModule,
  ],

  exports: [MatButtonModule, MatNativeDateModule, HeaderComponent,StartingPageComponent,  DoctorsComponent,PatientsComponent,AdminComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['ll', 'LL'],
        },
        display: {
          dateInput: 'LL',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    }]
})
export class SharedModule { constructor(router: Router) {}}
