 "use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product, ProductCategory } from "@/types/product";

type ProductCatalogueProps = { products: Product[] };

const filters: Array<"All pieces" | ProductCategory> = [
  "All pieces",
  "Pralines",
  "Truffles",
  "Dark Chocolate",
  "Gift Boxes",
];

export function ProductCatalogue({ products }: ProductCatalogueProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All pieces");

  const visibleProducts = useMemo(
    () =>
      activeFilter === "All pieces"
        ? products
        : products.filter((product) => product.category === activeFilter),
    [activeFilter, products],
  );

  return (
    <div className="catalogue">
      <div className="catalogue__toolbar">
        <div className="filter-list" aria-label="Filter products by category">
          {filters.map((filter) => (
            <button
              className={`filter-chip${activeFilter === filter ? " is-active" : ""}`}
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>
        <span className="catalogue__count">
          <SlidersHorizontal size={14} />
          {visibleProducts.length.toString().padStart(2, "0")} pieces
        </span>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <p className="empty-state">More handmade pieces are coming soon.</p>
      )}
    </div>
  );
}
