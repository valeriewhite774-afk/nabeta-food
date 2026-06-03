/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OrderStatus = 'placed' | 'preparing' | 'transit' | 'delivered';

export interface ProteinOption {
  id: string;
  name: string;
  price: number;
}

export interface SwallowOption {
  id: string;
  name: string;
  price: number;
}

export interface Review {
  stars: number;
  text: string;
  author: string;
  location: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewsCount: number;
  basePrice: number;
  image: string;
  defaultProteins: string[];
  defaultSwallow: string;
  bulletPoints: string[];
  review: Review;
  reviews: Review[];
  proteins: ProteinOption[];
  swallows: SwallowOption[];
  faqs?: FAQItem[];
}

export interface CustomizationState {
  addedProteins: string[]; // List of protein IDs
  selectedSwallow: string;  // Swallow ID
  quantity: number;
}

export interface CartItem {
  id: string; // unique cart item ID
  menuItem: MenuItem;
  customization: CustomizationState;
  finalPricePerUnit: number;
  totalPrice: number;
}

export interface FirebaseUserState {
  uid: string;
  email: string;
  displayName: string;
  loyaltyPoints: number;
  phoneNumber: string;
  addresses: string[];
  rewardTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export interface SimulatedOrder {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  pointsEarned: number;
  pointsUsed: number;
  status: OrderStatus;
  timestamp: string;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  driverLocation?: {
    lat: number;
    lng: number;
    progress: number; // 0 to 1
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'loyalty' | 'promo';
}

export type AppLanguage = 'EN' | 'YO' | 'IG' | 'HA' | 'FR';

export interface LocalizationStrings {
  brandName: string;
  slogan: string;
  excellent: string;
  reviews: string;
  whatsOnPlate: string;
  addMoreProteins: string;
  proteinsSub: string;
  changeSwallow: string;
  swallowSub: string;
  quantity: string;
  itemTotal: string;
  addToCart: string;
  cartEmpty: string;
  subtotal: string;
  deliveryFee: string;
  total: string;
  placeOrder: string;
  ratingText: string;
  loyaltyPoints: string;
  pts: string;
  orderStatus: {
    placed: string;
    preparing: string;
    transit: string;
    delivered: string;
  };
  orderStatusDesc: {
    placed: string;
    preparing: string;
    transit: string;
    delivered: string;
  };
  rewardsTitle: string;
  rewardsTier: string;
  darkMode: string;
  notifications: string;
  secureCheckout: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  payWithCard: string;
  orderTracking: string;
  estDelivery: string;
  deliveredSuccess: string;
  referralTitle: string;
  referralDesc: string;
}
