import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike } from '../../api/likeApi.js';
import { handleError } from '../../utils/errorHandler.js';

export const useToggleLike = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      // 해당 게시글의 좋아요 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['likes', 'post', postId] });
      // 전체 게시글 캐시 무효화 (Home 페이지 내 좋아요 수 업데이트를 위해)
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      handleError('좋아요 처리 중 오류가 발생했습니다.', error);
    },
  });
};
