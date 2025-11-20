import React, {useCallback, useEffect, useRef} from 'react';
import usePosts from '../hooks/queries/usePosts.js';
import PostList from './PostList.jsx';
import Spinner from './Spinner.jsx';

const UserPostList = ({ authorId }) => {
  // States & Refs
  const observerRef = useRef(); // 바닥 감지용

  // Custom Hooks
  // 내가 쓴 글 가져오기
  const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts({ authorId });

  // Sync / Derived
  // 다음 페이지 데이터 로드 함수
  const loadMorePosts = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // useEffect
  // 바닥 감지
  useEffect(() => {
    if (isLoading) return;

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
  }, [loadMorePosts, hasNextPage, isFetchingNextPage, isLoading]);

  // Early Return 첫 번째 (데이터 로드 전)
  if (isLoading && !isFetchingNextPage) {
    return <div className="py-20 text-center">글을 불러오는 중입니다...</div>;
  }

  // Early Return 두 번째 (데이터 로드 후)
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400">
        작성한 게시글이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PostList posts={posts} />

      {/* 무한 스크롤 트리거 */}
      <div
        ref={observerRef}
        className="py-10 text-center text-sm text-gray-400"
      >
        {isFetchingNextPage ? (
          <div className="flex items-center justify-center gap-3">
            <Spinner variant="secondary" size="md" />
            <span className="font-medium text-slate-600">불러오는 중...</span>
          </div>
        ) : !hasNextPage ? (
          '모든 글을 확인했습니다.'
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default UserPostList;
