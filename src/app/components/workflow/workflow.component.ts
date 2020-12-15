import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestPlan } from 'src/app/models/test-plan.model';
import { WorkflowStep } from 'src/app/models/workflow-step.model';
import { Workflow } from 'src/app/models/workflow.model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {
  test_plan: TestPlan
  workflow: Workflow
  workflow_steps: WorkflowStep[]

  constructor(private route: ActivatedRoute, private http: HttpService, public router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.test_plan = data.workflow_steps[0]
      this.workflow = data.workflow_steps[1]
      this.workflow_steps = data.workflow_steps[2]
    })
  }

}
