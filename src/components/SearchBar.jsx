import React, { useState } from 'react';

import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  const onChangeSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full md:w-80">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />
      <input
        type="text"
        placeholder="관심 있는 글 검색..."
        className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={onChangeSearch}
      />
    </div>
  );
};

export default SearchBar;
