import { useQuery } from '@tanstack/react-query';
import * as userApi from '../api/userApi.js';

const useProfile = (userId) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userApi.getProfileById(userId),
    enabled: !!userId, // 세션(userId)이 있을 때만 실행
    staleTime: 1000 * 60 * 30, // 프로필은 자주 안 바뀌니 30분 정도 캐싱
  });
};

export default useProfile;
