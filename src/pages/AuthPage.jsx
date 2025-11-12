import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button.jsx';

const AuthPage = () => {
  const { session } = useAuth();
  const nav = useNavigate();

  const navigateToHome = () => {
    nav('/');
  };

  useEffect(() => {
    if (session) {
      nav('/', { replace: true });
    }
  }, [session, nav]);

  return (
    <div className="relative mx-auto mt-20 max-w-md p-4">
      <Button variant="ghost" className="mb-2 px-0" onClick={navigateToHome}>
        <ArrowLeft size={20} /> 메인 화면으로 돌아가기
      </Button>
      <div className="rounded-2xl border bg-white p-10 shadow-sm">
        <h2 className="mb-6 text-center text-2xl font-bold">
          커뮤니티 시작하기
        </h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]} // 빈 배열로 두면 소셜 로그인 버튼이 사라짐
          localization={{
            variables: {
              sign_in: {
                email_label: '이메일',
                password_label: '비밀번호',
                button_label: '로그인',
              },
              sign_up: {
                email_label: '이메일',
                password_label: '비밀번호',
                button_label: '회원가입',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AuthPage;
