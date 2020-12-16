import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Organization } from 'src/app/models/organization.model';
import { Platform } from 'src/app/models/platform.model';
import { Product } from 'src/app/models/product.model';
import { EditOrganizationRequest } from 'src/app/requests/edit-organization.request';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-organization-settings',
  templateUrl: './organization-settings.component.html',
  styleUrls: ['./organization-settings.component.css']
})
export class OrganizationSettingsComponent implements OnInit {
  organizationForm: FormGroup;
  products: Product[];
  platforms: Platform[];

  constructor(private authService: AuthService, private http: HttpService) { }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    let req: EditOrganizationRequest = {
      name: this.organizationForm.value.name,
    }
    this.http.put<Organization>(`organizations`, req).subscribe(
      res => {
        this.authService.user$.organization.name = res.name
      }, error => {
        alert("Error!") //TODO: Handle errors
      }
    )
  }

  private initForm() {
    this.organizationForm = new FormGroup({
      'name': new FormControl(this.authService.user$.organization.name, [Validators.required]),
    });
  }

}
