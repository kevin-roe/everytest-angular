export interface TestPlanFormatted {
    product_name: string
    product_id: number
    test_plans: Plan[]
}

// Don't use this directly.
interface Plan {
    platform_name: string
    platform_id: number
    test_plan_id: number
}