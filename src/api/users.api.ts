import api from './axios.instance';
import { UpdateProfilePayload, UpdateProfileResponse } from '../types/users.types';
import { ApiResponse } from '../types/auth.types';

export const usersApi = {
  updateProfile: async (payload: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
    const response = await api.patch<ApiResponse<UpdateProfileResponse>>('/users/profile', payload);
    return response.data.data;
  },
};
