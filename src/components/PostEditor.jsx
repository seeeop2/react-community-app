import React, { useRef, useState } from 'react';
import { CATEGORY_LIST } from '../constants/categories.js';
import { Send } from 'lucide-react';
import Button from './Button.jsx';

const PostEditor = ({ initData, onSubmit, submitButtonText, isSubmitting }) => {
  // States & Refs
  const [input, setInput] = useState(
    initData || {
      title: '',
      category: 'NOTICE',
      content: '',
    }
  );
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // Event Handler
  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!input.title.trim()) {
      window.alert('제목을 입력하세요!');
      return titleRef.current.focus();
    }
    if (!input.content.trim()) {
      window.alert('내용을 입력하세요!');
      return contentRef.current.focus();
    }

    await onSubmit(input);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:rounded-3xl md:p-8">
      {/* 카테고리 */}
      <label className="mb-2 block text-[13px] font-bold text-slate-700 md:text-sm">
        카테고리
      </label>
      <select
        value={input.category}
        name="category"
        className="transition-focus mb-6 w-full rounded-xl border border-gray-200 bg-slate-50/50 p-3.5 text-sm focus:border-blue-500 focus:outline-none md:p-4 md:text-base"
        onChange={onChangeInput}
      >
        {CATEGORY_LIST.map((category) => (
          <option value={category.value} key={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      {/* 제목 */}
      <label className="mb-2 block text-[13px] font-bold text-slate-700 md:text-sm">
        제목
      </label>
      <input
        value={input.title}
        name="title"
        ref={titleRef}
        className="transition-focus mb-6 w-full rounded-xl border border-gray-200 p-3.5 text-sm focus:border-blue-500 focus:outline-none md:mb-8 md:p-4 md:text-base"
        onChange={onChangeInput}
        placeholder="제목을 입력하세요."
      />

      {/* 본문 */}
      <label className="mb-2 block text-[13px] font-bold text-slate-700 md:text-sm">
        본문
      </label>
      <textarea
        value={input.content}
        name="content"
        ref={contentRef}
        className="transition-focus mb-6 min-h-[180px] w-full resize-none rounded-xl border border-gray-200 p-3.5 text-sm focus:border-blue-500 focus:outline-none md:mb-8 md:min-h-[320px] md:p-4 md:text-base"
        rows="7"
        onChange={onChangeInput}
        placeholder="내용을 입력하세요."
      />

      {/* 전송 버튼 */}
      <Button
        fontWeight="bold"
        fullWidth={true}
        loading={isSubmitting}
        onClick={handleSubmit}
        className="py-3.5 md:py-4"
      >
        <Send size={18} /> {submitButtonText}
      </Button>
    </div>
  );
};

export default PostEditor;
