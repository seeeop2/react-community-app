import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const AuthPage = () => {
  const { session } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (session) {
      nav('/', { replace: true });
    }
  }, [session, nav]);

  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border bg-white p-10 shadow-sm">
      <h2 className="mb-6 text-center text-2xl font-bold">커뮤니티 시작하기</h2>
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
  );
};

export default AuthPage;
