import { NgModule } from '@angular/core';

// Declarations
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Imports
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
    PlatformsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
