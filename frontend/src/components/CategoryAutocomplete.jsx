import { useState, useEffect, useRef } from 'react';

const CATEGORY_EMOJIS = {
  'Film': '🎬',
  'Dizi': '📺',
  'Anime': '🎌',
  'Oyun': '🎮'
};

function CategoryAutocomplete({ value, onChange, suggestions = [] }) {
  const [inputValue, setInputValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Varsayılan kategoriler
  const defaultCategories = ['Film', 'Dizi', 'Anime', 'Oyun'];
  const allSuggestions = [...new Set([...defaultCategories, ...suggestions])];

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    // Click outside handler
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val.trim()) {
      const filtered = allSuggestions.filter(cat =>
        cat.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions(allSuggestions);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setFilteredSuggestions(allSuggestions);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Kullanıcı yazdıysa ve listede yoksa, yeni kategori olarak kaydet
    if (inputValue.trim() && !allSuggestions.includes(inputValue.trim())) {
      onChange(inputValue.trim());
    } else if (inputValue.trim()) {
      onChange(inputValue.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onChange(inputValue.trim());
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Kategori seçin veya yazın..."
        className="w-full px-4 py-2 bg-dark-850 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:shadow-glow-sm transition-all duration-300"
        autoComplete="off"
      />
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-dark-900 border border-gold/30 rounded-lg shadow-glow-sm max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionClick(suggestion);
              }}
              className="w-full px-4 py-2 text-left hover:bg-dark-850 hover:text-gold transition-all duration-150 flex items-center gap-2 text-white"
            >
              <span className="text-xl">{CATEGORY_EMOJIS[suggestion] || '📁'}</span>
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryAutocomplete;

