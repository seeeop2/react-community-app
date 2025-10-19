import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AppDispatchContext, AppStateContext} from "../App.jsx";
import {CATEGORY_MAP} from "../constants/categories.js";
import {ArrowLeft, Calendar, Edit3, Tag, Trash2} from "lucide-react";
import Button from "./Button.jsx";
import Badge from "./Badge.jsx";

const PostDetail = () => {
  const {id} = useParams();
  const {posts} = useContext(AppStateContext);
  const {onDeletePost} = useContext(AppDispatchContext);
  const nav = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const post = posts.find((post) =>
      String(post.id) === id
  );

  const isInvalid = !post || post.isDeleted;

  useEffect(() => {
    if (isInvalid && !isProcessing) {
      window.alert('존재하지 않는 게시글입니다.');
      nav('/', {replace: true});
    }
  }, [isInvalid, nav]);

  if (isInvalid) {
    return null;
  }

  const formattedDate = new Date(post.date).toLocaleDateString("ko-KR", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const onClickDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.")) {
      setIsProcessing(true);
      try {
        await onDeletePost(post.id); // 비동기 작업 시 await
        nav("/", {replace: true});
      } catch (error) {
        setIsProcessing(false); // 에러 시 로딩 종료
      }
    }
  };

  return (
      <div className="max-w-2xl mx-auto p-12">
        <Button variant="ghost"
                className="mb-8 px-0"
                onClick={() => nav('/')}
        >
          <ArrowLeft size={20}/> 목록으로 돌아가기
        </Button>

        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
            <Badge size='sm'
                   fontWeight='bold'
            >
              <Tag size={14}/> {CATEGORY_MAP[post.category]}
            </Badge>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Calendar size={14}/> {formattedDate}
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap min-h-[300px]">
            {post.content}
          </div>

          <div className="flex justify-end gap-3 mt-12 pt-8 border-t border-gray-100">
            <Button variant='ghost'
                    onClick={() =>
                        nav(`/edit/${post.id}`)
                    }
            >
              <Edit3 size={16}/> 수정
            </Button>

            <Button variant='dangerGhost'
                    loading={isProcessing}
                    onClick={onClickDelete}
            >
              <Trash2 size={16}/> 삭제
            </Button>

          </div>
        </div>
      </div>
  );
};

export default PostDetail;
