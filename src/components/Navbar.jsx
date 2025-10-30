import React from 'react';
import { supabase } from '../lib/supabase.js';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
  const { profile } = useAuth();
  const nav = useNavigate();

  // 로그아웃 함수
  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await supabase.auth.signOut();
    }
  };

  const navigateToHome = () => {
    nav('/');
  };

  // 로그인 안 된 상태(auth 페이지 등)에서는 Navbar 미표출
  if (!profile) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-12">
        {/* 왼쪽: 로고 및 홈 이동 */}
        <div
          className="group flex cursor-pointer items-center gap-2"
          onClick={navigateToHome}
        >
          <div className="rounded-lg bg-blue-600 p-1.5 transition-transform group-hover:scale-110">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-800">
            COMPANY
            <span className="text-blue-600"> HUB</span>
          </span>
        </div>

        {/* 오른쪽: 유저 정보 및 메뉴 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
            <div className="text-right">
              <p className="text-sm font-bold leading-none text-slate-800">
                {profile.username}
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-blue-500">
                {profile.role || 'user'}
              </p>
            </div>

            {/* 프로필 아바타 */}
            <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-500 transition-colors hover:border-blue-400">
              <User size={18} />
            </div>
          </div>

          {/* 로그아웃 버튼 */}
          <button
            className="flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-red-500"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
