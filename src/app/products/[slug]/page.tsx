import "../../globals.css";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { RatingPreview } from "@/components/rating-preview";
import { products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  return (
    <main className="detail-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Cacao Atelier home">
          <span className="brand__mark" aria-hidden="true">C<span>·</span>A</span>
          <span className="brand__name">CACAO ATELIER<span>HANDCRAFTED CHOCOLATES</span></span>
        </Link>
        <Link className="header-link" href="/#collection"><ArrowLeft size={15} /> Back to collection</Link>
      </header>

      <section className="detail-layout">
        <div className="detail-image">
          <Image src={product.image} alt={product.imageAlt} fill priority sizes="(max-width: 760px) 100vw, 50vw" />
        </div>
        <div className="detail-copy">
          <p className="eyebrow"><span className="eyebrow__number">CACAO ATELIER</span> / {product.category.toUpperCase()}</p>
          <h1>{product.name}</h1>
          <div className="detail-rating">
            <span className="detail-rating__stars" aria-hidden="true"><Star size={15} fill="currentColor" /> {product.rating.toFixed(1)}</span>
            <span>{product.reviewCount} sample reviews</span>
          </div>
          <p className="detail-description">{product.description}</p>
          <p className="detail-note">A small-batch creation, thoughtfully finished by hand. Product details and descriptions shown here are illustrative sample content.</p>
          <Link className="button button--gold" href="/#contact">Ask us about this piece <ArrowUpRight size={16} /></Link>

          <div className="detail-review-panel">
            <p className="eyebrow">YOUR IMPRESSION</p>
            <h2>Every opinion <em>matters.</em></h2>
            <p className="detail-review-intro">Enjoyed this piece? Leave a rating. Public reviews will be connected to a moderated submission flow in a later milestone.</p>
            <RatingPreview />
            <div className="review-sample">
              <div className="review-sample__top"><strong>Sample customer note</strong><span>★★★★★</span></div>
              <p>“A lovely little moment of indulgence. The balance of flavour is just right.”</p>
              <small>Illustrative sample review — not real customer feedback.</small>
            </div>
          </div>
        </div>
      </section>
      <footer className="detail-footer">
        <Link href="/#collection"><ArrowLeft size={14} /> Return to all chocolates</Link>
        <span>HANDCRAFTED · SMALL BATCH · THOUGHTFUL</span>
      </footer>
    </main>
  );
}
