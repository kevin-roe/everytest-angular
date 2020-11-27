import { User } from '../models/user.model';

export interface LoggedInResponse {
    logged_in: boolean
    user: User
}