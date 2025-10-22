import React from 'react';
import Badge from './Badge.jsx';

const Header = ({ badge, title, highlightTitle, description, action }) => {
  return (
    <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <Badge
          variant="blueLight"
          size="xs"
          shape="md"
          fontWeight="bold"
          tracking="wider"
        >
          {badge}
        </Badge>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          {title} <span className="text-blue-600">{highlightTitle}</span>
        </h1>
        <p className="mt-2 font-medium text-slate-500">{description}</p>
      </div>

      {action && <div className="w-full md:w-auto">{action}</div>}
    </header>
  );
};

export default Header;
