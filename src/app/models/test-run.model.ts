export interface SavedTestRun {
    test_run: {
        id: number
        test_case_id: number
        user_id: number
        notes: string
        result: number
    }
    test_run_steps: SavedTestRunStep[]
}

export interface SavedTestRunStep {
    id: number
    test_case_id: number
    user_id: number
    notes: string
    result: number
}