import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Platform } from '../models/platform.model';
import { Product } from '../models/product.model';
import { TestPlanFormatted } from '../models/test-plan-formatted.model';
import { TestPlan } from '../models/test-plan.model';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TestPlanService {
  public products: Product[];
  public platforms: Platform[];
  public test_plans: TestPlan[];
  public formatted_test_plans: TestPlanFormatted[]; 

  constructor(private http: HttpService) { 
    this.buildSideNavMenuFromDatabase()
  }

  public getProductName(product_id: number) : string {
    return this.products.find(x => x.id == product_id).name
  }

  public getPlatformName(platform_id: number) : string {
    return this.platforms.find(x => x.id == platform_id).name
  }

  addToFormattedTestPlans(plan: TestPlan) {
    // Does the product for this plan already exist in the formatted plans
    let notAddedYet = this.formatted_test_plans.find(x => x.product_id == plan.product.id) == null

    // if it's not already added, then add it now. 
    if (notAddedYet) {
      // First, get the name of he product
      let product_name = this.getProductName(plan.product.id)
      // Then, get the name of he platform
      let platform_name = this.getPlatformName(plan.platform.id)
      // Then push a new object
      let obj: TestPlanFormatted = { product_name: product_name, product_id: plan.product.id, test_plans: [{platform_name: platform_name, platform_id: plan.platform.id, test_plan_id: plan.id}] } 
      this.formatted_test_plans.push(obj)
    
    // If the product has already beed added
    } else {
      // Get the platform name 
      let platform_name = this.getPlatformName(plan.platform.id)
      // Push a new object
      this.formatted_test_plans.find(x => x.product_id == plan.product.id).test_plans.push({platform_name: platform_name, platform_id: plan.platform.id, test_plan_id: plan.id})
    }
  }

  public buildSideNavMenuFromDatabase() {
    let products = this.http.get<Product[]>(`products`);
    let platforms = this.http.get<Platform[]>(`platforms`);

    forkJoin([products, platforms]).subscribe(results => {
      this.products = results[0];
      this.platforms = results[1];

      this.http.get<TestPlan[]>(`test_plans`).subscribe(plans => {
        this.test_plans = plans
        this.formatted_test_plans = []
        this.test_plans.forEach(plan => {
          this.addToFormattedTestPlans(plan)
        })
      });

    }, () => alert("Could not load either products or platforms")) //TODO: Handle this better
  }

  updateSideNavMenu() {
    this.formatted_test_plans = []
    this.test_plans.forEach(plan => {
      this.addToFormattedTestPlans(plan)
    })
  }

  public getPlatformIcon(name: string) {
    name = name.trim().toLowerCase();
    switch (name) { 
      case "desktop": { return "fas fa-fw fa-desktop" }
      case "windows": { return "fab fa-fw fa-windows" }
      case "mac" || "macos" || "apple": { return "fab fa-fw fa-apple" }
      case "web" || "browser": {return "fas fa-fw fa-window-maximize"}  
      case "chrome": { return "fab fa-fw fa-chrome"}
      case "firefox": { return "fab fa-fw fa-firefox-browser" }
      case "internet explorer" || "ie": { return "fab fa-fw fa-internet-explorer" }
      case "edge": { return "fab fa-fw fa-edge" }
      case "safari": { return "fab fa-fw fa-safari" }
      case "mobile": { return "fas fa-fw fa-mobile-alt" }
      case "ios": { return "fab fa-fw fa-app-store-ios" }
      case "android": { return "fab fa-fw fa-android" }   
      default: { return "fas fa-fw fa-cog"}
   } 
  }
}
