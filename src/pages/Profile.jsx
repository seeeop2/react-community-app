import React, { useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import ProfileForm from '../components/ProfileForm.jsx';
import { cn } from '../utils/cn.js';
import Button from '../components/Button.jsx';
import UserPostList from '../components/UserPostList.jsx';
import useUserStats from '../hooks/queries/useUserStats.js';
import ProfileFormSkeleton from '../components/skeletons/ProfileFormSkeleton.jsx';

const Profile = () => {
  // States & Refs
  const [activeTab, setActiveTab] = useState('profile');

  // Custom Hooks
  const { profile, isLoading: isAuthLoading } = useAuth();
  // 작성자의 전체 게시글 수 조회
  const { totalCount, likedCount, commentedCount } = useUserStats(profile?.id);

  // Event Handler
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="mx-auto max-w-4xl p-8 sm:p-12">
      <div className="mb-10 flex flex-col items-center justify-between gap-4 border-b border-slate-100 pb-8 sm:flex-row">
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            My <span className="text-blue-600">Activity</span>
          </h1>
          <p className="text-slate-500">
            회원님의 정보를 관리하고 활동 내역을 확인하세요.
          </p>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <Button
            variant="ghost"
            size="sm"
            fontWeight="bold"
            onClick={() => handleTabChange('profile')}
            className={cn(
              'px-4 py-2 shadow-none transition-all',
              activeTab === 'profile'
                ? 'bg-white text-blue-600 shadow-sm hover:bg-white'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            프로필 수정
          </Button>

          <Button
            variant="ghost"
            size="sm"
            fontWeight="bold"
            onClick={() => handleTabChange('posts')}
            className={cn(
              'px-4 py-2 shadow-none transition-all',
              activeTab === 'posts'
                ? 'bg-white text-blue-600 shadow-sm hover:bg-white'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            내 게시글 ({totalCount})
          </Button>

          <Button
            variant="ghost"
            size="sm"
            fontWeight="bold"
            onClick={() => handleTabChange('likes')}
            className={cn(
              'px-4 py-2 shadow-none transition-all',
              activeTab === 'likes'
                ? 'bg-white text-blue-600 shadow-sm hover:bg-white'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            좋아요 ({likedCount})
          </Button>

          <Button
            variant="ghost"
            size="sm"
            fontWeight="bold"
            onClick={() => handleTabChange('comments')}
            className={cn(
              'px-4 py-2 shadow-none transition-all',
              activeTab === 'comments'
                ? 'bg-white text-blue-600 shadow-sm hover:bg-white'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            내 댓글 ({commentedCount})
          </Button>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="mt-8">
        {activeTab === 'profile' &&
          (isAuthLoading || !profile ? (
            <ProfileFormSkeleton />
          ) : (
            <ProfileForm profile={profile} key={profile.id} />
          ))}

        {/* 내 게시글 탭일 때 */}
        {activeTab === 'posts' && (
          <UserPostList userId={profile?.id} type={'posts'} />
        )}

        {/* 좋아요 탭일 때 */}
        {activeTab === 'likes' && (
          <UserPostList userId={profile?.id} type={'likes'} />
        )}

        {/* 내 댓글 탭일 때 */}
        {activeTab === 'comments' && (
          <UserPostList userId={profile?.id} type={'comments'} />
        )}
      </div>
    </div>
  );
};

export default Profile;
