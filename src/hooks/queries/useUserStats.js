import * as postApi from '../../api/postApi.js';
import { useQuery } from '@tanstack/react-query';

const useUserStats = (userId) => {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: () => postApi.getUserPostCount(userId),
    enabled: !!userId, // userId가 있을 때만 쿼리를 실행하도록 설정
  });
};

export default useUserStats;
