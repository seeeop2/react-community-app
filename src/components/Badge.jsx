import React from 'react';
import {cn} from "../lib/utils.js";

const Badge = ({
  children,
  variant = "blue",
  size = "md",
  shape = "pill",
  fontWeight = "normal",
  tracking = "wide",
  className = ""
}) => {

  const variants = {
    blue: "bg-blue-50 text-blue-600",
    blueLight: "bg-blue-100 text-blue-600",
    gray: "bg-slate-100 text-slate-500",
  };

  const sizes = {
    xxs: "text-[10px] px-2 py-1",
    xs: "text-xs px-2 py-1",
    sm: "text-sm px-4 py-1.5",
    md: "text-base px-4 py-1.5",
    lg: "text-lg px-6 py-2",
  };

  const shapes = {
    pill: "rounded-full",
    rounded: "rounded",
    md: "rounded-md"
  };

  const fontWeights = {
    normal: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  const trackings = {
    wide: "tracking-wide",
    wider: "tracking-wider", // 헤더용 자간 추가
  };

  const baseStyle = "inline-flex items-center gap-1.5 uppercase";

  return (
      <div className={cn(
          baseStyle,
          variants[variant],
          sizes[size],
          shapes[shape],
          fontWeights[fontWeight],
          trackings[tracking],
          className,
      )}>
        {children}
      </div>
  );
};

export default Badge;
