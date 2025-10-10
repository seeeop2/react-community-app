import React from 'react';

import {Search} from 'lucide-react';

const SearchBar = () => {
  return (
      <div className="relative w-full md:w-80">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
        />
        <input type="text"
               placeholder="관심 있는 글 검색..."
               className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
  );
};

export default SearchBar;