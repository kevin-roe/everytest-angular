import { Platform } from '../models/platform.model';
import { Product } from '../models/product.model';
import { TestSuite } from '../models/test-suite.model';

export interface TestPlanResponse {
    id: number
    product: Product
    platform: Platform
    test_suites: TestSuite[]
}