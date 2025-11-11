import React, { useState } from 'react';
import { Clock, Edit2, Trash2, User } from 'lucide-react';
import { formatRelativeTime } from '../utils/date.js';
import useAuth from '../hooks/useAuth.js';
import { useUpdateComment } from '../hooks/mutations/useUpdateComment.js';
import { useDeleteComment } from '../hooks/mutations/useDeleteComment.js';

const CommentItem = ({ comment, postId }) => {
  // Custom Hooks
  const { user, isAdmin } = useAuth();
  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateComment(postId);
  const { mutate: deleteComment } = useDeleteComment(postId);

  // States & Refs
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [imageError, setImageError] = useState(false);

  // Sync / Derived
  // 권한 체크 변수
  const isMyComment = user?.id === comment.author_id;
  const canEdit = isMyComment; // 수정은 '댓글 작성자'만 가능
  const canDelete = isMyComment || isAdmin; // 삭제는 '댓글 작성자' 혹은 '관리자' 가능

  // Event Handler
  const handleInputChange = (e) => {
    setEditContent(e.target.value);
  };

  const handleUpdate = () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }
    updateComment(
      {
        commentId: comment.id,
        content: editContent,
      },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm('해당 댓글을 삭제하시겠습니까?')) {
      deleteComment(comment.id);
    }
  };

  return (
    <div className="group flex gap-4">
      {/* 아바타 영역 */}
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-50">
        {comment.author?.avatar_url && !imageError ? (
          <img
            src={comment.author.avatar_url}
            className="h-full w-full object-cover"
            alt={comment.author.username}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <User size={20} />
          </div>
        )}
      </div>

      {/* 내용 영역 */}
      <div className="flex-1 border-b border-slate-50 pb-6">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">
              {comment.author?.username || '알 수 없음'}
            </span>

            {comment.is_edited && (
              <span className="text-[10px] font-medium text-slate-400">
                (수정됨)
              </span>
            )}

            {/* 수정 중이 아닐 때만 '수정' 버튼 보여줌 */}
            {!isEditing && (
              <div className="flex items-center opacity-0 transition-all duration-200 group-hover:opacity-100">
                {/* 수정 버튼: 오직 본인만! */}
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-md p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-500"
                    title="댓글 수정"
                  >
                    <Edit2 size={13} />
                  </button>
                )}

                {/* 삭제 버튼: 댓글 작성자 또는 관리자 */}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    title="댓글 삭제"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 시간 정보 */}
          <div className="flex select-none items-center gap-1 text-[11px] text-slate-400">
            <Clock size={12} />
            {formatRelativeTime(comment.created_at)}
          </div>
        </div>

        {/* 수정 모드 분기 처리 */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              className="w-full resize-none rounded-lg border border-slate-200 p-2 text-sm focus:border-blue-400 focus:ring-0"
              value={editContent}
              onChange={handleInputChange}
              rows="2"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-slate-400"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="text-xs font-bold text-blue-600"
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-600">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
