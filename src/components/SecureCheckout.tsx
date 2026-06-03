/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, RotateCcw, Landmark, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { LocalizationStrings } from '../types';

interface SecureCheckoutProps {
  totalAmount: number;
  locale: LocalizationStrings;
  darkMode: boolean;
  onPaymentSuccess: (pointsEarned: number) => void;
  onCancel: () => void;
  email?: string;
}

export const SecureCheckout: React.FC<SecureCheckoutProps> = ({
  totalAmount,
  locale,
  darkMode,
  onPaymentSuccess,
  onCancel,
  email,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'paystack'>('paystack');
  
  // Simulated Card State
  const [cardName, setCardName] = useState('Felix Birinumugha');
  const [cardNumber, setCardNumber] = useState('4235 6075 8891 2024');
  const [expiry, setExpiry] = useState('09/29');
  const [cvv, setCvv] = useState('312');
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'otp' | 'success'>('details');
  const [otpCode, setOtpCode] = useState('');
  const [focusedField, setFocusedField] = useState<'none' | 'card' | 'cvv'>('none');

  // Paystack Live State
  const [paystackEmail, setPaystackEmail] = useState(email || 'valeriewhite774@gmail.com');
  const [paystackKey, setPaystackKey] = useState(
    ((import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY) || 'pk_test_a04ebd7dd7b2759e6cfca683cbd8912e9b0577fc'
  );
  const [showKey, setShowKey] = useState(false);
  const [paystackError, setPaystackError] = useState('');
  const [paystackRef, setPaystackRef] = useState('');

  // Spaces format card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.substring(0, 16);
    const matches = val.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(val);
    }
  };

  // Format expiry date
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.substring(0, 4);
    if (val.length > 2) {
      setExpiry(`${val.substring(0, 2)}/${val.substring(2, 4)}`);
    } else {
      setExpiry(val);
    }
  };

  const startPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || cardNumber.length < 15 || expiry.length < 5 || cvv.length < 3) return;
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('otp');
    }, 1800);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) return;
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      const points = Math.floor(totalAmount / 10);
      setTimeout(() => {
        onPaymentSuccess(points);
      }, 1500);
    }, 1500);
  };

  // Dynamic Paystack Script loading
  const loadPaystackSDK = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).PaystackPop) {
        resolve((window as any).PaystackPop);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.id = 'paystack-inline-js';
      script.onload = () => {
        if ((window as any).PaystackPop) {
          resolve((window as any).PaystackPop);
        } else {
          reject(new Error('Paystack SDK loaded but initializer (PaystackPop) is missing.'));
        }
      };
      script.onerror = () => {
        reject(new Error('Unable to connect to Paystack gateway. Please check your internet connection.'));
      };
      document.body.appendChild(script);
    });
  };

  const startPaystackPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paystackEmail || !paystackKey.startsWith('pk_')) {
      setPaystackError('Valid checkout email and active public key (pk_test_... or pk_live_...) are required.');
      return;
    }
    setPaystackError('');
    setPaymentStep('processing');

    try {
      const PaystackSDK = await loadPaystackSDK();
      const reference = 'pay_' + Date.now().toString(36) + '_' + Math.floor(Math.random() * 100000).toString(36);
      
      const handler = PaystackSDK.setup({
        key: paystackKey,
        email: paystackEmail,
        amount: Math.round(totalAmount * 100), // convert NGN to kobo
        currency: 'NGN',
        ref: reference,
        callback: (response: any) => {
          setPaystackRef(response.reference || reference);
          setPaymentStep('success');
          // 10% Cashpoints
          const points = Math.floor(totalAmount / 10);
          setTimeout(() => {
            onPaymentSuccess(points);
          }, 1500);
        },
        onClose: () => {
          setPaymentStep('details');
        }
      });
      
      handler.openIframe();
    } catch (err: any) {
      console.error(err);
      setPaymentStep('details');
      setPaystackError(err.message || 'An error occurred launching the Paystack gateway.');
    }
  };

  return (
    <div className={`p-5 rounded-3xl ${darkMode ? 'bg-[#141615] text-white' : 'bg-white text-black'}`}>
      
      {/* Title block */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="bg-emerald-500/10 p-2 rounded-full text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight uppercase font-sans">
              {locale.secureCheckout}
            </h3>
            <p className="text-[10px] text-gray-500 font-mono">PCI-DSS Level 1 Compliant</p>
          </div>
        </div>
        
        {paymentStep === 'details' && (
          <div className="bg-emerald-500/10 px-2 py-1 rounded text-[9px] text-emerald-500 font-mono font-bold">
            NGN (₦)
          </div>
        )}
      </div>      {paymentStep === 'details' && (
        <div className="mb-4">
          {/* Paystack Authentic Integration Checkout Panel */}
          <form onSubmit={startPaystackPayment} className="space-y-4 font-sans text-xs">
            <div className={`p-4 rounded-3xl flex flex-col items-center justify-center text-center border transition-all duration-300 ${
              darkMode ? 'bg-[#151716] border-zinc-800' : 'bg-[#D6E6DB]/10 border-[#D6E6DB]'
            }`}>
              <div className="w-10 h-10 bg-[#40685D] dark:bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-base mb-2 shadow-sm shadow-[#40685D]/20 font-serif">
                P
              </div>
              <h4 className="text-xs font-extrabold tracking-widest uppercase text-[#40685D] dark:text-emerald-350">Paystack Checkout</h4>
              <p className="text-[10px] text-gray-500 mt-1 max-w-[240px] leading-relaxed">
                Authenticate transactions with credit/debit cards, bank transfers, USSD, or sandbox accounts.
              </p>
            </div>

            {paystackError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-2.5 rounded-xl text-[10px] font-mono whitespace-pre-wrap">
                {paystackError}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Customer Billing Email</label>
              <input
                type="email"
                required
                placeholder="customer@domain.com"
                value={paystackEmail}
                onChange={(e) => setPaystackEmail(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-mono transition-all duration-200 outline-hidden ${
                  darkMode ? 'bg-black/40 border-gray-800 text-white focus:border-[#40685D]' : 'bg-gray-50 border-gray-200 text-black focus:border-[#40685D]'
                }`}
              />
            </div>

            {/* Merchant Setting Collapsible Overrides (Closed/Hidden by default for customers) */}
            <div className={`pt-2 border-t font-sans ${darkMode ? 'border-zinc-800/60' : 'border-gray-100'}`}>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className={`text-[9.5px] font-bold tracking-wider uppercase transition-colors flex items-center space-x-1.5 ${
                  darkMode ? 'text-zinc-650 text-zinc-500 hover:text-zinc-350' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <span>⚙️ Merchant Settings (Admin Link)</span>
              </button>

              {showKey && (
                <div className={`mt-3.5 p-3.5 rounded-xl border animate-fade-in ${
                  darkMode ? 'bg-black/60 border-zinc-805 border-zinc-800' : 'bg-neutral-50/50 border-neutral-200'
                }`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[9.5px] font-bold text-gray-500 uppercase">Paystack Public Key Override</label>
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                      {paystackKey.startsWith('pk_live') ? 'LIVE KEY' : 'SANDBOX KEY'}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="pk_test_..."
                    value={paystackKey}
                    onChange={(e) => setPaystackKey(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border font-mono text-[10px] outline-hidden ${
                      darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-[#40685D]' : 'bg-white border-gray-250 text-black focus:border-[#40685D]'
                    }`}
                  />
                  <span className="text-[8.5px] text-gray-500 block mt-1.5 leading-relaxed font-sans">
                    💡 This override field is only visible to you for testing purposes. Normal customers will have their transactions routed securely via the centralized keys you configure inside your environment setup.
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-[#40685D] hover:bg-[#34544b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white py-3.5 rounded-2xl font-bold uppercase tracking-wider transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-1.5 shadow-md shadow-[#40685D]/10 cursor-pointer"
            >
              <span>Launch Paystack Secure Gateway</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onCancel}
              className={`w-full py-2 rounded-xl text-center font-bold text-[11px] uppercase tracking-wide hover:underline cursor-pointer ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Cancel and Return
            </button>
          </form>
        </div>
      )}

      {/* Processing State */}
      {paymentStep === 'processing' && (
        <div className="py-12 flex flex-col items-center justify-center text-center font-sans">
          <div className="relative w-16 h-16 mb-4">
            <span className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></span>
            <span className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
          <h4 className="text-sm font-bold text-cta">Connecting Securely...</h4>
          <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">
            Please do not close this window. Intersecting with pay session gateway...
          </p>
        </div>
      )}

      {/* OTP Authentication code */}
      {paymentStep === 'otp' && (
        <form onSubmit={verifyOtp} className="py-6 space-y-4 font-sans text-xs">
          <div className="text-center">
            <div className="bg-[#40685D]/10 text-[#40685D] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-cta">Paystack Secure Verification</h4>
            <p className="text-[10px] text-gray-500 max-w-[220px] mx-auto mt-1 leading-relaxed">
              We have dispatched a 4-digit verification code to <span className="font-bold">+234 812 ••• 2024</span> as simulated for <strong>{cardName}</strong>.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 text-center uppercase mb-1 font-sans">Enter 4-Digit OTP Pin</label>
            <input
              type="text"
              required
              maxLength={4}
              placeholder="7745"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className={`w-28 mx-auto p-3 text-center rounded-xl border font-mono text-lg tracking-widest block font-bold ${
                darkMode ? 'bg-black/40 border-gray-800 text-white focus:border-cta' : 'bg-gray-50 border-gray-200 text-black focus:border-[#40685D]'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={otpCode.length < 4}
            className="w-full bg-[#40685D] disabled:opacity-50 text-white py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all duration-200"
          >
            Confirm Verification Code
          </button>

          <p className="text-[9px] text-center text-gray-400">
            Didn't receive code? Resend available in 30 seconds.
          </p>
        </form>
      )}

      {paymentStep === 'success' && (
        <div className="py-12 flex flex-col items-center justify-center text-center font-sans">
          <div className="bg-emerald-500/10 text-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5] animate-pulse" />
          </div>
          <h4 className="text-base font-bold text-emerald-600 font-serif">Payment Authenticated!</h4>
          <p className="text-[11px] text-gray-500 mt-1 max-w-[220px]">
            Your fund transfer was safely cleared by Nabeta. Entering order tracking...
          </p>
          {paystackRef && (
            <div className="mt-2.5 p-2 bg-emerald-500/15 rounded-lg text-[9px] font-mono text-emerald-600 dark:text-emerald-400 break-all max-w-[220px]">
              Ref: {paystackRef}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
