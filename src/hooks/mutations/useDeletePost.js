import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as postApi from '../../api/postApi.js';
import { handleError } from '../../utils/errorHandler.js';

const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => postApi.softDeletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err) => handleError('게시글 삭제에 실패했습니다.', err),
  });
};

export default useDeletePost;
