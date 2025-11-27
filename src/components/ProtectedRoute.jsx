import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  // Hooks
  const nav = useNavigate();

  // Custom Hooks
  const { session, isLoading } = useAuth();

  // Effects
  useEffect(() => {
    // 로딩이 끝났는데 세션(로그인 정보)이 없으면 로그인 페이지로 강제 이동
    if (!isLoading && !session) {
      nav('/auth', { replace: true });
    }
  }, [session, isLoading, nav]);

  return children;
};

export default ProtectedRoute;
