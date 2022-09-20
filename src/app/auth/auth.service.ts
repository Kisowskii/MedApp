import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Doctor } from '../shared/doctor.model';
import { Patient } from '../shared/patient.model';
import { User } from './user.model';
import { Login } from './login.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private user: string;
  private doctors: Doctor[] = [];
  private patients: Patient[] = [];
  private admins: User[] = [];
  private doctorsUpdated = new Subject<Doctor[]>();
  private patientsUpdated = new Subject<Patient[]>();
  private adminsUpdated = new Subject<User[]>();
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private medPath: string = '/';
  constructor(private http: HttpClient, private router: Router) {}
  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getMedPath() {
    return this.medPath;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  login(login: string, password: string) {
    const user: Login = {
      login: login,
      password: password,
    };

    if (window.location.href.indexOf('patient') > -1) {
      this.http
        .post<{ token: string; id: string }>(
          'http://localhost:3000/api/users/patients/login',
          user
        )
        .subscribe((response) => {
          const token = response.token;
          const id = response.id;
          this.token = token;
          if (token) {
            this.medPath = '/patient/' + id;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/patient/', id]);
          }
        });
    } else if (window.location.href.indexOf('doctors') > -1) {
      this.http
        .post<{ token: string; id: string }>(
          'http://localhost:3000/api/users/doctors/login',
          user
        )
        .subscribe((response) => {
          const token = response.token;
          const id = response.id;
          this.token = token;
          if (token) {
            this.medPath = '/doctors/' + id;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/doctors/', id]);
          }
        });
    } else if (window.location.href.indexOf('admins') > -1) {
      this.http
        .post<{ token: string; id: string }>(
          'http://localhost:3000/api/users/admins/login',
          user
        )
        .subscribe((response) => {
          const token = response.token;
          const id = response.id;
          this.token = token;
          if (token) {
            this.medPath = '/admins/' + id;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/admins', id]);
          }
        });
    }
  }

  logout() {
    this.token = null;
    this.medPath = '/';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  createUser(name: string, lastname: string, login: string, password: string) {
    const user: User = {
      id: null,
      login: login,
      password: password,
      name: name,
      lastname: lastname,
    };

    if (window.location.href.indexOf('patient') > -1) {
      this.http
        .post<{ message: string }>(
          'http://localhost:3000/api/users/patients',
          user
        )
        .subscribe(() => {
          this.patients.push(user);
          this.patientsUpdated.next([...this.patients]);
        });
    } else if (window.location.href.indexOf('doctor') > -1) {
      this.http
        .post<{ message: string }>(
          'http://localhost:3000/api/users/doctors',
          user
        )
        .subscribe(() => {
          this.doctors.push(user);
          this.doctorsUpdated.next([...this.doctors]);
        });
    } else if (window.location.href.indexOf('admin') > -1) {
      this.http
        .post<{ message: string }>(
          'http://localhost:3000/api/users/admins',
          user
        )
        .subscribe(() => {
          this.admins.push(user);
          this.adminsUpdated.next([...this.admins]);
        });
    }
  }
}
