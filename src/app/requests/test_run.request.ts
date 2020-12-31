export interface TestRunRequest {
    test_run: {
        test_case_id: number
        user_id: number
        notes: string
        result: number
    }
    test_run_steps: TestRunStepRequest[]
}

export interface TestRunStepRequest {
    order: number
    action: string
    workflow: string
    notes: string
    result: number
}