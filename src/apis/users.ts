import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5001/test-fullstack-1c6a8/us-central1/api/v1'

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