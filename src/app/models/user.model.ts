import { Organization } from './organization.model';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    admin: boolean
    created_at: Date;
    updated_at: Date;
    organization: Organization
}