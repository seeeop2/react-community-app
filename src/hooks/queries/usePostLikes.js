import { useQuery } from '@tanstack/react-query';
import { getLikesByPostId } from '../../api/likeApi.js';

export const usePostLikes = (postId, userId) => {
  const { data: likes = [], isLoading } = useQuery({
    queryKey: ['likes', 'post', postId],
    queryFn: () => getLikesByPostId(postId),
    enabled: !!postId, // postId가 없을 때는 쿼리를 실행하지 않도록 설정
  });

  const isLiked = likes.some((like) => like.user_id === userId);
  const likeCount = likes.length;

  return { likes, isLiked, likeCount, isLoading };
};
