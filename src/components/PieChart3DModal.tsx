import React, { useState } from "react";

export interface Slice {
  label: string;
  value: number; // percentage (used for sizing/layout)
  raw: string | number;
  color: string;
  primaryDisplay?: string; // Optional custom string for the large bold text
}

export function PieChart3DModal({ title, slices, onClose }: { title: string, slices: Slice[], onClose: () => void }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [viewType, setViewType] = useState<"pie" | "bar">("pie");
  const depth = 20;
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
      
      <div className="relative flex flex-col bg-[#12122b] text-white rounded-[40px] shadow-2xl overflow-hidden max-w-4xl w-full h-[85vh] max-h-[800px] border border-white/10 ring-1 ring-black/50">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 relative z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-light text-white opacity-90">{title}</h2>
            
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setViewType("pie")} 
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${viewType === "pie" ? "bg-white/20 text-white shadow-sm" : "text-white/50 hover:text-white"}`}
              >
                Pie Chart
              </button>
              <button 
                onClick={() => setViewType("bar")} 
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${viewType === "bar" ? "bg-white/20 text-white shadow-sm" : "text-white/50 hover:text-white"}`}
              >
                Bar Graph
              </button>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>
        
        {/* Content Area */}
        {viewType === "pie" ? (
          <div className="flex-1 relative flex items-center justify-center -mt-16">
           {/* Container scaled down slightly to fit */}
           <div className="relative w-[600px] h-[600px] flex items-center justify-center">
             {/* SVG Stack */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: "scaleY(0.45)" }}>
               {Array.from({ length: depth }).map((_, i) => (
                 <svg key={i} viewBox="0 0 600 600" className="absolute w-[600px] h-[600px] overflow-visible" style={{ transform: `translateY(${i * 2}px)`, zIndex: depth - i, pointerEvents: i === 0 ? "auto" : "none" }}>
                   {slicesWithAngles.map((slice, sIdx) => {
                     const dashoffset = circumference - (circumference * slice.value) / 100;
                     const rotate = slice.startAngle - 90;
                     
                     const isHovered = hoveredIdx === sIdx;
                     const isDimmed = hoveredIdx !== null && !isHovered;
                     
                     // Pop out effect math
                     const shiftAmount = isHovered ? 25 : 0;
                     const shiftRad = (slice.middleAngle - 90) * (Math.PI / 180);
                     const dx = shiftAmount * Math.cos(shiftRad);
                     const dy = shiftAmount * Math.sin(shiftRad);
                     
                     const baseFilter = i === 0 ? "none" : "brightness(0.65)";
                     const dimFilter = isDimmed ? " brightness(0.5) grayscale(40%)" : "";

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
                           transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s" 
                         }}
                         filter={`${baseFilter}${dimFilter}`}
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
             <svg viewBox="-150 0 900 600" className="absolute top-0 left-0 w-full h-full pointer-events-none z-[110] overflow-visible">
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
                 
                 // Push labels wide out horizontally
                 const endX = isRight ? cx + 240 : cx - 240;
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
                     {/* Point at the pie slice */}
                     <circle cx={startX} cy={startY} r="2.5" fill="white" opacity="0.8" style={{ transition: "all 0.4s" }} />
                     
                     {/* Elbow line connecting slice to text */}
                     <polyline 
                       points={`${startX},${startY} ${midX},${endY} ${endX},${endY}`} 
                       fill="none" 
                       stroke="white" 
                       strokeWidth="1" 
                       opacity="0.35" 
                       style={{ transition: "all 0.4s" }} 
                     />
                     
                     {/* Compact Label */}
                     <foreignObject 
                       x={isRight ? endX + 8 : endX - 285} 
                       y={endY - 25} 
                       width="280" 
                       height="50" 
                       style={{ transform: `scale(${scale})`, transformOrigin: isRight ? "left center" : "right center", transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
                     >
                       <div className={`flex items-center gap-2 h-full w-full ${isRight ? 'justify-start' : 'justify-end flex-row-reverse'}`}>
                         <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: slice.color }} />
                         <span className="text-[18px] font-extrabold text-white drop-shadow-md whitespace-nowrap">
                           {slice.primaryDisplay || `${slice.value.toFixed(1)}%`}
                         </span>
                         <span className="text-[14px] text-white/90 font-medium truncate max-w-[110px]" title={slice.label}>{slice.label}</span>
                         <span className="text-[12px] text-white/50 font-mono whitespace-nowrap">({slice.raw})</span>
                       </div>
                     </foreignObject>
                   </g>
                 );
               })}
             </svg>
           </div>
        </div>
        ) : (
          <div className="flex-1 flex flex-col p-8 pt-0 overflow-hidden mt-4">
            <div className="flex-1 overflow-y-auto pr-4 flex flex-col gap-6" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}>
              {slices.map((s, idx) => {
                // To avoid 0-width bars for very small slices, ensure a minimum width of 1%
                const barWidth = Math.max(1, s.value);
                return (
                  <div key={idx} className="flex items-center gap-6 w-full group">
                    <div className="w-[35%] text-right text-[13px] font-semibold text-white/90 truncate group-hover:text-white transition-colors" title={s.label}>
                      {s.label}
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full h-7 relative overflow-hidden flex items-center shadow-inner border border-white/5">
                       <div 
                         className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out" 
                         style={{ 
                           width: `${barWidth}%`, 
                           backgroundColor: s.color, 
                           boxShadow: `inset 0 0 10px rgba(0,0,0,0.2)`
                         }} 
                       />
                    </div>
                    <div className="w-32 flex items-baseline gap-2 justify-end">
                      <span className="text-white font-light tracking-wide text-xl whitespace-nowrap">
                        {s.primaryDisplay || `${s.value.toFixed(1)}%`}
                      </span>
                      <span className="text-white/40 text-xs font-mono whitespace-nowrap">({s.raw})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
