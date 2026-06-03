/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { Navigation, MapPin, Compass, ShieldCheck } from 'lucide-react';

interface MapSimulationProps {
  progress: number; // 0 to 1
  status: 'placed' | 'preparing' | 'transit' | 'delivered';
  darkMode: boolean;
}

export const MapSimulation: React.FC<MapSimulationProps> = ({ progress, status, darkMode }) => {
  // Let's create an elegant SVG path representing the route from Nabeta Kitchen (Jeddo, Warri) to Destination.
  // We'll calculate the coordinates of the rider along the path.
  const pathStart = { x: 40, y: 150 };  // Nabeta Kitchen (Jeddo Base)
  const pathControl = { x: 150, y: 30 }; // Effurun Roundabout
  const pathEnd = { x: 260, y: 160 };   // Customer Home (Bishop Ideh Rd)

  // Quadratic Bezier interpolation to animate the biker precisely
  const getBezierPoint = (t: number) => {
    const x = (1 - t) * (1 - t) * pathStart.x + 2 * (1 - t) * t * pathControl.x + t * t * pathEnd.x;
    const y = (1 - t) * (1 - t) * pathStart.y + 2 * (1 - t) * t * pathControl.y + t * t * pathEnd.y;
    return { x, y };
  };

  const riderPos = getBezierPoint(status === 'transit' ? progress : status === 'delivered' ? 1 : 0);

  return (
    <div className={`rounded-2xl p-4 border transition-colors ${
      darkMode ? 'bg-[#181a19] border-gray-800' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-cta animate-spin-slow" />
          <span className="text-xs font-bold tracking-wider font-sans uppercase">
            Warri Delivery Network
          </span>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-mono font-bold">
          GPS Live
        </span>
      </div>

      {/* SVG Canvas Map */}
      <div className={`relative h-44 w-full rounded-xl overflow-hidden border ${
        darkMode ? 'bg-[#0f1110] border-gray-800' : 'bg-[#eef2f0] border-gray-300'
      }`}>
        
        {/* Subtle grid lines matching aesthetic blueprint */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-20">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className={`border-[0.5px] ${darkMode ? 'border-gray-800' : 'border-gray-400'}`}></div>
          ))}
        </div>

        {/* Warri Landmark Labels */}
        <div className={`absolute top-2 left-4 text-[9px] font-sans opacity-60 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Effurun Roundabout
        </div>
        <div className={`absolute bottom-2 left-6 text-[9px] font-sans opacity-60 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Delta Mall (Shoprite)
        </div>
        <div className={`absolute bottom-4 right-4 text-[9px] font-sans opacity-60 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Airport Road
        </div>

        <svg className="w-full h-full absolute inset-0 text-xs">
          {/* Main Delivery Path Curved Line */}
          <path
            d={`M ${pathStart.x} ${pathStart.y} Q ${pathControl.x} ${pathControl.y} ${pathEnd.x} ${pathEnd.y}`}
            fill="none"
            stroke={darkMode ? '#2d3330' : '#c9d3cd'}
            strokeWidth="3.5"
            strokeDasharray="5,4"
          />

          {/* Active Completed Path Highlight */}
          {status !== 'placed' && status !== 'preparing' && (
            <path
              d={`M ${pathStart.x} ${pathStart.y} Q ${pathControl.x} ${pathControl.y} ${pathEnd.x} ${pathEnd.y}`}
              fill="none"
              stroke="#40685D"
              strokeWidth="4"
              strokeDasharray="5,4"
              strokeDashoffset={status === 'transit' ? (1 - progress) * 300 : 0}
              className="transition-all duration-300"
            />
          )}

          {/* Nabeta Hub / Restaurant Landmark */}
          <g transform={`translate(${pathStart.x}, ${pathStart.y})`}>
            <circle r="12" fill="#40685D" className="animate-pulse" />
            <circle r="8" fill="#D6E6DB" />
            <title>Nabeta Kitchen</title>
          </g>

          {/* Customer Destination Landmark */}
          <g transform={`translate(${pathEnd.x}, ${pathEnd.y})`}>
            <circle r="12" fill="#ea4335" fillOpacity="0.15" />
            <path d="M-6-6 L6 6 M6-6 L-6 6" stroke="#ea4335" strokeWidth="2" />
            <title>Your Home</title>
          </g>

          {/* Rider Bike - Only show in transit or delivered */}
          {(status === 'transit' || status === 'delivered') && (
            <g transform={`translate(${riderPos.x}, ${riderPos.y})`} className="transition-transform duration-300">
              <circle r="14" fill="#fafafa" stroke="#40685D" strokeWidth="2" className="shadow-lg" />
              <g transform="scale(0.8) translate(-10, -10)">
                {/* Embedded simple bike icon path */}
                <path
                  d="M19 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm9-3h-1.5l-2.5-3h-2.5l-1 2H5v-2h2.5l1.5-3h4.5l2.5 3H19v2h-3z"
                  fill="#40685D"
                />
              </g>
            </g>
          )}
        </svg>

        {/* Floating Labels */}
        <div 
          className="absolute text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#40685D] text-white shadow"
          style={{ left: `${pathStart.x - 24}px`, top: `${pathStart.y - 24}px` }}
        >
          Nabeta Kitchen
        </div>

        <div 
          className="absolute text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#e85a4f] text-white shadow"
          style={{ left: `${pathEnd.x - 24}px`, top: `${pathEnd.y - 24}px` }}
        >
          Your Plate
        </div>

        {/* Rider banner over map */}
        {(status === 'transit' || status === 'delivered') && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-gray-700/50 py-1 px-2.5 rounded-lg flex items-center space-x-2 text-white animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[9px] font-sans tracking-wide">
              {status === 'transit' ? `Rider Ochuko: ${(progress * 100).toFixed(0)}% arrived` : 'Delivered!'}
            </span>
          </div>
        )}
      </div>

      {/* Address Details metadata for Georgia look */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-serif">
        <div className={`p-2.5 rounded-lg ${darkMode ? 'bg-black/30' : 'bg-white shadow-sm'}`}>
          <div className="text-[10px] tracking-wide text-gray-500 uppercase font-sans">Dispatch Office</div>
          <p className="font-bold truncate mt-0.5" title="Bishop Ideh Road, Jeddo, opposite Oil Road, Warri">Jeddo Kitchen, Warri</p>
        </div>
        <div className={`p-2.5 rounded-lg ${darkMode ? 'bg-black/30' : 'bg-white shadow-sm'}`}>
          <div className="text-[10px] tracking-wide text-gray-500 uppercase font-sans">Delivery Destination</div>
          <p className="font-bold truncate mt-0.5">Bishop Ideh Rd, Jeddo</p>
        </div>
      </div>
    </div>
  );
};
