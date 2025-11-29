import React, { useRef, useState } from 'react';
import { CATEGORY_LIST } from '../constants/categories.js';
import { Camera, Send, X } from 'lucide-react';
import Button from './Button.jsx';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

import { handleError } from '../utils/errorHandler.js';
import {
  ALLOWED_IMAGE_TYPES,
  DEFAULT_COMPRESSION_OPTIONS,
  FILE_SIZE_LIMIT,
} from '../constants/image.js';
import heic2any from 'heic2any';

const PostEditor = ({ initData, onSubmit, submitButtonText, isSubmitting }) => {
  // States & Refs
  const [input, setInput] = useState(
    initData || {
      title: '',
      category: 'NOTICE',
      content: '',
    }
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initData?.image_url || null);
  const titleRef = useRef(null);
  const fileInputRef = useRef(null);
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

  // 이미지 선택 시: 서버 전송 안 함(용량 체크 및 압축/미리보기 생성)
  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }

    const isHEIC =
      selectedFile.name.toLowerCase().endsWith('.heic') ||
      selectedFile.type === 'image/heic';

    if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type) && !isHEIC) {
      toast.error('JPG, PNG, WebP, HEIC 파일만 업로드 가능합니다.', {
        id: 'img-type',
      });
      e.target.value = '';
      return;
    }

    // 용량 초과 시 알림 이후 종료
    if (selectedFile.size > FILE_SIZE_LIMIT) {
      toast.error(
        `사진은 ${FILE_SIZE_LIMIT / (1024 * 1024)}MB를 초과할 수 없습니다.`,
        {
          id: 'img-size',
        }
      );
      e.target.value = '';
      return;
    }

    let processingFile = selectedFile; // 가공 흐름을 나타냄

    // HEIC 파일인 경우 JPEG로 변환
    if (isHEIC) {
      try {
        const convertedBlob = await heic2any({
          blob: selectedFile,
          toType: 'image/jpeg',
          quality: 0.8,
        });

        // 변환된 Blob을 File 객체로 새로 만듦 (확장자도 .jpg로 교체)
        processingFile = new File(
          [convertedBlob],
          selectedFile.name.replace(/\.[^/.]+$/, '.jpg'),
          { type: 'image/jpeg' }
        );
      } catch (error) {
        handleError('아이폰 이미지(HEIC) 변환 중 오류가 발생했습니다.', error);
        e.target.value = '';
        return;
      }
    }

    // 압축 프로세스
    try {
      // 압축 옵션 설정
      const compressOptions = {
        ...DEFAULT_COMPRESSION_OPTIONS,
      };

      // 이미지 압축 진행
      const compressedFile = await imageCompression(
        processingFile,
        compressOptions
      );
      setSelectedFile(compressedFile); // 서버 전송용은 압축된 파일로 저장

      // 프리뷰 URL 생성 및 메모리 정리
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      // 브라우저 메모리에 임시 주소 생성 (가짜 URL)
      const objectUrl = URL.createObjectURL(compressedFile);
      setPreviewUrl(objectUrl);
    } catch (error) {
      handleError('이미지 처리 중 오류가 발생했습니다.', error);
      e.target.value = '';
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!input.title.trim()) {
      toast.error('제목을 입력해주세요!', {
        id: 'title-required',
      });
      return titleRef.current.focus();
    }
    if (!input.content.trim()) {
      toast.error('내용을 입력해주세요!', {
        id: 'content-required',
      });
      return contentRef.current.focus();
    }

    await onSubmit({ ...input, selectedFile, previewUrl });
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

      {/* 이미지 업로드 영역 */}
      <div className="mb-6 md:mb-8">
        <label className="mb-2 block text-[13px] font-bold text-slate-700 md:text-sm">
          이미지 첨부
        </label>

        {previewUrl ? (
          <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-auto max-h-[400px] w-full object-contain"
            />
            <button
              onClick={handleRemoveImage}
              className="transition-hover absolute right-3 top-3 rounded-full bg-slate-900/50 p-1.5 text-white backdrop-blur-md hover:bg-slate-900"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-10 text-slate-400 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-500"
          >
            <div className="rounded-full bg-white p-3 shadow-sm">
              <Camera size={24} />
            </div>
            <span className="text-sm font-medium">이미지 추가하기 (선택)</span>
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*, .heic"
          onChange={handleFileSelect}
        />
      </div>

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
