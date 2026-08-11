import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getAllProducts } from "@/lib/queries/products";
import { Product } from "@/types/product";
import Button from "@/components/ui/Button";
import ProductDetailInteractive from "@/components/product/ProductDetailInteractive";
import RelatedProducts from "@/components/product/RelatedProducts";

// Removed generateStaticParams because the Supabase client uses cookies() which isn't allowed during build time

function titleCase(str: string) {
  return str.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  let relatedProducts: Product[] = [];
  if (product) {
    relatedProducts = await getRelatedProducts(product.id, product.category, 8);
  }

  // 1) Not-found handling
  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F2] pt-32 pb-24 px-4 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-charcoal/8 flex items-center justify-center">
          <svg className="w-9 h-9 text-charcoal/30" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="font-serif text-3xl text-charcoal">Product not found</h1>
          <p className="font-sans text-sm text-charcoal/60">
            The item you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        <Link href="/shop" passHref>
          <Button variant="primary" size="md">
            Return to Shop
          </Button>
        </Link>
      </div>
    );
  }

  // 2) Detail page layout shell
  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-24 md:pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="mb-6 md:mb-10">
          <ol className="flex items-center gap-2 font-sans text-xs text-charcoal/40 flex-wrap">
            <li>
              <Link href="/" className="hover:text-gold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="hover:text-gold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/shop?category=${product.category}`} className="hover:text-gold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm">
                {titleCase(product.category)}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">
              <span className="text-charcoal/60">{product.name}</span>
            </li>
          </ol>
        </nav>

        {/* ── Main Layout Shell ── */}
        <ProductDetailInteractive product={product} />
      </div>

      {/* ── Related Products (Step 14) ── */}
      <RelatedProducts relatedProducts={relatedProducts} />
    </div>
  );
}
