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
      setProfile(null);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);

      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).catch((error) => {
          handleError('프로필 패치에 실패하였습니다.', error);
        });
      } else {
        // 세션 없으면 프로필 비워줌
        setProfile(null);
      }
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
        profile,
        isAdmin: profile?.role === 'admin',
        isLoading,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
