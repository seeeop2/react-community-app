import React from 'react';

const PostItemSkeleton = () => {
  return (
    <tr className="flex animate-pulse flex-col border-b border-slate-50 p-5 md:table-row md:border-none md:p-0">
      {/* 제목 영역 스켈레톤 */}
      <td className="w-full px-0 py-0 md:px-8 md:py-5">
        <div className="flex items-center gap-0 md:gap-4">
          <div className="hidden h-10 w-10 shrink-0 rounded-xl bg-slate-100 md:block" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-50" />
          </div>
        </div>
      </td>
      {/* 작성자 영역 스켈레톤 */}
      <td className="mt-3 px-0 py-0 md:mt-0 md:w-48 md:px-8 md:py-5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-slate-100" />
          <div className="h-3 w-16 rounded bg-slate-100" />
        </div>
      </td>
      {/* 버튼 영역 스켈레톤 */}
      <td className="hidden px-8 py-5 md:table-cell">
        <div className="flex justify-end gap-2">
          <div className="h-8 w-8 rounded bg-slate-50" />
        </div>
      </td>
    </tr>
  );
};

export default PostItemSkeleton;
