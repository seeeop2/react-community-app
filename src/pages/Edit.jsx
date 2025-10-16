import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AppDispatchContext, AppStateContext} from "../App.jsx";
import {CATEGORY_LIST} from "../constants/categories.js";
import {ArrowLeft} from "lucide-react";

const Edit = () => {
  const {id} = useParams();
  const {posts} = useContext(AppStateContext);
  const {onUpdatePost} = useContext(AppDispatchContext); // 수정 함수
  const nav = useNavigate();

  const [input, setInput] = useState({title: "", category: "NOTICE", content: ""});
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const targetPost = posts.find((item) =>
        String(item.id) === String(id)
    );

    if (targetPost) {
      setInput({
        title: targetPost.title,
        category: targetPost.category,
        content: targetPost.content,
      });
    } else {
      window.alert("게시글을 찾을 수 없습니다.");
      nav("/", {replace: true});
    }
  }, [id, posts, nav]);

  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setInput({
      ...input,
      [name]: value,
    })
  }

  const onSubmit = () => {
    if (!input.title.trim()) {
      window.alert("제목을 입력하세요!");
      return titleRef.current.focus();
    }

    if (!input.content.trim()) {
      window.alert("내용을 입력하세요!");
      return contentRef.current.focus();
    }

    onUpdatePost(id, input.title, input.content, input.category);
    nav(`/post/${id}`, {replace: true});
  };

  return (
      <div className="max-w-2xl mx-auto p-12">
        <button className="flex items-center gap-2 text-gray-500 mb-8 hover:text-blue-600 transition-colors"
                onClick={() => {
                  if (window.confirm("작성 중인 내용이 사라집니다. 이동하시겠습니까?")) {
                    nav('/')
                  }
                }}
        >
          <ArrowLeft size={20}/> 목록으로 돌아가기
        </button>
        <h2 className="text-3xl font-extrabold mb-8">글 수정하기</h2>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold mb-2">카테고리</label>
          <select value={input.category}
                  name="category"
                  className="w-full p-4 mb-6 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={onChangeInput}
          >
            {CATEGORY_LIST.map((category) =>
                <option value={category.value} key={category.value}>
                  {category.label}
                </option>
            )}
          </select>

          <label className="block text-sm font-semibold mb-2">제목</label>
          <input value={input.title}
                 name="title"
                 ref={titleRef}
                 className="w-full p-4 mb-8 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                 onChange={onChangeInput}
                 placeholder="제목을 입력해주세요."
          />

          <label className="block text-sm font-semibold mb-2">본문</label>
          <textarea value={input.content}
                    name="content"
                    ref={contentRef}
                    className="w-full p-4 mb-8 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="10"
                    onChange={onChangeInput}
                    placeholder="내용을 입력해주세요."
          />
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold" onClick={onSubmit}>
            수정 완료하기
          </button>
        </div>
      </div>
  );
};

export default Edit;