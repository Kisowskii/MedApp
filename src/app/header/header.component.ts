import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  path: any;

  onRefresh() {
    this.path = this.authService.getMedPath();
    return this.path;
  }

  constructor(public authService: AuthService, private router: Router) {}
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  ngOnInit(): void {
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAutheticated) => {
        this.userIsAuthenticated = isAutheticated;
      });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
  logout() {
    this.authService.logout();
    this.path = '/';
  }
}
