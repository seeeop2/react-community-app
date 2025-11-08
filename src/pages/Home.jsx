import React, { useCallback, useEffect, useRef, useState } from 'react';
import StatsCard from '../components/StatsCard.jsx';
import { FileText, Plus, Users, Zap } from 'lucide-react';
import Header from '../components/Header.jsx';
import PostList from '../components/PostList.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import usePosts from '../hooks/queries/usePosts.js';
import * as postApi from '../api/postApi.js';
import { handleError } from '../utils/errorHandler.js';
import * as userApi from '../api/userApi.js';
import Spinner from '../components/Spinner.jsx';
import { FILTER_CATEGORIES } from '../constants/categories.js';

const Home = () => {
  // Hooks
  const nav = useNavigate();

  // Custom Hooks
  const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts();

  // States (필터/검색 관련) & Refs
  const observerRef = useRef(); // 바닥 감지용
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stats, setStats] = useState({
    totalPosts: 0,
    todayPosts: 0,
    activeUserCount: 0,
  });

  // Sync / Derived
  // 검색어 + 카테고리 필터링
  const filteredPosts = posts.filter((post) => {
    const matchesKeyword = post.title
      .toLowerCase()
      .includes(keyword.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || post.category === selectedCategory;

    return matchesKeyword && matchesCategory;
  });

  // 다음 페이지 데이터 로드 함수
  const loadMorePosts = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Event Handler
  // 카테고리 변경 시
  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
  };

  // useEffect
  // 바닥 감지
  useEffect(() => {
    // 초기 로딩 중에는 Observer를 붙이지 않고 기다림
    if (isLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // 요소가 화면에 나타나고, 데이터가 더 있고, 현재 로딩 중이 아닐 때
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
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
  }, [loadMorePosts, hasNextPage, isFetchingNextPage, isLoading]);

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
      {isLoading ? (
        <div className="py-20 text-center text-gray-500">
          데이터를 불러오는 중입니다...
        </div>
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
            {isFetchingNextPage ? (
              <div className="flex items-center justify-center gap-3">
                <Spinner variant="secondary" size="md" />
                <span className="font-medium text-slate-600">
                  불러오는 중...
                </span>
              </div>
            ) : !hasNextPage ? (
              '모든 게시글을 다 읽으셨습니다.'
            ) : (
              ''
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
