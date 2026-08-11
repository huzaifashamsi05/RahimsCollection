import { getAllProducts } from "@/lib/queries/products";
import AdminProductList from "@/components/admin/AdminProductList";

export const metadata = {
  title: "Products | Admin | Rahim's Collection",
};

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return <AdminProductList initialProducts={products} />;
}
