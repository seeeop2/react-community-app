import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PostEditor from '../components/PostEditor.jsx';
import Button from '../components/Button.jsx';
import usePost from '../hooks/queries/usePost.js';
import useAuth from '../hooks/useAuth.js';
import { useUpdatePost } from '../hooks/mutations/useUpdatePost.js';

const Edit = () => {
  // Hooks
  const { id } = useParams();
  const nav = useNavigate();

  // Custom Hooks
  const { user } = useAuth();
  const { mutateAsync: editPost, isPending: isEditing } = useUpdatePost();

  const { data: post, isLoading, isError } = usePost(id);

  // Early Return 첫 번째 (데이터 로드 전)
  if (isLoading) {
    return (
      <div className="py-20 text-center text-lg text-gray-500">
        데이터를 불러오는 중...
      </div>
    );
  }

  if (!post || isError) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-gray-500">게시글을 찾을 수 없습니다.</p>
        <Button onClick={() => nav('/')}>홈으로 돌아가기</Button>
      </div>
    );
  }

  // Event Handler
  const handleSubmit = async (input) => {
    await editPost({
      id,
      fields: {
        title: input.title,
        content: input.content,
        category: input.category,
      },
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

  // Early Return 두 번째 (데이터 로드 후)
  if (user && post.author_id !== user.id) {
    alert('본인의 글만 수정할 수 있습니다.');
    nav('/', { replace: true });
    return null; // 리다이렉트 중 렌더링 방지
  }

  return (
    <div className="mx-auto max-w-2xl p-5 md:p-12">
      <Button variant="ghost" onClick={handleCancel} className="mb-8 px-0">
        <ArrowLeft size={20} /> 이전으로 돌아가기
      </Button>
      <h2 className="mb-6 text-2xl font-extrabold md:mb-8 md:text-3xl">
        글 수정하기
      </h2>
      <PostEditor
        initData={post}
        submitButtonText="수정 완료하기"
        onSubmit={handleSubmit}
        isSubmitting={isEditing}
      />
    </div>
  );
};

export default Edit;
