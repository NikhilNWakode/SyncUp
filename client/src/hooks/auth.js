import { useState, useEffect, useCallback } from 'react';
import { userAppStore } from '../store';
import apiClient from '../lib/api-client';
import { GET_USER_INFO } from '../utils/constants';

 function useAuth() {
  const { userInfo, setUserInfo } = userAppStore();
  const [isLoading, setIsLoading] = useState(true);

  const loadUserFromAPI = useCallback(async () => {
    try {
      const res = await apiClient.get(GET_USER_INFO, { withCredentials: true });
      if (res.status === 200 && res.data.id) {
        setUserInfo(res.data);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUserInfo]);

  useEffect(() => {
    if (!userInfo) {
      loadUserFromAPI();
    } else {
      setIsLoading(false);
    }
  }, [userInfo, loadUserFromAPI]);

 

  return { userInfo, isLoading, refreshUser: loadUserFromAPI };
}

export {useAuth} ;