/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Share2, Copy, Check, Gift, ArrowRight } from 'lucide-react';
import { FirebaseUserState, LocalizationStrings } from '../types';

interface LoyaltyRewardsProps {
  user: FirebaseUserState;
  onRedeemPoints: (points: number, rewardDesc: string) => void;
  locale: LocalizationStrings;
  darkMode: boolean;
}

export const LoyaltyRewards: React.FC<LoyaltyRewardsProps> = ({
  user,
  onRedeemPoints,
  locale,
  darkMode,
}) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://nabetafood.com/join?ref=WARRI_${user.uid.substring(0, 5)}`;

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(referralLink);
    setTimeout(() => setCopied(false), 2000);
  };

  // Milestones to purchase with points
  const milestones = [
    { id: 'free-protein', points: 300, title: 'Free Add-on Protein', desc: 'Add beef, eye egg, or fish for 0 Naira!' },
    { id: 'discount-1000', points: 600, title: '₦1,000 Discount', desc: 'Get 1,000 Naira off your next checkout total.' },
    { id: 'free-banga-bowl', points: 1200, title: 'Gourmet Banga Bowl', desc: 'A fully customized bowl completely free.' },
  ];

  // Dynamic progress percentage for circular gauge / slide bar
  const nextTierPoints = 1500;
  const progressPercent = Math.min(100, (user.loyaltyPoints / nextTierPoints) * 100);

  return (
    <div className={`p-4 rounded-3xl font-sans text-xs ${
      darkMode ? 'bg-[#141615] hover:bg-[#161a18]' : 'bg-white hover:shadow-md'
    } transition-all border ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
      
      {/* Tier Heading Card */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="bg-[#40685D] text-white p-2 rounded-2xl shadow-premium-soft">
            <Award className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-gray-500 block leading-tight font-bold tracking-widest">
              {locale.rewardsTitle}
            </span>
            <span className="font-serif font-bold text-sm text-cta mt-0.5 block">
              {user.rewardTier} VIP Status
            </span>
          </div>
        </div>

        <div className="bg-[#D6E6DB] text-[#40685D] px-3 py-1.5 rounded-full font-mono font-bold text-center">
          <span className="text-sm block leading-none">{user.loyaltyPoints}</span>
          <span className="text-[8px] uppercase tracking-wide">{locale.pts}</span>
        </div>
      </div>

      {/* Progress to next milestone */}
      <div className={`mb-5 p-3 rounded-2xl ${darkMode ? 'bg-black/30' : 'bg-gray-50'}`}>
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <span>{progressPercent.toFixed(0)}% to Platinum Club</span>
          <span>{user.loyaltyPoints} / {nextTierPoints} Pts</span>
        </div>
        <div className="w-full bg-gray-200/55 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#40685D] h-full rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Redeemable Rewards milestones list */}
      <div className="space-y-2.5 mb-5">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
          <Gift className="w-3.5 h-3.5 text-cta" />
          <span>Redeem Available Points</span>
        </h4>

        {milestones.map((m) => {
          const canRedeem = user.loyaltyPoints >= m.points;
          return (
            <div 
              key={m.id}
              className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                darkMode 
                  ? 'bg-neutral-900 border-neutral-800' 
                  : 'bg-white border-gray-150 shadow-sm'
              } ${canRedeem ? 'hover:scale-[1.01]' : 'opacity-65'}`}
            >
              <div>
                <span className="font-bold text-white block truncate max-w-[170px]">{m.title}</span>
                <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">{m.desc}</span>
              </div>

              <button
                disabled={!canRedeem}
                onClick={() => onRedeemPoints(m.points, m.title)}
                className={`px-3 py-1.5 rounded-full font-bold text-[10px] tracking-wider uppercase transition-transform active:scale-95 flex items-center space-x-1 ${
                  canRedeem 
                    ? 'bg-[#40685D] text-white hover:bg-[#32524a]' 
                    : 'bg-gray-250 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>{m.points} Pts</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Referral Program Area */}
      <div className={`p-3 rounded-2xl border ${
        darkMode ? 'bg-black/20 border-gray-800' : 'bg-[#eef2f0] border-gray-200'
      }`}>
        <h4 className="font-serif font-bold text-cta text-xs mb-1">
          {locale.referralTitle}
        </h4>
        <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
          {locale.referralDesc}
        </p>

        <div className="flex space-x-1 bg-black/30 p-1 rounded-xl">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-transparent border-none text-[10px] font-mono p-1 trunc font-medium text-gray-400 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="bg-[#40685D] hover:bg-[#33534a] text-white p-2 rounded-lg transition-transform active:scale-95"
            title="Copy Referral Link"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
