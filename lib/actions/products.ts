'use server';

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';

// Helper to check admin auth
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return supabase;
}

export async function toggleProductStatus(id: string, field: 'is_new_arrival' | 'is_sold_out', currentValue: boolean) {
  const supabase = await requireAdmin();
  
  const { error } = await supabase
    .from('products')
    .update({ [field === 'is_new_arrival' ? 'is_new_arrival' : 'is_sold_out']: !currentValue })
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/');
  return { success: true };
}

export async function toggleFeatured(id: string, currentValue: boolean) {
  const supabase = await requireAdmin();
  
  // If we are trying to feature it, check if we already have 5
  if (!currentValue) {
    const { count, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_featured_new_arrival', true);
      
    if (countError) return { error: countError.message };
    if (count && count >= 5) {
      return { error: 'Maximum 5 products can be featured on the homepage showcase. Please un-feature one first.' };
    }
  }

  const { error } = await supabase
    .from('products')
    .update({ is_featured_new_arrival: !currentValue })
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath('/admin/products');
  revalidatePath('/');
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await requireAdmin();
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/');
  return { success: true };
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function saveProduct(productData: any) {
  const supabase = await requireAdmin();
  
  try {
    const isEditing = !!productData.id;
    let productId = productData.id;
    
    // Validate basics
    if (!productData.name || !productData.category) {
      throw new Error("Name and Category are required.");
    }
    if (!productData.colors || productData.colors.length === 0) {
      throw new Error("At least one color is required.");
    }
    
    const hasDefaultColor = productData.colors.some((c: any) => c.isDefault);
    if (!hasDefaultColor) {
      throw new Error("Exactly one color must be marked as Default.");
    }

    const slug = isEditing ? productData.slug : generateSlug(productData.name);

    const productRow = {
      name: productData.name,
      slug: slug,
      description: productData.description || "",
      price: productData.price,
      sale_price: productData.salePrice || null,
      category: productData.category,
      stock_type: productData.stockType,
      piece_count: productData.pieceCount,
      is_new_arrival: productData.isNewArrival || false,
      is_featured_new_arrival: productData.isFeaturedNewArrival || false,
      is_sold_out: productData.isSoldOut || false,
      restockable: productData.restockable || false,
      scarcity_label: productData.scarcityLabel || null,
    };

    if (isEditing) {
      const { error: updateError } = await supabase
        .from('products')
        .update(productRow)
        .eq('id', productId);
      if (updateError) throw new Error(updateError.message);
    } else {
      const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert(productRow)
        .select()
        .single();
      if (insertError) throw new Error(insertError.message);
      productId = newProduct.id;
    }

    // Upserting relations: For a clean slate, delete existing sizes and colors (colors cascade to images)
    // and re-insert them. 
    if (isEditing) {
      await supabase.from('product_sizes').delete().eq('product_id', productId);
      await supabase.from('product_colors').delete().eq('product_id', productId);
    }

    // Insert Sizes
    if (productData.sizes && productData.sizes.length > 0) {
      const sizesToInsert = productData.sizes.map((s: string, index: number) => ({
        product_id: productId,
        size: s,
        display_order: index
      }));
      const { error: sizesError } = await supabase.from('product_sizes').insert(sizesToInsert);
      if (sizesError) throw new Error(sizesError.message);
    }

    // Insert Colors
    for (let i = 0; i < productData.colors.length; i++) {
      const color = productData.colors[i];
      const { data: colorRow, error: colorError } = await supabase.from('product_colors').insert({
        product_id: productId,
        name: color.name,
        hex: color.hex,
        is_default: color.isDefault,
        display_order: i
      }).select().single();
      
      if (colorError) throw new Error(colorError.message);

      // Insert Color Images
      if (color.images && color.images.length > 0) {
        const imagesToInsert = color.images.map((url: string, imgIndex: number) => ({
          product_color_id: colorRow.id,
          url: url,
          display_order: imgIndex
        }));
        
        const { error: imagesError } = await supabase.from('product_color_images').insert(imagesToInsert);
        if (imagesError) throw new Error(imagesError.message);
      }
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');
    
    return { success: true, productId };

  } catch (error: any) {
    return { error: error.message };
  }
}
