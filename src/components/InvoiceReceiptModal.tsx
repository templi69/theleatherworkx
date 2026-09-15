import React, { useState } from 'react';
import { Order } from '../types';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';
import {
  formatPKR,
  generatePlainTextReceipt,
  generateStandaloneInvoiceHtml,
} from '../utils/invoiceGenerator';

interface InvoiceReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const dateStr = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // 1. Direct window.print handler with iframe sandbox error catching
  const handleDirectPrint = () => {
    setPrintError(null);
    try {
      window.print();
    } catch (err: unknown) {
      console.warn('Direct print failed, sandbox restriction detected:', err);
      setPrintError(
        'Direct print dialog is restricted by the preview sandbox. Please use "Open in New Tab" or "Download Invoice" below to print or save as PDF.'
      );
    }
  };

  // 2. Open printable invoice in standalone new window (escapes iframe sandbox)
  const handleOpenNewWindow = () => {
    setPrintError(null);
    try {
      const htmlContent = generateStandaloneInvoiceHtml(order);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const newWin = window.open(blobUrl, '_blank');
      if (!newWin) {
        // Pop-up blocked, fallback to download
        handleDownloadHtml();
      }
    } catch (err: unknown) {
      console.warn('Failed to open new tab, downloading instead:', err);
      handleDownloadHtml();
    }
  };

  // 3. Download standalone HTML Invoice (works 100% reliably everywhere)
  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneInvoiceHtml(order);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.id}-The-Leather-Workx.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 4. Copy Plain Text Receipt for WhatsApp / SMS
  const handleCopyText = () => {
    const textReceipt = generatePlainTextReceipt(order);
    navigator.clipboard.writeText(textReceipt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 print:p-0 print:bg-white animate-fade-in">
      {/* Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:border-none print:shadow-none print:w-full">
        {/* TOP TOOLBAR - Hidden during printing */}
        <div className="no-print bg-[#1E1915] text-[#FAF8F5] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#8B5A2B]" />
            <div>
              <h3 className="font-serif-luxury text-base font-bold tracking-wide">
                Invoice & Delivery Packing Slip
              </h3>
              <p className="text-[11px] text-stone-400">
                Order #{order.id} • Cash on Delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Print Button */}
            <button
              onClick={handleDirectPrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8B5A2B] hover:bg-[#70421B] text-white rounded-md text-xs font-bold shadow-xs transition cursor-pointer"
              title="Print directly using browser dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            {/* New Tab Button */}
            <button
              onClick={handleOpenNewWindow}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md text-xs font-semibold transition cursor-pointer"
              title="Open full-page invoice in new tab to print or save PDF"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in New Tab</span>
            </button>

            {/* Download HTML Button */}
            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md text-xs font-semibold transition cursor-pointer"
              title="Download standalone HTML invoice file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save File</span>
            </button>

            {/* Copy Receipt Text */}
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md text-xs font-semibold transition cursor-pointer"
              title="Copy plain text receipt for WhatsApp"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy Text</span>
                </>
              )}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-md hover:bg-stone-800 transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sandbox Print Notification (if direct print is blocked) */}
        {printError && (
          <div className="no-print bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-xs text-amber-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{printError}</span>
            </div>
            <button
              onClick={handleOpenNewWindow}
              className="shrink-0 font-bold underline hover:text-amber-950 cursor-pointer"
            >
              Open Printable Tab &rarr;
            </button>
          </div>
        )}

        {/* SCROLLABLE INVOICE PAPER VIEW - Targeted by @media print */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-[#FCFAF7] print:p-0 print:bg-white print:overflow-visible flex-1">
          <div
            id="printable-invoice"
            className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs print:border-none print:shadow-none print:p-0 max-w-2xl mx-auto space-y-6 text-stone-800 text-xs"
          >
            {/* Header: Brand and Invoice Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-stone-200">
              <div>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-stone-900">
                  THE LEATHER WORKX
                </h1>
                <p className="text-[11px] text-[#8B5A2B] font-semibold uppercase tracking-widest mt-0.5">
                  Pakistani Artisanal Vegetable-Tanned Atelier
                </p>
                <div className="mt-2 text-[11px] text-stone-500 space-y-0.5">
                  <p>Lahore Atelier Workshop, Punjab, Pakistan</p>
                  <p>Tel/WhatsApp: +92 300 8452109 • info@theleatherworkx.com</p>
                  <p>NTN: 8294012-7 • Reg: PK-LHR-2024</p>
                </div>
              </div>

              <div className="sm:text-right space-y-1">
                <span className="inline-block px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-wider">
                  Cash on Delivery (COD)
                </span>
                <h2 className="text-lg font-bold font-mono text-stone-900 mt-1">
                  INVOICE #{order.id}
                </h2>
                <p className="text-[11px] text-stone-500">Issued: {dateStr}</p>
                <p className="text-[11px] font-semibold text-emerald-700">
                  Order Status: {order.fulfillmentStatus.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Customer & Shipping Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF8F5] rounded-lg border border-stone-200">
              {/* Recipient */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Customer & Recipient
                </span>
                <p className="font-bold text-sm text-stone-900">{order.customer.fullName}</p>
                <p className="text-stone-600 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-stone-400" />
                  <span>{order.customer.phone}</span>
                </p>
                <p className="text-stone-600 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-stone-400" />
                  <span>{order.customer.email}</span>
                </p>
              </div>

              {/* Delivery Destination */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Doorstep Delivery Address
                </span>
                <p className="font-medium text-stone-900 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8B5A2B] shrink-0 mt-0.5" />
                  <span>
                    {order.customer.address}
                    {order.customer.apartment ? `, ${order.customer.apartment}` : ''}
                  </span>
                </p>
                <p className="font-semibold text-stone-800">
                  {order.customer.city}, {order.customer.province} {order.customer.postalCode || ''}
                </p>
                <p className="text-[11px] text-[#8B5A2B] font-semibold mt-1">
                  Courier Partner: {order.courierName || 'TCS Express / Leopards'}
                  {order.trackingNumber ? ` (Tracking: ${order.trackingNumber})` : ''}
                </p>
                {order.customer.deliveryNotes && (
                  <p className="text-[11px] text-amber-800 italic bg-amber-50/80 p-1.5 rounded border border-amber-100">
                    Rider Note: "{order.customer.deliveryNotes}"
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Order Table */}
            <div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-900 text-white text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-3 rounded-l font-semibold text-center w-8">#</th>
                    <th className="py-2.5 px-3 font-semibold">Artisan Leather Item & Specs</th>
                    <th className="py-2.5 px-3 font-semibold text-center w-14">Qty</th>
                    <th className="py-2.5 px-3 font-semibold text-right w-24">Rate (PKR)</th>
                    <th className="py-2.5 px-3 rounded-r font-semibold text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-3 px-3 text-center text-stone-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900 text-xs">
                          {item.product.name}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Grain: {item.product.leatherType} • Shade:{' '}
                          <strong className="text-stone-700">{item.selectedColor}</strong>
                          {item.monogramText && (
                            <span className="text-[#8B5A2B] font-semibold ml-1.5">
                              • Monogram: [{item.monogramText}]
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-stone-900">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right text-stone-600 font-medium">
                        {formatPKR(item.product.price)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-stone-900">
                        {formatPKR(item.product.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Breakdown Totals */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-72 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Items Subtotal:</span>
                  <span className="font-medium text-stone-900">{formatPKR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Courier Delivery Fee:</span>
                  <span className="font-medium text-stone-900">
                    {order.deliveryFee === 0 ? 'FREE' : formatPKR(order.deliveryFee)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Artisan Promo Discount:</span>
                    <span className="font-medium">-{formatPKR(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 pb-1 border-t-2 border-stone-900 text-stone-900">
                  <span className="font-bold text-xs uppercase tracking-wider">
                    Total COD Payable:
                  </span>
                  <span className="font-serif-luxury text-xl font-bold text-[#8B5A2B]">
                    {formatPKR(order.total)}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 text-right italic">
                  Exact Pakistani Rupees to be paid to delivery rider upon receipt.
                </p>
              </div>
            </div>

            {/* Courier Dispatch & Rider Cash Handover Slip */}
            <div className="p-3.5 bg-stone-50 border border-dashed border-stone-300 rounded-lg space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                    COURIER CASH COLLECTION ACKNOWLEDGMENT
                  </span>
                  <p className="text-[11px] text-stone-500">
                    Rider must collect <strong>{formatPKR(order.total)}</strong> prior to package handover.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-white border border-stone-300 rounded font-mono text-xs font-bold tracking-widest text-stone-800">
                    ||| {order.id} |||
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 grid grid-cols-2 gap-4 text-[10px] text-stone-500">
                <div>
                  <span>Courier Dispatch Agent: ____________________</span>
                </div>
                <div className="text-right">
                  <span>Customer Receiver Signature: ____________________</span>
                </div>
              </div>
            </div>

            {/* Authenticity Guarantee & Atelier Footer */}
            <div className="pt-3 border-t border-stone-200 text-center text-[11px] text-stone-500 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-stone-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#8B5A2B]" />
                <span>The Leather Workx Lifetime Stitching & Pure Leather Warranty</span>
              </div>
              <p>
                Handcrafted using full-grain, vegetable pit-tanned Pakistani hides. Developing a rich patina with age.
              </p>
              <p className="text-[10px] text-stone-400">
                For returns, claims, or care conditioning: WhatsApp +92 300 8452109 • Lahore Atelier
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM MODAL CONTROLS - Hidden during print */}
        <div className="no-print p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenNewWindow}
              className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-md shadow-2xs transition cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </button>

            <button
              onClick={handleDirectPrint}
              className="px-5 py-2 bg-[#8B5A2B] hover:bg-[#70421B] text-white text-xs font-bold rounded-md shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bill / Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
