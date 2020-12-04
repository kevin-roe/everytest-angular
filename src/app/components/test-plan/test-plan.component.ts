import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestPlan } from 'src/app/models/test-plan.model';
import { AuthService } from 'src/app/services/auth.service';
import { TestPlanService } from 'src/app/services/test-plan.service';

@Component({
  selector: 'app-test-plan',
  templateUrl: './test-plan.component.html',
  styleUrls: ['./test-plan.component.css']
})
export class TestPlanComponent implements OnInit {
  plan: TestPlan;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      console.log(routeParams.id);
    });
  }

}
