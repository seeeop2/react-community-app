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
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
      <label className="mb-2 block text-sm font-semibold">카테고리</label>
      <select
        value={input.category}
        name="category"
        className="mb-6 w-full rounded-xl border border-gray-200 p-4"
        onChange={onChangeInput}
      >
        {CATEGORY_LIST.map((category) => (
          <option value={category.value} key={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      <label className="mb-2 block text-sm font-semibold">제목</label>
      <input
        value={input.title}
        name="title"
        ref={titleRef}
        className="mb-8 w-full rounded-xl border border-gray-200 p-4"
        onChange={onChangeInput}
        placeholder="제목을 입력하세요."
      />

      <label className="mb-2 block text-sm font-semibold">본문</label>
      <textarea
        value={input.content}
        name="content"
        ref={contentRef}
        className="mb-8 w-full rounded-xl border border-gray-200 p-4"
        rows="10"
        onChange={onChangeInput}
        placeholder="내용을 입력하세요."
      />

      <Button
        fontWeight="bold"
        fullWidth={true}
        loading={isSubmitting}
        onClick={handleSubmit}
      >
        <Send size={18} /> {submitButtonText}
      </Button>
    </div>
  );
};

export default PostEditor;
