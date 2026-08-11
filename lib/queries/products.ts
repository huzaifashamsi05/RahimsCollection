import { createClient } from '../supabase/server';
import { Product, ProductColor, StockType, PieceCount } from '@/types/product';

/**
 * Helper function to map a raw database row to our typed Product interface
 */
function mapProduct(row: any): Product {
  const colors: ProductColor[] = (row.product_colors || [])
    .sort((a: any, b: any) => a.display_order - b.display_order)
    .map((c: any) => ({
      name: c.name,
      hex: c.hex,
      isDefault: c.is_default,
      images: (c.product_color_images || [])
        .sort((imgA: any, imgB: any) => imgA.display_order - imgB.display_order)
        .map((img: any) => img.url),
    }));

  const sizes = (row.product_sizes || [])
    .sort((a: any, b: any) => a.display_order - b.display_order)
    .map((s: any) => s.size);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    salePrice: row.sale_price != null ? Number(row.sale_price) : undefined,
    category: row.category,
    stockType: row.stock_type as StockType,
    pieceCount: row.piece_count as PieceCount,
    isNewArrival: row.is_new_arrival,
    isFeaturedNewArrival: row.is_featured_new_arrival,
    isSoldOut: row.is_sold_out,
    restockable: row.restockable,
    scarcityLabel: row.scarcity_label || undefined,
    description: row.description || '',
    colors,
    sizes,
  };
}

const productQueryString = `
  *,
  product_colors (
    *,
    product_color_images (*)
  ),
  product_sizes (*)
`;

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(productQueryString)
    .order('created_at', { ascending: true });

  if (error || !data) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(productQueryString)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return mapProduct(data);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(productQueryString)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapProduct(data);
}

export async function getFeaturedNewArrivals(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(productQueryString)
    .eq('is_featured_new_arrival', true)
    .order('created_at', { ascending: true });

  if (error || !data) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data.map(mapProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(productQueryString)
    .eq('category', category)
    .order('created_at', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map(mapProduct);
}

export async function getRelatedProducts(currentProductId: string, category: string, limit: number = 4): Promise<Product[]> {
  const supabase = await createClient();
  // Fetch from same category first
  const { data: sameCategoryData } = await supabase
    .from('products')
    .select(productQueryString)
    .eq('category', category)
    .neq('id', currentProductId)
    .limit(limit);

  let results = (sameCategoryData || []).map(mapProduct);

  // If not enough in category, fetch others
  if (results.length < limit) {
    const { data: fallbackData } = await supabase
      .from('products')
      .select(productQueryString)
      .neq('id', currentProductId)
      .neq('category', category)
      .limit(limit - results.length);

    if (fallbackData) {
      results = [...results, ...fallbackData.map(mapProduct)];
    }
  }

  return results;
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  
  // We only count products that are NOT sold out
  const { data, error } = await supabase
    .from('products')
    .select('category, is_sold_out')
    .eq('is_sold_out', false);

  if (error || !data) {
    return {};
  }

  return data.reduce((acc: Record<string, number>, item: any) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
}
