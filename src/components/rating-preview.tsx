 "use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function RatingPreview() {
  const [rating, setRating] = useState(0);

  return (
    <div className="rating-preview">
      <p className="rating-preview__label">Leave a rating</p>
      <div className="rating-preview__stars" role="group" aria-label="Choose a rating from zero to five">
        <button type="button" className="rating-zero" onClick={() => setRating(0)} aria-pressed={rating === 0}>
          0
        </button>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            type="button"
            key={value}
            className={`rating-star${rating >= value ? " is-selected" : ""}`}
            onClick={() => setRating(value)}
            aria-label={`${value} out of 5`}
            aria-pressed={rating === value}
          >
            <Star size={22} fill={rating >= value ? "currentColor" : "none"} strokeWidth={1.5} />
          </button>
        ))}
      </div>
      <p className="rating-preview__note" aria-live="polite">
        {rating === 0 ? "Choose a rating to preview the interaction." : `You selected ${rating} out of 5. Ratings will be saved when the review API is connected.`}
      </p>
    </div>
  );
}
