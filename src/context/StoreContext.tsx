import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CartItem, Order, CustomerInfo, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, monogramText?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeView: 'store' | 'admin';
  setActiveView: (view: 'store' | 'admin') => void;
  orders: Order[];
  unreadOrdersCount: number;
  newOrderAlert: Order | null;
  clearNewOrderAlert: () => void;
  placeOrder: (customer: CustomerInfo) => Order;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    courierName?: Order['courierName'],
    trackingNumber?: string,
    adminNotes?: string
  ) => void;
  markOrdersAsViewed: () => void;
  activeOrderConfirmation: Order | null;
  setActiveOrderConfirmation: (order: Order | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  freeDeliveryThreshold: number;
  toggleProductStock: (productId: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, quantity: number, inStock?: boolean) => void;
  resetProductsToDefault: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_ORDERS_KEY = 'the_leather_workx_orders_v1';
const LOCAL_STORAGE_PRODUCTS_KEY = 'the_leather_workx_products_v1';

// Initial sample orders for business owner admin portal
const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'TLW-PK-98214',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    items: [
      {
        id: 'sample-item-1',
        product: INITIAL_PRODUCTS[1], // Bespoke Passport Sleeve
        quantity: 1,
        selectedColor: 'Monaco Navy & Gold',
        monogramText: 'S.K.',
      },
      {
        id: 'sample-item-2',
        product: INITIAL_PRODUCTS[3], // Minimalist Bifold
        quantity: 1,
        selectedColor: 'Whiskey Tan',
      }
    ],
    customer: {
      fullName: 'Shahmeer Khan',
      email: 'shahmeer.k@gmail.com',
      phone: '0321-4567890',
      address: 'House 42-B, Street 7, Sector F-8/2',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      postalCode: '44000',
      deliveryNotes: 'Please deliver after 3 PM. Call before arrival.',
    },
    subtotal: 9200,
    deliveryFee: 0,
    discount: 0,
    total: 9200,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'unpaid_cod',
    fulfillmentStatus: 'pending_review',
    isViewedByAdmin: false,
  },
  {
    id: 'TLW-PK-98190',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    items: [
      {
        id: 'sample-item-3',
        product: INITIAL_PRODUCTS[0], // Heritage Weekender
        quantity: 1,
        selectedColor: 'Saddle Cognac',
      }
    ],
    customer: {
      fullName: 'Zainab Tariq',
      email: 'zainab.tariq@yahoo.com',
      phone: '0300-8899221',
      address: 'Apartment 402, Creek Vistas, Phase VIII, DHA',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75500',
      deliveryNotes: 'Leave with building reception if unavailable.',
    },
    subtotal: 24500,
    deliveryFee: 0,
    discount: 0,
    total: 24500,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'unpaid_cod',
    fulfillmentStatus: 'confirmed',
    courierName: 'TCS',
    trackingNumber: 'TCS-PK-9920148',
    isViewedByAdmin: false,
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((p: Product, idx: number) => ({
          ...p,
          stockQuantity: p.stockQuantity ?? (15 - (idx % 7)),
        }));
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [activeOrderConfirmation, setActiveOrderConfirmation] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  });

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  const freeDeliveryThreshold = 5000;

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    return cart.length === 0 ? 0 : cartSubtotal >= freeDeliveryThreshold ? 0 : 250;
  }, [cart.length, cartSubtotal, freeDeliveryThreshold]);

  const cartTotal = useMemo(() => cartSubtotal + deliveryFee, [cartSubtotal, deliveryFee]);

  const unreadOrdersCount = useMemo(() => {
    return orders.filter((o) => !o.isViewedByAdmin).length;
  }, [orders]);

  const addToCart = useCallback((
    product: Product,
    quantity = 1,
    selectedColor = product.colors[0]?.name || 'Standard',
    monogramText = ''
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          (item.monogramText || '') === (monogramText || '')
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          product,
          quantity,
          selectedColor,
          monogramText: monogramText.trim(),
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const placeOrder = useCallback((customer: CustomerInfo): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `TLW-PK-${randomNum}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: [...cart],
      customer,
      subtotal: cartSubtotal,
      deliveryFee,
      discount: 0,
      total: cartTotal,
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'unpaid_cod',
      fulfillmentStatus: 'pending_review',
      isViewedByAdmin: false,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setNewOrderAlert(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setActiveOrderConfirmation(newOrder);

    // Audio chime or alert can be triggered
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // AudioContext fallback
    }

    return newOrder;
  }, [cart, cartSubtotal, deliveryFee, cartTotal, clearCart]);

  const updateOrderStatus = useCallback((
    orderId: string,
    status: OrderStatus,
    courierName?: Order['courierName'],
    trackingNumber?: string,
    adminNotes?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            fulfillmentStatus: status,
            paymentStatus: status === 'delivered' ? 'paid_on_delivery' : order.paymentStatus,
            courierName: courierName || order.courierName,
            trackingNumber: trackingNumber !== undefined ? trackingNumber : order.trackingNumber,
            adminNotes: adminNotes !== undefined ? adminNotes : order.adminNotes,
          };
        }
        return order;
      })
    );
  }, []);

  const markOrdersAsViewed = useCallback(() => {
    setOrders((prev) => prev.map((order) => ({ ...order, isViewedByAdmin: true })));
  }, []);

  const clearNewOrderAlert = useCallback(() => {
    setNewOrderAlert(null);
  }, []);

  const toggleProductStock = useCallback((productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  }, []);

  const addProduct = useCallback((newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const updateProductStock = useCallback((productId: string, quantity: number, inStock?: boolean) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const safeQuantity = Math.max(0, quantity);
          return {
            ...p,
            stockQuantity: safeQuantity,
            inStock: inStock !== undefined ? inStock : safeQuantity > 0,
          };
        }
        return p;
      })
    );
  }, []);

  const resetProductsToDefault = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
  }, []);

  const contextValue = useMemo(() => ({
    products,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    selectedProduct,
    setSelectedProduct,
    activeView,
    setActiveView,
    orders,
    unreadOrdersCount,
    newOrderAlert,
    clearNewOrderAlert,
    placeOrder,
    updateOrderStatus,
    markOrdersAsViewed,
    activeOrderConfirmation,
    setActiveOrderConfirmation,
    isCheckoutOpen,
    setIsCheckoutOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    freeDeliveryThreshold,
    toggleProductStock,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    resetProductsToDefault,
  }), [
    products,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    selectedProduct,
    activeView,
    orders,
    unreadOrdersCount,
    newOrderAlert,
    clearNewOrderAlert,
    placeOrder,
    updateOrderStatus,
    markOrdersAsViewed,
    activeOrderConfirmation,
    isCheckoutOpen,
    searchQuery,
    selectedCategory,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    freeDeliveryThreshold,
    toggleProductStock,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    resetProductsToDefault,
  ]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
