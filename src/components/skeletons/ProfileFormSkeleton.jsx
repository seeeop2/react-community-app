import React from 'react';

const ProfileFormSkeleton = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* 프로필 상단 영역 (이미지 + 역할) */}
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row">
          {/* 아바타 뼈대 */}
          <div className="h-24 w-24 rounded-3xl bg-slate-100" />
          <div className="space-y-3 text-center sm:text-left">
            <div className="h-3 w-16 rounded bg-slate-50" /> {/* 역할 배지 */}
          </div>
        </div>

        {/* 폼 입력창 뼈대 */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-12 rounded bg-slate-100" /> {/* 라벨 */}
            <div className="h-12 w-full rounded-2xl bg-slate-50" /> {/* 인풋 */}
          </div>
          <div className="space-y-2">
            <div className="h-4 w-12 rounded bg-slate-100" /> {/* 라벨 */}
            <div className="h-32 w-full rounded-2xl bg-slate-50" />
            {/* Textarea */}
          </div>
          {/* 버튼 뼈대 */}
          <div className="h-12 w-full rounded-xl bg-slate-200/80" />
        </div>
      </div>
    </div>
  );
};

export default ProfileFormSkeleton;
