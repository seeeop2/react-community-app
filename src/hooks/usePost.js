import * as postApi from '../api/postApi.js';
import { useQuery } from '@tanstack/react-query';

const usePost = (id) => {
  return useQuery({
    queryKey: ['post', id], // ID별로 따로 캐싱
    queryFn: () => postApi.getPostById(id),
    enabled: !!id, // ID가 있을 때만 쿼리를 실행 (조건부 실행)
    staleTime: 1000 * 60 * 5, // 5분간 데이터를 Fresh 하다고 판단
  });
};

export default usePost;
