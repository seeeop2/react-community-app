import { useQuery } from '@tanstack/react-query';
import * as commentApi from '../../api/commentApi.js';

const useComments = (postId) => {
  return useQuery({
    queryKey: ['comments', postId], // 게시글 ID별로 캐시 따로 관리
    queryFn: () => commentApi.getComments(postId),
    enabled: !!postId, // postId가 있을 때만 실행
  });
};

export default useComments;
