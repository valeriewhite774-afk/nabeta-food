/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Flame, RefreshCw, Send, CheckCircle2, UserCheck, Smartphone } from 'lucide-react';
import { SimulatedOrder, FirebaseUserState, AppNotification } from '../types';

interface FirebaseConsoleProps {
  orders: SimulatedOrder[];
  currentUser: FirebaseUserState;
  notifications: AppNotification[];
  onAdvanceOrderStatus: (orderId: string) => void;
  onSendSystemPromo: () => void;
  onResetDatabase: () => void;
}

export const FirebaseConsole: React.FC<FirebaseConsoleProps> = ({
  orders,
  currentUser,
  notifications,
  onAdvanceOrderStatus,
  onSendSystemPromo,
  onResetDatabase,
}) => {
  const [activeTab, setActiveTab] = useState<'firestore' | 'auth' | 'rules'>('firestore');

  // Interactive JSON highlight helper
  const renderJSON = (data: any) => {
    return (
      <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-3 bg-neutral-950 rounded-lg max-h-[360px] no-scrollbar leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <div id="firebase-dev-console" className="bg-[#0f1110] border border-gray-800 rounded-3xl p-5 shadow-2xl flex flex-col h-full font-sans text-gray-200">
      
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-[#f5820d]/10 p-2 rounded-xl text-[#f5820d]">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white flex items-center space-x-2">
              <span>Firebase Control Console</span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/30">
                ACTIVE PIPELINE
              </span>
            </h2>
            <p className="text-[11px] text-gray-400 font-mono">Project: superb-radius-hkm1r</p>
          </div>
        </div>

        {/* Refresh / Reset State DB */}
        <button
          id="firebase-reset-db-btn"
          onClick={onResetDatabase}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 active:bg-gray-950 text-white rounded-lg transition-all border border-gray-700/50"
          title="Reset the simulated Firebase state to defaults."
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset DB</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4 bg-black/40 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('firestore')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'firestore'
              ? 'bg-[#f5820d] text-white font-bold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Firestore Database
        </button>
        <button
          onClick={() => setActiveTab('auth')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'auth'
              ? 'bg-[#f5820d] text-white font-bold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Authentication
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'rules'
              ? 'bg-[#f5820d] text-white font-bold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Security Rules
        </button>
      </div>

      {/* Interactive Controls Panel */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-4">
        <h3 className="text-xs font-bold text-gray-300 tracking-wider uppercase mb-3 flex items-center space-x-1.5 font-mono">
          <span>Real-time Event Triggers (Firebase Functions)</span>
        </h3>

        {/* Step-by-Step Order Status Pipeline controllers */}
        {orders.length === 0 ? (
          <div className="text-xs text-gray-500 py-3 text-center border border-dashed border-gray-800 rounded-xl">
            No active orders to simulate yet. Place a food order in the smartphone!
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div 
                key={o.id} 
                className="flex items-center justify-between p-3 bg-black/50 border border-gray-800 rounded-xl text-xs"
              >
                <div>
                  <span className="font-mono text-[10px] text-gray-400">Order Ref: {o.id.toUpperCase()}</span>
                  <div className="font-sans font-bold text-white mt-0.5">
                    Stage: <span className="text-sage text-uppercase">{o.status}</span>
                  </div>
                </div>

                {o.status !== 'delivered' ? (
                  <button
                    onClick={() => onAdvanceOrderStatus(o.id)}
                    className="flex items-center space-x-1 bg-[#f5820d] font-bold text-white px-3 py-1.5 rounded-lg text-xs hover:scale-105 active:scale-95 transition-all shadow-md"
                  >
                    <span>Advance Status</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-1 text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivered</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex space-x-2">
          <button
            onClick={onSendSystemPromo}
            className="flex-1 flex items-center justify-center space-x-1 p-2 bg-gray-850 hover:bg-gray-800 active:bg-neutral-950 border border-gray-700/50 text-white rounded-xl text-xs transition-transform hover:scale-[1.02] font-semibold"
          >
            <Send className="w-3.5 h-3.5 text-cta" />
            <span>Push Simulated Firebase Promo Promo</span>
          </button>
        </div>
      </div>

      {/* Main Tab Screen Content */}
      <div className="flex-1 flex flex-col justify-between">
        {activeTab === 'firestore' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-gray-400">
                <span>Collections /orders</span>
                <span className="text-[10px] bg-[#f5820d]/10 text-[#f5820d] font-bold px-1.5 py-0.5 rounded">
                  {orders.length} docs
                </span>
              </div>
              {renderJSON(orders)}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-gray-400">
                <span>Collections /notifications</span>
                <span className="text-[10px] bg-sky-500/10 text-sky-400 font-bold px-1.5 py-0.5 rounded">
                  {notifications.length} docs
                </span>
              </div>
              {renderJSON(notifications.slice(0, 2))}
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-4">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#f5820d]/10 flex items-center justify-center text-[#f5820d]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold font-sans text-white">{currentUser.displayName}</div>
                  <div className="text-[10px] font-mono text-gray-400">{currentUser.email}</div>
                </div>
              </div>
              <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-mono">
                Authenticated
              </span>
            </div>

            <div>
              <div className="text-xs font-mono text-gray-400 mb-1">Authenticated Firestore user record schema:</div>
              {renderJSON(currentUser)}
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
              <Database className="w-3.5 h-3.5" />
              <span>firestore.rules configuration</span>
            </div>
            <pre className="text-xs font-mono text-blue-300 overflow-x-auto p-4 bg-neutral-950 rounded-xl leading-relaxed border border-gray-800">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default safety catch-all deny
    match /{document=**} {
      allow read, write: if false;
    }
    // Public/unauthenticated access enabled for simulation & development testing
    match /users/{userId} {
      allow read, write: if true;
    }
    match /orders/{orderId} {
      allow read, write: if true;
    }
    match /notifications/{notifyId} {
      allow read, write: if true;
    }
    match /reviews/{reviewId} {
      allow read, write: if true;
    }
  }
}`}
            </pre>
          </div>
        )}

        {/* Database statistics badge */}
        <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500 font-mono">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span>Real-time Sync Active</span>
          </span>
          <span>WebSockets & Firestore Streams Connected</span>
        </div>
      </div>
    </div>
  );
};
