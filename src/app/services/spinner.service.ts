import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  showSpinner = false;

  constructor() { }

  start() {
    this.showSpinner = true;
  }

  stop() {
    this.showSpinner = false;
  }
}
