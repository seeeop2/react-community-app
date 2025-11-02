import React, { useCallback, useEffect, useRef, useState } from 'react';
import StatsCard from '../components/StatsCard.jsx';
import { FileText, Plus, Users, Zap } from 'lucide-react';
import Header from '../components/Header.jsx';
import PostList from '../components/PostList.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import usePosts from '../hooks/usePosts.js';
import useUsers from '../hooks/useUsers.js';

const Home = () => {
  const { posts = [], isLoading: isPostInitialLoading, refetch } = usePosts();
  const { users = [], isLoading: isUserLoading } = useUsers();
  const [keyword, setKeyword] = useState('');

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const observerRef = useRef(); // 바닥 감지용
  // TODO: 추후 API 단에서 필터링하여 최적화 필요
  const todayTime = new Date().setHours(0, 0, 0, 0);
  const nav = useNavigate();

  // 다음 페이지 데이터 로드 함수
  const loadMorePosts = useCallback(async () => {
    if (isFetching || !hasMore) {
      return;
    }

    setIsFetching(true);
    const nextPage = page + 1;
    const newData = await refetch(nextPage);

    // 받아온 데이터가 없거나 10개 미만이면 더 이상 데이터가 없는 것으로 판단
    if (!newData || newData.length < 10) {
      setHasMore(false);
    }

    setPage(nextPage);
    setIsFetching(false);
  }, [page, isFetching, hasMore, refetch]);

  useEffect(() => {
    // 초기 로딩 중에는 Observer를 붙이지 않고 기다림
    if (isPostInitialLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // 요소가 화면에 나타나고, 데이터가 더 있고, 현재 로딩 중이 아닐 때
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          loadMorePosts();
        }
      },
      {
        threshold: 0,
        rootMargin: '200px', // 하단 200px 지점에서 미리 트리거
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts, hasMore, isFetching, isPostInitialLoading]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(keyword.toLowerCase())
  );

  const todayPostsCount = posts.filter((post) => {
    const postDate = new Date(post.created_at).getTime();
    return postDate >= todayTime;
  }).length;

  const activeMemberCount = users.filter(
    (user) => user.status === 'active'
  ).length;

  return (
    <div className="mx-auto max-w-7xl p-12">
      <Header
        badge="Community"
        title="Company"
        highlightTitle="Board"
        description="자유롭게 의견을 나누는 공간입니다."
        action={
          <Button
            fontWeight="bold"
            fullWidth={true}
            onClick={() => nav('/new')}
          >
            <Plus size={20} />새 글 쓰기
          </Button>
        }
      />

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="전체 게시글"
          count={posts.length}
          icon={FileText}
          variant="blue"
        />
        <StatsCard
          title="오늘 올라온 글"
          count={todayPostsCount}
          icon={Zap}
          variant="orange"
          highlight={true}
        />
        <StatsCard
          title="활동 멤버"
          count={activeMemberCount}
          icon={Users}
          variant="green"
        />
      </div>

      {/* 게시글 목록 영역 */}
      {isPostInitialLoading && page === 0 ? (
        <div className="py-20 text-center">초기 로드 중...</div>
      ) : (
        <>
          <PostList
            posts={filteredPosts}
            searchComponent={<SearchBar onSearch={setKeyword} />}
          />

          {/* 무한 스크롤 트리거 */}
          <div
            ref={observerRef}
            className="py-10 text-center text-sm text-gray-400"
          >
            {isFetching
              ? '불러오는 중...'
              : !hasMore
                ? '마지막 페이지입니다.'
                : ''}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
