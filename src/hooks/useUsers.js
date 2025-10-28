import { useContext } from 'react';
import { UserContext } from '../contexts/UserProvider.jsx';

const useUsers = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUsers는 반드시 UserProvider 내부에서 사용해야 합니다.');
  }

  return context;
};

export default useUsers;
