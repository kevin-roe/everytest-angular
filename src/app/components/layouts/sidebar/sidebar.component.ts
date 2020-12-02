import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Platform } from 'src/app/models/platform.model';
import { Product } from 'src/app/models/product.model';
import { TestPlanFormatted } from 'src/app/models/test-plan-formatted.model';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestPlanRequest } from 'src/app/requests/new-test-plan.request';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { TestPlanServiceService } from 'src/app/services/test-plan-service.service';
declare var $: any;

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  addTestPlanForm: FormGroup;

  constructor(private authService: AuthService, private http: HttpService, public testPlanService: TestPlanServiceService) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.addTestPlanForm = new FormGroup({
      'platform': new FormControl(null, [Validators.required]),
      'product': new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    let req: TestPlanRequest = {
      product_id: this.addTestPlanForm.get("product").value,
      platform_id: this.addTestPlanForm.get("platform").value
    }
    this.http.post<TestPlan>(`testplans/${this.authService.user$.organization.id}`, req).subscribe(
      data => {
        this.testPlanService.addToFormattedTestPlans(data)
        $("#addTestPlanModal").modal('hide');
      }, () => {
        alert("Error!") // TODO: Handle this better
      }
    )
  }

  toggleSidebar() {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  }

}
