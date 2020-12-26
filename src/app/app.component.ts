import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // showLoadingSpinner = false;
  public_routes = ["/", "/login", "/register"]

  constructor(public authService: AuthService, public router: Router, public spinner: SpinnerService) {
    
    this.router.events.subscribe((e: Event) => {
      if (e instanceof NavigationStart) {
        this.spinner.start();
      }

      if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
        this.spinner.stop();
      }
    })
  }
}
