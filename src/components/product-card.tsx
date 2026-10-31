import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  index: number;
};

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <article className="product-card" style={{ animationDelay: `${index * 70}ms` }}>
      <Link
        className="product-card__image-link"
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
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
          <span className="product-card__quick-view" aria-hidden="true">
            <ArrowUpRight size={18} strokeWidth={1.5} />
          </span>
        </div>
      </Link>

      <div className="product-card__meta">
        <span className="eyebrow">{product.category}</span>
        <span className="product-card__rating" aria-label={`${product.rating} out of 5 stars`}>
          <Star size={13} fill="currentColor" strokeWidth={1.3} />
          {product.rating.toFixed(1)}
          <span className="muted">({product.reviewCount})</span>
        </span>
      </div>

      <h3 className="product-card__title">
        <Link href={`/products/${product.slug}`}>{product.name}</Link>
      </h3>
      <p className="product-card__description">{product.description}</p>
    </article>
  );
}
