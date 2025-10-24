import { useContext } from 'react';
import { PostContext } from '../context/PostProvider.jsx';

const usePosts = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error('usePosts는 반드시 PostProvider 내부에서 사용해야 합니다.');
  }

  return context;
};

export default usePosts;
