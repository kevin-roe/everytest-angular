import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestPlanRequest } from 'src/app/requests/test-plan.request';
import { HttpService } from 'src/app/services/http.service';
import { TestPlanService } from 'src/app/services/test-plan.service';
declare var $: any;

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  addTestPlanForm: FormGroup;

  constructor(private http: HttpService, public testPlanService: TestPlanService) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.addTestPlanForm = new FormGroup({
      'platform': new FormControl(null, [Validators.required]),
      'product': new FormControl(null, [Validators.required]),
    });
  }

  onCancel() {
    this.addTestPlanForm.reset();
    $("#addTestPlanModal").modal('hide');
  }

  onSubmit() {
    let req: TestPlanRequest = {
      product_id: this.addTestPlanForm.get("product").value,
      platform_id: this.addTestPlanForm.get("platform").value
    }
    this.http.post<TestPlan>(`test_plans`, req).subscribe(
      data => {
        this.testPlanService.addToFormattedTestPlans(data)
        this.addTestPlanForm.reset()
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

  toggleSidebarMenuCollapse() {
    $('.sidebar .collapse').collapse('hide');
  }

}
