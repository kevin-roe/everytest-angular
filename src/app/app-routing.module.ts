import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OrganizationSettingsComponent } from './components/organization/organization-settings/organization-settings.component';
import { RegisterComponent } from './components/register/register.component';
import { TestPlanResolverService } from './components/test-plan/test-plan-resolver.service';
import { TestPlanComponent } from './components/test-plan/test-plan.component';
import { AuthGuard } from './services/auth.guard';
import { NotAuthGuard } from './services/not-auth.guard';
import { TestSuiteComponent } from './components/test-suite/test-suite.component';
import { TestSuiteResolverService } from './components/test-suite/test-suite-resolver.service';
import { TestCaseComponent } from './components/test-case/test-case.component';
import { TestCaseResolverService } from './components/test-case/test-case-resolver.service';
import { WorkflowsComponent } from './components/workflows/workflows.component';
import { WorkflowsResolverService } from './components/workflows/workflows-resolver.service';
import { WorkflowComponent } from './components/workflow/workflow.component';
import { WorkflowStepsResolverService } from './components/workflow/workflow-resolver.service';

const routes: Routes = [
  //Public
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard] },
  
  // Private
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]  },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'organization', component: OrganizationSettingsComponent, canActivate: [AuthGuard] },
  { path: 'test_plan/:id', component: TestPlanComponent, canActivate: [AuthGuard], resolve: {test_plan: TestPlanResolverService} },
  { path: 'test_suite/:id', component: TestSuiteComponent, canActivate: [AuthGuard], resolve: { test_suite: TestSuiteResolverService } },
  { path: 'test_case/:id', component: TestCaseComponent, canActivate: [AuthGuard], resolve: { test_case: TestCaseResolverService } },
  { path: 'product/:id/workflows', component: WorkflowsComponent, canActivate: [AuthGuard], resolve: { workflows: WorkflowsResolverService } },
  { path: 'workflow/:id', component: WorkflowComponent, canActivate: [AuthGuard], resolve: { workflowSteps: WorkflowStepsResolverService } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
