export interface WorkflowStep {
    id: number
    workflow_id: number
    action: string
    order: number
    notes: string
}