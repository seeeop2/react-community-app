import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import useProfile from '../hooks/useProfile.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const userId = session?.user?.id;

  // Custom Hooks
  const { data: profile, isLoading: isProfileLoading } = useProfile(userId);

  // States & Refs
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // useEffect
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setIsAuthLoading(false);
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
        isLoading: isAuthLoading || isProfileLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
