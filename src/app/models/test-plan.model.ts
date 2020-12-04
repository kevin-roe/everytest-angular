import { Platform } from './platform.model';
import { Product } from './product.model';

export interface TestPlan {
    id: number
    product: Product
    platform: Platform
}