import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { SidebarComponent } from './components/layouts/sidebar/sidebar.component';
import { TopbarComponent } from './components/layouts/topbar/topbar.component';
import { RegisterComponent } from './components/register/register.component';
import { OrganizationSettingsComponent } from './components/organization/organization-settings/organization-settings.component';
import { ProductsComponent } from './components/organization/products/products.component';
import { PlatformsComponent } from './components/organization/platforms/platforms.component';
import { TestPlanComponent } from './components/test-plan/test-plan.component';
import { TestSuiteComponent } from './components/test-suite/test-suite.component';
import { TestCaseComponent } from './components/test-case/test-case.component';
import { MetsNamePipe } from './services/mets-name.pipe';
import { MetsColorPipe } from './services/mets-color.pipe';
import { WorkflowsComponent } from './components/workflows/workflows.component';
import { WorkflowComponent } from './components/workflow/workflow.component';
import { UsersComponent } from './components/organization/users/users.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    AboutComponent,
    SidebarComponent,
    TopbarComponent,
    RegisterComponent,
    OrganizationSettingsComponent,
    ProductsComponent,
    PlatformsComponent,
    TestPlanComponent,
    TestSuiteComponent,
    TestCaseComponent,
    MetsNamePipe,
    MetsColorPipe,
    WorkflowsComponent,
    WorkflowComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
