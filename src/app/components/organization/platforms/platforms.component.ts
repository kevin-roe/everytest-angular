import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Platform } from 'src/app/models/platform.model';
import { PlatformRequest } from 'src/app/requests/platform.request';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
declare var $: any;

@Component({
  selector: 'platforms',
  templateUrl: './platforms.component.html',
  styleUrls: ['./platforms.component.css']
})
export class PlatformsComponent implements OnInit {
  @Input() platforms: Platform[]
  platform: Platform
  editPlatformForm: FormGroup;
  addPlatformForm: FormGroup;

  constructor(private authService: AuthService, private http: HttpService) { }

  ngOnInit(): void {
    this.initForms()
  }

  setPlatform(platform: Platform, setEditForm: boolean) {
    this.platform = platform
    if (setEditForm) {
      this.editPlatformForm.get("editField").setValue(this.platform.name)
    }
  }

  private initForms() {
    this.editPlatformForm = new FormGroup({
      'editField': new FormControl(null, [Validators.required]),
    });
    this.addPlatformForm = new FormGroup({
      'addField': new FormControl(null, [Validators.required]),
    });
  }

  onEditSubmit() {
    let req: PlatformRequest = {
      name: this.editPlatformForm.value.editField,
    }
    this.http.put<Platform>(`platforms/${this.authService.user$.organization.id}/${this.platform.id}`, req).subscribe(
      data => {
        this.platforms.find(p => p.id === data.id).name = data.name;
        $("#editPlatformModal").modal('hide');
      }, () => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

  onDeleteSubmit() {
    this.http.delete(`platforms/${this.authService.user$.organization.id}/${this.platform.id}`).subscribe(
      () => {
        this.platforms = this.platforms.filter(p => p.id != this.platform.id);
        this.platform = null; // Just in case
        $("#deletePlatformModal").modal('hide');
      }, () => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

  onAddSubmit() {
    let req: PlatformRequest = {
      name: this.addPlatformForm.value.addField,
    }
    this.http.post<Platform>(`platforms/${this.authService.user$.organization.id}`, req).subscribe(
      data => {
        this.platforms.push(data)
        $("#addPlatformModal").modal('hide');
      }, () => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

}
