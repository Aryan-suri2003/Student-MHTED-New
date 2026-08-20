"use client";

import React, { useState, useEffect } from "react";
import { Building2, Users, Landmark, BookOpen, GraduationCap } from "lucide-react";

// Simple custom hook for count-up animation
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
}

// Component to handle number formatting with animation
const AnimatedNumber = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const count = useCountUp(value, 2000);
  
  // Format based on the magnitude
  let displayValue = "";
  if (value >= 1000000) { // e.g. 3.08M or 30.8L
    // The animated count is the raw number, we format it dynamically
    displayValue = (count / 100000).toFixed(1) + "L";
  } else {
    displayValue = count.toLocaleString('en-IN');
  }

  return <span>{displayValue}{suffix}</span>;
};

export default function KpiRail() {
  const kpis = [
    { 
      label: "Public Universities", 
      value: 24, 
      icon: Landmark, 
      color: "text-[#2563EB]", 
      bg: "bg-[#DBEAFE]",
      border: "border-[#2563EB]"
    },
    { 
      label: "Private Universities", 
      value: 18, 
      icon: Building2, 
      color: "text-[#8B5CF6]", 
      bg: "bg-[#EDE9FE]",
      border: "border-[#8B5CF6]"
    },
    { 
      label: "Colleges", 
      value: 2408, 
      icon: BookOpen, 
      color: "text-[#10B981]", 
      bg: "bg-[#D1FAE5]",
      border: "border-[#10B981]"
    },
    { 
      label: "Total Enrolled Students", 
      value: 3078210, // ~30.8 Lakh
      icon: Users, 
      color: "text-[#F59E0B]", 
      bg: "bg-[#FEF3C7]",
      border: "border-[#F59E0B]"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-[#F8FAFC] to-white border-b border-[#E2E8F0] py-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full px-8">
        
        {/* Adjusted to grid-cols-4 for the 4 specific metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-[150px] cursor-pointer">
              
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 w-full h-1 ${kpi.bg} group-hover:h-1.5 transition-all`}>
                <div className={`h-full ${kpi.border} ${kpi.color} bg-current w-full`}></div>
              </div>

              {/* Background Icon Watermark */}
              <div className={`absolute -bottom-4 -right-4 opacity-10 transform group-hover:scale-125 transition-transform duration-500`}>
                <kpi.icon size={100} className={kpi.color} />
              </div>

              <div className="flex justify-between items-start mt-2 relative z-10">
                <div>
                  <h3 className="text-[36px] font-black text-[#0F172A] leading-none mb-2 tracking-tight">
                    <AnimatedNumber value={kpi.value} />
                  </h3>
                  <p className="text-[14px] font-bold text-[#64748B] uppercase tracking-wider leading-tight">{kpi.label}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color} group-hover:rotate-12 transition-transform duration-300 shadow-sm`}>
                  <kpi.icon size={24} strokeWidth={2.5} />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
