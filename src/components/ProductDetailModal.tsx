import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, Sparkles, Shield, Truck, RefreshCw, Check, CheckCircle2 } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCartOpen } = useStore();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [monogramText, setMonogramText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  if (!selectedProduct) return null;

  // Set default color if not selected
  const currentColor = selectedColor || selectedProduct.colors[0]?.name || 'Standard';

  const allImages = [selectedProduct.image, ...selectedProduct.secondaryImages];

  const formatPKR = (val: number) => `Rs. ${val.toLocaleString('en-PK')}`;

  const handleAddToCart = () => {
    if (!selectedProduct.inStock) return;
    addToCart(selectedProduct, quantity, currentColor, monogramText);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-stone-100 text-stone-600 hover:text-stone-950 shadow-sm transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Images Column */}
          <div className="md:col-span-6 bg-[#F8F5F1] p-4 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="aspect-4/3 w-full rounded-lg overflow-hidden border border-[#E8DFC9] bg-white relative">
                <img
                  src={allImages[activeImageIndex] || selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center"
                />
                {selectedProduct.isBespokeHandPainted && (
                  <span className="absolute top-3 left-3 bg-[#8B5A2B] text-white text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Hand-Painted Artwork
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'border-[#8B5A2B] scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Guarantees Badge */}
            <div className="mt-6 pt-4 border-t border-[#E8E1D9] grid grid-cols-2 gap-3 text-stone-600 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8B5A2B] shrink-0" />
                <span>Cash on Delivery across Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#8B5A2B] shrink-0" />
                <span>Lifetime Leather Integrity</span>
              </div>
            </div>
          </div>

          {/* Product Details Column */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Category and Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="uppercase tracking-wider text-[#8B5A2B] font-semibold">
                  {selectedProduct.categoryLabel}
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="font-semibold text-stone-800 text-xs">
                    {selectedProduct.rating} ({selectedProduct.reviewsCount} verified reviews)
                  </span>
                </div>
              </div>

              {/* Title & Price */}
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                {selectedProduct.name}
              </h2>

              <div className="flex items-baseline gap-3 my-3">
                <span className="text-2xl font-bold text-[#1E1915]">
                  {formatPKR(selectedProduct.price)}
                </span>
                {selectedProduct.compareAtPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatPKR(selectedProduct.compareAtPrice)}
                  </span>
                )}
                <span className="text-xs bg-[#F5EDE4] text-[#8B5A2B] font-semibold px-2 py-0.5 rounded">
                  COD Available
                </span>
                {selectedProduct.inStock ? (
                  <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 font-semibold px-2 py-0.5 rounded">
                    {selectedProduct.stockQuantity !== undefined
                      ? selectedProduct.stockQuantity <= 3
                        ? `Only ${selectedProduct.stockQuantity} units left in atelier`
                        : `In Stock (${selectedProduct.stockQuantity} units)`
                      : 'In Stock'}
                  </span>
                ) : (
                  <span className="text-xs text-red-700 bg-red-50 border border-red-200 font-semibold px-2 py-0.5 rounded">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                {selectedProduct.description}
              </p>

              {/* Color Shade Selection */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-stone-800 mb-2">
                  Leather Shade: <span className="text-[#8B5A2B] font-bold">{currentColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {selectedProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition cursor-pointer ${
                        currentColor === c.name
                          ? 'border-[#8B5A2B] bg-[#FAF6F1] font-semibold text-stone-900'
                          : 'border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Complimentary Monogram Foil Stamping */}
              <div className="mb-5 p-3.5 bg-[#FAF8F5] border border-[#EADFCB] rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B]" />
                    <span className="text-xs font-bold text-stone-900">Complimentary Monogram (Optional)</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                    FREE
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mb-2">
                  Personalize with your initials hand-stamped in gold or blind deboss (e.g., "T.A.")
                </p>
                <input
                  type="text"
                  maxLength={5}
                  value={monogramText}
                  onChange={(e) => setMonogramText(e.target.value.toUpperCase())}
                  placeholder="Enter up to 4 initials (e.g. S.K.)"
                  className="w-full text-xs uppercase tracking-widest px-3 py-1.5 bg-white border border-stone-300 rounded focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              {/* Technical Specifications Specs Accordion / Grid */}
              <div className="border-t border-b border-[#F0EAE1] py-3 text-xs space-y-1.5 text-stone-600 mb-6">
                <div className="flex justify-between">
                  <span className="text-stone-400">Leather Grain:</span>
                  <span className="font-medium text-stone-800">{selectedProduct.leatherType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Tanning:</span>
                  <span className="font-medium text-stone-800">{selectedProduct.tanning}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Hardware:</span>
                  <span className="font-medium text-stone-800">{selectedProduct.hardware}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Dimensions:</span>
                  <span className="font-medium text-stone-800">{selectedProduct.dimensions}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="space-y-3">
              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-500 font-medium">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-stone-600 hover:text-stone-900 cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-stone-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-stone-600 hover:text-stone-900 cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedProduct.inStock}
                  className={`flex-1 py-3 px-4 rounded-md text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : selectedProduct.inStock
                      ? 'bg-[#8B5A2B] hover:bg-[#72451F] text-white shadow-md'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added to Bag
                    </>
                  ) : selectedProduct.inStock ? (
                    'Add to Bag'
                  ) : (
                    'Out of Stock'
                  )}
                </button>

                {selectedProduct.inStock && (
                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-5 border border-[#1E1915] bg-[#1E1915] hover:bg-black text-[#FAF8F5] rounded-md text-xs uppercase tracking-wider font-bold transition shadow-md cursor-pointer"
                  >
                    Order COD
                  </button>
                )}
              </div>

              {/* Pakistan City Delivery Time */}
              <p className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Estimated dispatch: 24-48 hours via TCS / Leopards Courier</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
