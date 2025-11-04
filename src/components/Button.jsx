import React from 'react';
import Spinner from './Spinner.jsx';
import { cn } from '../utils/cn.js';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fontWeight = 'normal',
  shape = 'xl',
  fullWidth = false,
  loading = false,
  disabled = false,
  isSelected = false,
  className = '',
}) => {
  const baseStyle = 'flex items-center justify-center gap-2 transition-all';

  const variants = {
    primary: 'bg-blue-600 text-white shadow-lg shadow-blue-100',
    secondary: 'bg-gray-200 text-slate-800',
    ghost: 'bg-transparent text-slate-500',
    danger: 'bg-red-600 text-white shadow-lg shadow-red-100',
    dangerGhost: 'bg-transparent text-red-600',
    chip: isSelected
      ? 'bg-slate-900 text-white border-slate-900 shadow-md border'
      : 'bg-white border border-gray-200 text-gray-500',
  };

  const interactions = {
    primary: 'hover:bg-blue-700 active:scale-[0.98]',
    secondary: 'hover:bg-gray-300 active:scale-[0.98]',
    ghost: 'hover:bg-slate-50 hover:text-blue-600 active:scale-[0.98]',
    danger: 'hover:bg-red-700 active:scale-[0.98]',
    dangerGhost: 'hover:bg-red-50 active:scale-[0.98]',
    chip: isSelected
      ? 'active:scale-[0.95]'
      : 'hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-3 text-base',
    chip: 'px-5 py-2 text-sm',
    lg: 'px-8 py-4 text-lg',
  };

  const fontWeights = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
    semiBold: 'font-semibold',
    extrabold: 'font-extrabold',
  };

  const shapes = {
    pill: 'rounded-full',
    rounded: 'rounded',
    md: 'rounded-md',
    xl: 'rounded-xl',
  };

  const disabledStyle =
    'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        baseStyle,
        sizes[size],
        fontWeights[fontWeight],
        shapes[shape],
        fullWidth && 'w-full',
        disabled ? disabledStyle : variants[variant],
        !loading && !disabled && interactions[variant],
        className
      )}
      onClick={onClick}
    >
      {loading && <Spinner variant={variant} />}
      <span
        className={`flex items-center justify-center gap-2 whitespace-nowrap ${loading ? 'opacity-60' : ''}`}
      >
        {children}
      </span>
    </button>
  );
};

export default Button;
