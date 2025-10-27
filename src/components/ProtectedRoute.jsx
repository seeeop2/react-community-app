import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { session, isLoading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    // 로딩이 끝났는데 세션(로그인 정보)이 없으면 로그인 페이지로 강제 이동
    if (!isLoading && !session) {
      nav('/auth', { replace: true });
    }
  }, [session, isLoading, nav]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        인증 확인 중...
      </div>
    );
  }

  // 로그인 상태라면 감싸고 있는 자식 컴포넌트(Home 등)를 보여줌
  return session ? children : null;
};

export default ProtectedRoute;
