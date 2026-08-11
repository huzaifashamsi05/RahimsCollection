import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";

export const metadata = {
  title: "Add New Product | Admin | Rahim's Collection",
};

export default function NewProductPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="mb-4">
        <Link href="/admin/products" className="text-charcoal/50 hover:text-charcoal text-sm flex items-center gap-1 transition-colors">
          <span>&larr;</span> Back to Products
        </Link>
      </div>
      
      <div>
        <h1 className="font-serif text-3xl text-charcoal mb-2">Add New Product</h1>
        <p className="text-charcoal/60 text-sm">Create a new product by filling out the details below.</p>
      </div>

      <ProductForm />
    </div>
  );
}
