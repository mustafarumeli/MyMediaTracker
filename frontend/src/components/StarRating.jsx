import { useState } from 'react';

function StarRating({ value = 0, onChange, readonly = false, size = 'md' }) {
  const [hoverValue, setHoverValue] = useState(null);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };
  
  const starSize = sizeClasses[size] || sizeClasses.md;
  const totalStars = 10;
  
  const handleClick = (starValue) => {
    if (!readonly && onChange) {
      onChange(starValue);
    }
  };
  
  const handleMouseEnter = (starValue) => {
    if (!readonly) {
      setHoverValue(starValue);
    }
  };
  
  const handleMouseLeave = () => {
    setHoverValue(null);
  };
  
  const renderStar = (index) => {
    const starValue = index + 1;
    const displayValue = hoverValue !== null ? hoverValue : value;
    const filled = starValue <= displayValue;
    const halfFilled = starValue === Math.ceil(displayValue) && displayValue % 1 !== 0;
    
    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        disabled={readonly}
        className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform duration-150 focus:outline-none`}
      >
        {halfFilled ? (
          <svg className={starSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={`half-${index}`}>
                <stop offset="50%" stopColor="#FDB022" />
                <stop offset="50%" stopColor="#4B5563" />
              </linearGradient>
            </defs>
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={`url(#half-${index})`}
              stroke="#FDB022"
              strokeWidth="1"
            />
          </svg>
        ) : (
          <svg className={starSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={filled ? '#FDB022' : '#4B5563'}
              stroke="#FDB022"
              strokeWidth="1"
            />
          </svg>
        )}
      </button>
    );
  };
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => renderStar(index))}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-400">
          {hoverValue !== null ? hoverValue.toFixed(1) : value.toFixed(1)} / 10
        </span>
      )}
    </div>
  );
}

export default StarRating;

