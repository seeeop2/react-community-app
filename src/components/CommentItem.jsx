import React, { useState } from 'react';
import { Clock, User } from 'lucide-react';

const CommentItem = ({ comment }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex gap-4">
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
          <span className="text-sm font-bold text-slate-800">
            {comment.author?.username || '알 수 없음'}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock size={12} />
            {new Date(comment.created_at).toLocaleDateString()}
          </div>
        </div>
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-600">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

export default CommentItem;
