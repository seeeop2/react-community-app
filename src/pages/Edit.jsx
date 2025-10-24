import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PostEditor from '../components/PostEditor.jsx';
import Button from '../components/Button.jsx';
import usePost from '../hooks/usePost.jsx';
import usePosts from '../hooks/usePosts.js';

const Edit = () => {
  const { id } = useParams();
  const { editPost } = usePosts();
  const nav = useNavigate();

  const { post, isLoading } = usePost(id);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const handleSubmit = async (input) => {
    await editPost(id, {
      title: input.title,
      content: input.content,
      category: input.category,
    });
    nav(`/post/${id}`, { replace: true });
  };

  const handleCancel = () => {
    if (
      window.confirm('수정 중인 내용이 사라집니다. 이전 페이지로 돌아갈까요?')
    ) {
      nav(-1);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-12">
      <Button variant="ghost" onClick={handleCancel} className="mb-8 px-0">
        <ArrowLeft size={20} /> 이전으로 돌아가기
      </Button>
      <h2 className="mb-8 text-3xl font-extrabold">글 수정하기</h2>
      <PostEditor
        initData={post}
        submitButtonText="수정 완료하기"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Edit;
