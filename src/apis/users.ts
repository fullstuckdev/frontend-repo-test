import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

export const userApi = {
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

  updateUserData: async (userId: string, userData: {
    displayName: string;
    photoURL: string;
    role: string;
    isActive: boolean;
  }, token: string) => {
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