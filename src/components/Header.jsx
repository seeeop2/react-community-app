import React from 'react';

const Header = ({
  badge,
  title,
  highlightTitle,
  description,
  action
}) => {
  return (
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            {badge}
          </span>
          <h1 className="text-4xl font-black tracking-tight mt-2">
            {title} <span className="text-blue-600">{highlightTitle}</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">{description}</p>
        </div>

        {action && (
            <div className="w-full md:w-auto">
              {action}
            </div>
        )}
      </header>
  );
};

export default Header;
