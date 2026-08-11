import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/queries/products";

export const metadata = {
  title: "Edit Product | Admin | Rahim's Collection",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="mb-4">
        <Link href="/admin/products" className="text-charcoal/50 hover:text-charcoal text-sm flex items-center gap-1 transition-colors">
          <span>&larr;</span> Back to Products
        </Link>
      </div>
      
      <div>
        <h1 className="font-serif text-3xl text-charcoal mb-2">Edit Product</h1>
        <p className="text-charcoal/60 text-sm">Update the details for <strong>{product.name}</strong>.</p>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}
