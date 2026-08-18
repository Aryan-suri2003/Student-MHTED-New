"use client";

import React, { useEffect, useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useYear } from "@/contexts/YearContext";
import { districtsData } from "@/data/districts";
import { motion } from "framer-motion";

export default function HeroMap() {
  const { academicYear } = useYear();
  const districts = useMemo(() => districtsData[academicYear] || districtsData["2025–26"], [academicYear]);
  
  const [geoJsonLoaded, setGeoJsonLoaded] = useState(false);

  useEffect(() => {
    const loadMap = async () => {
      try {
        const res = await fetch("/data/wb_districts.geojson");
        const geoJson = await res.json();
        echarts.registerMap("WB", geoJson as any);
        setGeoJsonLoaded(true);
      } catch (e) {
        console.error("Failed to load map geojson", e);
      }
    };
    loadMap();
  }, []);

  const getMapOption = () => {
    if (!geoJsonLoaded) return {};
    return {
      tooltip: { show: false },
      geo: {
        map: "WB",
        roam: false,
        zoom: 1.2,
        top: '10%',
        bottom: '10%',
        itemStyle: {
          areaColor: "transparent",
          borderColor: "#4F7FEF",
          borderWidth: 0.8,
        },
        emphasis: { disabled: true }
      },
      series: [
        {
          name: "Density Points",
          type: "effectScatter",
          coordinateSystem: "geo",
          data: districts.map(d => ({ name: d.name, value: [...d.coords, d.institutions] })),
          symbolSize: (val: any) => Math.max(4, val[2] / 20),
          showEffectOn: 'render',
          rippleEffect: { brushType: 'stroke', scale: 3 },
          itemStyle: { color: "#4F7FEF", shadowBlur: 10, shadowColor: "rgba(79, 127, 239, 0.5)" },
        }
      ],
    };
  };

  return (
    <section className="relative bg-gradient-to-r from-[#FFFFFF] to-[#EAF2FF] border-b border-[#E6EAF0] overflow-hidden min-h-[420px] max-h-[500px] flex items-center">
      
      {/* Subtle WB Background Map Watermark */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.03] pointer-events-none flex items-center justify-center">
         {/* Using Echarts map as a watermark if we wanted, but we'll use a large icon or just let the main map shine */}
      </div>

      <div className="max-w-7xl mx-auto w-full px-8 relative z-10 flex flex-col md:flex-row items-center justify-between h-full py-12">
        
        {/* Left: Compact Hero Text */}
        <div className="md:w-1/2 z-20">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-2 text-[#4F7FEF] font-bold tracking-widest text-[11px] uppercase">
            West Bengal
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[32px] font-bold text-[#172033] tracking-tight leading-tight mb-4"
          >
            Higher and Technical Education, West Bengal 
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-[15px] text-[#667085] font-medium mb-8"
          >
            Scale • Access • Participation • Growth
          </motion.p>
          
          {/* We will leave the KPIs for the KpiRail component below the hero, 
              but the prompt showed them inline in the hero. Let's put a small version here or we can just use the KpiRail below.
              The prompt says: "Immediately below hero. Add a State at a Glance visualization strip".
              Wait, the prompt hero sketch showed:
              2,450       12.4L        48.2K       78.4%
              Institutions Students    Faculty     Enrolment
              inside the hero, and THEN a "State at a glance" visualization strip below. 
              Let's put the KPI block here. */}
              
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-nowrap justify-between w-full gap-4 mt-8"
          >
            {/* Institutions */}
            <div className="shrink-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[28px] font-black text-[#172033] leading-none tracking-tight">2,450</span>
                <span className="text-xl">🏛</span>
              </div>
              <div className="text-[12px] font-bold text-[#667085] uppercase tracking-wider mt-1">Institutions</div>
              <div className="text-[11px] font-bold text-[#25B98A] mt-1.5 flex items-center gap-1">↑ 3.2% YoY</div>
              <div className="h-1 w-full bg-[#EAF2FF] rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#4F7FEF] rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            {/* Students */}
            <div className="shrink-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[28px] font-black text-[#172033] leading-none tracking-tight">12.4L</span>
                <span className="text-xl">👥</span>
              </div>
              <div className="text-[12px] font-bold text-[#667085] uppercase tracking-wider mt-1">Students</div>
              <div className="text-[11px] font-bold text-[#25B98A] mt-1.5 flex items-center gap-1">↑ 7.2% YoY</div>
              <div className="flex gap-[3px] mt-2 items-end h-[12px]">
                {[1,2,3,4,6,8,10].map((v, i) => (
                  <div key={i} className="w-1.5 bg-[#8B6FE8] rounded-t-sm" style={{ height: `${v + 2}px` }}></div>
                ))}
              </div>
            </div>

            {/* Faculty */}
            <div className="shrink-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[28px] font-black text-[#172033] leading-none tracking-tight">48.2K</span>
                <span className="text-xl">◉</span>
              </div>
              <div className="text-[12px] font-bold text-[#667085] uppercase tracking-wider mt-1">Faculty</div>
              <div className="text-[11px] font-bold text-[#25B98A] mt-1.5 flex items-center gap-1">↑ 2.1% YoY</div>
              <div className="flex gap-1 mt-2 items-end h-[12px] pb-[1px]">
                {[1,1,1,1,1].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#48B9D9]"></div>
                ))}
              </div>
            </div>

            {/* Enrolment */}
            <div className="shrink-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[28px] font-black text-[#172033] leading-none tracking-tight">78.4%</span>
              </div>
              <div className="text-[12px] font-bold text-[#667085] uppercase tracking-wider mt-1">Enrolment Rate</div>
              <div className="text-[11px] font-bold text-[#25B98A] mt-1.5 flex items-center gap-1">↑ 1.5% YoY</div>
              <div className="h-[12px] w-[50px] bg-[#E2F8F0] rounded-full mt-2 overflow-hidden relative">
                 <div className="absolute left-0 top-0 bottom-0 bg-[#25B98A]" style={{ width: '78.4%' }}></div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Right: Map Integration */}
        <div className="md:w-1/2 h-[350px] md:h-[450px] relative z-10 flex items-center justify-end">
          {geoJsonLoaded ? (
            <ReactECharts option={getMapOption()} style={{ height: "100%", width: "100%", minHeight: "350px" }} />
          ) : (
            <div className="text-[#98A2B3] text-sm font-medium">Loading Map...</div>
          )}
        </div>

      </div>
    </section>
  );
}
