import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userApi } from '@/apis/users';
import { setUser, setError } from '@/store/slices/authSlice';
import type { RootState } from '@/store';

export const useUserData = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const updateUserData = async (userData: {
    displayName: string;
    photoURL: string;
    role: string;
    isActive: boolean;
  }) => {
    if (!user?.id || !user?.token) return;
    
    setLoading(true);
    try {
      const updatedUser = await userApi.updateUserData(
        user.id,
        userData,
        user.token
      );
      dispatch(setUser({ ...updatedUser, token: user.token }));
    } catch (error) {
      dispatch(setError('Failed to update user data'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateUserData, loading };
}; 