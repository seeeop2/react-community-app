import React, { useCallback, useEffect, useRef, useState } from 'react';
import StatsCard from '../components/StatsCard.jsx';
import { FileText, Plus, Users, Zap } from 'lucide-react';
import Header from '../components/Header.jsx';
import PostList from '../components/PostList.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import usePosts from '../hooks/usePosts.js';
import * as postApi from '../api/postApi.js';
import { handleError } from '../utils/errorHandler.js';
import * as userApi from '../api/userApi.js';
import { FILTER_CATEGORIES } from '../constants/categories.js';

const Home = () => {
  const { posts = [], isLoading: isPostInitialLoading, refetch } = usePosts();
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stats, setStats] = useState({
    totalPosts: 0,
    todayPosts: 0,
    activeUserCount: 0,
  });

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const observerRef = useRef(); // 바닥 감지용
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

  // 바닥 감지
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

  // 초기 1회 전체/오늘 게시글 및 활동 유저 카운트를 가져옴
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postStats, userCount] = await Promise.all([
          postApi.getPostStats(),
          userApi.getActiveUserCount(),
        ]);
        setStats({
          ...postStats,
          activeUserCount: userCount,
        });
      } catch (error) {
        handleError('통계 데이터 로드에 실패했습니다.', error);
      }
    };
    fetchStats();
  }, []);

  // 검색어 + 카테고리 필터링
  const filteredPosts = posts.filter((post) => {
    const matchesKeyword = post.title
      .toLowerCase()
      .includes(keyword.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || post.category === selectedCategory;

    return matchesKeyword && matchesCategory;
  });

  // 카테고리 변경 시
  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
  };

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

      {/* 상단 통계 영역 */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="전체 게시글"
          count={stats.totalPosts}
          icon={FileText}
          variant="blue"
        />
        <StatsCard
          title="오늘 올라온 글"
          count={stats.todayPosts}
          icon={Zap}
          variant="orange"
          highlight={true}
        />
        <StatsCard
          title="활동 멤버"
          count={stats.activeUserCount}
          icon={Users}
          variant="green"
        />
      </div>

      {/* 카테고리 칩 필터 영역 */}
      <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto pb-2">
        {FILTER_CATEGORIES.map((category) => (
          <div key={category.value}>
            <Button
              variant="chip"
              isSelected={selectedCategory === category.value}
              size="chip"
              fontWeight="semiBold"
              shape="pill"
              onClick={() => handleCategoryChange(category.value)}
            >
              {category.label}
            </Button>
          </div>
        ))}
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
