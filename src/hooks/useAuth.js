import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider.jsx'; // AuthProvider에서 만든 Context 가져오기

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
};

export default useAuth;
