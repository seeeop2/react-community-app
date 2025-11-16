import { useNavigate } from 'react-router-dom';
import { useUpdateProfile } from '../hooks/mutations/useUpdateProfile.js';
import { useState } from 'react';
import { handleError } from '../utils/errorHandler.js';
import { Camera, Save, User } from 'lucide-react';
import {
  ALLOWED_IMAGE_TYPES,
  DEFAULT_COMPRESSION_OPTIONS,
  FILE_SIZE_LIMIT,
} from '../constants/image.js';
import Button from '../components/Button.jsx';
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';

const ProfileForm = ({ profile }) => {
  // Hooks
  const nav = useNavigate();

  // Custom Hooks
  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateProfile();

  // States & Refs
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
  });
  const [previewUrl, setPreviewUrl] = useState(profile?.avatar_url || null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Event Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
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
      alert('JPG, PNG, WebP, HEIC 파일만 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }

    // 용량 초과 시 알림 이후 종료
    if (selectedFile.size > FILE_SIZE_LIMIT) {
      alert(
        `프로필 사진은 ${FILE_SIZE_LIMIT / (1024 * 1024)}MB를 초과할 수 없습니다.`
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

  // 통합 저장 핸들러: 이미지 + 텍스트 함께 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      return alert('닉네임을 입력해주세요.');
    }

    try {
      await updateProfile({
        userId: profile.id,
        formData,
        selectedFile,
        currentAvatarUrl: profile.avatar_url,
      });

      setSelectedFile(null);
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      alert('프로필이 저장되었습니다!');
      nav('/');
    } catch (error) {}
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
      {/* 프로필 이미지 영역 */}
      <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row">
        <div className="group relative">
          <div className="h-24 w-24 overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-md">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="h-full w-full object-cover"
                // 이미지 로드 실패 시 실행되는 롤백 로직
                onError={() => {
                  console.warn(
                    '이미지를 불러올 수 없어 기본 아이콘으로 대체합니다.'
                  );
                  setPreviewUrl(null); // 주소를 비우면 하단의 User 아이콘이 자동으로 나타남
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <User size={40} />
              </div>
            )}
          </div>
          {/* 파일 선택 숨겨진 input */}
          <label className="absolute -bottom-2 -right-2 cursor-pointer rounded-xl bg-blue-600 p-2 text-white shadow-lg transition-transform hover:scale-110">
            <Camera size={18} />
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp, image/heic"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-lg font-bold text-slate-800">{profile?.email}</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            {profile?.role}
          </p>
        </div>
      </div>

      {/* 정보 수정 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            닉네임
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            placeholder="활동명을 입력하세요"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            자기소개
          </label>
          <textarea
            value={formData.bio}
            name="bio"
            onChange={handleInputChange}
            className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            placeholder="자신을 짧게 소개해 주세요"
          />
        </div>

        <Button type="submit" fullWidth={true} loading={isUpdating}>
          <Save size={18} /> 설정 저장하기
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
