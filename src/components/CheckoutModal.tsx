import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PAKISTAN_CITIES, PROVINCES } from '../data/products';
import { CustomerInfo } from '../types';
import { X, Truck, ShieldCheck, Banknote, MapPin, Mail, Phone, User, CheckCircle } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    placeOrder,
  } = useStore();

  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '',
    deliveryNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCheckoutOpen) return null;

  const formatPKR = (val: number) => `Rs. ${val.toLocaleString('en-PK')}`;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required for order invoice';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Contact number is required for courier delivery verification';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Please enter a valid 11-digit Pakistani phone number (e.g. 0300-1234567)';
    }
    if (!formData.address.trim()) {
      errs.address = 'Detailed home address (House/Street/Sector) is required';
    }
    if (!formData.city.trim()) errs.city = 'City is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder(formData);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE2D7] bg-[#FAF8F5] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#8B5A2B] font-bold">Checkout</span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-medium">Pakistan Nationwide Delivery</span>
            </div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900">
              Cash on Delivery (COD) Order
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Section 1: Customer Contact Info */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-stone-900 font-semibold text-sm border-b border-[#F0EAE1] pb-1.5">
              <User className="w-4 h-4 text-[#8B5A2B]" />
              <span>1. Contact Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Taha Amer"
                  className={`w-full px-3 py-2 text-xs bg-[#FAF9F7] border rounded-md focus:outline-none focus:bg-white transition ${
                    errors.fullName ? 'border-red-400' : 'border-stone-300 focus:border-[#8B5A2B]'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. taha@gmail.com"
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F7] border rounded-md focus:outline-none focus:bg-white transition ${
                      errors.email ? 'border-red-400' : 'border-stone-300 focus:border-[#8B5A2B]'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  WhatsApp / Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0300 1234567 or +92 321 4567890"
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F7] border rounded-md focus:outline-none focus:bg-white transition ${
                      errors.phone ? 'border-red-400' : 'border-stone-300 focus:border-[#8B5A2B]'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  Our dispatch coordinator will contact this number to confirm delivery before rider dispatch.
                </p>
                {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Home Address */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-stone-900 font-semibold text-sm border-b border-[#F0EAE1] pb-1.5">
              <MapPin className="w-4 h-4 text-[#8B5A2B]" />
              <span>2. Delivery Address in Pakistan</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Home / Office Address (House / Street / Sector / Phase) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. House # 14-B, Lane 4, Phase 5, DHA"
                  className={`w-full px-3 py-2 text-xs bg-[#FAF9F7] border rounded-md focus:outline-none focus:bg-white transition ${
                    errors.address ? 'border-red-400' : 'border-stone-300 focus:border-[#8B5A2B]'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF9F7] border border-stone-300 rounded-md focus:outline-none focus:border-[#8B5A2B]"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Province
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF9F7] border border-stone-300 rounded-md focus:outline-none focus:border-[#8B5A2B]"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="e.g. 54000"
                    className="w-full px-3 py-2 text-xs bg-[#FAF9F7] border border-stone-300 rounded-md focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Delivery Notes / Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={formData.deliveryNotes}
                  onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                  placeholder="e.g. Near Shell pump, deliver between 3 PM and 6 PM"
                  className="w-full px-3 py-2 text-xs bg-[#FAF9F7] border border-stone-300 rounded-md focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-stone-900 font-semibold text-sm border-b border-[#F0EAE1] pb-1.5">
              <Banknote className="w-4 h-4 text-[#8B5A2B]" />
              <span>3. Payment Method</span>
            </div>

            <div className="p-4 rounded-lg border-2 border-[#8B5A2B] bg-[#FAF6F1] flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#8B5A2B] text-white shrink-0 mt-0.5">
                <Banknote className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Pay cash in hand to the courier rider upon physical delivery at your address. Inspect your luxury package safely at your doorstep.
                </p>
                <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>No upfront online card payment required</span>
                </div>
              </div>
            </div>

            {/* Upcoming Payment Gateways Badge */}
            <div className="mt-2.5 p-2.5 bg-stone-50 border border-dashed border-stone-200 rounded text-[11px] text-stone-500 flex items-center justify-between">
              <span>Visa/Mastercard & 1Link/Raast Direct Bank Transfer</span>
              <span className="text-[10px] font-semibold text-stone-400 uppercase">Coming Soon</span>
            </div>
          </div>

          {/* Order Summary Breakdown */}
          <div className="p-4 bg-[#F8F5F0] rounded-lg border border-[#E8E0D5] space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
              <span className="font-semibold text-stone-900">{formatPKR(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Nationwide Shipping:</span>
              <span>
                {deliveryFee === 0 ? (
                  <strong className="text-emerald-700">FREE</strong>
                ) : (
                  formatPKR(deliveryFee)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Payable upon Delivery:</span>
              <span className="text-[#8B5A2B] text-base">{formatPKR(cartTotal)}</span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#8B5A2B] hover:bg-[#72451F] text-white rounded-md text-xs uppercase tracking-widest font-bold shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Place Cash on Delivery Order • {formatPKR(cartTotal)}</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-stone-400 text-center mt-2">
              By placing your order, you agree to receive order notifications via SMS, WhatsApp, and Email.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
