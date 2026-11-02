"use client";

import React, { useEffect, useState } from "react";

type ReviewItem = {
  name: string;
  rating: number;
  message: string;
  chocolate: string;
};

const CURATED_REVIEWS: ReviewItem[] = [
  {
    name: "Aanya M.",
    rating: 5,
    message: "The dark chocolate shell with roasted almond is absolute perfection. Melt-in-mouth texture and not overly sweet!",
    chocolate: "Secret Crush",
  },
  {
    name: "Rohan S.",
    rating: 5,
    message: "That Nutella centre made my entire Sunday. You can immediately tell it is handcrafted in small batches.",
    chocolate: "Sweet Surrender",
  },
  {
    name: "Priya K.",
    rating: 5,
    message: "The combination of cocoa cashew and dark chocolate is dangerously addictive. Ordered another box right away.",
    chocolate: "Bad Habit",
  },
  {
    name: "Devansh T.",
    rating: 5,
    message: "The marshmallow and crisps combination took me straight back to childhood. Outstanding freshness and crunch.",
    chocolate: "Sugar Rush",
  },
  {
    name: "Meera R.",
    rating: 5,
    message: "Rich 70% cocoa with zero bitterness. Deep, nuanced flavour notes. Our family devoured the entire box.",
    chocolate: "Dark Affair",
  },
  {
    name: "Arjun N.",
    rating: 5,
    message: "The marble swirl of dark and white chocolate is both visually stunning and delicious. Truly made with love.",
    chocolate: "Mixed Signals",
  },
];

export default function OiAIReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(CURATED_REVIEWS);

  useEffect(() => {
    // Optionally fetch recent feedback from API and merge
    fetch("/api/feedback")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.feedback) && data.feedback.length > 0) {
          const apiReviews: ReviewItem[] = data.feedback
            .filter((f: any) => f.name && f.message)
            .map((f: any) => ({
              name: f.name,
              rating: Number(f.rating) || 5,
              message: f.message,
              chocolate: f.product_name || f.context || "Chocolate Sample",
            }));
          if (apiReviews.length > 0) {
            // Combine API reviews first with curated reviews up to 6
            const combined = [...apiReviews, ...CURATED_REVIEWS].slice(0, 6);
            setReviews(combined);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-heading reveal">
        <span className="eyebrow">TASTE NOTES &amp; COMMUNITY REVIEWS</span>
        <h2>
          Kind words from <em>our chocolate lovers.</em>
        </h2>
        <p>
          Honest little impressions left after that very first bite. Every note means the world to our kitchen.
        </p>
      </div>

      <div className="reviews-grid">
        {reviews.map((rev, index) => (
          <article
            className="review-card reveal"
            key={`${rev.name}-${index}`}
            style={{ transitionDelay: `${index * 130}ms` }}
          >
            <div className="review-card-top">
              <h3 className="review-author-name">{rev.name}</h3>
              <div
                className="review-stars"
                aria-label={`${rev.rating} out of 5 stars`}
              >
                {"★".repeat(Math.min(Math.max(rev.rating, 1), 5))}
                {"☆".repeat(Math.max(0, 5 - rev.rating))}
              </div>
            </div>

            <p className="review-text">&ldquo;{rev.message}&rdquo;</p>

            <div className="review-chocolate-badge">
              <span>🍫</span>
              <span>{rev.chocolate}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
