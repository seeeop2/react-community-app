import React from 'react';
import PostItem from './PostItem.jsx';

const PostList = ({ posts, searchComponent }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
      {searchComponent && (
        <div className="border-b border-slate-50 p-6">{searchComponent}</div>
      )}
      <div className="md:overflow-x-auto">
        <table className="w-full min-w-0 table-fixed text-left">
          <thead className="hidden bg-slate-50/50 md:table-header-group">
            <tr>
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                제목
              </th>
              <th className="w-48 py-4 pl-16 pr-8 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                작성자
              </th>
              <th className="w-32 px-8 py-4 text-right text-[11px] font-bold uppercase tracking-widest text-slate-400">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostList;
