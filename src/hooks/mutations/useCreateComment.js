import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as commentApi from '../../api/commentApi.js';
import { handleError } from '../../utils/errorHandler.js';
import useAuth from '../useAuth.js';

const useCreateComment = (postId) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (content) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      return commentApi.createComment({
        post_id: postId,
        author_id: user.id,
        content,
      });
    },
    onSuccess: () => {
      // 댓글 작성이 성공하면 해당 게시글의 댓글 목록만 새로고침
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });

      // 게시글 목록의 댓글 카운트를 위해 posts 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      // 알림 목록 새로고침을 위해 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err) => handleError('댓글 작성에 실패했습니다.', err),
  });
};

export default useCreateComment;
