import React from 'react';

const CommentItemSkeleton = () => {
  return (
    <div className="flex animate-pulse gap-4">
      {/* 아바타 영역 스켈레톤 */}
      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-100" />

      {/* 내용 영역 스켈레톤 */}
      <div className="flex-1 border-b border-slate-50 pb-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 rounded bg-slate-100" /> {/* 이름 */}
            <div className="h-3 w-10 rounded bg-slate-50" />
            {/* (수정됨) 자리 */}
          </div>
          <div className="h-3 w-16 rounded bg-slate-50" /> {/* 시간 정보 */}
        </div>

        {/* 댓글 본문 스켈레톤 */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-2/3 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
};

export default CommentItemSkeleton;
