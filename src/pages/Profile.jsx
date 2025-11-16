import React from 'react';
import useAuth from '../hooks/useAuth.js';
import ProfileForm from '../components/ProfileForm.jsx';

const Profile = () => {
  // Custom Hooks
  const { profile } = useAuth();

  return (
    <div className="mx-auto max-w-2xl p-8 sm:p-12">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-black text-slate-800">
          My <span className="text-blue-600">Profile</span>
        </h1>
        <p className="text-slate-500">회원님의 활동 정보를 관리하세요.</p>
      </div>

      {!profile ? (
        <div className="py-20 text-center text-lg text-gray-500">
          프로필 데이터를 불러오는 중...
        </div>
      ) : (
        <ProfileForm profile={profile} key={profile.id} />
      )}
    </div>
  );
};

export default Profile;
