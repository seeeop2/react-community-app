import { useEffect, useState } from 'react';
import * as postApi from '../api/postApi.js';
import { handleError } from '../utils/errorHandler.js';

const usePost = (id) => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null); // 새로운 요청을 시작할 때 이전 에러 초기화
        const data = await postApi.getPostById(id);

        if (!data) {
          throw new Error('존재하지 않는 게시글입니다.');
        }

        setPost(data);
      } catch (err) {
        handleError('상세 데이터 로드에 실패했습니다.', err);
        setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  return { post, isLoading, error };
};

export default usePost;
