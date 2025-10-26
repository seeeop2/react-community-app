import { useEffect, useState } from 'react';
import * as userApi from '../api/userApi.js';
import { handleError } from '../utils/errorHandler.js';

const useUserProfile = (userId) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null); // 새로운 요청을 시작할 때 이전 에러 초기화
        const data = await userApi.getProfileById(userId);

        if (!data) {
          throw new Error('존재하지 않는 사용자입니다.');
        }

        setUser(data);
      } catch (err) {
        handleError('사용자 정보를 불러오는데 실패했습니다.', err);
        setError(err.message || '데이터 로드 중 오류 발생');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, isLoading, error };
};

export default useUserProfile;
