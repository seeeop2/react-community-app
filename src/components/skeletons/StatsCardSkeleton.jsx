import React from 'react';

const StatsCardSkeleton = () => {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* 아이콘 영역 */}
      <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-100" />

      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-2">
        {/* 타이틀 스켈레톤 */}
        <div className="h-3 w-20 rounded bg-slate-100" />

        {/* 숫자 스켈레톤  */}
        <div className="h-6 w-14 rounded-lg bg-slate-200/80" />
      </div>
    </div>
  );
};

export default StatsCardSkeleton;
