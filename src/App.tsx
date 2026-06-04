/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Plus, 
  Minus, 
  Smartphone, 
  Award, 
  CheckCircle2, 
  Compass, 
  BellRing, 
  UtensilsCrossed, 
  PhoneCall, 
  Clock, 
  RotateCcw, 
  Sparkles,
  User,
  Heart,
  Share2,
  Database,
  Eye,
  EyeOff
} from 'lucide-react';

import { MENU_ITEMS } from './menuData';
import { LOCALIZATION_DATA } from './localization';
import { db, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDocs,
  deleteDoc,
  query, 
  where, 
  updateDoc
} from 'firebase/firestore';
import { PhoneShell } from './components/PhoneShell';
import { FirebaseConsole } from './components/FirebaseConsole';
import { MapSimulation } from './components/MapSimulation';
import { SecureCheckout } from './components/SecureCheckout';
import { LoyaltyRewards } from './components/LoyaltyRewards';
import { GourmetReviews } from './components/GourmetReviews';
import { 
  OrderStatus, 
  CustomizationState, 
  CartItem, 
  SimulatedOrder, 
  FirebaseUserState, 
  AppNotification, 
  MenuItem,
  Review
} from './types';

export default function App() {
  // Mobile app settings / simulation states
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const viewMode = 'standalone';

  const showDevConsole = false; // Locked to false for production release
  const [menuItemsState, setMenuItemsState] = useState<MenuItem[]>(MENU_ITEMS);
  const [currentMenuIndex, setCurrentMenuIndex] = useState<number>(0);
  const currentItem = menuItemsState[currentMenuIndex];

  // Active view inside the phone mockup: 'menu' | 'cart' | 'checkout' | 'tracking' | 'rewards' | 'reviews'
  const [activeView, setActiveView] = useState<'menu' | 'cart' | 'checkout' | 'tracking' | 'rewards' | 'reviews'>('menu');
  const [previousView, setPreviousView] = useState<'menu' | 'cart' | 'checkout' | 'tracking' | 'rewards' | 'reviews' | null>(null);
  const [activeReviewFilter, setActiveReviewFilter] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeFooterTab, setActiveFooterTab] = useState<'shipping' | 'contact' | 'privacy' | null>(null);

  // Customization selection state, initialized for the current active menu item
  const [customState, setCustomState] = useState<CustomizationState>({
    addedProteins: [], // list of protein names or IDs
    selectedSwallow: currentItem.defaultSwallow,
    quantity: 1,
  });

  // Track item quantity changes on menu switch and inject dynamic SEO updates
  useEffect(() => {
    setCustomState({
      addedProteins: [],
      selectedSwallow: currentItem.defaultSwallow,
      quantity: 1,
    });
    setOpenFaqIndex(null); // Reset open FAQ item on soup switch

    // Dynamic browser SEO tag updates for indexed crawlers
    if (currentItem) {
      document.title = `${currentItem.name} Delivery - NabetaFood: Order Fresh Nigerian Soups Online`;
      
      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) {
        descTag.setAttribute('content', `Craving fresh ${currentItem.name}? ${currentItem.description} Ordered hot, fast, and delivered straight to your door in Warri.`);
      }

      // Append or update dynamic single-product JSON-LD script for rich snippets on item views
      let dynamicScript = document.getElementById('dynamic-product-jsonld');
      if (!dynamicScript) {
        dynamicScript = document.createElement('script');
        dynamicScript.id = 'dynamic-product-jsonld';
        dynamicScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(dynamicScript);
      }
      dynamicScript.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${currentItem.name} - Authentic Traditional Nigerian Bowl`,
        "description": currentItem.description,
        "brand": {
          "@type": "Brand",
          "name": "NabetaFood"
        },
        "offers": {
          "@type": "Offer",
          "price": String(currentItem.basePrice),
          "priceCurrency": "NGN",
          "availability": "https://schema.org/InStock",
          "url": `https://nabetafood.com/#/soup/${currentItem.id}`
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": String(currentItem.rating),
          "reviewCount": String(currentItem.reviewsCount)
        }
      });

      // Append or update dynamic single-document FAQPage JSON-LD for rich questions on Google
      if (currentItem.faqs && currentItem.faqs.length > 0) {
        let dynamicFaqScript = document.getElementById('dynamic-faq-jsonld');
        if (!dynamicFaqScript) {
          dynamicFaqScript = document.createElement('script');
          dynamicFaqScript.id = 'dynamic-faq-jsonld';
          dynamicFaqScript.setAttribute('type', 'application/ld+json');
          document.head.appendChild(dynamicFaqScript);
        }
        dynamicFaqScript.innerHTML = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": currentItem.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        });
      } else {
        const existingFaqScript = document.getElementById('dynamic-faq-jsonld');
        if (existingFaqScript) {
          existingFaqScript.remove();
        }
      }
    }
  }, [currentMenuIndex, currentItem]);

  // Firebase Database State Simulation
  const [currentUser, setCurrentUser] = useState<FirebaseUserState>({
    uid: 'user_u88x92a',
    email: 'valeriewhite774@gmail.com',
    displayName: 'Valerie White',
    loyaltyPoints: 650,
    phoneNumber: '+234 812 345 6789',
    addresses: ['Bishop Ideh Road, Jeddo, Warri', 'Airport Road, Effurun'],
    rewardTier: 'Gold'
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<SimulatedOrder[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Safety net to capture and handle harmless "user aborted request" or AbortError events gracefully
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const isAbortMsg = event.message?.toLowerCase().includes('abort') || 
                         event.message?.toLowerCase().includes('aborted');
      const isAbortName = event.error?.name === 'AbortError' || 
                          event.error?.name === 'DOMException' && event.error?.message?.toLowerCase().includes('abort');
      
      if (isAbortMsg || isAbortName) {
        event.preventDefault();
        console.warn('Silently handled harmless user-aborted request:', event.message);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const isAbortMsg = reason?.message?.toLowerCase().includes('abort') || 
                         reason?.message?.toLowerCase().includes('aborted') ||
                         String(reason).toLowerCase().includes('abort');
      const isAbortName = reason?.name === 'AbortError' || reason === 'AbortError';

      if (isAbortMsg || isAbortName) {
        event.preventDefault();
        console.warn('Silently handled harmless user-aborted promise rejection');
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // 1. Initial Load of reviews, notifications, orders, and user from Firestore
  useEffect(() => {
    // Check if user document exists, otherwise seed it
    const userDocRef = doc(db, 'users', 'user_u88x92a');
    
    // Listen to real-time updates on our user document
    const unsubUser = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        setCurrentUser(snap.data() as FirebaseUserState);
      } else {
        const defaultUser: FirebaseUserState = {
          uid: 'user_u88x92a',
          email: 'valeriewhite774@gmail.com',
          displayName: 'Valerie White',
          loyaltyPoints: 650,
          phoneNumber: '+234 812 345 6789',
          addresses: ['Bishop Ideh Road, Jeddo, Warri', 'Airport Road, Effurun'],
          rewardTier: 'Gold'
        };
        try {
          setDoc(userDocRef, defaultUser);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/user_u88x92a`);
        }
      }
    }, (error) => {
      console.warn("User fetch error, probably offline or rule issue:", error);
    });

    // Real-time listen to orders
    const ordersCol = collection(db, 'orders');
    const qOrders = query(ordersCol, where('userId', '==', 'user_u88x92a'));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      const ordersList: SimulatedOrder[] = [];
      snap.forEach(docSnap => {
        ordersList.push(docSnap.data() as SimulatedOrder);
      });
      ordersList.sort((a,b) => b.id.localeCompare(a.id));
      setOrders(ordersList);
    }, (err) => {
      console.warn("Orders live sync error:", err);
    });

    // Real-time listen to notifications
    const notifyCol = collection(db, 'notifications');
    const unsubNotify = onSnapshot(notifyCol, (snap) => {
      const notifyList: AppNotification[] = [];
      snap.forEach(docSnap => {
        notifyList.push(docSnap.data() as AppNotification);
      });
      if (notifyList.length > 0) {
        setNotifications(notifyList);
      } else {
        const defaultNotifies: AppNotification[] = [
          {
            id: 'welcome-notify',
            title: 'Welcome back to NabetaFood Gold!',
            message: 'Exclusive: Enjoy double loyalty points on all swallow orders today.',
            timestamp: 'Just now',
            read: false,
            type: 'promo'
          },
          {
            id: 'prev-loyal',
            title: 'Tier upgraded to Gold 🌟',
            message: 'You have crossed 500 lifetime points and unlocked access to standard free shipping!',
            timestamp: '2 hours ago',
            read: true,
            type: 'loyalty'
          }
        ];
        defaultNotifies.forEach(async (n) => {
          try {
            await setDoc(doc(db, 'notifications', n.id), n);
          } catch(e) {}
        });
      }
    }, (err) => {
      console.warn("Notifications live sync error:", err);
    });

    // Real-time dynamic compilation of gourmet reviews
    const reviewsCol = collection(db, 'reviews');
    const unsubReviews = onSnapshot(reviewsCol, (snap) => {
      const dbReviews: { [menuItemId: string]: Review[] } = {};
      snap.forEach(docSnap => {
        const data = docSnap.data();
        const menuItemId = data.menuItemId || '';
        if (menuItemId) {
          if (!dbReviews[menuItemId]) {
            dbReviews[menuItemId] = [];
          }
          dbReviews[menuItemId].push({
            stars: data.stars,
            text: data.text,
            author: data.author,
            location: data.location
          });
        }
      });

      setMenuItemsState(prevItems => {
        return prevItems.map(item => {
          const baseReviews = item.reviews || [item.review];
          const itemDbReviews = dbReviews[item.id] || [];
          
          const merged = [...itemDbReviews];
          baseReviews.forEach(bRev => {
            const alreadyExists = merged.some(m => m.author === bRev.author && m.text === bRev.text);
            if (!alreadyExists) {
              merged.push(bRev);
            }
          });

          const avgStars = merged.reduce((acc, r) => acc + r.stars, 0) / (merged.length || 1);

          return {
            ...item,
            reviews: merged,
            reviewsCount: merged.length,
            rating: Number(avgStars.toFixed(1))
          };
        });
      });
    }, (err) => {
      console.warn("Reviews live sync error:", err);
    });

    return () => {
      unsubUser();
      unsubOrders();
      unsubNotify();
      unsubReviews();
    };
  }, []);

  // Floating simulated push notification toast inside the phone bezel
  const [pushToast, setPushToast] = useState<AppNotification | null>(null);
  const [showNotificationsList, setShowNotificationsList] = useState<boolean>(false);

  // Map progress drivers simulation
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [mapProgress, setMapProgress] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Localized strings
  const strings = LOCALIZATION_DATA['EN'];

  // Calculated custom values
  const extraProteinsPrice = customState.addedProteins.reduce((total, id) => {
    const p = currentItem.proteins.find(item => item.id === id);
    return total + (p ? p.price : 0);
  }, 0);

  const pricePerUnit = currentItem.basePrice + extraProteinsPrice;
  const currentTotal = pricePerUnit * customState.quantity;

  // Handle Carousel navigation
  const nextCarousel = () => {
    setCurrentMenuIndex((prev) => (prev + 1) % MENU_ITEMS.length);
  };

  const prevCarousel = () => {
    setCurrentMenuIndex((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
  };

  // Quick select customization tags
  const toggleProteinCustom = (id: string) => {
    setCustomState(prev => {
      const exists = prev.addedProteins.includes(id);
      const updated = exists 
        ? prev.addedProteins.filter(pId => pId !== id)
        : [...prev.addedProteins, id];
      return { ...prev, addedProteins: updated };
    });
  };

  const setSwallowSelect = (id: string) => {
    setCustomState(prev => ({ ...prev, selectedSwallow: id }));
  };

  const incrementQty = () => {
    setCustomState(prev => ({ ...prev, quantity: prev.quantity + 1 }));
  };

  const decrementQty = () => {
    setCustomState(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }));
  };

  // Push notification helper with audio chime effect
  const triggerPushNotify = (notify: AppNotification) => {
    setNotifications(prev => {
      if (prev.some(n => n.id === notify.id)) {
        return prev;
      }
      return [notify, ...prev];
    });
    setPushToast(notify);
    
    // Play subtle synthesized mobile chime audio frequency securely
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      // Audio context might be restricted before user gestures
    }

    // Auto dismiss bubble in 4 seconds
    setTimeout(() => {
      setPushToast(null);
    }, 4500);
  };

  // Add customized dish to local Cart
  const handleAddToCart = () => {
    const newCartItem: CartItem = {
      id: `${currentItem.id}_${Date.now()}`,
      menuItem: currentItem,
      customization: { ...customState },
      finalPricePerUnit: pricePerUnit,
      totalPrice: currentTotal
    };

    setCart(prev => [...prev, newCartItem]);
    
    // Notification chime and popup
    triggerPushNotify({
      id: `add-cart-${Date.now()}`,
      title: 'Added to Cart! 🛒',
      message: `${customState.quantity}x ${currentItem.name} successfully updated to your order ticket. Check outer cart to review.`,
      timestamp: 'Just now',
      read: false,
      type: 'promo'
    });

    // Reset customizations
    setCustomState({
      addedProteins: [],
      selectedSwallow: currentItem.defaultSwallow,
      quantity: 1,
    });

    // Reset screen scrolling to top so that cart / checkout details show cleanly
    const container = document.getElementById('phone-scroll-content');
    if (container) {
      container.scrollTo({ top: 0 });
    }

    // Instantly navigate to the cart / checkout ticket view to eliminate scrolling bottleneck entirely!
    setActiveView('cart');
  };

  // Cart total math
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = cartSubtotal > 0 ? 500 : 0; // ₦500 delivery
  const cartTotal = cartSubtotal + deliveryFee;

  // Process secure payment outcome
  const handleCheckoutSuccess = async (pointsEarned: number) => {
    const finalOrder: SimulatedOrder = {
      id: `order_${Math.random().toString(36).substring(2, 7)}`,
      userId: currentUser.uid,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartTotal,
      pointsEarned,
      pointsUsed: 0,
      status: 'placed',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryAddress: currentUser.addresses[0],
      paymentMethod: 'Paystack Secured Card',
      paymentStatus: 'paid'
    };

    setActiveOrderId(finalOrder.id);
    
    // Store in Firestore
    try {
      await setDoc(doc(db, 'orders', finalOrder.id), finalOrder);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${finalOrder.id}`);
    }

    // Increment User points in Firestore
    const updatedPoints = currentUser.loyaltyPoints + pointsEarned;
    const tier = updatedPoints >= 1500 ? 'Platinum' : updatedPoints >= 1000 ? 'Gold' : updatedPoints >= 500 ? 'Silver' : 'Bronze';
    try {
      await setDoc(doc(db, 'users', 'user_u88x92a'), {
        ...currentUser,
        loyaltyPoints: updatedPoints,
        rewardTier: tier
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/user_u88x92a`);
    }

    // Reset checkout forms
    setCart([]);
    setActiveView('tracking');

    // Trigger Success notification in Firestore
    const successNotify: AppNotification = {
      id: `success-${finalOrder.id}-${Date.now()}`,
      title: 'Order Synchronized! 🔥',
      message: `₦${finalOrder.total.toLocaleString()} paid! Your order is active. Earnt +${pointsEarned} Nabeta points!`,
      timestamp: 'Just now',
      read: false,
      type: 'order'
    };
    try {
      await setDoc(doc(db, 'notifications', successNotify.id), successNotify);
    } catch (e) {}

    triggerPushNotify(successNotify);
  };

  // Firebase Simulator Order progress controls
  const handleAdvanceOrderStatus = async (orderId: string) => {
    const o = orders.find(ord => ord.id === orderId);
    if (!o) return;

    let nextStatus: OrderStatus = 'placed';
    if (o.status === 'placed') nextStatus = 'preparing';
    else if (o.status === 'preparing') {
      nextStatus = 'transit';
      setMapProgress(0.01);
    }
    else if (o.status === 'transit') nextStatus = 'delivered';

    try {
      await updateDoc(doc(db, 'orders', orderId), { status: nextStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }

    // Write push notification to Firestore
    const statusNotify: AppNotification = {
      id: `status-${orderId}-${nextStatus}-${Date.now()}`,
      title: `Status: ${strings.orderStatus[nextStatus]}!`,
      message: strings.orderStatusDesc[nextStatus],
      timestamp: 'Just now',
      read: false,
      type: 'order'
    };
    try {
      await setDoc(doc(db, 'notifications', statusNotify.id), statusNotify);
    } catch (e) {}

    triggerPushNotify(statusNotify);
  };

  // Live progress ticking simulation
  useEffect(() => {
    if (mapProgress > 0 && mapProgress < 1) {
      timerRef.current = setInterval(() => {
        setMapProgress(prev => {
          if (prev >= 1) {
            clearInterval(timerRef.current!);
            return 1;
          }
          return prev + 0.05; // increment progress smoothly
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mapProgress]);

  // Handle map delivery auto-delivered
  useEffect(() => {
    if (mapProgress >= 1 && activeOrderId) {
      setOrders(prev => prev.map(o => {
        if (o.id === activeOrderId && o.status === 'transit') {
          // Send push alert
          triggerPushNotify({
            id: `delivered-auto-${activeOrderId}`,
            title: strings.deliveredSuccess,
            message: 'Enjoy your warm meals straight from Nabeta Kitchen! Share on social media for bonus points.',
            timestamp: 'Just now',
            read: false,
            type: 'order'
          });
          return { ...o, status: 'delivered' };
        }
        return o;
      }));
      setMapProgress(0); // clear
    }
  }, [mapProgress, activeOrderId]);

  // Send random promotional push alert
  const handleSendSystemPromo = async () => {
    const promoPhrases = [
      { t: 'Weekend Promo Special! 🌶️', m: 'Claim ₦1,500 off your next fisherman soup bowl. Use code WARRISEAFOOD.' },
      { t: 'Free Extra Starch Voucher 🌟', m: 'A complimentary starch is matched for any Banga bowl purchased within 30 min.' },
      { t: 'Earn 3x Points! 🎖️', m: 'Refer any companion today and triple your standard gold points payout.' }
    ];
    const rand = promoPhrases[Math.floor(Math.random() * promoPhrases.length)];
    const pId = `promo-sys-${Date.now()}`;
    const newPromo: AppNotification = {
      id: pId,
      title: rand.t,
      message: rand.m,
      timestamp: 'Just now',
      read: false,
      type: 'promo'
    };
    
    try {
      await setDoc(doc(db, 'notifications', pId), newPromo);
    } catch(e) {}

    triggerPushNotify(newPromo);
  };

  // Wipe states to initial demonstration levels
  const handleResetDatabase = async () => {
    // Reset User doc in Firestore
    try {
      await setDoc(doc(db, 'users', 'user_u88x92a'), {
        uid: 'user_u88x92a',
        email: 'valeriewhite774@gmail.com',
        displayName: 'Valerie White',
        loyaltyPoints: 650,
        phoneNumber: '+234 812 345 6789',
        addresses: ['Bishop Ideh Road, Jeddo, Warri', 'Airport Road, Effurun'],
        rewardTier: 'Gold'
      });
    } catch (e) {}

    // Clear Orders in Firestore
    try {
      const ordSnaps = await getDocs(collection(db, 'orders'));
      ordSnaps.forEach(async (d) => {
        try { await deleteDoc(d.ref); } catch(e) {}
      });
    } catch (e) {}

    // Clear Notifications in Firestore
    try {
      const noteSnaps = await getDocs(collection(db, 'notifications'));
      noteSnaps.forEach(async (d) => {
        try { await deleteDoc(d.ref); } catch(e) {}
      });
    } catch (e) {}

    // Clear custom reviews in Firestore
    try {
      const revSnaps = await getDocs(collection(db, 'reviews'));
      revSnaps.forEach(async (d) => {
        try { await deleteDoc(d.ref); } catch(e) {}
      });
    } catch (e) {}

    setCart([]);
    setOrders([]);
    setMapProgress(0);
    setActiveOrderId(null);
    setActiveView('menu');

    triggerPushNotify({
      id: `db-cleared-${Date.now()}`,
      title: 'Database Reset Complete',
      message: 'All Firestore collections synchronized & recycled successfully.',
      timestamp: 'Just now',
      read: true,
      type: 'loyalty'
    });
  };

  // Manage Points Redemption
  const handleRedeemPoints = async (pointsSpent: number, title: string) => {
    if (currentUser.loyaltyPoints < pointsSpent) return;

    const updatedPoints = currentUser.loyaltyPoints - pointsSpent;
    const tier = updatedPoints >= 1500 ? 'Platinum' : updatedPoints >= 1000 ? 'Gold' : updatedPoints >= 500 ? 'Silver' : 'Bronze';

    try {
      await setDoc(doc(db, 'users', 'user_u88x92a'), {
        ...currentUser,
        loyaltyPoints: updatedPoints,
        rewardTier: tier
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/user_u88x92a`);
    }

    const redeemNotify: AppNotification = {
      id: `redeem-${Date.now()}`,
      title: `Reward Unlocked! 🎁`,
      message: `You successfully redeemed ${pointsSpent} points for: "${title}". Use coupon code VIP_REDEEM during checkout!`,
      timestamp: 'Just now',
      read: false,
      type: 'loyalty'
    };

    try {
      await setDoc(doc(db, 'notifications', redeemNotify.id), redeemNotify);
    } catch (e) {}

    triggerPushNotify(redeemNotify);
  };

  // Helper back router inside mobile views
  const handleMobileBack = () => {
    if (activeView === 'cart') setActiveView('menu');
    else if (activeView === 'checkout') setActiveView('cart');
    else if (activeView === 'tracking') setActiveView('menu');
    else if (activeView === 'rewards') setActiveView('menu');
    else if (activeView === 'reviews') setActiveView('menu');
  };

  // Add a dynamic review submitted by user
  const handleAddReview = async (menuItemId: string, newReview: Review) => {
    const rId = `review_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    try {
      await setDoc(doc(db, 'reviews', rId), {
        ...newReview,
        menuItemId
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `reviews/${rId}`);
    }

    triggerPushNotify({
      id: `new-review-${Date.now()}`,
      title: 'Review Published! ⭐',
      message: `You successfully added a ${newReview.stars} star review for ${menuItemsState.find(k => k.id === menuItemId)?.name || 'your meal'}!`,
      timestamp: 'Just now',
      read: false,
      type: 'promo'
    });
  };

  // Close notifications list
  const toggleNotificationsDrawer = () => {
    setShowNotificationsList(!showNotificationsList);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#111312] text-white' : 'bg-[#FAFAF9] text-gray-900'} flex flex-col font-sans transition-colors duration-350`}>
      
      {/* Main Container Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-20 flex flex-col items-center justify-center">
        
        {/* Responsive Content Portal Wrapper */}
        <section className="flex flex-col items-center w-full max-w-6xl transition-all duration-300">
          
          {/* Interactive Responsive Content Frame */}
          <PhoneShell
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            brandName={strings.brandName}
            slogan={strings.slogan}
            cartCount={cart.length}
            onOpenCart={() => { setActiveView('cart'); setShowNotificationsList(false); }}
            onOpenMenu={() => { setActiveView('menu'); setShowNotificationsList(false); }}
            onOpenRewards={() => { setActiveView('rewards'); setShowNotificationsList(false); }}
            onOpenReviews={() => { setActiveView('reviews'); setShowNotificationsList(false); }}
            onOpenTracking={() => { setActiveView('tracking'); setShowNotificationsList(false); }}
            showTrackingButton={orders.length > 0}
            activeView={activeView}
            onBack={activeView !== 'menu' || showNotificationsList ? handleMobileBack : null}
            notificationsCount={notifications.filter(n => !n.read).length}
            onOpenNotifications={toggleNotificationsDrawer}
            viewMode={viewMode}
          >
            {/* Dynamic Native Banners incoming overlay inside phone screen bezel */}
            {pushToast && (
              <div className="absolute top-1 left-4 right-4 z-50 bg-[#161918]/95 border-l-4 border-[#40685D] p-3 rounded-2xl shadow-premium-depth text-xs flex items-start space-x-2.5 animate-slide-up select-none">
                <div className="bg-[#40685D]/10 text-[#40685D] p-1.5 rounded-full inline-flex self-start">
                  <BellRing className="w-3.5 h-3.5 text-cta" />
                </div>
                <div className="flex-1 font-sans">
                  <div className="font-bold text-white text-[11px] uppercase tracking-wide flex justify-between">
                    <span>{pushToast.title}</span>
                    <span className="text-[8px] text-gray-500">{pushToast.timestamp}</span>
                  </div>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-[10px] leading-tight mt-0.5`}>
                    {pushToast.message}
                  </p>
                </div>
              </div>
            )}

            {/* Notification Center Drawer Overlay */}
            {showNotificationsList ? (
              <div className="flex-1 p-4 flex flex-col font-sans animate-fade-in">
                <div className="flex justify-between items-center pb-3 border-b border-gray-700/30 mb-3">
                  <h3 className="font-serif font-bold text-base text-cta flex items-center space-x-1.5">
                    <BellRing className="w-4 h-4 text-cta" />
                    <span>{strings.notifications}</span>
                  </h3>
                  <button 
                    onClick={() => {
                      notifications.forEach(async (n) => {
                        if (!n.read) {
                          try {
                            await updateDoc(doc(db, 'notifications', n.id), { read: true });
                          } catch (e) {}
                        }
                      });
                      setShowNotificationsList(false);
                    }}
                    className="text-[10px] text-gray-500 hover:underline uppercase tracking-wider font-bold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                  {notifications.filter((n, idx, self) => self.findIndex(item => item.id === n.id) === idx).map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-3 rounded-2xl border transition-all ${
                        darkMode ? 'bg-black/40 border-gray-800' : 'bg-gray-50 border-gray-200'
                      } ${!n.read ? 'border-l-4 border-l-[#40685D]' : ''}`}
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-white text-xs">{n.title}</span>
                        <span className="text-[9px] text-gray-500 font-mono">{n.timestamp}</span>
                      </div>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-[10px] mt-1 leading-relaxed`}>
                        {n.message}
                      </p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center text-gray-500 py-12 text-xs">No notifications yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* 1. BROWSE MENU VIEW - Product customized screen exactly representing screenshots! */}
                {activeView === 'menu' && (
                  <div className="animate-fade-in flex flex-col">

                    {/* Gourmet Visual Hero Slider Carousel */}
                    <div id="product-visual-container" className="relative w-full h-[280px] group overflow-hidden bg-neutral-900 border-b border-gray-800/10">
                      
                      {/* Interactive slide transitions */}
                      <img 
                        src={currentItem.image} 
                        alt={currentItem.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-opacity duration-350 transform group-hover:scale-105"
                      />

                      {/* Dark overlay banner */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white select-none">
                        <p className="text-[9px] tracking-widest text-[#D6E6DB] uppercase font-bold">
                          Warri Delivery • Freshly hot and garnished daily
                        </p>
                      </div>

                      {/* Navigation Carousel arrows precisely on top of food picture */}
                      <button 
                        id="carousel-prev"
                        onClick={prevCarousel} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-black shadow-lg flex items-center justify-center hover:bg-slate-100 transition-transform active:scale-90"
                        title="Previous Dish"
                      >
                        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                      </button>

                      <button 
                        id="carousel-next"
                        onClick={nextCarousel} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-black shadow-lg flex items-center justify-center hover:bg-slate-100 transition-transform active:scale-90"
                        title="Next Dish"
                      >
                        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                      </button>

                      {/* Dots indices indicator */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-black/40 px-2 py-1 rounded-full">
                        {MENU_ITEMS.map((_, i) => (
                          <span 
                            key={i} 
                            onClick={() => setCurrentMenuIndex(i)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                              currentMenuIndex === i ? 'bg-white w-4' : 'bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Detailed Content matching styling requirements */}
                    <div className="p-4 flex-1">
                      
                      {/* Rating details: Clickable link to dedicated reviews view */}
                      <button 
                        onClick={() => {
                          setActiveReviewFilter(currentItem.id);
                          setActiveView('reviews');
                        }}
                        className="flex items-center space-x-1.5 text-xs mb-2 group cursor-pointer transition-all hover:opacity-85 active:scale-[0.99]"
                      >
                        <span className="font-bold text-[#40685D] tracking-wide">{strings.excellent}</span>
                        <div className="flex text-amber-500 scale-90">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-[11px] font-sans font-medium group-hover:underline flex items-center`}>
                          {currentItem.rating} {strings.ratingText} · {currentItem.reviewsCount} {strings.reviews}
                          <span className="ml-1 text-[9px] text-[#40685D] opacity-70 group-hover:opacity-100 transition-opacity">➔</span>
                        </span>
                      </button>

                      {/* Main Title Styled with Elegant Georgia font */}
                      <h1 className={`font-serif text-3xl font-bold tracking-tight mb-3 ${
                        darkMode ? 'text-white' : 'text-neutral-900'
                      }`}>
                        {currentItem.name}
                      </h1>

                      {/* Rich Description */}
                      <p className={`text-xs leading-relaxed mb-4 ${
                        darkMode ? 'text-gray-300' : 'text-neutral-700'
                      }`}>
                        {currentItem.description}
                      </p>

                      {/* Check bullets */}
                      <div className="space-y-2 mb-6">
                        {currentItem.bulletPoints.map((pt, index) => (
                          <div key={index} className="flex items-start space-x-2 text-xs">
                            <span className="bg-emerald-500/10 text-emerald-500 p-0.5 rounded-full inline-flex self-start mt-0.5">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-sans`}>
                              {pt}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Testimonials Stack precisely matching scrolling requirement */}
                      <div className="mb-6 space-y-3">
                        <div className="flex justify-between items-center px-1 mb-1">
                          <h4 className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                            Customer Reviews
                          </h4>
                          <span className="text-[10px] text-[#40685D] font-mono font-bold uppercase tracking-wider">
                            Verified
                          </span>
                        </div>

                        {(currentItem.reviews || [currentItem.review]).slice(0, 3).map((rev, revIdx) => (
                          <div 
                            key={revIdx}
                            className={`p-4 rounded-3xl border relative overflow-hidden transition-all duration-350 ${
                              darkMode ? 'bg-[#151716] border-gray-800' : 'bg-[#fcfdfc] border-gray-200'
                            } shadow-premium-soft`}
                          >
                            <div className="flex text-amber-500 mb-1.5 scale-90 -translate-x-1">
                              {Array.from({ length: rev.stars }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                            </div>
                            <p className={`text-xs italic leading-relaxed ${
                              darkMode ? 'text-gray-300' : 'text-gray-750'
                            }`}>
                              {rev.text}
                            </p>

                            <div className="flex items-center space-x-2.5 mt-3 pt-3 border-t border-gray-150/10 dark:border-gray-850/10">
                              <div className="w-7 h-7 rounded-full bg-[#D6E6DB] text-[#40685D] text-[10px] font-sans font-bold flex items-center justify-center">
                                {rev.author.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <div>
                                <span className={`text-[11px] font-bold font-sans block leading-none ${
                                  darkMode ? 'text-white' : 'text-neutral-950'
                                }`}>{rev.author}</span>
                                <span className="text-[9px] text-gray-500 font-sans mt-0.5 block">{rev.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* WHAT'S IN YOUR PLATE box (SAGE Green styled background) */}
                      <div className="p-4 rounded-3xl bg-[#D6E6DB]/50 border border-[#D6E6DB] mb-6 flex flex-col justify-between shadow-premium-soft">
                        <div className="text-[10px] uppercase text-[#40685D] tracking-widest font-sans font-bold block mb-2 leading-none">
                          {strings.whatsOnPlate}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          {currentItem.defaultProteins.map((tag, i) => (
                            <span key={i} className="bg-[#40685D] text-white text-[10px] font-sans px-3 py-1 rounded-full font-bold shadow-sm">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <span className="text-[11px] text-gray-700 font-serif">
                          All included · Base price: <strong>₦{currentItem.basePrice.toLocaleString()}</strong>
                        </span>
                      </div>

                      {/* CUSTOMIZER - Add More Proteins (Optional grid) */}
                      <div className="mb-6">
                        <h4 className="font-serif font-bold text-base text-gray-900 block mb-0.5 dark:text-white">
                          {strings.addMoreProteins} <span className="text-xs text-gray-500 font-sans font-normal">optional</span>
                        </h4>
                        <p className="text-[11px] text-gray-500 mb-3.5 leading-snug">
                          {strings.proteinsSub}
                        </p>

                        <div className="grid grid-cols-2 gap-3.5">
                          {currentItem.proteins.map((p) => {
                            const isAdded = customState.addedProteins.includes(p.id);
                            return (
                              <button
                                key={p.id}
                                onClick={() => toggleProteinCustom(p.id)}
                                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                                  isAdded 
                                    ? 'bg-[#D6E6DB] border-[#40685D] ring-2 ring-[#40685D]/20 shadow-premium-soft' 
                                    : darkMode ? 'bg-[#151716] border-gray-800' : 'bg-white border-gray-200'
                                }`}
                              >
                                <span className={`text-[12px] font-bold block ${
                                  isAdded ? 'text-[#40685D]' : darkMode ? 'text-white' : 'text-black'
                                }`}>
                                  {p.name}
                                </span>
                                <span className={`text-[10px] font-mono mt-1 ${
                                  isAdded ? 'text-[#40685D]' : 'text-gray-500'
                                }`}>
                                  +₦{p.price.toLocaleString()}
                                </span>

                                {isAdded && (
                                  <span className="absolute top-2 right-2 bg-[#40685D] text-white rounded-full p-0.5 text-[8px] flex items-center justify-center">
                                    <Check className="w-3 h-3 stroke-[2.5]" />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* CUSTOMIZER - Change Your Swallow (Optional list tabs) */}
                      <div className="mb-6">
                        <h4 className="font-serif font-bold text-base text-gray-900 block mb-0.5 dark:text-white">
                          {strings.changeSwallow} <span className="text-xs text-gray-500 font-sans font-normal">optional</span>
                        </h4>
                        <p className="text-[11px] text-gray-500 mb-3.5 leading-snug">
                          {strings.swallowSub}
                        </p>

                        <div className="flex space-x-2">
                          {currentItem.swallows.map((sw) => {
                            const isSelected = customState.selectedSwallow === sw.name;
                            return (
                              <button
                                key={sw.id}
                                onClick={() => setSwallowSelect(sw.name)}
                                className={`flex-1 py-3 text-center border text-[11px] font-sans font-bold rounded-2xl uppercase tracking-wider transition-all ${
                                  isSelected 
                                    ? 'bg-[#D6E6DB] border-[#40685D] text-[#40685D]' 
                                    : darkMode ? 'bg-[#151716] border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-neutral-700'
                                }`}
                              >
                                {sw.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex justify-between items-center py-4 border-t border-b border-gray-750/30 mb-6">
                        <span className="font-serif font-bold text-sm tracking-wide text-gray-900 dark:text-white">{strings.quantity}</span>
                        <div className="flex items-center space-x-3.5 bg-neutral-900/3 w-fit rounded-xl p-1 border border-gray-700/50">
                          <button
                            onClick={decrementQty}
                            className="bg-gray-800 hover:bg-gray-750 active:scale-90 text-white rounded-lg p-2 transition-transform"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-sm font-bold w-6 text-center">{customState.quantity}</span>
                          <button
                            onClick={incrementQty}
                            className="bg-gray-800 hover:bg-gray-750 active:scale-90 text-white rounded-lg p-2 transition-transform"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Dynamic itemization calculation box */}
                      <div className={`p-4 rounded-3xl border mb-6 ${
                        darkMode ? 'bg-black/40 border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-sans">
                          <span className="truncate max-w-[210px]">
                            {currentItem.name} ({customState.addedProteins.length > 0 ? customState.addedProteins.map(id=>currentItem.proteins.find(item=>item.id===id)?.name).join(', ') : 'Default'}) + {customState.selectedSwallow}
                          </span>
                          <span className="font-mono">₦{pricePerUnit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
                          <span>Multiplier</span>
                          <span>x{customState.quantity}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-700/20 font-serif">
                          <span className="font-bold text-gray-900 dark:text-white text-xs">{strings.itemTotal}</span>
                          <span className="font-bold text-lg text-emerald-600 font-mono">₦{currentTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Add to Cart Premium Action button! */}
                      <button
                        id="phone-add-to-cart-cta"
                        onClick={handleAddToCart}
                        className="w-full bg-[#40685D] hover:bg-[#34544b] text-white py-3.5 rounded-2xl font-bold font-sans uppercase tracking-wider text-xs transition-transform transform active:scale-95 shadow-premium-depth flex items-center justify-center space-x-2 animate-pulse-subtle"
                      >
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>{strings.addToCart} · ₦{currentTotal.toLocaleString()}</span>
                      </button>

                      {/* Highlighted Featured Customer Review Card */}
                      {currentItem.review && (
                        <div className={`mt-6 p-4 rounded-3xl border transition-all duration-300 shadow-sm ${
                          darkMode ? 'bg-[#151716] border-zinc-800' : 'bg-white border-zinc-250/50'
                        } font-sans`}>
                          <div className="flex justify-between items-center mb-2.5">
                            <span className="text-[10px] uppercase text-[#40685D] dark:text-emerald-300 tracking-widest font-extrabold">
                              CUSTOMER REVIEW
                            </span>
                            <div className="flex space-x-0.5 text-amber-500">
                              {Array.from({ length: currentItem.review.stars }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current stroke-current" />
                              ))}
                            </div>
                          </div>
                          <p className={`text-xs italic leading-relaxed font-serif ${
                            darkMode ? 'text-zinc-200' : 'text-neutral-800'
                          }`}>
                            {currentItem.review.text}
                          </p>
                          <div className="mt-3 flex items-center justify-between text-[10px] opacity-75 font-medium">
                            <span className={darkMode ? 'text-zinc-400' : 'text-neutral-600'}>
                              By {currentItem.review.author}
                            </span>
                            <span className={darkMode ? 'text-zinc-500' : 'text-neutral-500'}>
                              {currentItem.review.location}, NG
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Soup FAQs Accordion Section */}
                      {currentItem.faqs && currentItem.faqs.length > 0 && (
                        <div className="mt-8 space-y-2.5">
                          <div className="flex justify-between items-center px-1 mb-1">
                            <h4 className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                              Frequently Asked Questions
                            </h4>
                            <span className="text-[10px] text-[#40685D] font-mono font-bold uppercase tracking-wider">
                              Soup FAQs
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            {currentItem.faqs.map((faq, idx) => {
                              const isOpen = openFaqIndex === idx;
                              return (
                                <div 
                                  key={idx}
                                  className={`rounded-2xl border transition-all duration-300 ${
                                    isOpen 
                                      ? 'border-[#40685D]/40 bg-[#D6E6DB]/10' 
                                      : darkMode ? 'bg-[#151716] border-gray-800' : 'bg-[#fcfdfc] border-gray-200'
                                  }`}
                                >
                                  <button
                                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                    className="w-full px-4 py-3.5 flex justify-between items-center text-left transition-all active:scale-[0.99]"
                                  >
                                    <span className={`text-xs font-bold ${
                                      isOpen ? 'text-[#40685D] dark:text-emerald-300' : darkMode ? 'text-zinc-100' : 'text-neutral-900'
                                    }`}>
                                      {faq.question}
                                    </span>
                                    <span className="text-xs transition-transform duration-300 transform">
                                      {isOpen ? (
                                        <Minus className="w-3.5 h-3.5 text-[#40685D] dark:text-emerald-300 shrink-0" />
                                      ) : (
                                        <Plus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                      )}
                                    </span>
                                  </button>
                                  
                                  <div 
                                    className={`overflow-hidden transition-all duration-300 ${
                                      isOpen ? 'max-h-40 border-t border-[#40685D]/10' : 'max-h-0'
                                    }`}
                                  >
                                    <p className={`p-4 text-[11px] leading-relaxed ${
                                      darkMode ? 'text-zinc-300' : 'text-neutral-700'
                                    }`}>
                                      {faq.answer}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Interactive Footer & Policies Section */}
                      <footer className={`mt-12 pt-6 pb-4 border-t px-2 text-center transition-all duration-300 ${
                        darkMode ? 'border-zinc-800 text-zinc-500' : 'border-neutral-200 text-neutral-500'
                      }`}>
                        {/* Delivery speed alert bar */}
                        <div className={`p-4 rounded-3xl mb-6 text-left flex items-start space-x-3 shadow-premium-soft transition-all duration-300 ${
                          darkMode ? 'bg-[#151716] border border-zinc-800' : 'bg-[#D6E6DB]/20 border border-[#D6E6DB]'
                        }`}>
                          <Clock className="w-5 h-5 text-[#40685D] dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h5 className={`text-xs font-bold font-sans uppercase tracking-wider mb-0.5 ${
                              darkMode ? 'text-zinc-200' : 'text-[#40685D]'
                            }`}>
                              Superfast Fresh Delivery
                            </h5>
                            <p className={`text-[11px] leading-relaxed ${
                              darkMode ? 'text-zinc-400' : 'text-neutral-600'
                            }`}>
                              Your gourmet soups are garnished, cooked hot, and delivered in only <strong className="text-[#40685D] dark:text-emerald-300">15 to 45 minutes</strong> depending on location.
                            </p>
                          </div>
                        </div>

                        {/* WhatsApp support call to action */}
                        <div className="mb-6 px-1">
                          <a 
                            href="https://wa.me/2348104063360?text=Hello%20Nabetafood%2C%20I%20have%20an%2520inquiry%2520about%2520my%2520order!"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-2xl text-xs transition-all transform active:scale-95 shadow-md uppercase tracking-widest"
                          >
                            <svg className="w-4 h-4 fill-current mr-1" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c2.199.001 4.268.57 6.13 1.66A11.966 11.966 0 0 1 24 11.896c0 6.648-5.338 11.987-11.944 11.987-2.005-.001-3.973-.5-5.733-1.446L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.7 1.45 5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10c0 1.9.52 3.8 1.5 5.4l-.99 3.63 3.79-.98zm11.21-3.5c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.18.2-.35.23-.65.08-1.12-.56-1.93-.97-2.69-2.27-.2-.35-.2-.1.08-.38l.62-.62c.11-.15.15-.25.22-.4.08-.15.03-.3-.02-.45-.05-.15-.47-1.12-.65-1.55-.17-.4-.35-.35-.47-.35h-.45c-.15 0-.4.05-.62.3-.22.25-.85.83-.85 2.03s.87 2.35.99 2.52c.13.17 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43z"/>
                            </svg>
                            <span>WhatsApp Helpline</span>
                          </a>
                        </div>

                        {/* Links matrix */}
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4 text-[10px] font-bold tracking-wider uppercase select-none">
                          <button 
                            onClick={() => setActiveFooterTab('shipping')}
                            className="transition-colors hover:text-[#40685D] dark:hover:text-emerald-400 cursor-pointer"
                          >
                            Delivery Info
                          </button>
                          <span className="text-zinc-300 dark:text-zinc-700 select-none">•</span>
                          <button 
                            onClick={() => setActiveFooterTab('contact')}
                            className="transition-colors hover:text-[#40685D] dark:hover:text-emerald-400 cursor-pointer"
                          >
                            Contact Us
                          </button>
                          <span className="text-zinc-300 dark:text-zinc-700 select-none">•</span>
                          <button 
                            onClick={() => setActiveFooterTab('privacy')}
                            className="transition-colors hover:text-[#40685D] dark:hover:text-emerald-400 cursor-pointer"
                          >
                            Privacy
                          </button>
                        </div>

                        {/* Copyright */}
                        <p className="text-[10px] opacity-75 font-serif py-1">
                          © 2026 NABETA FOODS. All rights reserved.
                        </p>
                        <p className="text-[8px] opacity-50 tracking-wide font-mono mt-0.5 uppercase">
                          Authentic Warri Specialty Kitchen
                        </p>
                      </footer>

                    </div>
                  </div>
                )}

                {/* 2. OVERLAY / CART DRAWER */}
                {activeView === 'cart' && (
                  <div className="animate-fade-in p-4 flex flex-col h-full font-sans">
                    <h3 className="font-serif font-bold text-xl text-cta mb-4">{strings.brandName} Ticket</h3>
                    
                    {cart.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                        <ShoppingBag className="w-12 h-12 text-gray-400 mb-3 animate-bounce-short" />
                        <p className="text-gray-500 max-w-[200px] leading-relaxed text-xs">
                          {strings.cartEmpty}
                        </p>
                        <button
                          onClick={() => setActiveView('menu')}
                          className="mt-4 bg-[#40685D] text-white px-4 py-2 rounded-xl text-xs font-bold"
                        >
                          Find Soup Now
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 flex-1">
                        {cart.map((item, index) => (
                          <div 
                            key={item.id} 
                            className={`p-3.5 rounded-2xl border transition-all ${
                              darkMode ? 'bg-black/30 border-gray-800' : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between">
                              <span className="font-bold text-white text-sm font-serif block">{item.menuItem.name}</span>
                              <button
                                onClick={() => setCart(prev => prev.filter((_, i) => i !== index))}
                                className="text-red-500 font-mono font-bold text-xs"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="text-gray-500 text-[10px] mt-0.5 leading-tight font-sans">
                              Proteins: {item.customization.addedProteins.length > 0 ? item.customization.addedProteins.map(id => item.menuItem.proteins.find(p=>p.id===id)?.name).join(', ') : 'Default'} • Swallow: {item.customization.selectedSwallow}
                            </p>
                            <div className="flex justify-between items-center mt-2.5">
                              <span className="font-mono text-xs text-emerald-500">₦{item.finalPricePerUnit.toLocaleString()} x {item.customization.quantity}</span>
                              <span className="font-mono text-xs font-bold text-white">₦{item.totalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}

                        {/* Calculation Total and Secure checkout link */}
                        <div className="pt-4 border-t border-gray-700/20 space-y-2 mt-4">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{strings.subtotal}</span>
                            <span className="font-mono">₦{cartSubtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{strings.deliveryFee}</span>
                            <span className="font-mono">₦{deliveryFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-baseline pt-2 border-t border-gray-700/25 font-serif text-sm">
                            <span className="font-bold text-white uppercase tracking-wider">{strings.total}</span>
                            <span className="font-bold text-lg text-emerald-600 font-mono">₦{cartTotal.toLocaleString()}</span>
                          </div>

                          <button
                            onClick={() => setActiveView('checkout')}
                            className="w-full mt-4 bg-[#40685D] hover:bg-[#32524a] text-white py-3 rounded-2xl font-bold uppercase transition-transform active:scale-95"
                          >
                            Proceed to Secure Checkout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. SECURE CHECKOUT PORT OVERLAY */}
                {activeView === 'checkout' && (
                  <div className="animate-fade-in py-2">
                    <SecureCheckout
                      totalAmount={cartTotal}
                      locale={strings}
                      darkMode={darkMode}
                      onPaymentSuccess={handleCheckoutSuccess}
                      onCancel={() => setActiveView('cart')}
                      email={currentUser.email}
                    />
                  </div>
                )}

                {/* 4. REAL-TIME ORDER TRACKING SCREEN */}
                {activeView === 'tracking' && (
                  <div className="animate-fade-in p-4 flex flex-col h-full font-sans">
                    <h3 className="font-serif font-bold text-lg text-cta mb-1">{strings.orderTracking}</h3>
                    <p className="text-[10px] text-gray-500 mb-3 block">{strings.estDelivery}</p>

                    {/* Stage status tracker pipeline */}
                    {orders.length === 0 ? (
                      <div className="py-12 text-center text-gray-500 text-xs">
                        No active orders yet. Find soup to track in real-time.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Dynamic Map Simulation component */}
                        <MapSimulation 
                          progress={mapProgress} 
                          status={orders[0].status} 
                          darkMode={darkMode} 
                        />

                        {/* Interactive Vertical Status Tracker Pipeline */}
                        <div className="space-y-4 p-4 rounded-3xl bg-black/30 border border-gray-800">
                          {([
                            { code: 'placed', icon: ShoppingBag },
                            { code: 'preparing', icon: Sparkles },
                            { code: 'transit', icon: Compass },
                            { code: 'delivered', icon: CheckCircle2 }
                          ] as const).map((stage, i) => {
                            const steps = ['placed', 'preparing', 'transit', 'delivered'] as OrderStatus[];
                            const activeIdx = steps.indexOf(orders[0].status);
                            const thisIdx = steps.indexOf(stage.code);
                            
                            const isDone = thisIdx < activeIdx;
                            const isActive = thisIdx === activeIdx;

                            const Icon = stage.icon;

                            return (
                              <div key={stage.code} className="flex space-x-3.5 relative">
                                {/* Connecting timeline indicator line */}
                                {i < 3 && (
                                  <span className={`absolute left-4 top-8 w-0.5 h-10 ${
                                    isDone ? 'bg-[#40685D]' : 'bg-gray-800'
                                  }`}></span>
                                )}

                                <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center transition-all ${
                                  isDone ? 'bg-[#40685D] text-white' : isActive ? 'bg-[#D6E6DB] text-[#40685D] ring-4 ring-[#40685D]/10' : 'bg-gray-880 text-gray-600'
                                }`}>
                                  <Icon className="w-4.5 h-4.5" />
                                </div>

                                <div className="flex-1">
                                  <div className="flex justify-between items-baseline">
                                    <h4 className={`text-xs font-bold ${isActive ? 'text-[#40685D]' : 'text-white'}`}>
                                      {strings.orderStatus[stage.code]}
                                    </h4>
                                    {isActive && (
                                      <span className="text-[8px] bg-cta/10 text-cta font-mono uppercase font-bold px-1.5 py-0.5 rounded">
                                        LIVE
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                                    {strings.orderStatusDesc[stage.code]}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Customer call assistance */}
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => triggerPushNotify({
                              id: 'call-biker',
                              title: 'Connecting Call 📞',
                              message: 'Simulating secure phone link to Rider Ochuko. Connection established.',
                              timestamp: 'Just now',
                              read: false,
                              type: 'promo'
                            })}
                            className="bg-gray-850 border border-gray-750/50 hover:bg-gray-800 text-white rounded-xl py-2 px-4 text-xs font-bold flex-1 flex justify-center items-center space-x-1.5"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-[#40685D]" />
                            <span>Call Dispatch Rider</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. LOYALTY REWARDS WORKSPACE VIEW */}
                {activeView === 'rewards' && (
                  <div className="animate-fade-in p-4 flex flex-col h-full font-sans">
                    <LoyaltyRewards
                      user={currentUser}
                      onRedeemPoints={handleRedeemPoints}
                      locale={strings}
                      darkMode={darkMode}
                    />
                  </div>
                )}

                {/* 6. DEDICATED GOURMET CUSTOMER REVIEWS VIEW */}
                {activeView === 'reviews' && (
                  <div className="animate-fade-in flex flex-col h-full">
                    <GourmetReviews
                      darkMode={darkMode}
                      onBack={handleMobileBack}
                      menuItems={menuItemsState}
                      activeReviewFilter={activeReviewFilter}
                      setActiveReviewFilter={setActiveReviewFilter}
                      onAddReview={handleAddReview}
                    />
                  </div>
                )}

                {/* 7. SECURE DIALOGS / FOOTER PAGES MODALS INSIDE PHONE SIMULATOR */}
                {activeFooterTab && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 animate-fade-in">
                    <div 
                      className={`w-full max-h-[80%] rounded-t-[32px] p-6 pb-8 transition-all duration-300 transform translate-y-0 flex flex-col shadow-2xl relative ${
                        darkMode ? 'bg-[#151716] text-white border-t border-zinc-800' : 'bg-white text-black border-t border-neutral-200'
                      }`}
                    >
                      {/* Drag pill indicator */}
                      <div className="mx-auto w-12 h-1 bg-gray-305 dark:bg-zinc-700/80 rounded-full mb-5 shrink-0" />

                      {/* Header */}
                      <div className="flex justify-between items-center mb-4 shrink-0">
                        <div className="flex items-center space-x-2">
                          {activeFooterTab === 'shipping' && (
                            <Clock className="w-5 h-5 text-[#40685D] dark:text-emerald-400" />
                          )}
                          {activeFooterTab === 'contact' && (
                            <PhoneCall className="w-5 h-5 text-[#40685D] dark:text-emerald-400" />
                          )}
                          {activeFooterTab === 'privacy' && (
                            <Award className="w-5 h-5 text-[#40685D] dark:text-emerald-400" />
                          )}
                          <h3 className="font-serif font-bold text-lg text-[#40685D] dark:text-emerald-300">
                            {activeFooterTab === 'shipping' && 'Delivery Info'}
                            {activeFooterTab === 'contact' && 'Contact Support'}
                            {activeFooterTab === 'privacy' && 'Guarantees & Privacy'}
                          </h3>
                        </div>
                        <button 
                          onClick={() => setActiveFooterTab(null)}
                          className={`text-xs font-bold font-sans py-1 px-3.5 rounded-full transition-colors ${
                            darkMode ? 'bg-zinc-805 bg-gray-800 text-zinc-350 hover:bg-zinc-700' : 'bg-gray-105 bg-neutral-100 text-gray-700 hover:bg-neutral-200'
                          }`}
                        >
                          CLOSE
                        </button>
                      </div>

                      {/* Body Content with Nice Typography */}
                      <div className="flex-1 overflow-y-auto pr-1 text-xs space-y-4 leading-relaxed font-sans scrollbar-thin">
                        {activeFooterTab === 'shipping' && (
                          <div className="space-y-3.5">
                            <div className="p-3.5 rounded-2.5xl bg-[#D6E6DB]/20 border border-[#D6E6DB]/50">
                              <p className="font-bold text-emerald-800 dark:text-emerald-305 text-emerald-350 mb-1 flex items-center gap-1.5">
                                <span>⚡ Swift Delivery: 15 - 45 Mins</span>
                              </p>
                              <p className={darkMode ? 'text-zinc-300' : 'text-neutral-700'}>
                                To ensure your meal tastes as authentic and fresh as standard local dining, our chefs prepare everything hot to match order timing. Delivery takes <strong className="text-[#40685D] dark:text-emerald-300">15 to 45 minutes max</strong> from order confirmation.
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-extrabold mb-1 uppercase tracking-wider text-[10px] text-zinc-400">Where We Deliver:</h4>
                              <p className={darkMode ? 'text-zinc-300' : 'text-neutral-600'}>
                                We natively deliver to all prime areas across Warri, Effurun, & Jeddo, including Bishop Ideh Road, Airport Road, GRA, Enerhen, Refinery Road, Swamp sectors, and core town coordinates.
                              </p>
                            </div>

                            <div>
                              <h4 className="font-extrabold mb-1 uppercase tracking-wider text-[10px] text-zinc-400">Heat Retention Packing:</h4>
                              <p className={darkMode ? 'text-zinc-300' : 'text-neutral-600'}>
                                Every single traditional pot is enclosed inside custom insulated thermic chambers to preserve ideal serving temperatures (70°C+) completely in transit.
                              </p>
                            </div>
                          </div>
                        )}

                        {activeFooterTab === 'contact' && (
                          <div className="space-y-4">
                            <p className={darkMode ? 'text-zinc-300' : 'text-neutral-700'}>
                              We would love to hear from you or assist with any inquiries! Please use our primary active channels below:
                            </p>

                            <div className="space-y-3">
                              <div className="p-3.5 rounded-2.5xl bg-emerald-500/5 border border-emerald-500/20">
                                <h5 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                                  <span>💬 Instant WhatsApp Line</span>
                                </h5>
                                <p className={`mb-3 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                                  For prompt order modifications, delivery updates, or complaints, chat with us live.
                                </p>
                                <a 
                                  href="https://wa.me/2348104063360?text=Hello%20Nabetafood%2C%20I%20have%20an%252520inquiry!"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 p-2 px-4 rounded-xl text-[10px] uppercase tracking-widest"
                                >
                                  <span>Start Chat</span>
                                </a>
                              </div>

                              <div className={`p-3.5 rounded-2.5xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-50 border-gray-150'}`}>
                                <h5 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>📍 Central Kitchen Base</h5>
                                <p className={darkMode ? 'text-zinc-400' : 'text-neutral-600'}>
                                  Bishop Ideh Road, Jeddo, opposite Oil Road, Warri, Delta State, Nigeria.
                                </p>
                              </div>

                              <div className={`p-3.5 rounded-2.5xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-50 border-gray-150'}`}>
                                <h5 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>⏰ Operating Hours</h5>
                                <p className={darkMode ? 'text-zinc-400' : 'text-neutral-600'}>
                                  Mondays - Sundays: 8:00 AM - 10:00 PM (Orders placed after 9:45 PM are scheduled for next-day breakfast dispatch).
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeFooterTab === 'privacy' && (
                          <div className="space-y-3.5">
                            <p className={darkMode ? 'text-zinc-300' : 'text-neutral-600'}>
                              NABETAFOOD remains committed to safeguarding your order records and system preferences:
                            </p>

                            <ol className="list-decimal list-inside space-y-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                              <li>
                                <strong className="text-zinc-700 dark:text-zinc-300 font-sans">Point Integrity:</strong> Your loyalty point database ledger is stored securely inside certified cloud-based database clusters and cannot be customized arbitrarily.
                              </li>
                              <li>
                                <strong className="text-zinc-700 dark:text-zinc-300 font-sans">Payment Security:</strong> Card payments are completely handled via Paystack PCI-DSS certified gateway. No card credentials, PINs, or raw bank details ever hit our servers.
                              </li>
                              <li>
                                <strong className="text-zinc-700 dark:text-zinc-300 font-sans">Your Profile Data:</strong> Personal details such as delivery coordinates and phone lines are kept private and accessible solely for dispatching food orders.
                              </li>
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </PhoneShell>
        </section>

        {/* RIGHT COLUMN: Developers Sandbox Control Monitor (Spans 5 cols) */}
        {showDevConsole && (
          <section className="lg:col-span-5 flex flex-col gap-6 sticky top-24 w-full">
            
            {/* Firestore Console Panel */}
            <FirebaseConsole
              orders={orders}
              currentUser={currentUser}
              notifications={notifications}
              onAdvanceOrderStatus={handleAdvanceOrderStatus}
              onSendSystemPromo={handleSendSystemPromo}
              onResetDatabase={handleResetDatabase}
            />

            {/* Sandbox informational instructions widget */}
            <div className="rounded-2xl p-5 bg-[#171a18] border border-gray-800 shadow-xl font-sans text-xs">
              <h3 className="font-serif font-bold text-sm text-[#D6E6DB] tracking-wide mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-cta" />
                <span>Developer Workspace Notes</span>
              </h3>
              
              <p className="text-gray-400 text-[11px] leading-relaxed mb-3">
                This sandbox completely models the architecture of a real-time React Native app synchronized over 100% compliant Firestore queries:
              </p>

              <ul className="space-y-2 text-gray-500 text-[10px]">
                <li className="flex items-start space-x-1.5">
                  <span className="text-[#40685D]">•</span>
                  <span><strong>Menu customization state:</strong> Change proteins and swallow options on the phone to instantly recalculate prices.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="text-[#40685D]">•</span>
                  <span><strong>Secure Gateway simulator:</strong> Typing credit credentials mimics real Paystack multi-factor card validations recursively.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="text-[#40685D]">•</span>
                  <span><strong>Real-time Order Tracking:</strong> Click "Advance Status" inside the right console to trigger visual map updates & in-app alerts on the phone screen.</span>
                </li>
              </ul>
            </div>

          </section>
        )}

      </main>

    </div>
  );
}
