import React, { useState, useEffect } from "react";

export interface Slice {
  label: string;
  value: number; // percentage (used for sizing/layout)
  raw: string | number;
  color: string;
  primaryDisplay?: string; // Optional custom string for the large bold text
}

export function PieChart3DModal({ title, description, slices, onClose }: { title: string, description?: string, slices: Slice[], onClose: () => void }) {
  const defaultDesc = "This chart visualizes the detailed breakdown of the selected metric. The total absolute values and their proportional share are depicted below to provide deeper analytical insights into the current distribution.";
  const displayDesc = description || defaultDesc;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const depth = 45;
  const radius = 180;
  const strokeWidth = 70;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercent = 0;
  const slicesWithAngles = slices.map(s => {
    const pct = s.value;
    const startAngle = (cumulativePercent * 360) / 100;
    const endAngle = ((cumulativePercent + pct) * 360) / 100;
    const middleAngle = startAngle + (endAngle - startAngle) / 2;
    cumulativePercent += pct;
    return { ...s, startAngle, endAngle, middleAngle };
  });

  // Calculate even Y distribution for labels to prevent overlap
  const rightSlices = slicesWithAngles.filter(s => Math.cos((s.middleAngle - 90) * Math.PI / 180) >= 0);
  const leftSlices = slicesWithAngles.filter(s => Math.cos((s.middleAngle - 90) * Math.PI / 180) < 0).reverse();

  const rightYPositions = new Map<string, number>();
  rightSlices.forEach((s, i) => {
    const y = rightSlices.length <= 1 ? 300 : 30 + (540 / (rightSlices.length - 1)) * i;
    rightYPositions.set(s.label, y);
  });

  const leftYPositions = new Map<string, number>();
  leftSlices.forEach((s, i) => {
    const y = leftSlices.length <= 1 ? 300 : 30 + (540 / (leftSlices.length - 1)) * i;
    leftYPositions.set(s.label, y);
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8" style={{ fontFamily: "sans-serif" }}>
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      <div className="relative flex flex-col bg-[#12122b] text-white rounded-[40px] shadow-2xl overflow-hidden max-w-6xl w-full h-[85vh] max-h-[800px] border border-white/10 ring-1 ring-black/50">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 relative z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-light text-white opacity-90">{title}</h2>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row relative z-0 overflow-hidden pb-8">
          {/* Pie Chart Side */}
          <div className="flex-1 relative flex flex-col items-center justify-center">
           <h3 className="absolute top-8 left-8 text-xl font-bold text-white/80 z-20 hidden lg:block">Distribution</h3>
           {/* Container scaled down slightly to fit */}
           <div className="relative w-[600px] h-[500px] flex items-center justify-center scale-75 lg:scale-90 xl:scale-100">
             {/* SVG Stack */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: "scaleY(0.45)" }}>
               {Array.from({ length: depth }).map((_, i) => (
                 <svg key={i} viewBox="0 0 600 600" className="absolute w-[600px] h-[600px] overflow-visible" style={{ transform: `translateY(${i * 2}px)`, zIndex: depth - i, pointerEvents: i === 0 ? "auto" : "none" }}>
                   {slicesWithAngles.map((slice, sIdx) => {
                     const finalDashoffset = circumference - (circumference * slice.value) / 100;
                     const dashoffset = isMounted ? finalDashoffset : circumference;
                     const rotate = slice.startAngle - 90;
                     
                     const isHovered = hoveredIdx === sIdx;
                     
                     // Pop out effect math
                     const shiftAmount = isHovered ? 25 : 0;
                     const shiftRad = (slice.middleAngle - 90) * (Math.PI / 180);
                     const dx = shiftAmount * Math.cos(shiftRad);
                     const dy = shiftAmount * Math.sin(shiftRad);
                     
                     const baseFilter = i === 0 ? "none" : "brightness(0.65)";

                     const duration = (slice.value / 100) * 1.5;
                     const delay = (slice.startAngle / 360) * 1.5;

                     return (
                       <circle
                         key={sIdx}
                         cx="300"
                         cy="300"
                         r={radius}
                         fill="none"
                         stroke={slice.color}
                         strokeWidth={strokeWidth}
                         strokeDasharray={circumference}
                         strokeDashoffset={dashoffset}
                         style={{ 
                           transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`, 
                           transformOrigin: "300px 300px",
                           transition: `stroke-dashoffset ${duration}s linear ${delay}s, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)` 
                         }}
                         filter={baseFilter}
                         onMouseEnter={() => setHoveredIdx(sIdx)}
                         onMouseLeave={() => setHoveredIdx(null)}
                         onClick={() => setHoveredIdx(isHovered ? null : sIdx)}
                         className="cursor-pointer"
                       />
                     );
                   })}
                 </svg>
               ))}
             </div>
             
             {/* Lines and Labels Overlay (unscaled) */}
             <svg viewBox="-300 0 1200 600" className="absolute top-0 left-0 w-full h-full pointer-events-none z-[110] overflow-visible" style={{ opacity: isMounted ? 1 : 0, transition: "opacity 0.5s ease 1.5s" }}>
               
               {/* Center Total */}
               <g className="opacity-90" style={{ transform: 'translateY(30px)' }}>
                 <text x="300" y="290" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" letterSpacing="1">
                   {slices.reduce((sum, s) => sum + Number(String(s.raw).replace(/,/g, '')), 0).toLocaleString()}
                 </text>
                 <text x="300" y="325" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="16" fontWeight="600" letterSpacing="2" textTransform="uppercase">
                   Total Value
                 </text>
               </g>

               {slicesWithAngles.map((slice, idx) => {
                 const isHovered = hoveredIdx === idx;
                 
                 const cx = 300, cy = 300;
                 const outerR = radius + strokeWidth / 2; // 215
                 const shiftAmount = isHovered ? 25 : 0;
                 
                 const rad = (slice.middleAngle - 90) * (Math.PI / 180);
                 const startX = cx + (outerR + shiftAmount) * Math.cos(rad);
                 // apply scaleY(0.45) squash manually to Y coordinate for the line start
                 const startY = cy + (outerR + shiftAmount) * Math.sin(rad) * 0.45;
                 
                 const isRight = Math.cos(rad) >= 0;
                 const endY = isRight ? rightYPositions.get(slice.label)! : leftYPositions.get(slice.label)!;
                 
                 // Push labels out horizontally
                 const endX = isRight ? cx + 220 : cx - 220;
                 // Midpoint for the elbow line (30px inward from the text)
                 const midX = isRight ? endX - 30 : endX + 30;
  
                 let opacity = 1;
                 if (isHovered) {
                   opacity = 1;
                 } else if (hoveredIdx !== null) {
                   opacity = 0.25;
                 }
                 
                 const scale = isHovered ? 1.15 : 1;
                 const zIndex = isHovered ? 50 : 1;

                 return (
                   <g key={idx} style={{ opacity, transition: "opacity 0.3s" }}>
                   </g>
                 );
               })}
             </svg>
            </div>
          </div>

          {/* Bar Graph Side */}
          <div className="flex-1 flex flex-col px-8 lg:px-12 lg:border-l border-white/10 mt-8 lg:mt-0 h-full overflow-hidden relative pt-8 lg:pt-12">
            <h3 className="text-xl font-bold text-white/90 mb-3">Metrics Breakdown</h3>
            <p className="text-white/50 text-base leading-relaxed mb-6 border-b border-white/10 pb-6">
              {displayDesc}
            </p>
            <div className="overflow-y-auto pr-4 flex flex-col gap-10 w-full flex-1 pb-8" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}>
              {slices.map((s, idx) => {
                const barWidth = Math.max(1, s.value);
                const isHovered = hoveredIdx === idx;
                const isDimmed = hoveredIdx !== null && !isHovered;
                return (
                  <div 
                    key={idx} 
                    className="flex items-center gap-4 lg:gap-5 w-full group cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{
                      opacity: isDimmed ? 0.3 : 1,
                      transform: isHovered ? "translateX(8px)" : "translateX(0)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <div 
                      className="w-[22%] min-w-[100px] text-right text-[13px] font-semibold truncate transition-colors" 
                      title={s.label}
                      style={{ color: isHovered ? s.color : 'rgba(255, 255, 255, 0.9)' }}
                    >
                      {s.label}
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full h-4 relative overflow-hidden flex items-center shadow-inner border border-white/5">
                       <div 
                         className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out" 
                         style={{ 
                           width: isMounted ? `${barWidth}%` : '0%', 
                           backgroundColor: s.color, 
                           boxShadow: `inset 0 0 10px rgba(0,0,0,0.2)`,
                           transitionDelay: `${(idx * 0.1)}s`
                         }} 
                       />
                    </div>
                    <div className="w-24 lg:w-32 flex items-baseline gap-2 justify-end">
                      <span 
                        className="font-light tracking-wide text-xl lg:text-2xl whitespace-nowrap transition-colors"
                        style={{ color: isHovered ? s.color : 'white' }}
                      >
                        {s.primaryDisplay || `${s.value.toFixed(1)}%`}
                      </span>
                      <span 
                        className="text-[11px] font-mono whitespace-nowrap transition-colors"
                        style={{ color: isHovered ? s.color : 'rgba(255, 255, 255, 0.4)' }}
                      >
                        ({s.raw})
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {/* Summary Block to fill empty space */}
              <div className="mt-4 p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Overall Total</span>
                  <span className="text-white text-3xl font-bold mt-1">
                    {slices.reduce((sum, s) => sum + Number(String(s.raw).replace(/,/g, '')), 0).toLocaleString()}
                  </span>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
