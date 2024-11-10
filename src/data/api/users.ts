import axios from 'axios';
import type { User } from '@/domain/models/user';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_FB_PROJECT_ID}/us-central1/api/v1`;

export interface UserApiService {
  fetchUsersData: (token: string) => Promise<User[]>;
  updateUserData: (userId: string, userData: Partial<User>, token: string) => Promise<User>;
}

export const userApiService: UserApiService = {
  fetchUsersData: async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/fetch-users-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserData: async (userId: string, userData: Partial<User>, token: string) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/update-user-data/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
