import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CATEGORY_MAP } from '../constants/categories.js';
import { ArrowLeft, Calendar, Edit3, Tag, Trash2 } from 'lucide-react';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import usePost from '../hooks/usePost.js';
import useAuth from '../hooks/useAuth.js';
import useDeletePost from '../hooks/useDeletePost.js';

const PostDetail = () => {
  // Hooks
  const { id } = useParams();
  const nav = useNavigate();

  // Custom Hooks
  const { user } = useAuth();
  const { data: post, isLoading, isError } = usePost(id);
  const { mutateAsync: removePost, isPending: isRemoving } = useDeletePost();

  // Early Return (데이터 로드 전)
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
        <p className="mb-4 text-gray-500">
          게시글을 찾을 수 없거나 삭제되었습니다.
        </p>
        <Button onClick={() => nav('/')}>목록으로 돌아가기</Button>
      </div>
    );
  }

  // Sync / Derived
  // 가져온 데이터 가공 및 변수 할당
  const isAuthor = user?.id === post.author_id;
  const formattedDate = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Event Handler
  const onClickDelete = async () => {
    if (
      window.confirm('정말 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.')
    ) {
      try {
        await removePost(post.id); // 비동기 작업 시 await
        nav('/', { replace: true });
      } catch (error) {}
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-12">
      <Button variant="ghost" className="mb-8 px-0" onClick={() => nav('/')}>
        <ArrowLeft size={20} /> 목록으로 돌아가기
      </Button>

      <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
          <Badge size="sm" fontWeight="bold">
            <Tag size={14} /> {CATEGORY_MAP[post.category]}
          </Badge>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Calendar size={14} /> {formattedDate}
          </div>
        </div>

        <h1 className="mb-8 text-4xl font-extrabold leading-tight text-gray-900">
          {post.title}
        </h1>

        <div className="min-h-[300px] whitespace-pre-wrap text-lg leading-relaxed text-gray-700">
          {post.content}
        </div>

        {isAuthor && (
          <div className="mt-12 flex justify-end gap-3 border-t border-gray-100 pt-8">
            <Button variant="ghost" onClick={() => nav(`/edit/${post.id}`)}>
              <Edit3 size={16} /> 수정
            </Button>

            <Button
              variant="dangerGhost"
              loading={isRemoving}
              onClick={onClickDelete}
            >
              <Trash2 size={16} /> 삭제
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
