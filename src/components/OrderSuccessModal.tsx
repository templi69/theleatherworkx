import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, MessageSquare, LayoutDashboard, Printer, MapPin, Mail, Phone, ShoppingBag, X, FileText } from 'lucide-react';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';

export const OrderSuccessModal: React.FC = () => {
  const { activeOrderConfirmation, setActiveOrderConfirmation, setActiveView, markOrdersAsViewed } = useStore();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (!activeOrderConfirmation) return null;

  const order = activeOrderConfirmation;
  const formatPKR = (val: number) => `Rs. ${val.toLocaleString('en-PK')}`;

  const handleOpenWhatsApp = () => {
    const itemsSummary = order.items
      .map((i) => `${i.quantity}x ${i.product.name} (${i.selectedColor}${i.monogramText ? `, Monogram: ${i.monogramText}` : ''})`)
      .join(', ');

    const text = encodeURIComponent(
      `Assalam-o-Alaikum The Leather Workx,\n\nI have placed a Cash on Delivery order #${order.id}.\n\nItems: ${itemsSummary}\nTotal: ${formatPKR(
        order.total
      )}\nDelivery Address: ${order.customer.address}, ${order.customer.city}\nPhone: ${order.customer.phone}\n\nPlease confirm dispatch. Thank you!`
    );

    window.open(`https://wa.me/923008452109?text=${text}`, '_blank');
  };

  const handleGoToAdmin = () => {
    setActiveOrderConfirmation(null);
    setActiveView('admin');
    markOrdersAsViewed();
  };

  const handleOpenInvoice = () => {
    setShowInvoiceModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Order Placed Successfully • Cash on Delivery
            </span>
          </div>
          <button
            onClick={() => setActiveOrderConfirmation(null)}
            className="p-1 rounded-full hover:bg-emerald-800 text-emerald-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900">
              Shukriya, {order.customer.fullName}!
            </h2>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Your Cash on Delivery order has been registered and sent directly to our workshop in Lahore.
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-[#FAF6F1] border border-[#E8DFC9] rounded-md">
              <span className="text-xs text-stone-500">Order Reference: </span>
              <strong className="text-xs font-mono font-bold text-[#8B5A2B]">{order.id}</strong>
            </div>
          </div>

          {/* Delivery & Payment Note */}
          <div className="p-4 bg-[#FAF8F5] border border-[#EAE2D5] rounded-lg text-xs space-y-2 text-stone-700">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <span>What Happens Next?</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-stone-600">
              <li>Our dispatch team will send you a verification WhatsApp/SMS on <strong>{order.customer.phone}</strong> before dispatching.</li>
              <li>Your order will be safely dispatched via <strong>TCS / Leopards Courier</strong> with live tracking.</li>
              <li>Please keep <strong>{formatPKR(order.total)}</strong> cash ready upon courier arrival at your doorstep.</li>
            </ul>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border border-stone-200 rounded-lg p-4 bg-stone-50/60">
            <div>
              <span className="text-stone-400 font-medium uppercase text-[10px]">Recipient Details</span>
              <p className="font-bold text-stone-900 mt-0.5">{order.customer.fullName}</p>
              <p className="text-stone-600 flex items-center gap-1 mt-1">
                <Phone className="w-3 h-3 text-stone-400" />
                <span>{order.customer.phone}</span>
              </p>
              <p className="text-stone-600 flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-stone-400" />
                <span>{order.customer.email}</span>
              </p>
            </div>

            <div>
              <span className="text-stone-400 font-medium uppercase text-[10px]">Shipping Destination</span>
              <p className="text-stone-800 font-medium mt-0.5 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8B5A2B] shrink-0 mt-0.5" />
                <span>{order.customer.address}, {order.customer.city} ({order.customer.province})</span>
              </p>
              {order.customer.deliveryNotes && (
                <p className="text-stone-500 text-[11px] mt-1 italic">
                  Note: "{order.customer.deliveryNotes}"
                </p>
              )}
            </div>
          </div>

          {/* Ordered Items summary */}
          <div className="border-t border-stone-200 pt-4">
            <h4 className="text-xs font-bold text-stone-900 mb-3 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#8B5A2B]" />
              <span>Order Summary ({order.items.length} item{order.items.length > 1 ? 's' : ''})</span>
            </h4>
            <div className="space-y-2.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded bg-stone-100 border border-stone-200"
                    />
                    <div>
                      <span className="font-medium text-stone-900">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="block text-[11px] text-stone-500">
                        Shade: {item.selectedColor} {item.monogramText ? `• Monogram: [${item.monogramText}]` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-stone-900">
                    {formatPKR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-stone-200 text-xs space-y-1 text-stone-600">
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : formatPKR(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-1">
                <span>Total Amount (Cash on Delivery):</span>
                <span className="text-[#8B5A2B]">{formatPKR(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm on WhatsApp</span>
            </button>

            <button
              onClick={handleGoToAdmin}
              className="py-3 px-4 bg-[#1E1915] hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-md transition flex items-center justify-center gap-2 cursor-pointer"
              title="See how this order appears in the Business Owner Admin Portal"
            >
              <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
              <span>View in Owner Admin</span>
            </button>

            <button
              onClick={handleOpenInvoice}
              className="py-3 px-4 border border-stone-300 hover:border-[#8B5A2B] hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-md transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              title="Print official Bill / Invoice & Courier Packing Slip"
            >
              <Printer className="w-4 h-4 text-[#8B5A2B]" />
              <span>Print Bill / Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Tax Invoice & Packing Slip Modal */}
      <InvoiceReceiptModal
        order={order}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
};
