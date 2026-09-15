import { Order } from '../types';

export const formatPKR = (val: number): string => `Rs. ${val.toLocaleString('en-PK')}`;

/**
 * Formats a plain text receipt suitable for WhatsApp, SMS, or thermal POS printing
 */
export const generatePlainTextReceipt = (order: Order): string => {
  const dateStr = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name}\n   Qty: ${item.quantity} | Shade: ${item.selectedColor}${
          item.monogramText ? ` | Monogram: [${item.monogramText}]` : ''
        }\n   Price: ${formatPKR(item.product.price * item.quantity)}`
    )
    .join('\n\n');

  return `==========================================
THE LEATHER WORKX - ATELIER LAHORE
COMMERCIAL CASH ON DELIVERY RECEIPT
==========================================
Order Ref: ${order.id}
Date: ${dateStr}
Payment: CASH ON DELIVERY (COD)
Status: ${order.fulfillmentStatus.toUpperCase()}

CUSTOMER & SHIPPING DETAILS:
Name: ${order.customer.fullName}
Phone: ${order.customer.phone}
Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.province}
${order.customer.deliveryNotes ? `Notes: "${order.customer.deliveryNotes}"\n` : ''}
------------------------------------------
ORDERED ITEMS:
${itemsList}
------------------------------------------
Subtotal:       ${formatPKR(order.subtotal)}
Delivery Fee:   ${order.deliveryFee === 0 ? 'FREE' : formatPKR(order.deliveryFee)}
${order.discount > 0 ? `Discount:       -${formatPKR(order.discount)}\n` : ''}------------------------------------------
TOTAL AMOUNT DUE: ${formatPKR(order.total)}
(Please pay exact cash to courier rider)
==========================================
Dispatch via: ${order.courierName || 'TCS / Leopards Express'}
Workshop: Lahore Atelier, Pakistan
Support: +92 300 8452109 | info@theleatherworkx.com
==========================================`;
};

/**
 * Generates a self-contained, standalone HTML document for printing or downloading.
 * This guarantees the user can always print or save as PDF even if the browser iframe
 * sandbox blocks window.print().
 */
export const generateStandaloneInvoiceHtml = (order: Order): string => {
  const dateStr = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemsHtml = order.items
    .map(
      (item, idx) => `
    <tr>
      <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">${
        idx + 1
      }</td>
      <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 600; color: #111827; font-size: 13px;">${item.product.name}</div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">
          Grain: ${item.product.leatherType} • Shade: <strong>${item.selectedColor}</strong>
          ${item.monogramText ? ` • <span style="color: #8b5a2b; font-weight: bold;">Monogram: [${item.monogramText}]</span>` : ''}
        </div>
      </td>
      <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 13px;">${
        item.quantity
      }</td>
      <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 13px;">${formatPKR(
        item.product.price
      )}</td>
      <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #111827; font-size: 13px;">${formatPKR(
        item.product.price * item.quantity
      )}</td>
    </tr>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${order.id} - The Leather Workx</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1f2937;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      font-size: 13px;
      line-height: 1.5;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #e5e7eb;
      padding: 32px;
      border-radius: 8px;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .brand-title {
      font-family: Georgia, serif;
      font-size: 26px;
      font-weight: bold;
      color: #1c1917;
      letter-spacing: 1px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background: #fef3c7;
      color: #92400e;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-grid {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 24px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 6px;
      border: 1px solid #f3f4f6;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .items-table th {
      background: #1c1917;
      color: #ffffff;
      padding: 10px 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
    }
    .totals-area {
      width: 300px;
      margin-left: auto;
      margin-bottom: 24px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
    }
    .total-highlight {
      font-size: 16px;
      font-weight: bold;
      color: #8b5a2b;
      border-top: 2px solid #1c1917;
      border-bottom: 2px solid #1c1917;
      padding: 10px 0;
      margin-top: 6px;
    }
    .footer-notice {
      border-top: 1px dashed #d1d5db;
      padding-top: 16px;
      font-size: 11px;
      color: #6b7280;
      text-align: center;
    }
    @media print {
      body {
        padding: 0;
      }
      .invoice-card {
        border: none;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 800px; margin: 0 auto 16px; text-align: right;">
    <button onclick="window.print()" style="padding: 10px 18px; background: #8b5a2b; color: #fff; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
      🖨️ Click Here to Print / Save as PDF
    </button>
  </div>

  <div class="invoice-card" id="invoice">
    <!-- Header -->
    <table class="header-table">
      <tr>
        <td style="vertical-align: top;">
          <div class="brand-title">THE LEATHER WORKX</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">
            Pakistani Artisanal Vegetable-Tanned Leather Goods<br>
            Lahore Atelier Workshop, Punjab, Pakistan<br>
            Tel/WhatsApp: +92 300 8452109 • info@theleatherworkx.com
          </div>
        </td>
        <td style="vertical-align: top; text-align: right;">
          <div class="badge">Cash on Delivery (COD)</div>
          <div style="font-size: 16px; font-weight: bold; margin-top: 6px; color: #111827;">INVOICE #${order.id}</div>
          <div style="font-size: 12px; color: #6b7280;">Date: ${dateStr}</div>
          <div style="font-size: 12px; color: #15803d; font-weight: 600; margin-top: 2px;">
            Status: ${order.fulfillmentStatus.toUpperCase()}
          </div>
        </td>
      </tr>
    </table>

    <!-- Info Grid -->
    <table style="width: 100%; margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 6px; background: #f9fafb; border-collapse: collapse;">
      <tr>
        <td style="width: 50%; padding: 14px; vertical-align: top; border-right: 1px solid #e5e7eb;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #6b7280; margin-bottom: 4px;">CUSTOMER & RECIPIENT</div>
          <div style="font-size: 14px; font-weight: bold; color: #111827;">${order.customer.fullName}</div>
          <div style="color: #374151; margin-top: 4px;">Phone: <strong>${order.customer.phone}</strong></div>
          <div style="color: #6b7280;">Email: ${order.customer.email}</div>
        </td>
        <td style="width: 50%; padding: 14px; vertical-align: top;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #6b7280; margin-bottom: 4px;">DISPATCH DESTINATION & COURIER</div>
          <div style="color: #111827; font-weight: 500;">
            ${order.customer.address}
            ${order.customer.apartment ? `, ${order.customer.apartment}` : ''}
          </div>
          <div style="color: #111827; font-weight: 600;">${order.customer.city}, ${order.customer.province} ${order.customer.postalCode || ''}</div>
          <div style="color: #8b5a2b; font-size: 11px; margin-top: 4px;">
            Courier: <strong>${order.courierName || 'TCS Express / Leopards'}</strong> ${order.trackingNumber ? `(Tracking: ${order.trackingNumber})` : ''}
          </div>
          ${order.customer.deliveryNotes ? `<div style="color: #b45309; font-size: 11px; margin-top: 4px; font-style: italic;">Note: "${order.customer.deliveryNotes}"</div>` : ''}
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 30px; text-align: center;">#</th>
          <th>Item Description & Specifications</th>
          <th style="width: 50px; text-align: center;">Qty</th>
          <th style="width: 100px; text-align: right;">Unit Price</th>
          <th style="width: 110px; text-align: right;">Total (PKR)</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Financial Totals -->
    <div class="totals-area">
      <div class="totals-row">
        <span style="color: #6b7280;">Subtotal:</span>
        <span style="font-weight: 600;">${formatPKR(order.subtotal)}</span>
      </div>
      <div class="totals-row">
        <span style="color: #6b7280;">Courier Delivery:</span>
        <span style="font-weight: 600;">${order.deliveryFee === 0 ? 'FREE' : formatPKR(order.deliveryFee)}</span>
      </div>
      ${
        order.discount > 0
          ? `
      <div class="totals-row" style="color: #15803d;">
        <span>Artisan Discount:</span>
        <span>-${formatPKR(order.discount)}</span>
      </div>
      `
          : ''
      }
      <div class="totals-row total-highlight">
        <span>COD Cash to Collect:</span>
        <span>${formatPKR(order.total)}</span>
      </div>
    </div>

    <!-- Courier Tear-Off / Rider Slip -->
    <div style="margin-top: 24px; padding: 14px; border: 1px dashed #9ca3af; background: #fafaf9; border-radius: 6px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="vertical-align: middle;">
            <div style="font-weight: bold; font-size: 11px; text-transform: uppercase; color: #44403c;">Courier Rider Acknowledgment Slip</div>
            <div style="font-size: 11px; color: #78716c; margin-top: 2px;">
              Handover exact cash sum of <strong>${formatPKR(order.total)}</strong> to delivery courier.
            </div>
          </td>
          <td style="vertical-align: middle; text-align: right; width: 180px;">
            <div style="border-top: 1px solid #78716c; width: 160px; margin-left: auto; padding-top: 4px; font-size: 10px; color: #78716c; text-align: center;">
              Customer Receiver Signature
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div class="footer-notice" style="margin-top: 20px;">
      <p style="margin: 0; font-weight: 600; color: #374151;">All products hand-crafted with vegetable-tanned full-grain Pakistani cowhides.</p>
      <p style="margin: 4px 0 0;">For inquiries or custom leather care assistance, contact our Lahore workshop on WhatsApp +92 300 8452109.</p>
    </div>
  </div>
</body>
</html>`;
};
