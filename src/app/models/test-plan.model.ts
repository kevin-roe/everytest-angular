import { Platform } from './platform.model';
import { Product } from './product.model';

export interface TestPlan {
    id: number
    organization_id: number
    created_at: Date
    updated_at: Date
    product: Product
    platform: Platform
    
}