import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus, Product } from '../types';
import { AddProductModal } from './AddProductModal';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';
import {
  Bell,
  Search,
  CheckCircle,
  Truck,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Printer,
  Package,
  Clock,
  DollarSign,
  Store,
  Check,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  SlidersHorizontal,
  Eye,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  X,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    orders,
    unreadOrdersCount,
    markOrdersAsViewed,
    updateOrderStatus,
    products,
    toggleProductStock,
    updateProductStock,
    deleteProduct,
    resetProductsToDefault,
    setActiveView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [orderForInvoice, setOrderForInvoice] = useState<Order | null>(null);

  // Product Catalog & Stock Controls State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToViewSpecs, setProductToViewSpecs] = useState<Product | null>(null);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('all');
  const [inventoryStockFilter, setInventoryStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'sold_out'>('all');
  const [quickRestockItem, setQuickRestockItem] = useState<{ id: string; amount: number } | null>(null);

  // Mark unread orders as viewed when admin opens the portal
  React.useEffect(() => {
    markOrdersAsViewed();
  }, []);

  const formatPKR = (val: number) => `Rs. ${val.toLocaleString('en-PK')}`;

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.fulfillmentStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.fulfillmentStatus === 'pending_review').length;
  const confirmedOrders = orders.filter((o) => o.fulfillmentStatus === 'confirmed').length;
  const dispatchedOrders = orders.filter((o) => o.fulfillmentStatus === 'dispatched').length;
  const deliveredOrders = orders.filter((o) => o.fulfillmentStatus === 'delivered').length;

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== 'all' && order.fulfillmentStatus !== filterStatus) {
      return false;
    }
    if (adminSearch.trim()) {
      const q = adminSearch.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customer.fullName.toLowerCase().includes(q);
      const matchEmail = order.customer.email.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.toLowerCase().includes(q);
      const matchCity = order.customer.city.toLowerCase().includes(q);
      const matchAddress = order.customer.address.toLowerCase().includes(q);
      return matchId || matchName || matchEmail || matchPhone || matchCity || matchAddress;
    }
    return true;
  });

  const handleWhatsAppCustomer = (order: Order) => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customer.fullName},\nThis is The Leather Workx regarding your Cash on Delivery order #${order.id} for ${formatPKR(
        order.total
      )}.\nWe are preparing your handcrafted leather package for dispatch to ${order.customer.address}, ${order.customer.city}.\nPlease reply to confirm you will be available to receive it. Thank you!`
    );
    window.open(`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" />
            Pending Verification
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
            <Check className="w-3 h-3 text-blue-700" />
            Confirmed (Ready to Pack)
          </span>
        );
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-300">
            <Truck className="w-3 h-3 text-purple-700" />
            Dispatched via Courier
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle className="w-3 h-3 text-emerald-700" />
            Delivered & COD Collected
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-200 text-stone-700">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-stone-900 pb-16">
      {/* Top Banner Notice for Business Owner */}
      <div className="bg-[#1E1915] text-[#FAF8F5] border-b border-stone-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#8B5A2B] text-white">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide flex items-center gap-2">
              <span>Business Owner Admin Center</span>
              <span className="text-[10px] bg-[#D4AF37] text-stone-900 px-1.5 py-0.5 rounded font-bold uppercase">
                Lahore HQ
              </span>
            </h1>
            <p className="text-xs text-stone-300">
              Cash on Delivery order stream & customer fulfillment notifications
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('store')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition border border-white/20 cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Return to Storefront</span>
          </button>
        </div>
      </div>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Real-time Order Notification Alert Banner */}
        {pendingOrders > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full text-amber-800 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                  {pendingOrders} New Cash on Delivery Order{pendingOrders > 1 ? 's' : ''} Awaiting Call Verification!
                </h3>
                <p className="text-xs text-amber-800">
                  Customers in Karachi, Lahore & Islamabad are waiting. Please call or WhatsApp before courier pickup.
                </p>
              </div>
            </div>
            <button
              onClick={() => setFilterStatus('pending_review')}
              className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-3 py-1.5 rounded transition cursor-pointer"
            >
              Filter Pending Orders
            </button>
          </div>
        )}

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E8E0D5] shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Sales (COD)</span>
              <DollarSign className="w-4 h-4 text-[#8B5A2B]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900">
              {formatPKR(totalRevenue)}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">From {orders.length} orders</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E8E0D5] shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-700">
              {pendingOrders}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Requires customer call</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E8E0D5] shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Dispatched</span>
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-purple-800">
              {dispatchedOrders}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">With TCS / Leopards</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E8E0D5] shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Delivered & Paid</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700">
              {deliveredOrders}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Cash collected</span>
          </div>
        </div>

        {/* Tab Navigation: Orders vs Inventory */}
        <div className="flex border-b border-[#E0D7CB] space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#8B5A2B] text-[#8B5A2B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Customer Orders & COD Deliveries ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'border-[#8B5A2B] text-[#8B5A2B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Product Catalog & Stock Controls ({products.length})
          </button>
        </div>

        {/* TAB 1: ORDERS FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E0D5] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Search customer, city, email, phone, or order ID..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F7] border border-stone-300 rounded-md focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'pending_review', label: 'Pending Review' },
                  { id: 'confirmed', label: 'Confirmed' },
                  { id: 'dispatched', label: 'Dispatched' },
                  { id: 'delivered', label: 'Delivered' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setFilterStatus(st.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                      filterStatus === st.id
                        ? 'bg-[#1E1915] text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-stone-200 text-stone-500">
                <Package className="w-12 h-12 mx-auto text-stone-300 mb-2" />
                <h4 className="font-bold text-stone-700">No orders found</h4>
                <p className="text-xs">No customer orders matching the current filter criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-[#E8E0D5] p-5 shadow-xs hover:border-[#8B5A2B]/50 transition-all space-y-4"
                  >
                    {/* Card Top Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0EBE3] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-[#8B5A2B] bg-[#FAF6F1] px-2.5 py-1 rounded border border-[#EADFCB]">
                          {order.id}
                        </span>
                        <span className="text-xs text-stone-500">
                          {new Date(order.createdAt).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.fulfillmentStatus)}
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          Cash on Delivery ({formatPKR(order.total)})
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Customer & Delivery Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Customer Contact */}
                      <div className="space-y-1">
                        <span className="text-stone-400 font-semibold uppercase text-[10px]">Customer</span>
                        <p className="font-bold text-stone-900 text-sm">{order.customer.fullName}</p>
                        <p className="text-stone-600 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          <span>{order.customer.email}</span>
                        </p>
                        <p className="text-stone-600 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <strong className="text-stone-900">{order.customer.phone}</strong>
                        </p>
                      </div>

                      {/* Shipping Address in Pakistan */}
                      <div className="space-y-1">
                        <span className="text-stone-400 font-semibold uppercase text-[10px]">Destination</span>
                        <p className="text-stone-800 font-medium flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#8B5A2B] shrink-0 mt-0.5" />
                          <span>{order.customer.address}</span>
                        </p>
                        <p className="text-stone-600 font-semibold">
                          {order.customer.city}, {order.customer.province} {order.customer.postalCode ? `(${order.customer.postalCode})` : ''}
                        </p>
                        {order.customer.deliveryNotes && (
                          <p className="text-stone-500 italic bg-[#FAF8F5] p-1.5 rounded text-[11px]">
                            Rider Note: "{order.customer.deliveryNotes}"
                          </p>
                        )}
                      </div>

                      {/* Items Ordered */}
                      <div className="space-y-1.5">
                        <span className="text-stone-400 font-semibold uppercase text-[10px]">
                          Ordered Items ({order.items.length})
                        </span>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-stone-800">
                                <strong>{item.quantity}x</strong> {item.product.name}
                                <span className="text-stone-500 text-[11px] block">
                                  {item.selectedColor} {item.monogramText ? `• [Monogram: ${item.monogramText}]` : ''}
                                </span>
                              </span>
                              <span className="font-semibold text-stone-900">
                                {formatPKR(item.product.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Actions & Status Updater */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0EBE3] bg-[#FAF9F7] -mx-5 -mb-5 p-4 rounded-b-xl">
                      {/* Left quick customer outreach */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleWhatsAppCustomer(order)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#25D366] hover:bg-[#1faa4e] text-white rounded text-xs font-bold transition cursor-pointer"
                          title="Open WhatsApp chat with prefilled order verification"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Customer</span>
                        </button>

                        <a
                          href={`tel:${order.customer.phone}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded text-xs font-semibold transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-stone-500" />
                          <span>Call Rider/Customer</span>
                        </a>

                        <button
                          onClick={() => setOrderForInvoice(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:border-[#8B5A2B] hover:text-[#8B5A2B] text-stone-700 rounded text-xs font-semibold transition cursor-pointer shadow-2xs"
                          title="View & Print Official Bill Receipt / Courier Invoice"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#8B5A2B]" />
                          <span>Print Bill / Invoice</span>
                        </button>
                      </div>

                      {/* Status changer dropdown for owner */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-stone-500">Update Status:</span>
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="text-xs font-semibold bg-white border border-stone-300 rounded px-3 py-1.5 text-stone-900 focus:outline-none focus:border-[#8B5A2B]"
                        >
                          <option value="pending_review">Pending Review</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="dispatched">Dispatched (Courier)</option>
                          <option value="delivered">Delivered & COD Collected</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVENTORY & STOCK MANAGEMENT */}
        {activeTab === 'inventory' && (() => {
          // Inventory Calculations
          const totalProducts = products.length;
          const totalStockUnits = products.reduce((acc, p) => acc + (p.stockQuantity ?? 0), 0);
          const inStockCount = products.filter((p) => p.inStock && (p.stockQuantity ?? 1) > 0).length;
          const lowStockCount = products.filter((p) => (p.stockQuantity ?? 0) <= 3 && (p.stockQuantity ?? 0) > 0).length;
          const soldOutCount = products.filter((p) => !p.inStock || (p.stockQuantity ?? 0) === 0).length;

          // Filter Products
          const filteredProducts = products.filter((p) => {
            if (inventoryCategoryFilter !== 'all' && p.category !== inventoryCategoryFilter) {
              return false;
            }
            if (inventoryStockFilter === 'in_stock') {
              if (!p.inStock || (p.stockQuantity ?? 0) === 0) return false;
            } else if (inventoryStockFilter === 'low_stock') {
              if ((p.stockQuantity ?? 0) > 3 || (p.stockQuantity ?? 0) === 0) return false;
            } else if (inventoryStockFilter === 'sold_out') {
              if (p.inStock && (p.stockQuantity ?? 0) > 0) return false;
            }
            if (inventorySearch.trim()) {
              const q = inventorySearch.toLowerCase();
              const matchName = p.name.toLowerCase().includes(q);
              const matchCat = p.categoryLabel.toLowerCase().includes(q);
              const matchLeather = p.leatherType.toLowerCase().includes(q);
              const matchTanning = p.tanning.toLowerCase().includes(q);
              return matchName || matchCat || matchLeather || matchTanning;
            }
            return true;
          });

          return (
            <div className="space-y-4">
              {/* Top Banner & Main Action Buttons */}
              <div className="bg-white rounded-xl border border-[#E8E0D5] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-[#8B5A2B]/10 text-[#8B5A2B] rounded-lg">
                      <Layers className="w-4 h-4" />
                    </span>
                    <h3 className="text-base font-bold text-stone-900">
                      Product Catalog & Workshop Stock Controls
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Add new mastercrafted items, update selling price, modify leather specifications, and adjust inventory units.
                  </p>
                </div>

                {/* Main Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => {
                      if (window.confirm('Reset catalog products and initial stock to factory defaults?')) {
                        resetProductsToDefault();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                    title="Restore standard sample artisan collection"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    onClick={() => {
                      setProductToEdit(null);
                      setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8B5A2B] hover:bg-[#70421B] text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product / Stock</span>
                  </button>
                </div>
              </div>

              {/* Atelier Stock Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Total Catalog SKUs
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-stone-900">{totalProducts}</span>
                    <span className="text-[11px] text-stone-400">Masterpieces</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Total Atelier Units
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-stone-900">{totalStockUnits}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">Units Available</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    In Stock Items
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-emerald-700">{inStockCount}</span>
                    <span className="text-[11px] text-stone-400">Active</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Low Stock / Sold Out
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-amber-600">{lowStockCount}</span>
                    <span className="text-[11px] text-stone-400">Low</span>
                    <span className="text-stone-300">/</span>
                    <span className="text-xl font-bold text-red-600">{soldOutCount}</span>
                    <span className="text-[11px] text-stone-400">Out</span>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-xl border border-[#E8E0D5] p-3.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search by product name, leather type, tanning, or category..."
                    className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#8B5A2B]"
                  />
                  {inventorySearch && (
                    <button
                      onClick={() => setInventorySearch('')}
                      className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Filter */}
                  <select
                    value={inventoryCategoryFilter}
                    onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                    className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 font-medium text-stone-800 focus:outline-none focus:border-[#8B5A2B]"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    <option value="bags">Bags & Satchels</option>
                    <option value="wallets">Wallets & Small Leather</option>
                    <option value="travel">Travel & Luggage</option>
                    <option value="bespoke">Bespoke Hand-Painted</option>
                    <option value="accessories">Accessories & Belts</option>
                  </select>

                  {/* Stock Filter Pills */}
                  <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-[11px] font-semibold text-stone-600">
                    <button
                      onClick={() => setInventoryStockFilter('all')}
                      className={`px-2.5 py-1.5 rounded-md transition cursor-pointer ${
                        inventoryStockFilter === 'all'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'hover:text-stone-900'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setInventoryStockFilter('in_stock')}
                      className={`px-2.5 py-1.5 rounded-md transition cursor-pointer ${
                        inventoryStockFilter === 'in_stock'
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'hover:text-stone-900'
                      }`}
                    >
                      In Stock
                    </button>
                    <button
                      onClick={() => setInventoryStockFilter('low_stock')}
                      className={`px-2.5 py-1.5 rounded-md transition cursor-pointer ${
                        inventoryStockFilter === 'low_stock'
                          ? 'bg-white text-amber-800 shadow-xs'
                          : 'hover:text-stone-900'
                      }`}
                    >
                      Low Stock (≤3)
                    </button>
                    <button
                      onClick={() => setInventoryStockFilter('sold_out')}
                      className={`px-2.5 py-1.5 rounded-md transition cursor-pointer ${
                        inventoryStockFilter === 'sold_out'
                          ? 'bg-white text-red-800 shadow-xs'
                          : 'hover:text-stone-900'
                      }`}
                    >
                      Sold Out
                    </button>
                  </div>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-xl border border-[#E8E0D5] p-5 shadow-xs space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px]">
                        <th className="pb-3 font-semibold">Product & Category</th>
                        <th className="pb-3 font-semibold">Price (PKR)</th>
                        <th className="pb-3 font-semibold">Leather Specifications</th>
                        <th className="pb-3 font-semibold">Workshop Stock</th>
                        <th className="pb-3 font-semibold">Availability</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-stone-500">
                            No products match the selected criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                            {/* Product Info */}
                            <td className="py-3.5 pr-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-12 h-12 object-cover rounded-lg bg-stone-100 border border-stone-200 shrink-0"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-stone-900 text-sm">{p.name}</span>
                                    {p.isBespokeHandPainted && (
                                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#8B5A2B] text-white">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        Hand-Painted
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 text-stone-500 text-[11px]">
                                    <span className="text-[#8B5A2B] font-medium">{p.categoryLabel}</span>
                                    {p.tag && <span>• {p.tag}</span>}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="py-3.5">
                              <div>
                                <span className="font-bold text-stone-900 text-sm block">
                                  {formatPKR(p.price)}
                                </span>
                                {p.compareAtPrice && (
                                  <span className="text-[11px] text-stone-400 line-through">
                                    {formatPKR(p.compareAtPrice)}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Leather Specifications */}
                            <td className="py-3.5 max-w-xs">
                              <div className="space-y-0.5">
                                <p className="font-medium text-stone-800 line-clamp-1" title={p.leatherType}>
                                  {p.leatherType}
                                </p>
                                <p className="text-[11px] text-stone-500 line-clamp-1">
                                  {p.tanning} • {p.dimensions}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setProductToViewSpecs(p)}
                                  className="text-[10px] text-[#8B5A2B] hover:underline font-semibold flex items-center gap-1 mt-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View Leather Specs</span>
                                </button>
                              </div>
                            </td>

                            {/* Workshop Stock Controls */}
                            <td className="py-3.5">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-bold text-sm ${
                                      (p.stockQuantity ?? 0) === 0
                                        ? 'text-red-600'
                                        : (p.stockQuantity ?? 0) <= 3
                                        ? 'text-amber-600'
                                        : 'text-stone-900'
                                    }`}
                                  >
                                    {p.stockQuantity ?? 0}
                                  </span>
                                  <span className="text-[11px] text-stone-500">units</span>
                                </div>

                                {/* Quick Stock Adjustment Buttons */}
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = p.stockQuantity ?? 0;
                                      updateProductStock(p.id, Math.max(0, current - 1));
                                    }}
                                    disabled={(p.stockQuantity ?? 0) <= 0}
                                    className="w-5 h-5 flex items-center justify-center bg-stone-100 hover:bg-stone-200 disabled:opacity-30 rounded text-stone-700 text-xs font-bold cursor-pointer"
                                    title="Decrease stock by 1"
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = p.stockQuantity ?? 0;
                                      updateProductStock(p.id, current + 1);
                                    }}
                                    className="w-5 h-5 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded text-stone-700 text-xs font-bold cursor-pointer"
                                    title="Add 1 unit"
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = p.stockQuantity ?? 0;
                                      updateProductStock(p.id, current + 5);
                                    }}
                                    className="px-1.5 h-5 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded text-stone-700 text-[10px] font-semibold cursor-pointer"
                                    title="Add 5 units"
                                  >
                                    +5
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = p.stockQuantity ?? 0;
                                      updateProductStock(p.id, current + 10);
                                    }}
                                    className="px-1.5 h-5 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded text-stone-700 text-[10px] font-semibold cursor-pointer"
                                    title="Add 10 units"
                                  >
                                    +10
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Availability Badge */}
                            <td className="py-3.5">
                              {p.inStock && (p.stockQuantity ?? 0) > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  In Stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                  Sold Out
                                </span>
                              )}
                            </td>

                            {/* Actions Column */}
                            <td className="py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Quick Restock custom button */}
                                <button
                                  type="button"
                                  onClick={() => setQuickRestockItem({ id: p.id, amount: 5 })}
                                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-[#8B5A2B] border border-amber-200 rounded text-xs font-semibold transition cursor-pointer"
                                  title="Add custom stock quantity"
                                >
                                  + Stock
                                </button>

                                {/* Toggle In/Out Stock */}
                                <button
                                  type="button"
                                  onClick={() => toggleProductStock(p.id)}
                                  className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                                    p.inStock
                                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  }`}
                                  title="Toggle visibility"
                                >
                                  {p.inStock ? 'Mark Out' : 'Mark In'}
                                </button>

                                {/* Edit Product & Specs */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProductToEdit(p);
                                    setIsAddModalOpen(true);
                                  }}
                                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition cursor-pointer"
                                  title="Edit Name, Category, Price, Leather Specs"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Product */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to remove "${p.name}" from catalog?`)) {
                                      deleteProduct(p.id);
                                    }
                                  }}
                                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ADD / EDIT PRODUCT MODAL */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setProductToEdit(null);
          }}
          productToEdit={productToEdit}
        />

        {/* QUICK ADD STOCK MODAL */}
        {quickRestockItem && (() => {
          const targetProduct = products.find((p) => p.id === quickRestockItem.id);
          if (!targetProduct) return null;

          return (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-stone-200 p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-stone-900 text-sm">Add Workshop Stock</h4>
                  <button
                    onClick={() => setQuickRestockItem(null)}
                    className="text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <img src={targetProduct.image} alt="" className="w-12 h-12 object-cover rounded-lg border border-stone-200" />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block line-clamp-1">{targetProduct.name}</span>
                    <span className="text-stone-500">Current Stock: <strong>{targetProduct.stockQuantity ?? 0} units</strong></span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Units to Add:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={quickRestockItem.amount}
                      onChange={(e) =>
                        setQuickRestockItem({
                          ...quickRestockItem,
                          amount: Number(e.target.value),
                        })
                      }
                      className="flex-1 px-3 py-2 text-sm font-bold border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                    />
                    <span className="text-xs text-stone-500">units</span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    {[+2, +5, +10, +20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() =>
                          setQuickRestockItem({
                            ...quickRestockItem,
                            amount: num,
                          })
                        }
                        className="flex-1 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 rounded text-stone-800 cursor-pointer"
                      >
                        +{num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuickRestockItem(null)}
                    className="flex-1 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newTotal = (targetProduct.stockQuantity ?? 0) + quickRestockItem.amount;
                      updateProductStock(targetProduct.id, newTotal, true);
                      setQuickRestockItem(null);
                    }}
                    className="flex-1 py-2 bg-[#8B5A2B] hover:bg-[#70421B] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                  >
                    Confirm & Restock
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* VIEW LEATHER SPECS MODAL */}
        {productToViewSpecs && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#FAF8F5] rounded-xl shadow-2xl border border-[#E8E1D9] overflow-hidden">
              <div className="px-5 py-4 bg-[#1E1915] text-[#FAF8F5] flex items-center justify-between">
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold">Artisanal Leather Specifications</h4>
                  <p className="text-xs text-stone-400">{productToViewSpecs.name}</p>
                </div>
                <button
                  onClick={() => setProductToViewSpecs(null)}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
                  <img
                    src={productToViewSpecs.image}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg border border-stone-300"
                  />
                  <div>
                    <span className="text-stone-900 font-bold text-sm block">
                      {productToViewSpecs.name}
                    </span>
                    <span className="text-[#8B5A2B] font-semibold">{productToViewSpecs.categoryLabel}</span>
                    <span className="text-stone-500 block">{formatPKR(productToViewSpecs.price)}</span>
                  </div>
                </div>

                <div className="space-y-2.5 bg-white p-4 rounded-lg border border-stone-200">
                  <div className="flex justify-between border-b border-stone-100 pb-2">
                    <span className="text-stone-500 font-medium">Leather Type & Grain:</span>
                    <span className="text-stone-900 font-bold text-right">{productToViewSpecs.leatherType}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-2">
                    <span className="text-stone-500 font-medium">Tanning Method:</span>
                    <span className="text-stone-900 font-bold text-right">{productToViewSpecs.tanning}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-2">
                    <span className="text-stone-500 font-medium">Hardware & Stitching:</span>
                    <span className="text-stone-900 font-bold text-right">{productToViewSpecs.hardware}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">Dimensions & Sizing:</span>
                    <span className="text-stone-900 font-bold text-right">{productToViewSpecs.dimensions}</span>
                  </div>
                </div>

                {productToViewSpecs.story && (
                  <div className="p-3 bg-[#F5EDE4] rounded-lg border border-[#E0D1BF]">
                    <span className="font-bold text-[#8B5A2B] uppercase text-[10px] block mb-1">
                      Atelier Heritage Story
                    </span>
                    <p className="text-stone-700 italic text-[11px] leading-relaxed">
                      "{productToViewSpecs.story}"
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      const target = productToViewSpecs;
                      setProductToViewSpecs(null);
                      setProductToEdit(target);
                      setIsAddModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#70421B] text-white rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Specifications</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Commercial Tax Invoice & Courier Packing Slip Modal */}
        <InvoiceReceiptModal
          order={orderForInvoice}
          isOpen={!!orderForInvoice}
          onClose={() => setOrderForInvoice(null)}
        />
      </div>
    </div>
  );
};
