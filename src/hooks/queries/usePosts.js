import { useInfiniteQuery } from '@tanstack/react-query';
import * as postApi from '../../api/postApi.js';

const usePosts = (filters) => {
  // 게시글 목록 조회 (무한 스크롤)
  const postsQuery = useInfiniteQuery({
    queryKey: ['posts', filters],
    queryFn: ({ pageParam = 0 }) => {
      // 'isLikedTab' 필터가 들어오면 내가 좋아요 한 목록 API 호출
      if (filters.isLikedTab) {
        return postApi.getLikedPosts(pageParam, filters.userId);
      }

      return postApi.getPosts(pageParam, {
        ...filters,
        authorId: filters.userId,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      // 페이지당 10개라고 가정할 때, 데이터가 없거나 부족하면 끝
      return !lastPage || lastPage.length < 10 ? undefined : allPages.length;
    },
  });

  return {
    posts: postsQuery.data?.pages.flat() || [],
    isLoading: postsQuery.isLoading,
    isFetchingNextPage: postsQuery.isFetchingNextPage,
    hasNextPage: postsQuery.hasNextPage,
    fetchNextPage: postsQuery.fetchNextPage,
    refetch: postsQuery.refetch,
  };
};

export default usePosts;
