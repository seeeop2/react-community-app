import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CATEGORY_MAP } from '../constants/categories.js';
import {
  ArrowLeft,
  Calendar,
  Edit3,
  Heart,
  Tag,
  Trash2,
  User,
} from 'lucide-react';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import usePost from '../hooks/queries/usePost.js';
import useAuth from '../hooks/useAuth.js';
import useDeletePost from '../hooks/mutations/useDeletePost.js';
import CommentInput from '../components/CommentInput.jsx';
import CommentList from '../components/CommentList.jsx';
import { useToggleLike } from '../hooks/mutations/useToggleLike.js';
import { usePostLikes } from '../hooks/queries/usePostLikes.js';
import { cn } from '../utils/cn.js';

const PostDetail = () => {
  // Hooks
  const { id } = useParams();
  const nav = useNavigate();

  // Custom Hooks
  const { user } = useAuth();
  const { data: post, isLoading, isError } = usePost(id);
  const { mutateAsync: removePost, isPending: isRemoving } = useDeletePost();
  const {
    isLiked,
    likeCount,
    isLoading: isLikesLoading,
  } = usePostLikes(id, user?.id);
  const { mutate: toggleLike, isPending: isLikeUpdating } = useToggleLike(id);

  // States & Refs
  const [imageError, setImageError] = useState(false);

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

  const handleLikeClick = () => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    toggleLike({
      postId: post.id,
      userId: user.id,
      isLiked,
    });
  };

  return (
    <div className="mx-auto max-w-2xl p-5 md:p-12">
      <Button variant="ghost" className="mb-6 px-0" onClick={() => nav('/')}>
        <ArrowLeft size={20} /> 목록으로 돌아가기
      </Button>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:rounded-3xl md:p-10">
        <div className="mb-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            {/* 아바타 */}
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm">
              {post.author?.avatar_url && !imageError ? (
                <img
                  src={post.author.avatar_url}
                  className="h-full w-full object-cover"
                  alt={post.author.username}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400">
                  <User size={22} />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-slate-800">
                {post.author?.username || '알 수 없음'}
              </span>

              {/* 날짜 */}
              <div className="flex items-center gap-1 text-[12px] font-medium text-gray-400">
                <Calendar size={12} /> {formattedDate}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Badge size="sm" variant="blue" fontWeight="bold">
              <Tag size={14} /> {CATEGORY_MAP[post.category]}
            </Badge>
          </div>
        </div>

        <h1 className="mb-6 text-2xl font-extrabold leading-tight text-gray-900 md:mb-8 md:text-4xl">
          {post.title}
        </h1>

        <div className="min-h-[160px] whitespace-pre-wrap text-[16px] leading-relaxed text-gray-700 md:min-h-[300px] md:text-lg">
          {post.content}
        </div>

        {/* 좋아요 버튼 */}
        <div className="flex justify-center border-b border-t border-gray-50">
          <button
            onClick={handleLikeClick}
            disabled={isLikeUpdating}
            className={cn(
              'flex flex-col items-center gap-2 transition-all duration-300',
              isLiked
                ? 'scale-105 text-red-500'
                : 'text-slate-400 hover:text-red-400'
            )}
          >
            <div
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all',
                isLiked
                  ? 'border-red-100 bg-red-50'
                  : 'border-slate-100 bg-slate-50'
              )}
            >
              <Heart
                size={28}
                fill={isLiked ? 'currentColor' : 'none'}
                className={isLikeUpdating ? 'animate-pulse' : ''}
              />
            </div>
            <span className="text-sm font-bold">
              {isLikesLoading ? '...' : likeCount}
            </span>
          </button>
        </div>

        {isAuthor && (
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-6 md:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => nav(`/edit/${post.id}`)}
            >
              <Edit3 size={16} /> 수정
            </Button>

            <Button
              variant="dangerGhost"
              size="sm"
              loading={isRemoving}
              onClick={onClickDelete}
            >
              <Trash2 size={16} /> 삭제
            </Button>
          </div>
        )}
      </div>

      <section className="mt-8 border-t border-slate-100 pt-8 md:mt-12">
        <h3 className="mb-6 text-lg font-bold text-slate-900 md:text-xl">
          댓글
        </h3>
        <CommentInput postId={id} />
        <CommentList postId={id} />
      </section>
    </div>
  );
};

export default PostDetail;
