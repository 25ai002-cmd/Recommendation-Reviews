import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  readOnly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 'lg',
  readOnly = false
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  return (
    <div className="flex items-center gap-2 justify-center select-none" onMouseLeave={() => !readOnly && setHoverRating(null)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating !== null ? hoverRating : value) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            className={`p-1 transition-transform duration-150 focus:outline-none ${
              !readOnly ? 'hover:scale-125 active:scale-95 cursor-pointer' : 'cursor-default'
            }`}
            aria-label={`${star} Stars`}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors duration-150 ${
                isFilled
                  ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                  : 'text-slate-300 fill-slate-100'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
