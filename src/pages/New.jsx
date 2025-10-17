import React, {useContext} from 'react';
import {useNavigate} from "react-router-dom";
import {AppDispatchContext} from "../App.jsx";
import {ArrowLeft} from "lucide-react";
import PostEditor from "../components/PostEditor.jsx";

const New = () => {
  const {onCreatePost} = useContext(AppDispatchContext);
  const nav = useNavigate();

  const handleSubmit = (input) => {
    onCreatePost({...input, userId: 1});
    nav("/", {replace: true});
  };

  return (
      <div className="max-w-2xl mx-auto p-12">
        <button className="flex items-center gap-2 text-gray-500 mb-8 hover:text-blue-600 transition-colors"
                onClick={() => {
                  if (window.confirm("작성 중인 내용이 사라집니다. 이동하시겠습니까?")) {
                    nav(-1)
                  }
                }}
        >
          <ArrowLeft size={20}/> 목록으로 돌아가기
        </button>

        <h2 className="text-3xl font-extrabold mb-8">새 글 쓰기</h2>
        <PostEditor submitButtonText="작성 완료하기"
                    onSubmit={handleSubmit}
        />
      </div>
  );
};

export default New;