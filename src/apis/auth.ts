import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/your-project/us-central1/api';

export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getUserInfo: async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 