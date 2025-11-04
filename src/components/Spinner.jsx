import React from 'react';
import { cn } from '../utils/cn.js';

const Spinner = ({ variant = 'primary', size = 'md' }) => {
  const baseStyle = 'animate-spin border-2 rounded-full';

  const spinnerColor = {
    primary: 'border-white border-t-transparent',
    secondary: 'border-gray-200 border-t-gray-600',
    dangerGhost: 'border-red-600 border-t-transparent',
  };

  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return <span className={cn(baseStyle, spinnerColor[variant], sizes[size])} />;
};

export default Spinner;
