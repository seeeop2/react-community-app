import React from 'react';

const PostDetailSkeleton = () => {
  return (
    <div className="mx-auto max-w-2xl animate-pulse p-5 md:p-12">
      {/* 뒤로가기 버튼 자리 */}
      <div className="mb-6 h-6 w-32 rounded bg-slate-100" />

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:rounded-3xl md:p-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100" />
            {/* 아바타 */}
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-slate-100" /> {/* 이름 */}
              <div className="h-3 w-24 rounded bg-slate-50" /> {/* 날짜 */}
            </div>
          </div>
          <div className="h-6 w-16 rounded-full bg-slate-100" /> {/* 배지 */}
        </div>
        {/* 제목 */}
        <div className="mb-6 h-10 w-3/4 rounded bg-slate-100 md:mb-8 md:h-12" />

        {/* 본문 줄 영역 */}
        <div className="mb-8 space-y-4">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-5/6 rounded bg-slate-100" />
        </div>

        {/* 좋아요 버튼 영역 스켈레톤 */}
        <div className="flex flex-col items-center border-t border-slate-50 py-8">
          <div className="h-14 w-14 rounded-full bg-slate-50" />
          {/* 하트 원형 */}
          <div className="mt-2.5 h-3 w-8 rounded bg-slate-50" /> {/* 숫자 */}
        </div>
      </div>
    </div>
  );
};

export default PostDetailSkeleton;
