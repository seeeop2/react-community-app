import { useInfiniteQuery } from '@tanstack/react-query';
import * as postApi from '../../api/postApi.js';

const usePosts = ({ userId, type }) => {
  // 게시글 목록 조회 (무한 스크롤)
  const postsQuery = useInfiniteQuery({
    queryKey: ['posts', userId, type],
    queryFn: ({ pageParam = 0 }) => {
      switch (type) {
        case 'likes': // 내가 좋아요 한 목록 API 호출
          return postApi.getLikedPosts(pageParam, userId);
        case 'comments': // 내가 댓글 단 목록 API 호출
          return postApi.getCommentedPosts(pageParam, userId);
        default: // 내가 작성한 글 목록 API 호출
          return postApi.getPosts(pageParam, { authorId: userId });
      }
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
