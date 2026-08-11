"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { toggleProductStatus, toggleFeatured, deleteProduct } from "@/lib/actions/products";

export default function AdminProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = async (id: string, field: 'is_new_arrival' | 'is_sold_out', currentValue: boolean) => {
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field === 'is_new_arrival' ? 'isNewArrival' : 'isSoldOut']: !currentValue } : p));
    const result = await toggleProductStatus(id, field, currentValue);
    if (result.error) {
      setError(result.error);
      // Revert on error
      setProducts(initialProducts);
    }
  };

  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    setError(null);
    const result = await toggleFeatured(id, currentValue);
    if (result.error) {
      setError(result.error);
    } else {
      // Update local state without full reload
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isFeaturedNewArrival: !currentValue } : p));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    setError(null);
    const result = await deleteProduct(id);
    if (result.error) {
      setError(result.error);
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-serif text-3xl text-charcoal">Products</h1>
        <Link 
          href="/admin/products/new"
          className="px-6 py-2 bg-charcoal text-cream font-medium tracking-wide hover:bg-gold transition-colors"
        >
          + Add New Product
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-charcoal/20 px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm bg-red-50 px-3 py-1 border border-red-200">
            {error}
          </div>
        )}
      </div>

      <div className="bg-white border border-charcoal/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-charcoal-light/5 text-charcoal/60 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Pricing</th>
                <th className="px-6 py-4 font-medium">Status & Visibility</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {filteredProducts.map(product => {
                const defaultColor = product.colors.find(c => c.isDefault) || product.colors[0];
                const thumbnail = defaultColor?.images[0] || '/images/placeholder.jpg';

                return (
                  <tr key={product.id} className="hover:bg-charcoal/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-16 bg-cream/50 overflow-hidden flex-shrink-0 border border-charcoal/10">
                          <Image src={thumbnail} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-charcoal">{product.name}</div>
                          <div className="text-charcoal/50 text-xs capitalize">
                            {product.category} &bull; {product.pieceCount}-Piece &bull; {product.stockType.replace('-', ' ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.salePrice ? (
                        <div>
                          <div className="text-red-600 font-medium">Rs. {product.salePrice.toLocaleString()}</div>
                          <div className="text-charcoal/40 line-through text-xs">Rs. {product.price.toLocaleString()}</div>
                        </div>
                      ) : (
                        <div className="font-medium">Rs. {product.price.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleToggleStatus(product.id, 'is_new_arrival', product.isNewArrival)}
                          className={`text-xs px-2 py-1 border transition-colors ${product.isNewArrival ? 'bg-gold/10 border-gold text-gold-dark' : 'bg-transparent border-charcoal/20 text-charcoal/40 hover:border-gold'}`}
                        >
                          New Arrival
                        </button>
                        <button 
                          onClick={() => handleToggleFeatured(product.id, !!product.isFeaturedNewArrival)}
                          className={`text-xs px-2 py-1 border transition-colors ${product.isFeaturedNewArrival ? 'bg-charcoal text-cream border-charcoal' : 'bg-transparent border-charcoal/20 text-charcoal/40 hover:border-charcoal'}`}
                        >
                          Featured
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(product.id, 'is_sold_out', product.isSoldOut)}
                          className={`text-xs px-2 py-1 border transition-colors ${product.isSoldOut ? 'bg-red-50 border-red-200 text-red-600' : 'bg-transparent border-charcoal/20 text-charcoal/40 hover:border-red-200'}`}
                        >
                          Sold Out
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm font-medium text-gold hover:text-charcoal transition-colors uppercase tracking-widest"
                        >
                          Edit
                        </Link>
                        <span className="text-charcoal/20">|</span>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-charcoal/50">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
