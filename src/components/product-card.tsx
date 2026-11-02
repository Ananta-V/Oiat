"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  index: number;
};

function handleCardClick(e: React.MouseEvent | React.KeyboardEvent, product: Product) {
  e.preventDefault();
  if (typeof window !== "undefined" && typeof (window as any).openFeedback === "function") {
    (window as any).openFeedback(product.name, product.name, product.id);
  }
}

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <article
      className="product-card"
      style={{ animationDelay: `${index * 70}ms`, cursor: "pointer" }}
      onClick={(e) => handleCardClick(e, product)}
      role="button"
      tabIndex={0}
      aria-label={`Leave a taste note for ${product.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleCardClick(e, product);
      }}
    >
      <div className="product-card__image-wrap">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="product-card__image"
        />
        {product.note ? <span className="product-card__note">{product.note}</span> : null}
      </div>

      <div className="product-card__meta">
        <span className="eyebrow">{product.category}</span>
        <span className="product-card__rating" aria-label={`${product.rating} out of 5 stars`}>
          <Star size={13} fill="currentColor" strokeWidth={1.3} />
          {product.rating.toFixed(1)}
          <span className="muted">({product.reviewCount})</span>
        </span>
      </div>

      <h3 className="product-card__title">{product.name}</h3>
      <p className="product-card__description">{product.description}</p>
    </article>
  );
}
