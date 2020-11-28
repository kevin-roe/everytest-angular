import { Component, Input, OnInit } from '@angular/core';
import { Platform } from 'src/app/models/platform.model';

@Component({
  selector: 'platforms',
  templateUrl: './platforms.component.html',
  styleUrls: ['./platforms.component.css']
})
export class PlatformsComponent implements OnInit {
  @Input() platforms: Platform[]

  constructor() { }

  ngOnInit(): void {
    console.log(this.platforms)
  }

}
