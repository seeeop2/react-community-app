import React from 'react';
import { cn } from '../utils/cn.js';

const StatsCard = ({
  title,
  count,
  icon: Icon,
  variant = 'blue',
  highlight = false,
}) => {
  const baseStyle =
    'bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5';

  const variants = {
    blue: {
      box: 'text-blue-600 bg-blue-50',
      border: 'border-t-blue-400',
    },
    orange: {
      box: 'text-orange-500 bg-orange-50',
      border: 'border-t-orange-400',
    },
    green: {
      box: 'text-green-600 bg-green-50',
      border: 'border-t-green-400',
    },
  };

  // 테두리 스타일
  const highlightStyle = highlight
    ? `border-t-4 ${variants[variant].border}`
    : '';

  return (
    <div className={cn(baseStyle, highlightStyle)}>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${variants[variant].box}`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  );
};

export default StatsCard;
