export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number; // in PKR
  compareAtPrice?: number;
  stockQuantity?: number; // Available inventory units in atelier
  category: 'bags' | 'wallets' | 'travel' | 'bespoke' | 'accessories';
  categoryLabel: string;
  image: string;
  secondaryImages: string[];
  tag?: string;
  description: string;
  story?: string;
  leatherType: string;
  tanning: string;
  hardware: string;
  dimensions: string;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  isBespokeHandPainted?: boolean;
  colors: { name: string; hex: string }[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor: string;
  monogramText?: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode?: string;
  deliveryNotes?: string;
}

export type OrderStatus = 'pending_review' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid_cod' | 'paid_on_delivery';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerInfo;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cash_on_delivery';
  paymentStatus: PaymentStatus;
  fulfillmentStatus: OrderStatus;
  courierName?: 'TCS' | 'Leopards' | 'Call Courier' | 'Trax' | 'PostEx' | 'Custom Courier';
  trackingNumber?: string;
  adminNotes?: string;
  isViewedByAdmin: boolean;
}
