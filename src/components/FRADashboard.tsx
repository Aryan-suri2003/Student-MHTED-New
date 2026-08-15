"use client";

import React, { useState } from "react";

export default function FRADashboard() {
  const [hoveredSegment, setHoveredSegment] = useState<{
    course: string;
    type: "Minimum Fee" | "Average Fee" | "Maximum Fee";
    value: number;
    x: number;
    y: number;
  } | null>(null);

  // Stacked Chart Data matching the screenshot values
  const feeRangeData = [
    {
      course: "Doctor of Pharmacy (Pharm D)",
      min: 67567,
      avg: 87570,
      max: 158261
    },
    {
      course: "Bachelor of Design",
      min: 59090,
      avg: 99110,
      max: 139130
    },
    {
      course: "Bachelor of Hotel Management and Catering Technology",
      min: 50576,
      avg: 89894,
      max: 165217
    },
    {
      course: "Master of Hotel Management and Catering Technology",
      min: 48889,
      avg: 48889,
      max: 48889
    },
    {
      course: "Dual Degree in Master of Computer Application",
      min: 46140,
      avg: 46140,
      max: 46140
    },
    {
      course: "Master of Business Administration-Part Time",
      min: 45045,
      avg: 56870,
      max: 68696
    }
  ];

  const formatCurrency = (num: number) => {
    return "₹ " + num.toLocaleString("en-IN");
  };

  // Stacked Chart Math
  const globalMaxStack = 313398; // Sum of Doctor of Pharmacy (67567 + 87570 + 158261)

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn pb-8">
      {/* PRIMARY CARD: Course-wise Stacked Fee Range Chart */}
      <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#f0f6ff] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-6 w-full relative overflow-hidden min-h-[440px]">
        
        {/* Header & Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-extrabold text-brand-900 tracking-tight">
              Course-wise Institute-wise Maximum Fees, Average Fees and Minimum Fees (In ₹)
            </h3>
            <p className="text-sm text-brand-600 font-bold mt-0.5">2025-26</p>
          </div>
          <div className="text-xs text-slate-500 font-bold tracking-tight italic select-none">
            *Disclaimer: Data updated as on 14-Aug-2026
          </div>
        </div>

        {/* Scrollable Column Chart container */}
        <div className="w-full overflow-x-auto scrollbar-thin pb-4 relative">
          <div className="relative min-w-[1100px] h-[300px] flex items-end justify-around px-4 mt-6 select-none pb-12 pt-6">
            
            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12 pt-6 pr-4">
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
            </div>

            {/* Bars */}
            <div className="w-full h-full flex items-end justify-around z-10">
              {feeRangeData.map((item) => {
                // Compute heights relative to the global max stack
                const minHeight = (item.min / globalMaxStack) * 100;
                const avgHeight = (item.avg / globalMaxStack) * 100;
                const maxHeight = (item.max / globalMaxStack) * 100;

                return (
                  <div key={item.course} className="flex flex-col items-center w-full max-w-[200px] relative">
                    
                    {/* Stack Container */}
                    <div className="w-28 h-52 flex flex-col justify-end rounded-lg overflow-hidden border border-slate-200/20 shadow-sm">
                      
                      {/* Maximum Fee (Dark Blue) */}
                      <div
                        style={{ height: `${maxHeight}%` }}
                        className="bg-[#0284c7] hover:bg-[#0274b0] transition-colors duration-200 cursor-pointer flex items-center justify-center text-[12px] font-black text-white px-1 select-none text-center"
                        onMouseEnter={(e) => {
                          setHoveredSegment({
                            course: item.course,
                            type: "Maximum Fee",
                            value: item.max,
                            x: e.clientX,
                            y: e.clientY
                          });
                        }}
                        onMouseMove={(e) => {
                          if (hoveredSegment) {
                            setHoveredSegment({
                              ...hoveredSegment,
                              x: e.clientX,
                              y: e.clientY
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredSegment(null)}
                      >
                        {item.max.toLocaleString("en-IN")}
                      </div>

                      {/* Average Fee (Light Blue) */}
                      <div
                        style={{ height: `${avgHeight}%` }}
                        className="bg-[#60a5fa] hover:bg-[#4ea0f6] transition-colors duration-200 cursor-pointer flex items-center justify-center text-[12px] font-black text-brand-955 px-1 select-none text-center"
                        onMouseEnter={(e) => {
                          setHoveredSegment({
                            course: item.course,
                            type: "Average Fee",
                            value: item.avg,
                            x: e.clientX,
                            y: e.clientY
                          });
                        }}
                        onMouseMove={(e) => {
                          if (hoveredSegment) {
                            setHoveredSegment({
                              ...hoveredSegment,
                              x: e.clientX,
                              y: e.clientY
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredSegment(null)}
                      >
                        {item.avg.toLocaleString("en-IN")}
                      </div>

                      {/* Minimum Fee (Gray) */}
                      <div
                        style={{ height: `${minHeight}%` }}
                        className="bg-[#94a3b8] hover:bg-[#8393a8] transition-colors duration-200 cursor-pointer flex items-center justify-center text-[12px] font-black text-white px-1 select-none text-center"
                        onMouseEnter={(e) => {
                          setHoveredSegment({
                            course: item.course,
                            type: "Minimum Fee",
                            value: item.min,
                            x: e.clientX,
                            y: e.clientY
                          });
                        }}
                        onMouseMove={(e) => {
                          if (hoveredSegment) {
                            setHoveredSegment({
                              ...hoveredSegment,
                              x: e.clientX,
                              y: e.clientY
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredSegment(null)}
                      >
                        {item.min.toLocaleString("en-IN")}
                      </div>

                    </div>

                    {/* X-Axis labels */}
                    <div className="text-xs font-black text-brand-900 mt-3 text-center h-12 overflow-hidden text-ellipsis line-clamp-3 select-none px-2">
                      {item.course}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Dynamic Tooltip Overlay */}
        {hoveredSegment && (
          <div 
            className="fixed bg-blue-50/95 border border-blue-200/80 p-3 rounded-xl shadow-lg z-50 pointer-events-none backdrop-blur-sm transition-all duration-75 text-[12px] font-extrabold max-w-[280px]"
            style={{ 
              left: `${hoveredSegment.x + 15}px`, 
              top: `${hoveredSegment.y - 10}px` 
            }}
          >
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <span className="text-slate-400 font-bold w-14">Course</span>
                <span className="text-brand-950 flex-1">{hoveredSegment.course}</span>
              </div>
              <div className="flex gap-2 border-t border-blue-200/40 pt-1 mt-1">
                <span className="text-slate-400 font-bold w-14">{hoveredSegment.type}</span>
                <span className="text-brand-900">{formatCurrency(hoveredSegment.value)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center items-center gap-8 text-sm font-bold text-slate-700 mt-2 border-t border-slate-100/50 pt-4 select-none">
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#94a3b8]" style={{ boxShadow: '0 2px 8px #94a3b880' }} />
            Minimum Fee
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#60a5fa]" style={{ boxShadow: '0 2px 8px #60a5fa80' }} />
            Average Fee
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#0284c7]" style={{ boxShadow: '0 2px 8px #0284c780' }} />
            Maximum Fee
          </span>
        </div>

      </div>
    </div>
  );
}
