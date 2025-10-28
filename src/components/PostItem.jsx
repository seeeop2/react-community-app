import React, { useState } from 'react';
import { Edit2, MessageSquare, Trash2 } from 'lucide-react';
import { CATEGORY_MAP } from '../constants/categories.js';
import { useNavigate } from 'react-router-dom';
import Badge from './Badge.jsx';
import usePosts from '../hooks/usePosts.js';

const PostItem = ({ post }) => {
  const [isDeleting, setIsDeleting] = useState(false); // 로딩 상태
  const { removePost } = usePosts();

  const nav = useNavigate();

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
      setIsDeleting(true);
      try {
        await removePost(post.id);
        alert('삭제되었습니다.');
      } catch (error) {
        // 에러 알림은 PostProvider의 handleError에서 처리함
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <tr
      className="group cursor-pointer transition-all hover:bg-blue-50/30"
      onClick={handleNavigateDetail}
    >
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white">
            <MessageSquare size={18} />
          </div>
          <div>
            <p className="font-semibold text-slate-800 transition-colors group-hover:text-blue-600">
              {post.title}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <Badge
                variant="gray"
                shape="rounded"
                size="xxs"
                fontWeight="bold"
              >
                {CATEGORY_MAP[post.category]}
              </Badge>
              <span className="text-[10px] text-slate-400">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-8 py-5 text-sm font-medium text-slate-600">
        {post.author?.username || '알 수 없음'}
      </td>
      <td className="px-8 py-5">
        <div className="flex translate-x-1 justify-end gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <button
            className="p-2 text-slate-400 transition-colors hover:text-blue-600"
            onClick={handleNavigateEdit}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="p-2 text-slate-400 transition-colors hover:text-red-500"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PostItem;
