import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as commentApi from '../../api/commentApi.js';
import { handleError } from '../../utils/errorHandler.js';

export const useUpdateComment = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }) =>
      commentApi.updateComment(commentId, content),
    onSuccess: () => {
      // 현재 게시글의 댓글 목록만 새로고침
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: (err) => handleError('댓글 수정에 실패했습니다.', err),
  });
};
