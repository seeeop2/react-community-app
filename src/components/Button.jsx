import React from 'react';
import Spinner from "./Spinner.jsx";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  fontWeight = "normal",
  fullWidth = false,
  loading = false,
  disabled = false,
  className = ""
}) => {
  const baseStyle = "flex items-center justify-center gap-2 transition-all rounded-xl";

  const variants = {
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-100",
    secondary: "bg-gray-200 text-slate-800",
    ghost: "bg-transparent text-slate-500",
    danger: "bg-red-600 text-white shadow-lg shadow-red-100",
    dangerGhost: "bg-transparent text-red-600",
  };

  const interactions = {
    primary: "hover:bg-blue-700 active:scale-[0.98]",
    secondary: "hover:bg-gray-300 active:scale-[0.98]",
    ghost: "hover:bg-slate-50 hover:text-blue-600 active:scale-[0.98]",
    danger: "hover:bg-red-700 active:scale-[0.98]",
    dangerGhost: "hover:bg-red-50 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const fontWeights = {
    normal: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  const disabledStyle = "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none";

  const combinedClasses = `
    ${baseStyle} 
    ${sizes[size]} 
    ${fontWeights[fontWeight]} 
    ${fullWidth && 'w-full'}
    ${disabled ? disabledStyle : variants[variant]}
    ${!loading && !disabled && interactions[variant]}
    ${className}
  `.trim();

  return (
      <button type={type}
              disabled={disabled || loading}
              className={combinedClasses}
              onClick={onClick}
      >
        {loading && <Spinner variant={variant}/>}
        <span className={`flex items-center justify-center gap-2 whitespace-nowrap ${loading ? "opacity-60" : ""}`}>
          {children}
        </span>
      </button>
  );
};

export default Button;
