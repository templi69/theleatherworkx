import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, Truck, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    freeDeliveryThreshold,
    setIsCheckoutOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const formatPKR = (val: number) => `Rs. ${val.toLocaleString('en-PK')}`;

  const remainingForFreeShipping = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E5DCD1] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8E0D5] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8B5A2B]" />
              <h2 className="font-serif-luxury text-xl font-bold text-stone-900">
                Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress in Pakistan */}
          <div className="p-3.5 bg-[#F4EDE5] border-b border-[#E5DCD1] text-xs">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-stone-700">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#8B5A2B]" />
                    Add <strong className="text-stone-900">{formatPKR(remainingForFreeShipping)}</strong> for Free Delivery
                  </span>
                  <span className="font-bold text-[#8B5A2B]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8B5A2B] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>You have unlocked FREE Express Delivery across Pakistan!</span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif-luxury text-lg font-bold text-stone-800">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Discover our handcrafted genuine leather collections, designed and stitched in Pakistan.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 bg-[#8B5A2B] text-white text-xs font-semibold rounded-md hover:bg-[#72451F] transition"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 bg-white rounded-lg border border-[#ECE4DA] shadow-xs relative"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md bg-[#F4EFEB] shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif-luxury text-sm font-bold text-stone-900 truncate">
                      {item.product.name}
                    </h4>

                    <p className="text-[11px] text-stone-500">
                      Shade: <span className="font-medium text-stone-800">{item.selectedColor}</span>
                    </p>

                    {item.monogramText && (
                      <p className="text-[10px] text-[#8B5A2B] font-bold tracking-wider">
                        Monogram: [{item.monogramText}]
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-stone-900">
                        {formatPKR(item.product.price * item.quantity)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone-200 rounded bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold text-stone-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Item Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-red-600 transition p-1 self-start"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#E8E0D5] space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900">{formatPKR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery (Nationwide Pakistan):</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatPKR(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Estimated Total:</span>
                  <span className="text-[#8B5A2B] text-base">{formatPKR(cartTotal)}</span>
                </div>
                <div className="text-[11px] text-stone-500 text-center font-medium bg-[#FAF8F5] p-2 rounded border border-[#ECE5DC]">
                  Payment Method: <strong>Cash on Delivery (Pay upon arrival)</strong>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-4 bg-[#8B5A2B] hover:bg-[#72451F] text-white rounded-md text-xs uppercase tracking-widest font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Cash on Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-stone-400 text-center">
                Dispatched via TCS / Leopards Courier with tracking number.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
