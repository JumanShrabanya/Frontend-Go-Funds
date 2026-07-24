import { UserProfile } from './auth.types';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  annualIncome?: number;
}

export type UpdateProfileResponse = UserProfile;
