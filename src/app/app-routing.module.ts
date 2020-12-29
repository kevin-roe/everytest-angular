import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OrganizationSettingsComponent } from './components/organization/organization-settings/organization-settings.component';
import { RegisterComponent } from './components/register/register.component';
import { EditTestPlanResolverService } from './components/edit-test-plans/edit-test-plan/edit-test-plan-resolver.service';
import { EditTestPlanComponent } from './components/edit-test-plans/edit-test-plan/edit-test-plan.component';
import { AuthGuard } from './services/auth.guard';
import { NotAuthGuard } from './services/not-auth.guard';
import { EditTestSuiteComponent } from './components/edit-test-plans/edit-test-suite/edit-test-suite.component';
import { EditTestSuiteResolverService } from './components/edit-test-plans/edit-test-suite/edit-test-suite-resolver.service';
import { EditTestCaseComponent } from './components/edit-test-plans/edit-test-case/edit-test-case.component';
import { EditTestCaseResolverService } from './components/edit-test-plans/edit-test-case/edit-test-case-resolver.service';
import { EditWorkflowsComponent } from './components/edit-test-plans/edit-workflows/edit-workflows.component';
import { EditWorkflowsResolverService } from './components/edit-test-plans/edit-workflows/edit-workflows-resolver.service';
import { EditWorkflowComponent } from './components/edit-test-plans/edit-workflow/edit-workflow.component';
import { EditWorkflowStepsResolverService } from './components/edit-test-plans/edit-workflow/edit-workflow-resolver.service';
import { TestPlanComponent } from './components/test-plan/test-plan.component';
import { TestPlanResolverService } from './components/test-plan/test-plan-resolver.service';

const routes: Routes = [
  //Public
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard] },
  
  // Private
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]  },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'organization', component: OrganizationSettingsComponent, canActivate: [AuthGuard] },
  { path: 'test_plan/:id', component: TestPlanComponent, canActivate: [AuthGuard], resolve: { test_plan: TestPlanResolverService } },
  
  // Edit Test Plan Routes
  { path: 'edit/test_plan/:id', component: EditTestPlanComponent, canActivate: [AuthGuard], resolve: {test_plan: EditTestPlanResolverService} },
  { path: 'edit/test_suite/:id', component: EditTestSuiteComponent, canActivate: [AuthGuard], resolve: { test_suite: EditTestSuiteResolverService } },
  { path: 'edit/test_case/:id', component: EditTestCaseComponent, canActivate: [AuthGuard], resolve: { test_case: EditTestCaseResolverService } },
  { path: 'edit/product/:id/workflows', component: EditWorkflowsComponent, canActivate: [AuthGuard], resolve: { workflows: EditWorkflowsResolverService } },
  { path: 'edit/workflow/:id', component: EditWorkflowComponent, canActivate: [AuthGuard], resolve: { workflowSteps: EditWorkflowStepsResolverService } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
