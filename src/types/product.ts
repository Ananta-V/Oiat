export type ProductCategory = "Pralines" | "Truffles" | "Dark Chocolate" | "Gift Boxes";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  category: ProductCategory;
  featured?: boolean;
  rating: number;
  reviewCount: number;
  note?: string;
};
