import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ onSearch, placeholder = 'Buscar...', debounceTime = 300 }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceTime);
    return () => clearTimeout(handler);
  }, [query, onSearch, debounceTime]);

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar-container">
      <Search className="search-icon" size={18} />
      <input
        type="text"
        className="ui-input search-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button className="clear-search-btn" onClick={clearSearch}>
          <X size={16} />
        </button>
      )}
      <style jsx="true">{`
        .search-bar-container {
          position: relative;
          width: 100%;
          max-width: 400px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-tierra-sombra);
          opacity: 0.5;
        }
        .search-input {
          padding-left: 38px !important;
          padding-right: 36px !important;
          width: 100%;
        }
        .clear-search-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--color-tierra-sombra);
          opacity: 0.5;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 50%;
        }
        .clear-search-btn:hover {
          opacity: 1;
          background: rgba(0,0,0,0.05);
        }
        [data-theme='dark'] .clear-search-btn:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
