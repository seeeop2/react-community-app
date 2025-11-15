import React, { useState } from 'react';
import { Edit2, MessageSquare, Trash2, User } from 'lucide-react';
import { CATEGORY_MAP } from '../constants/categories.js';
import { useNavigate } from 'react-router-dom';
import Badge from './Badge.jsx';
import useAuth from '../hooks/useAuth.js';
import useDeletePost from '../hooks/mutations/useDeletePost.js';
import { cn } from '../utils/cn.js';

const PostItem = ({ post }) => {
  // Hooks
  const nav = useNavigate();

  // Custom Hooks
  const { user, isAdmin } = useAuth();
  const { mutateAsync: removePost, isPending: isRemoving } = useDeletePost();

  // States & Refs
  const [imageError, setImageError] = useState(false);

  // Sync / Derived
  // 권한 체크 변수
  const isAuthor = user?.id === post.author_id; // 내가 쓴 글인가?
  const canEdit = isAuthor; // 수정은 '글쓴이'만 가능
  const canDelete = isAuthor || isAdmin; // 삭제는 '글쓴이' 혹은 '관리자' 가능

  // Event Handler
  const handleNavigateDetail = () => {
    nav(`/post/${post.id}`);
  };

  const handleNavigateEdit = (e) => {
    e.stopPropagation();
    nav(`/edit/${post.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (
      window.confirm('정말 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.')
    ) {
      await removePost(post.id);
      alert('삭제되었습니다.');
    }
  };

  return (
    <tr
      className="group flex cursor-pointer flex-col border-b border-slate-50 p-5 transition-all hover:bg-blue-50/30 md:table-row md:border-none md:p-0"
      onClick={handleNavigateDetail}
    >
      {/* 제목 및 메타 정보 영역 */}
      <td className="w-full min-w-0 px-0 py-0 md:w-full md:px-8 md:py-5">
        <div className="flex min-w-0 items-start gap-0 md:items-center md:gap-4">
          {/* 아이콘 박스 */}
          <div className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white md:flex">
            <MessageSquare size={18} />
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-[15px] font-semibold text-slate-800 transition-colors group-hover:text-blue-600 md:text-base">
              {post.title}
            </p>

            {/* 카테고리, 댓글, 날짜 */}
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <Badge
                variant="gray"
                shape="rounded"
                size="xxs"
                fontWeight="bold"
              >
                {CATEGORY_MAP[post.category]}
              </Badge>

              {/* 댓글 수 표시 */}
              <div
                className={cn(
                  'flex items-center gap-1 text-[11px] font-bold',
                  post.comment_count > 0 ? 'text-blue-500' : 'text-slate-400'
                )}
              >
                <MessageSquare
                  size={12}
                  fill="currentColor"
                  fillOpacity={post.comment_count > 0 ? 0.1 : 0}
                />
                <span>{post.comment_count}</span>
              </div>

              <span className="text-[10px] text-slate-400">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* 작성자 영역 */}
      <td className="mt-3 px-0 py-0 text-sm font-medium text-slate-600 md:mt-0 md:w-48 md:px-8 md:py-5">
        <div className="flex items-center gap-2 pl-0 md:pl-0">
          {/* 아바타 이미지 */}
          <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
            {post.author?.avatar_url && !imageError ? (
              <img
                src={post.author.avatar_url}
                className="h-full w-full object-cover"
                alt={post.author.username}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                <User size={14} />
              </div>
            )}
          </div>

          <span>{post.author?.username || '알 수 없음'}</span>
        </div>
      </td>
      {/* 관리 버튼 */}
      <td className="hidden px-8 py-5 md:table-cell">
        <div className="flex translate-x-1 justify-end gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          {canEdit && (
            <button
              className="p-2 text-slate-400 transition-colors hover:text-blue-600"
              onClick={handleNavigateEdit}
            >
              <Edit2 size={16} />
            </button>
          )}
          {canDelete && (
            <button
              className="p-2 text-slate-400 transition-colors hover:text-red-500"
              disabled={isRemoving}
              onClick={handleDelete}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default PostItem;
