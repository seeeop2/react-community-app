import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, User } from 'lucide-react';
import Spinner from './Spinner.jsx';
import { cn } from '../utils/cn.js';
import { formatRelativeTime } from '../utils/date.js';

const NotificationDropdown = ({
  notifications,
  isLoading,
  markAsRead,
  onClose,
}) => {
  // Hooks
  const nav = useNavigate();

  // Event Handler
  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      // 읽음 처리 API 호출
      markAsRead(notification.id);
    }
    // 해당 게시글로 이동
    nav(`/post/${notification.post_id}`);
    // 드롭다운 닫기
    onClose();
  };

  return (
    <div className="animate-in fade-in zoom-in absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl ring-1 ring-black ring-opacity-5 duration-200">
      <div className="border-b border-slate-50 bg-slate-50/50 px-4 py-3">
        <h3 className="text-sm font-bold text-slate-800">알림</h3>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="sm" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            새로운 알림이 없습니다.
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                'flex cursor-pointer gap-3 border-b border-slate-50 px-4 py-4 transition-colors last:border-0 hover:bg-slate-50',
                !notification.is_read ? 'bg-blue-50/30' : ''
              )}
            >
              {/* 발신자 아바타 */}
              <div className="relative shrink-0">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-100 bg-slate-200">
                  {notification.sender?.avatar_url ? (
                    <img
                      src={notification.sender.avatar_url}
                      alt="sender"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <User size={16} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-600 p-1 text-white">
                  <MessageSquare size={10} />
                </div>
              </div>

              {/* 알림 내용 */}
              <div className="flex-1 overflow-hidden">
                <p className="text-sm leading-snug text-slate-700">
                  <span className="font-bold">
                    {notification.sender?.username || '알 수 없는 사용자'}
                  </span>
                  님이 댓글을 남겼습니다.
                </p>
                <p className="mt-1 truncate text-xs text-slate-400">
                  {formatRelativeTime(notification.created_at)}
                </p>
              </div>

              {/* 안 읽음 표시 점 */}
              {!notification.is_read && (
                <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
