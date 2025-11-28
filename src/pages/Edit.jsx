import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import PostEditor from '../components/PostEditor.jsx';
import Button from '../components/Button.jsx';
import usePost from '../hooks/queries/usePost.js';
import useAuth from '../hooks/useAuth.js';
import { useUpdatePost } from '../hooks/mutations/useUpdatePost.js';
import PostEditorSkeleton from '../components/skeletons/PostEditorSkeleton.jsx';
import toast from 'react-hot-toast';

const Edit = () => {
  // Hooks
  const { id } = useParams();
  const nav = useNavigate();

  // Custom Hooks
  const { user, isLoading: isAuthLoading } = useAuth();
  const { mutateAsync: editPost, isPending: isEditing } = useUpdatePost();
  const { data: post, isLoading: isPostLoading, isError } = usePost(id);

  // Sync / Derived
  // 통합 로딩 상태 (인증 확인 중이거나 게시글 로딩 중일 때)
  const showSkeleton = isAuthLoading || isPostLoading;

  // Early Return
  if (!showSkeleton && (!post || isError)) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 md:py-32">
        {/* 아이콘 */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-50 p-6 text-red-400">
            <AlertCircle size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-800">
            게시글을 찾을 수 없습니다.
          </h2>
          <p className="mb-10 text-slate-500">
            삭제된 게시글이거나 잘못된 접근입니다.
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex w-full justify-center">
          <Button
            onClick={() => nav('/')}
            variant="ghost"
            fontWeight="bold"
            className="min-w-[160px] py-3"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // 권한 확인 (데이터가 확실히 있을 때만 실행)
  if (!showSkeleton && user && post && post.author_id !== user.id) {
    toast.error('본인의 글만 수정할 수 있습니다.', {
      id: 'edit-denied',
    });
    nav('/', { replace: true });
    return null; // 리다이렉트 중 렌더링 방지
  }

  // Event Handler
  const handleSubmit = async (input) => {
    try {
      await editPost({
        id,
        fields: {
          title: input.title,
          content: input.content,
          category: input.category,
        },
      });
      toast.success('수정이 완료되었습니다!');
      nav(`/post/${id}`, { replace: true });
    } catch (error) {}
  };

  const handleCancel = () => {
    if (
      window.confirm('수정 중인 내용이 사라집니다. 이전 페이지로 돌아갈까요?')
    ) {
      nav(-1);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-5 md:p-12">
      <Button variant="ghost" onClick={handleCancel} className="mb-8 px-0">
        <ArrowLeft size={20} /> 이전으로 돌아가기
      </Button>
      <h2 className="mb-6 text-2xl font-extrabold md:mb-8 md:text-3xl">
        글 수정하기
      </h2>

      {showSkeleton ? (
        <PostEditorSkeleton />
      ) : (
        <PostEditor
          initData={post}
          submitButtonText="수정 완료하기"
          onSubmit={handleSubmit}
          isSubmitting={isEditing}
        />
      )}
    </div>
  );
};

export default Edit;
