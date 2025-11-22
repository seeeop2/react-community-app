import * as postApi from '../../api/postApi.js';
import { useQuery } from '@tanstack/react-query';

const useUserStats = (userId) => {
  // 내 게시글 수
  const postCountQuery = useQuery({
    queryKey: ['userStats', 'posts', userId],
    queryFn: () => postApi.getUserPostCount(userId),
    enabled: !!userId, // userId가 있을 때만 쿼리를 실행하도록 설정
  });

  // 좋아요 한 글 수
  const likedCountQuery = useQuery({
    queryKey: ['userStats', 'likes', userId],
    queryFn: () => postApi.getLikedPostCount(userId),
    enabled: !!userId, // userId가 있을 때만 쿼리를 실행하도록 설정
  });

  // 내가 댓글 단 게시글 수
  const commentedCountQuery = useQuery({
    queryKey: ['userStats', 'comments', userId],
    queryFn: () => postApi.getCommentedPostCount(userId),
    enabled: !!userId, // userId가 있을 때만 쿼리를 실행하도록 설정
  });

  return {
    totalCount: postCountQuery.data ?? 0,
    likedCount: likedCountQuery.data ?? 0,
    commentedCount: commentedCountQuery.data ?? 0,
    isLoading:
      postCountQuery.isLoading ||
      likedCountQuery.isLoading ||
      commentedCountQuery.isLoading,
  };
};

export default useUserStats;
