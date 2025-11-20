import React, { useCallback, useEffect, useRef, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import ProfileForm from '../components/ProfileForm.jsx';
import PostList from '../components/PostList.jsx';
import usePosts from '../hooks/queries/usePosts.js';
import { cn } from '../utils/cn.js';
import Button from '../components/Button.jsx';
import Spinner from '../components/Spinner.jsx';
import useUserStats from '../hooks/queries/useUserStats.js';

const Profile = () => {
  // States & Refs
  const [activeTab, setActiveTab] = useState('profile');
  const observerRef = useRef(); // 바닥 감지용

  // Custom Hooks
  const { profile } = useAuth();
  // 내가 쓴 글 가져오기
  const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts({
      authorId: profile?.id,
    });
  // 작성자의 전체 게시글 수 조회
  const { data: totalCount } = useUserStats(profile?.id);

  // Sync / Derived
  // 다음 페이지 데이터 로드 함수
  const loadMorePosts = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Event Handler
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // useEffect
  // 바닥 감지
  useEffect(() => {
    if (isLoading || activeTab !== 'posts') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMorePosts();
        }
      },
      { threshold: 0, rootMargin: '200px' }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMorePosts, hasNextPage, isFetchingNextPage, isLoading, activeTab]);

  // Early Return
  if (!profile) {
    return (
      <div className="py-20 text-center text-gray-500">
        프로필 데이터를 불러오는 중...
      </div>
    );
  }

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
        </div>
      </div>

      {activeTab === 'profile' ? (
        <div className="mx-auto max-w-2xl">
          <ProfileForm profile={profile} key={profile.id} />
        </div>
      ) : (
        <div className="space-y-6">
          {isLoading && !isFetchingNextPage ? (
            <div className="py-20 text-center">글을 불러오는 중입니다...</div>
          ) : posts.length > 0 ? (
            <>
              <PostList posts={posts} />

              {/* 무한 스크롤 트리거 */}
              <div
                ref={observerRef}
                className="py-10 text-center text-sm text-gray-400"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center justify-center gap-3">
                    <Spinner variant="secondary" size="md" />
                    <span className="font-medium text-slate-600">
                      불러오는 중...
                    </span>
                  </div>
                ) : !hasNextPage ? (
                  '모든 글을 확인했습니다.'
                ) : (
                  ''
                )}
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-400">
              작성한 게시글이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
