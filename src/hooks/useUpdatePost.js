import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as postApi from '../api/postApi.js';
import { handleError } from '../utils/errorHandler.js';

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, fields }) => postApi.updatePost(id, fields),
    onSuccess: (data, variables) => {
      // 전체 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // 특정 게시글 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
    },
    onError: (err) => handleError('게시글 수정에 실패했습니다.', err),
  });
};
