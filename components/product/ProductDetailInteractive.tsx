"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfoPanel from "@/components/product/ProductInfoPanel";

export default function ProductDetailInteractive({ product }: { product: Product }) {
  // Initialize selected color to the default color
  const defaultColor = product.colors.find((c) => c.isDefault) || product.colors[0];
  const [selectedColorName, setSelectedColorName] = useState(defaultColor.name);

  // Find the selected color object to pass its images to the gallery
  const activeColor = product.colors.find((c) => c.name === selectedColorName) || defaultColor;

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
      {/* Left Column: Gallery */}
      <div className="lg:col-span-7 xl:col-span-7">
        <ProductGallery
          key={`gallery-${product.id}-${selectedColorName}`}
          images={activeColor.images as [string, ...string[]]}
          productName={product.name}
        />
      </div>

      {/* Right Column: Info Panel */}
      <div className="lg:col-span-5 xl:col-span-5 mt-8 lg:mt-0">
        <ProductInfoPanel
          key={`info-${product.id}`}
          product={product}
          selectedColorName={selectedColorName}
          onColorChange={setSelectedColorName}
        />
      </div>
    </div>
  );
}
