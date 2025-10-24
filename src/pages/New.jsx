import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PostEditor from '../components/PostEditor.jsx';
import Button from '../components/Button.jsx';
import usePosts from '../hooks/usePosts.js';

const New = () => {
  const { createPost } = usePosts();
  const nav = useNavigate();

  const handleSubmit = async (input) => {
    try {
      await createPost({ ...input });
      nav('/', { replace: true });
    } catch (error) {
      console.error('제출 중 에러 발생:', error);
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 목록으로 돌아갈까요?')) {
      nav('/');
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-12">
      <Button variant="ghost" onClick={handleCancel} className="mb-8">
        <ArrowLeft size={20} /> 목록으로 돌아가기
      </Button>

      <h2 className="mb-8 text-3xl font-extrabold">새 글 쓰기</h2>
      <PostEditor submitButtonText="작성 완료하기" onSubmit={handleSubmit} />
    </div>
  );
};

export default New;
