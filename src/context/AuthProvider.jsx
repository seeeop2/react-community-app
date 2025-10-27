import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 가져오기 (새로고침 대응)
    const initAuth = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      setSession(initialSession);
      setIsLoading(false); // 세션 확인 끝나면 로딩 끝!
    };

    initAuth();

    // 로그인/로그아웃 상태 변화 감시
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user, // 세션 안의 user 객체만 따로 제공
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
