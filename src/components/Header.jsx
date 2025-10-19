import React from 'react';
import Badge from "./Badge.jsx";

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
          <Badge variant="blueLight"
                 size="xs"
                 shape="md"
                 fontWeight="bold"
                 tracking="wider"
          >
            {badge}
          </Badge>
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
