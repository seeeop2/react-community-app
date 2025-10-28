import React, { createContext, useCallback, useEffect, useState } from 'react';
import * as userApi from '../api/userApi';
import { handleError } from '../utils/errorHandler';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userApi.getProfiles();
      setUsers(data || []);
    } catch (error) {
      handleError('사용자 정보를 불러오는데 실패했습니다.', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <UserContext.Provider
      value={{ users, isLoading, refetchUsers: fetchProfiles }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
