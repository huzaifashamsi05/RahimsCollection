"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product, ProductColor } from "@/types/product";
import { saveProduct } from "@/lib/actions/products";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["raw-silk", "chiffon", "organza", "georgette", "net", "velvet", "lawn", "linen"];
const ALL_SIZES = ["S", "M", "L", "XL"];

export default function ProductForm({ initialData }: { initialData?: Product }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [salePrice, setSalePrice] = useState(initialData?.salePrice?.toString() || "");
  const [stockType, setStockType] = useState<"ready" | "made-to-order">(initialData?.stockType || "made-to-order");
  const [restockable, setRestockable] = useState(initialData?.restockable ?? false);
  const [pieceCount, setPieceCount] = useState<2 | 3>(initialData?.pieceCount || 3);
  
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
  
  const [isNewArrival, setIsNewArrival] = useState(initialData?.isNewArrival ?? false);
  const [isFeaturedNewArrival, setIsFeaturedNewArrival] = useState(initialData?.isFeaturedNewArrival ?? false);
  const [scarcityLabel, setScarcityLabel] = useState(initialData?.scarcityLabel || "");

  const [colors, setColors] = useState<ProductColor[]>(
    initialData?.colors || [{ name: "", hex: "#000000", isDefault: true, images: [] }]
  );

  const handleColorChange = (index: number, field: keyof ProductColor, value: any) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const handleSetDefaultColor = (index: number) => {
    setColors(colors.map((c, i) => ({ ...c, isDefault: i === index })));
  };

  const addColor = () => {
    setColors([...colors, { name: "", hex: "#000000", isDefault: colors.length === 0, images: [] }]);
  };

  const removeColor = (index: number) => {
    if (colors[index].images.length > 0) {
      if (!confirm("This color has uploaded images. Are you sure you want to remove it?")) return;
    }
    const newColors = colors.filter((_, i) => i !== index);
    if (colors[index].isDefault && newColors.length > 0) {
      newColors[0].isDefault = true;
    }
    setColors(newColors);
  };

  // Simple file upload handler
  const handleImageUpload = async (colorIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const supabase = createClient();
    
    // Set an uploading placeholder or just block until done for simplicity. 
    // For robust UX, we would show a loading spinner per color.
    // We will do simple sequential upload here.
    const newUrls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (error) {
        alert(`Error uploading image: ${error.message}`);
        continue;
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(data.path);
        newUrls.push(publicUrlData.publicUrl);
      }
    }

    if (newUrls.length > 0) {
      const newColors = [...colors];
      newColors[colorIndex].images = [...newColors[colorIndex].images, ...newUrls];
      setColors(newColors);
    }
  };

  const removeImage = (colorIndex: number, imageIndex: number) => {
    const newColors = [...colors];
    newColors[colorIndex].images = newColors[colorIndex].images.filter((_, i) => i !== imageIndex);
    setColors(newColors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validation
    if (colors.length === 0) {
      setError("At least one color is required.");
      setSubmitting(false);
      return;
    }
    if (!colors.some(c => c.isDefault)) {
      setError("Exactly one color must be marked as Default.");
      setSubmitting(false);
      return;
    }
    for (const c of colors) {
      if (c.images.length === 0) {
        setError(`Color "${c.name || 'Unnamed'}" must have at least one image.`);
        setSubmitting(false);
        return;
      }
      if (!c.name || !c.hex) {
        setError("All colors must have a name and hex value.");
        setSubmitting(false);
        return;
      }
    }
    if (sizes.length === 0) {
      setError("At least one size is required (e.g. Unstitched/Free size can just be one option).");
      setSubmitting(false);
      return;
    }

    const payload = {
      id: initialData?.id, // undefined if new
      slug: initialData?.slug,
      name,
      description,
      category,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      stockType,
      restockable,
      pieceCount,
      sizes,
      isNewArrival,
      isFeaturedNewArrival,
      scarcityLabel,
      colors,
    };

    const result = await saveProduct(payload);
    
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      router.push("/admin/products");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 pb-20">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* 1. Basic Info */}
      <section className="bg-white p-6 rounded border border-charcoal/10 space-y-4 shadow-sm">
        <h2 className="font-serif text-xl text-charcoal mb-4">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Product Name *</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Category *</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold capitalize">
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Description</label>
          <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" />
        </div>
      </section>

      {/* 2. Pricing & Stock */}
      <section className="bg-white p-6 rounded border border-charcoal/10 space-y-4 shadow-sm">
        <h2 className="font-serif text-xl text-charcoal mb-4">Pricing & Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Price (Rs.) *</label>
            <input required type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Sale Price (Rs.)</label>
            <input type="number" min="0" value={salePrice} onChange={e => setSalePrice(e.target.value)} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" placeholder="Leave blank if not on sale" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Stock Type *</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStockType("ready")} className={`flex-1 py-2 rounded border text-sm transition-colors ${stockType === 'ready' ? 'bg-charcoal text-cream border-charcoal' : 'bg-charcoal/5 text-charcoal border-charcoal/10 hover:border-charcoal/30'}`}>Ready to Ship</button>
              <button type="button" onClick={() => setStockType("made-to-order")} className={`flex-1 py-2 rounded border text-sm transition-colors ${stockType === 'made-to-order' ? 'bg-charcoal text-cream border-charcoal' : 'bg-charcoal/5 text-charcoal border-charcoal/10 hover:border-charcoal/30'}`}>Made to Order</button>
            </div>
            {stockType === "ready" && (
              <label className="flex items-center gap-2 mt-3 text-sm text-charcoal/70">
                <input type="checkbox" checked={restockable} onChange={e => setRestockable(e.target.checked)} className="accent-gold" />
                Restockable?
              </label>
            )}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Piece Count *</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPieceCount(2)} className={`flex-1 py-2 rounded border text-sm transition-colors ${pieceCount === 2 ? 'bg-charcoal text-cream border-charcoal' : 'bg-charcoal/5 text-charcoal border-charcoal/10 hover:border-charcoal/30'}`}>2-Piece</button>
              <button type="button" onClick={() => setPieceCount(3)} className={`flex-1 py-2 rounded border text-sm transition-colors ${pieceCount === 3 ? 'bg-charcoal text-cream border-charcoal' : 'bg-charcoal/5 text-charcoal border-charcoal/10 hover:border-charcoal/30'}`}>3-Piece</button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sizes */}
      <section className="bg-white p-6 rounded border border-charcoal/10 space-y-4 shadow-sm">
        <h2 className="font-serif text-xl text-charcoal mb-4">Sizes *</h2>
        <div className="flex flex-wrap gap-4">
          {ALL_SIZES.map(s => (
            <label key={s} className="flex items-center gap-2 text-charcoal cursor-pointer">
              <input 
                type="checkbox" 
                checked={sizes.includes(s)}
                onChange={e => {
                  if (e.target.checked) setSizes([...sizes, s]);
                  else setSizes(sizes.filter(size => size !== s));
                }}
                className="w-4 h-4 accent-gold cursor-pointer" 
              />
              {s}
            </label>
          ))}
        </div>
      </section>

      {/* 4. Colors & Photos */}
      <section className="bg-white p-6 rounded border border-charcoal/10 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-charcoal">Colors & Photos *</h2>
          <Button type="button" variant="secondary" size="sm" onClick={addColor}>+ Add Color</Button>
        </div>

        <div className="space-y-6">
          {colors.map((color, colorIdx) => (
            <div key={colorIdx} className="p-4 border border-charcoal/10 bg-[#FAF7F2] rounded space-y-4 relative">
              {colors.length > 1 && (
                <button type="button" onClick={() => removeColor(colorIdx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pr-16">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Color Name *</label>
                  <input required type="text" value={color.name} onChange={e => handleColorChange(colorIdx, 'name', e.target.value)} className="w-full bg-white border border-charcoal/10 rounded px-3 py-2 text-charcoal focus:outline-none focus:border-gold" placeholder="e.g. Midnight Blue" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Visual Picker *</label>
                  <div className="flex items-center gap-2 bg-white border border-charcoal/10 rounded px-2 py-1">
                    <input type="color" value={color.hex} onChange={e => handleColorChange(colorIdx, 'hex', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none p-0" />
                    <span className="text-sm font-mono text-charcoal/60">{color.hex}</span>
                  </div>
                </div>
                <div className="flex items-center sm:justify-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-charcoal">
                    <input type="radio" name="default_color" checked={color.isDefault} onChange={() => handleSetDefaultColor(colorIdx)} className="w-4 h-4 accent-gold" />
                    Set as Default
                  </label>
                </div>
              </div>

              {/* Images */}
              <div className="mt-4 border-t border-charcoal/10 pt-4">
                <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Images ({color.images.length}) *</label>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {color.images.map((url, imgIdx) => (
                    <div key={imgIdx} className="relative w-24 h-32 border border-charcoal/10 bg-white group">
                      <Image src={url} alt={`${color.name} image ${imgIdx}`} fill className="object-cover" />
                      <button type="button" onClick={() => removeImage(colorIdx, imgIdx)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                  
                  <div className="w-24 h-32 border-2 border-dashed border-charcoal/20 flex flex-col items-center justify-center bg-white/50 relative hover:bg-charcoal/5 transition-colors cursor-pointer">
                    <span className="text-2xl text-charcoal/30">+</span>
                    <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(colorIdx, e)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                </div>
                <p className="text-xs text-charcoal/40">Select multiple images at once. The first image will be the primary thumbnail for this color.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Visibility */}
      <section className="bg-white p-6 rounded border border-charcoal/10 space-y-4 shadow-sm">
        <h2 className="font-serif text-xl text-charcoal mb-4">Visibility Options</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isNewArrival} onChange={e => setIsNewArrival(e.target.checked)} className="w-5 h-5 accent-gold" />
            <div>
              <div className="font-medium text-charcoal">Mark as New Arrival</div>
              <div className="text-xs text-charcoal/50">Shows the "New Arrival" badge on product cards.</div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isFeaturedNewArrival} onChange={e => setIsFeaturedNewArrival(e.target.checked)} className="w-5 h-5 accent-gold" />
            <div>
              <div className="font-medium text-charcoal">Feature in Homepage Showcase</div>
              <div className="text-xs text-charcoal/50">Appears in the scrollytelling section. Maximum 5 products total.</div>
            </div>
          </label>
          <div className="pt-2">
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Scarcity / FOMO Label</label>
            <input type="text" value={scarcityLabel} onChange={e => setScarcityLabel(e.target.value)} placeholder="e.g. Only 2 Left!" className="w-full max-w-sm bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" />
            <div className="text-xs text-charcoal/50 mt-1">Leave blank if not applicable. Highlights urgency on the product page.</div>
          </div>
        </div>
      </section>

      <div className="flex gap-4 pt-4 border-t border-charcoal/10">
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? "Saving..." : "Save Product"}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => router.push('/admin/products')} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
