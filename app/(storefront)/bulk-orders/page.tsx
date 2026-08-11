import { getAllProducts } from "@/lib/queries/products";
import BulkOrdersClient from "@/components/bulk-orders/BulkOrdersClient";

export default async function BulkOrdersPage() {
  const products = await getAllProducts();
  const popularResellerProducts = products.slice(0, 8); // Display first 8

  return <BulkOrdersClient popularResellerProducts={popularResellerProducts} />;
}
