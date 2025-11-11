import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as commentApi from '../../api/commentApi.js';
import { handleError } from '../../utils/errorHandler.js';

export const useDeleteComment = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => commentApi.deleteComment(commentId),
    onSuccess: () => {
      // 해당 게시글의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: (err) => handleError('댓글 삭제에 실패했습니다.', err),
  });
};
