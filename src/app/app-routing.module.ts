import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OrganizationSettingsComponent } from './components/organization/organization-settings/organization-settings.component';
import { PlatformsResolverService } from './components/organization/platforms/platforms-resolver.service';
import { ProductsResolverService } from './components/organization/products/products-resolver.service';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './services/auth.guard';
import { NotAuthGuard } from './services/not-auth.guard';

const routes: Routes = [
  //Public
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard] },
  
  // Private
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]  },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'organization', component: OrganizationSettingsComponent, canActivate: [AuthGuard], resolve: {products: ProductsResolverService, platforms: PlatformsResolverService} }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
