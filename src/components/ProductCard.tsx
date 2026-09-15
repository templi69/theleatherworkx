import React, { memo, useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, Sparkles, Plus, Eye, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=75';

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  const { setSelectedProduct, addToCart } = useStore();
  const [imgSrc, setImgSrc] = useState(product.image);
  const [imgHasError, setImgHasError] = useState(false);

  const formatPKR = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-lg overflow-hidden border border-[#EBE3D8] hover:border-[#8B5A2B]/40 hover:shadow-md transition-all duration-300">
      {/* Image Container */}
      <div 
        className="relative aspect-4/3 w-full bg-[#F4EFEB] overflow-hidden cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        {imgHasError ? (
          <div className="h-full w-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
            <ImageOff className="w-8 h-8 text-stone-300 mb-1" />
            <span className="text-[11px] font-serif-luxury font-bold text-stone-600">{product.name}</span>
            <span className="text-[10px] text-stone-400">Atelier Lahore</span>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
            onError={() => {
              if (imgSrc !== FALLBACK_IMAGE) {
                setImgSrc(FALLBACK_IMAGE);
              } else {
                setImgHasError(true);
              }
            }}
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.tag && (
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-sm bg-[#1E1915] text-[#D4AF37] shadow-xs">
              {product.tag}
            </span>
          )}
          {product.isBespokeHandPainted && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-sm bg-[#8B5A2B] text-white shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              Hand-Painted
            </span>
          )}
        </div>

        {/* Stock status badge if out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-700 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded">
              Temporarily Sold Out
            </span>
          </div>
        )}

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/95 hover:bg-white text-stone-900 text-xs font-medium rounded shadow-sm backdrop-blur-xs transition"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
          {product.inStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="flex items-center justify-center px-3 py-2 bg-[#8B5A2B] hover:bg-[#70421B] text-white text-xs font-medium rounded shadow-sm transition"
              title="Add to Bag"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
          <span className="uppercase tracking-wider text-[#8B5A2B] font-medium">
            {product.categoryLabel}
          </span>
          <div className="flex items-center gap-1 text-stone-700">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400 text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => setSelectedProduct(product)}
          className="font-serif-luxury text-lg font-bold text-stone-900 hover:text-[#8B5A2B] cursor-pointer line-clamp-1 transition-colors"
        >
          {product.name}
        </h3>

        {/* Leather Specification Tagline */}
        <p className="text-xs text-stone-500 mt-1 line-clamp-1">
          {product.leatherType}
        </p>

        {/* Color variants preview dots */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {product.colors.map((c, idx) => (
            <span
              key={idx}
              className="w-2.5 h-2.5 rounded-full border border-stone-300"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          <span className="text-[10px] text-stone-400 ml-1">{product.colors.length} shades</span>
        </div>

        {/* Price & COD indicator */}
        <div className="mt-3 pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#1E1915]">
                {formatPKR(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPKR(product.compareAtPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-500 block font-medium">Cash on Delivery</span>
          </div>

          <button
            onClick={() => setSelectedProduct(product)}
            className="text-xs font-semibold text-[#8B5A2B] hover:text-[#5E3614] transition-colors underline-offset-4 hover:underline"
          >
            Customize &rarr;
          </button>
        </div>
      </div>
    </div>
  );
});
