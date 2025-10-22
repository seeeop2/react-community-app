import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatchContext } from '../App.jsx';
import { CATEGORY_MAP } from '../constants/categories.js';
import { ArrowLeft, Calendar, Edit3, Tag, Trash2 } from 'lucide-react';
import Button from './Button.jsx';
import Badge from './Badge.jsx';
import usePost from '../hooks/usePost.jsx';

const PostDetail = () => {
  const { id } = useParams();
  const { onDeletePost } = useContext(AppDispatchContext);
  const nav = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const post = usePost(id);

  if (!post) {
    return null;
  }

  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const onClickDelete = async () => {
    if (
      window.confirm('정말 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.')
    ) {
      setIsProcessing(true);
      try {
        await onDeletePost(post.id); // 비동기 작업 시 await
        nav('/', { replace: true });
      } catch (error) {
        setIsProcessing(false); // 에러 시 로딩 종료
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-12">
      <Button variant="ghost" className="mb-8 px-0" onClick={() => nav('/')}>
        <ArrowLeft size={20} /> 목록으로 돌아가기
      </Button>

      <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
          <Badge size="sm" fontWeight="bold">
            <Tag size={14} /> {CATEGORY_MAP[post.category]}
          </Badge>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Calendar size={14} /> {formattedDate}
          </div>
        </div>

        <h1 className="mb-8 text-4xl font-extrabold leading-tight text-gray-900">
          {post.title}
        </h1>

        <div className="min-h-[300px] whitespace-pre-wrap text-lg leading-relaxed text-gray-700">
          {post.content}
        </div>

        <div className="mt-12 flex justify-end gap-3 border-t border-gray-100 pt-8">
          <Button variant="ghost" onClick={() => nav(`/edit/${post.id}`)}>
            <Edit3 size={16} /> 수정
          </Button>

          <Button
            variant="dangerGhost"
            loading={isProcessing}
            onClick={onClickDelete}
          >
            <Trash2 size={16} /> 삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
