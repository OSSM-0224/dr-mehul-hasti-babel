/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield } from 'lucide-react';

interface Dental3DReferenceProps {
  selectedTeeth: string[];
  onToggleTooth: (id: string) => void;
}

interface ToothAnatomicalData {
  id: string;
  num: number;
  displayName: string;
  type: 'molar' | 'premolar' | 'canine' | 'incisor';
  x: number;
  y: number;
  rotation: number;
}

export default function Dental3DReference({ selectedTeeth, onToggleTooth }: Dental3DReferenceProps) {
  // Center is calibrated around 240, 240 in a 480x480 coordinate layout
  // We shifted the upper teeth up by 45px and the lower teeth down by 45px
  // to create a massive, distinct visual gap between upper and lower arches (130px corner-to-corner gap).
  
  const UPPER_RIGHT: ToothAnatomicalData[] = [
    { id: '#1', num: 1, displayName: '1', type: 'molar', x: 82, y: 160, rotation: -90 },
    { id: '#2', num: 2, displayName: '2', type: 'molar', x: 86, y: 125, rotation: -80 },
    { id: '#3', num: 3, displayName: '3', type: 'molar', x: 96, y: 92, rotation: -70 },
    { id: '#4', num: 4, displayName: '4', type: 'premolar', x: 111, y: 62, rotation: -60 },
    { id: '#5', num: 5, displayName: '5', type: 'premolar', x: 131, y: 37, rotation: -50 },
    { id: '#6', num: 6, displayName: '6', type: 'canine', x: 156, y: 17, rotation: -35 },
    { id: '#7', num: 7, displayName: '7', type: 'incisor', x: 186, y: 4, rotation: -20 },
    { id: '#8', num: 8, displayName: '8', type: 'incisor', x: 218, y: -2, rotation: -5 },
  ];

  const UPPER_LEFT: ToothAnatomicalData[] = [
    { id: '#9', num: 9, displayName: '9', type: 'incisor', x: 262, y: -2, rotation: 5 },
    { id: '#10', num: 10, displayName: '10', type: 'incisor', x: 294, y: 4, rotation: 20 },
    { id: '#11', num: 11, displayName: '11', type: 'canine', x: 324, y: 17, rotation: 35 },
    { id: '#12', num: 12, displayName: '12', type: 'premolar', x: 349, y: 37, rotation: 50 },
    { id: '#13', num: 13, displayName: '13', type: 'premolar', x: 369, y: 62, rotation: 60 },
    { id: '#14', num: 14, displayName: '14', type: 'molar', x: 384, y: 92, rotation: 70 },
    { id: '#15', num: 15, displayName: '15', type: 'molar', x: 394, y: 125, rotation: 80 },
    { id: '#16', num: 16, displayName: '16', type: 'molar', x: 398, y: 160, rotation: 90 },
  ];

  const LOWER_LEFT: ToothAnatomicalData[] = [
    { id: '#17', num: 17, displayName: '17', type: 'molar', x: 398, y: 320, rotation: 90 },
    { id: '#18', num: 18, displayName: '18', type: 'molar', x: 394, y: 355, rotation: 100 },
    { id: '#19', num: 19, displayName: '19', type: 'molar', x: 384, y: 388, rotation: 110 },
    { id: '#20', num: 20, displayName: '20', type: 'premolar', x: 369, y: 418, rotation: 120 },
    { id: '#21', num: 21, displayName: '21', type: 'premolar', x: 349, y: 443, rotation: 130 },
    { id: '#22', num: 22, displayName: '22', type: 'canine', x: 324, y: 463, rotation: 145 },
    { id: '#23', num: 23, displayName: '23', type: 'incisor', x: 294, y: 476, rotation: 160 },
    { id: '#24', num: 24, displayName: '24', type: 'incisor', x: 262, y: 482, rotation: 175 },
  ];

  const LOWER_RIGHT: ToothAnatomicalData[] = [
    { id: '#25', num: 25, displayName: '25', type: 'incisor', x: 218, y: 482, rotation: -175 },
    { id: '#26', num: 26, displayName: '26', type: 'incisor', x: 186, y: 476, rotation: -160 },
    { id: '#27', num: 27, displayName: '27', type: 'canine', x: 156, y: 463, rotation: -145 },
    { id: '#28', num: 28, displayName: '28', type: 'premolar', x: 131, y: 443, rotation: -130 },
    { id: '#29', num: 29, displayName: '29', type: 'premolar', x: 111, y: 418, rotation: -120 },
    { id: '#30', num: 30, displayName: '30', type: 'molar', x: 96, y: 388, rotation: -110 },
    { id: '#31', num: 31, displayName: '31', type: 'molar', x: 86, y: 355, rotation: -100 },
    { id: '#32', num: 32, displayName: '32', type: 'molar', x: 82, y: 320, rotation: -90 },
  ];

  const allTeethData: ToothAnatomicalData[] = [
    ...UPPER_RIGHT,
    ...UPPER_LEFT,
    ...LOWER_LEFT,
    ...LOWER_RIGHT,
  ];

  // Render high-fidelity medically accurate anatomical tooth outlines
  const renderToothPath = (type: 'molar' | 'premolar' | 'canine' | 'incisor', isSelected: boolean) => {
    const pathFill = isSelected ? '#FEF08A' : '#FFFFFF'; // Highlighted ivory vs standard clinical clean bone-white
    const pathStroke = isSelected ? '#CA8A04' : '#7F8D9C'; // Bold clinical active stroke
    const pathStrokeWidth = isSelected ? '2.5' : '1.3';

    switch (type) {
      case 'molar':
        return (
          <g>
            <path
              d="M -15,-16 C -15,-20 -10,-22 -5,-22 C -2,-22 0,-19 2,-22 C 7,-22 15,-20 15,-16 C 17,-10 18,3 16,10 C 14.5,15 9,17 0,17 C -9,17 -14.5,15 -16,10 C -18,3 -15,-10 -15,-16 Z"
              fill={pathFill}
              stroke={pathStroke}
              strokeWidth={pathStrokeWidth}
              className="transition-all duration-300"
            />
            <path
              d="M -9,-6 C -4,-8 0,-5 4,-8 M -1,-14 L -1,9 M -9,-1 L 9,-2"
              stroke={isSelected ? '#A16207' : '#94A3B8'}
              strokeWidth="0.8"
              fill="none"
              opacity="0.45"
            />
          </g>
        );
      case 'premolar':
        return (
          <g>
            <path
              d="M -12,-15 C -12,-19 -7,-21 -3,-21 Q 0,-18 3,-21 C 7,-21 12,-19 12,-15 C 13.5,-9 14,2 13,8 C 12,13 8,15 0,15 C -8,15 -12,13 -13,8 C -14,2 -12,-9 -12,-15 Z"
              fill={pathFill}
              stroke={pathStroke}
              strokeWidth={pathStrokeWidth}
              className="transition-all duration-300"
            />
            <path
              d="M -7,-3 Q 0,-5 7,-3 M 0,-11 L 0,7"
              stroke={isSelected ? '#A16207' : '#94A3B8'}
              strokeWidth="0.8"
              fill="none"
              opacity="0.45"
            />
          </g>
        );
      case 'canine':
        return (
          <g>
            <path
              d="M -11,-13 C -11,-17 -6,-21 0,-23 C 6,-21 11,-17 11,-13 C 12.5,-8 13.2,3 12,8 C 11,12.5 7,14 0,14 C -7,14 -11,12.5 -12,8 C -13.2,3 -11,-8 -11,-13 Z"
              fill={pathFill}
              stroke={pathStroke}
              strokeWidth={pathStrokeWidth}
              className="transition-all duration-300"
            />
            <path
              d="M 0,-16 L 0,7"
              stroke={isSelected ? '#A16207' : '#CBD5E1'}
              strokeWidth="0.9"
              fill="none"
              opacity="0.6"
            />
          </g>
        );
      case 'incisor':
      default:
        return (
          <g>
            <path
              d="M -10,-12 C -10,-15 -6,-18 0,-18 C 6,-18 10,-15 10,-12 C 11.2,-6 12,4 11,8 C 9.5,12 6,12.5 0,12.5 C -6,12.5 -9.5,12 -11,8 C -12,4 -10,-6 -10,-12 Z"
              fill={pathFill}
              stroke={pathStroke}
              strokeWidth={pathStrokeWidth}
              className="transition-all duration-300"
            />
            <path
              d="M -6.5,-12 L 6.5,-12"
              stroke={isSelected ? '#A16207' : '#E2E8F0'}
              strokeWidth="0.9"
              fill="none"
              opacity="0.7"
            />
          </g>
        );
    }
  };

  return (
    <div className="bg-[#FCFAF2] shrink-0 border border-[#DDD6C5] rounded-3xl p-6 shadow-xs font-sans flex flex-col h-full overflow-hidden relative">
      
      {/* Clinic branding header, matching standard paper references */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#EBE4D5] pb-3 mb-6 gap-2 text-left w-full">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#8B6B00]/70 tracking-wider font-mono">3D Diagnostics Twin</span>
          <h3 className="font-serif text-lg font-bold text-slate-950 tracking-tight">Anatomical Dental Map</h3>
        </div>
        <div className="text-right text-[10px] font-mono text-slate-500">
          <div className="font-serif font-black text-slate-800">TACTILE CORE</div>
          <div className="text-[9px] text-[#00C853] font-bold">Synchronized Active</div>
        </div>
      </div>

      {/* Main Container - Fully centered large open-mouth clinical visual reference */}
      <div className="flex-1 flex items-center justify-center p-3 bg-white/70 rounded-2xl border border-[#DDD6C5] shadow-inner overflow-hidden min-h-[520px] relative w-full">
        <div className="w-full max-w-[440px] aspect-[24/31] relative flex items-center justify-center">
          <svg 
            viewBox="0 -70 480 620" 
            width="100%" 
            height="100%" 
            className="w-full h-full select-none"
          >
            <defs>
              {/* Clinical active tooth contour shadow glow */}
              <filter id="toothHighlightGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="0.75" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Pink Oral Gums Horseshoe Outer Outline - Upper Jaw (calibrated upper) */}
            <path 
              d="M 68,165 C 68,-5 412,-5 412,165" 
              fill="none" 
              stroke="#FF3E70" 
              strokeWidth="24" 
              strokeLinecap="round" 
              opacity="0.85"
            />

            {/* Pink Oral Gums Horseshoe Outer Outline - Lower Jaw (calibrated lower) */}
            <path 
              d="M 68,315 C 68,485 412,485 412,315" 
              fill="none" 
              stroke="#FF3E70" 
              strokeWidth="24" 
              strokeLinecap="round" 
              opacity="0.85"
            />
            
            {/* Mouth Void back cavern depth */}
            <path 
              d="M 100,240 C 100,65 240,50 380,65 C 395,100 405,160 405,260 C 405,360 395,410 380,430 C 240,480 100,415 100,240 Z" 
              fill="#520519"
              stroke="#380110"
              strokeWidth="1.5"
              transform="rotate(-90 240 240)"
            />

            {/* Hanging Uvula anatomical outline */}
            <path 
              d="M 234,60 Q 240,97 240,97 Q 240,97 246,60" 
              fill="#FF4F7A" 
              stroke="#9E062B" 
              strokeWidth="1" 
            />

            {/* Pink tongue positioned within the expanded interior */}
            <path 
              d="M 125,325 C 125,450 355,450 355,325 C 355,270 305,257 240,257 C 175,257 125,270 125,325 Z" 
              fill="#FF8A9F" 
              stroke="#C9103C" 
              strokeWidth="1.2" 
            />
            {/* Tongue central median furrow line */}
            <path 
              d="M 240,267 L 240,412" 
              stroke="#9E062B" 
              strokeWidth="1.8" 
              opacity="0.6" 
              strokeLinecap="round"
            />

            {/* ANATOMICAL ARCHES RENDERING */}
            <g id="clinical-dental-anatomy">
              {allTeethData.map((tooth) => {
                const isSelected = selectedTeeth.includes(tooth.id);
                return (
                  <g 
                    key={tooth.id}
                    transform={`translate(${tooth.x}, ${tooth.y}) rotate(${tooth.rotation})`}
                    className="cursor-pointer group select-none"
                    onClick={() => onToggleTooth(tooth.id)}
                  >
                    {/* Generous touch targets for perfect selection */}
                    <circle cx="0" cy="0" r="18" fill="transparent" />

                    {/* Scale tooth on hover */}
                    <g 
                      className="transition-all duration-200 hover:scale-110 active:scale-95"
                      filter={isSelected ? 'url(#toothHighlightGlow)' : ''}
                    >
                      {renderToothPath(tooth.type, isSelected)}
                    </g>

                    {/* Highly visible green circular numbering overlay, centered exactly on each tooth */}
                    <g transform={`rotate(${-tooth.rotation})`} className="pointer-events-none">
                      <circle 
                        cx="0" 
                        cy="0" 
                        r="9.5" 
                        className={`transition-all duration-200 ${
                          isSelected 
                            ? 'fill-[#00E676] stroke-[#008F39] stroke-[2px] shadow-xs' 
                            : 'fill-[#00E676]/30 stroke-[#00B445]/50 stroke-[1px]'
                        }`}
                      />
                      <text
                        x="0"
                        y="2.8"
                        textAnchor="middle"
                        className={`font-semibold text-[8px] font-mono leading-none ${
                          isSelected ? 'fill-slate-950 font-black' : 'fill-slate-900 font-bold'
                        }`}
                      >
                        {tooth.displayName}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Sync footer status indicator */}
      <div className="mt-6 p-3 bg-white/40 border border-[#DDD6C5] rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
        <span className="text-[10px] font-mono text-slate-700 flex items-center gap-1.5 font-bold">
          <Shield className="w-3.5 h-3.5 text-rose-600" />
          SYNCHRONIZED DIAGRAM LOCATIONS:
        </span>
        <div className="flex flex-wrap gap-1 items-center justify-end">
          {selectedTeeth.length === 0 ? (
            <span className="text-[10px] text-slate-400 italic">No teeth active. Tap any anatomical tooth above to map diagnostic coordinates.</span>
          ) : (
            selectedTeeth.map(num => (
              <span 
                key={num} 
                onClick={() => onToggleTooth(num)}
                className="bg-emerald-600 hover:bg-red-650 text-white font-mono text-[9px] font-extrabold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Remove selection"
              >
                #{num.replace('#', '')}
                <span className="text-[8px] font-bold opacity-60">×</span>
              </span>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
