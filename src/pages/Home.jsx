import React, { useCallback, useEffect, useRef, useState } from 'react';
import StatsCard from '../components/StatsCard.jsx';
import { FileText, Plus, Users, Zap } from 'lucide-react';
import Header from '../components/Header.jsx';
import PostList from '../components/PostList.jsx';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import usePosts from '../hooks/queries/usePosts.js';
import * as postApi from '../api/postApi.js';
import { handleError } from '../utils/errorHandler.js';
import * as userApi from '../api/userApi.js';
import Spinner from '../components/Spinner.jsx';
import {
  DEFAULT_CATEGORY,
  FILTER_CATEGORIES,
} from '../constants/categories.js';
import useAuth from '../hooks/useAuth.js';
import SearchBar from '../components/SearchBar.jsx';

const Home = () => {
  // Hooks
  const nav = useNavigate();

  // States (필터/검색 관련) & Refs
  const observerRef = useRef(); // 바닥 감지용
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [orderBy, setOrderBy] = useState('created_at'); // 기본값 최신순
  const [stats, setStats] = useState({
    totalPosts: 0,
    todayPosts: 0,
    activeUserCount: 0,
  });

  // Custom Hooks
  const { profile } = useAuth();
  const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts({ keyword, category: selectedCategory, orderBy });

  // Sync / Derived
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
    setKeyword(''); // 카테고리 변경 시 검색어 초기화
  };

  const handleNewPost = () => {
    if (!profile) {
      if (
        window.confirm(
          '로그인이 필요한 기능입니다. 로그인 페이지로 이동할까요?'
        )
      ) {
        nav('/auth');
      }
      return;
    }
    nav('/new');
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
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
    <div className="mx-auto max-w-7xl p-6 md:p-12">
      <Header
        badge="Community"
        title="Company"
        highlightTitle="Board"
        description="자유롭게 의견을 나누는 공간입니다."
        action={
          <Button fontWeight="bold" fullWidth={true} onClick={handleNewPost}>
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

      <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-4">
        <div className="flex-1">
          <SearchBar onSearch={setKeyword} value={keyword} />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <select
            value={orderBy}
            onChange={handleOrderChange}
            className="cursor-pointer bg-transparent text-sm font-semibold text-slate-600 outline-none transition-colors hover:text-blue-600"
          >
            <option value="created_at">최신순</option>
            <option value="like_count">좋아요순</option>
            <option value="comment_count">댓글순</option>
          </select>
        </div>
      </div>

      {/* 게시글 목록 영역 */}
      {isLoading && !isFetchingNextPage ? (
        <div className="py-20 text-center text-gray-500">
          데이터를 불러오는 중입니다...
        </div>
      ) : (
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
