import React from 'react';

const Spinner = ({
  variant = 'primary',
  size = 'md'
}) => {
  const baseStyle = "animate-spin border-2 rounded-full";

  const spinnerColor = {
    primary: "border-white border-t-transparent",
    dangerGhost: "border-red-600 border-t-transparent",
  }

  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const combinedClasses = `
  ${baseStyle}
  ${spinnerColor[variant]}
  ${sizes[size]}
  `;

  return (
      <span className={combinedClasses}/>
  );
};

export default Spinner;
