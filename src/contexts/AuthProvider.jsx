import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import * as userApi from '../api/userApi.js';
import { handleError } from '../utils/errorHandler.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // DB에서 내 상세 프로필 정보를 가져오는 함수
  const fetchProfile = async (userId) => {
    if (!userId) {
      return;
    }
    try {
      const data = await userApi.getProfileById(userId);
      setProfile(data);
    } catch (error) {
      handleError('프로필 로드에 실패했습니다.', error);
    }
  };

  useEffect(() => {
    // 현재 세션 가져오기 (새로고침 대응)
    const initAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();
        setSession(initialSession);

        // 세션이 있다면 프로필까지 기다렸다가 가져오기
        if (initialSession?.user) {
          await fetchProfile(initialSession.user.id);
        }
      } catch (error) {
        handleError('인증 초기화에 에러가 발생했습니다.', error);
      } finally {
        setIsLoading(false); // 세션 확인 끝나면 로딩 끝!
      }
    };

    initAuth();

    // 로그인/로그아웃 상태 변화 감시
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);

      // 세션 없으면 프로필도 비워줌
      if (!currentSession) {
        setProfile(null);
      }
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
        profile,
        isAdmin: profile?.role === 'admin',
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
