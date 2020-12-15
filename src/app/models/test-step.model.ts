export interface TestStep {
    id: number
    test_case_id: number
    workflow_id: number
    action: string
    order: number
    notes: string
}