import React from 'react';

const PostEditorSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:rounded-3xl md:p-8">
      {/* 카테고리 라벨 & 셀렉트 */}
      <div className="mb-2 h-4 w-16 rounded bg-slate-100" />
      <div className="mb-6 h-[52px] w-full rounded-xl bg-slate-50 md:h-[62px]" />

      {/* 제목 라벨 & Input */}
      <div className="mb-2 h-4 w-12 rounded bg-slate-100" />
      <div className="mb-6 h-[52px] w-full rounded-xl bg-slate-50 md:mb-8 md:h-[62px]" />

      {/* 이미지 업로드 영역 */}
      <div className="mb-6 md:mb-8">
        <div className="mb-2 h-4 w-20 rounded bg-slate-100" />
        <div className="h-[120px] w-full rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 md:h-[160px]" />
      </div>
      {/* 본문 라벨 & Textarea */}
      <div className="mb-2 h-4 w-12 rounded bg-slate-100" />
      <div className="mb-6 h-[182px] w-full rounded-xl bg-slate-50 md:mb-8 md:h-[322px]" />

      {/* 버튼 */}
      <div className="h-[52px] w-full rounded-xl bg-slate-200/80 md:h-[60px]" />
    </div>
  );
};

export default PostEditorSkeleton;
