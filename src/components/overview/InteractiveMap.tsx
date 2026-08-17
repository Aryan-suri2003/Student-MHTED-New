"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useYear } from "@/contexts/YearContext";
import { districtsData, DistrictData } from "@/data/districts";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Plus, Minus } from "lucide-react";

type MapMode = "Institutions" | "Students" | "Growth" | "Enrolment";
const MAP_MODES: { id: MapMode; label: string }[] = [
  { id: "Institutions", label: "Institutions" },
  { id: "Students", label: "Students" },
  { id: "Growth", label: "Growth" },
  { id: "Enrolment", label: "Enrolment" },
];

export default function InteractiveMap() {
  const { academicYear } = useYear();
  const districts = useMemo(() => districtsData[academicYear] || districtsData["2025–26"], [academicYear]);
  
  const [mode, setMode] = useState<MapMode>("Institutions");
  const [geoJsonLoaded, setGeoJsonLoaded] = useState(false);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1.1);
  const eChartsRef = useRef<ReactECharts>(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        const geoJson = await import("@/data/geo/wb_dummy.json");
        echarts.registerMap("WB", geoJson.default as any);
        setGeoJsonLoaded(true);
      } catch (e) {
        console.error("Failed to load map geojson", e);
      }
    };
    loadMap();
  }, []);

  // Sort districts based on mode for the District Leaders list
  const sortedDistricts = useMemo(() => {
    return [...districts].sort((a, b) => {
      if (mode === "Growth") return parseFloat(b.growth) - parseFloat(a.growth);
      if (mode === "Institutions") return b.institutions - a.institutions;
      if (mode === "Students") return b.students - a.students;
      if (mode === "Enrolment") return b.enrolment - a.enrolment;
      return 0;
    }).slice(0, 7);
  }, [districts, mode]);

  const getMapOption = () => {
    if (!geoJsonLoaded) return {};

    const baseOption: any = {
      tooltip: { show: false },
      geo: {
        map: "WB",
        roam: true, // Allow mouse drag/zoom
        zoom: zoomLevel,
        itemStyle: {
          areaColor: "#F7F9FC",
          borderColor: "#E6EAF0",
          borderWidth: 1.5,
        },
        emphasis: {
          itemStyle: { areaColor: "#EAF2FF", borderColor: "#2563EB" },
          label: { show: false }
        },
      },
      series: []
    };

    let seriesData: any[] = [];
    let bubbleData: any[] = [];
    let visualMapRange = { min: 0, max: 100, color: ["#FFFFFF", "#2563EB"] };

    if (mode === "Institutions") {
      seriesData = districts.map(d => ({ name: d.name, value: d.institutions }));
      bubbleData = districts.map(d => ({ name: d.name, value: [...d.coords, d.institutions] }));
      visualMapRange = { min: 0, max: 200, color: ["#EAF2FF", "#2563EB", "#1E3A8A"] };
    } else if (mode === "Growth") {
      seriesData = districts.map(d => ({ name: d.name, value: parseFloat(d.growth) }));
      bubbleData = districts.map(d => ({ name: d.name, value: [...d.coords, parseFloat(d.growth) * 10] }));
      visualMapRange = { min: 0, max: 15, color: ["#E2F8F0", "#25B98A", "#047857"] };
    } else if (mode === "Students") {
      seriesData = districts.map(d => ({ name: d.name, value: d.students }));
      bubbleData = districts.map(d => ({ name: d.name, value: [...d.coords, d.students / 10000] }));
      visualMapRange = { min: 0, max: 200000, color: ["#F0EBFF", "#8B6FE8", "#5B21B6"] };
    } else if (mode === "Enrolment") {
      seriesData = districts.map(d => ({ name: d.name, value: d.enrolment }));
      bubbleData = districts.map(d => ({ name: d.name, value: [...d.coords, d.enrolment] }));
      visualMapRange = { min: 50, max: 100, color: ["#E3F6FB", "#48B9D9", "#0369A1"] };
    }

    baseOption.visualMap = {
      min: visualMapRange.min, 
      max: visualMapRange.max,
      inRange: { color: visualMapRange.color },
      show: false
    };

    // Choropleth layer
    baseOption.series.push({
      name: mode,
      type: "map",
      geoIndex: 0,
      data: seriesData,
    });

    // Bubble layer on top
    baseOption.series.push({
      name: "Bubble",
      type: "scatter",
      coordinateSystem: "geo",
      data: bubbleData,
      symbolSize: (val: any) => Math.max(4, val[2] / 5),
      itemStyle: {
        color: "#172033",
        opacity: 0.8,
        borderColor: '#fff',
        borderWidth: 1.5,
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)'
      },
      emphasis: { itemStyle: { opacity: 1, borderColor: '#F2A93B' } }
    });

    return baseOption;
  };

  const handleMapEvents = {
    mouseover: (params: any) => {
      if (params.name) {
        const dist = districts.find(d => d.name === params.name);
        if (dist) setHoveredDistrict(dist);
      }
    },
    mouseout: () => setHoveredDistrict(null),
    georoam: (params: any) => {
      // Sync React state if user zooms with scroll wheel so buttons stay in sync
      if (params.zoom != null && eChartsRef.current) {
        const instance = eChartsRef.current.getEchartsInstance();
        const option = instance.getOption() as any;
        if (option && option.geo && option.geo[0]) {
          setZoomLevel(option.geo[0].zoom);
        }
      }
    }
  };

  const getLeaderValue = (dist: DistrictData) => {
    if (mode === "Growth") return `+${dist.growth}%`;
    if (mode === "Institutions") return dist.institutions;
    if (mode === "Students") return `${(dist.students / 100000).toFixed(1)}L`;
    if (mode === "Enrolment") return `${dist.enrolment}%`;
    return "";
  };

  const getLeaderBarColor = () => {
    if (mode === "Growth") return "bg-[#25B98A]";
    if (mode === "Institutions") return "bg-[#2563EB]";
    if (mode === "Students") return "bg-[#8B6FE8]";
    if (mode === "Enrolment") return "bg-[#48B9D9]";
    return "bg-slate-400";
  };

  return (
    <section 
      className="bg-white py-16 relative"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <div className="max-w-7xl mx-auto w-full px-8 flex flex-col h-full">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6 border-b border-[#E6EAF0] pb-6">
          <div>
            <h2 className="text-[26px] font-bold text-[#172033] mb-1">West Bengal Education Map</h2>
            <p className="text-[14px] text-[#667085]">Explore the geographic distribution across 23 districts.</p>
          </div>

          <div className="flex bg-[#F7F9FC] p-1 rounded-lg border border-[#E6EAF0]">
            {MAP_MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={clsx(
                  "px-4 py-1.5 rounded text-[13px] font-bold transition-all",
                  mode === m.id 
                    ? "bg-white text-[#2563EB] shadow-sm border border-[#E6EAF0]" 
                    : "text-[#667085] hover:text-[#172033]"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          
          {/* Left: Map Container */}
          <div className="lg:w-2/3 min-h-[600px] bg-white rounded-xl border border-[#E6EAF0] shadow-sm relative overflow-hidden flex flex-col">
            
            {/* Map Controls */}
            <div className="absolute right-4 top-4 z-10 flex flex-col bg-white rounded-md shadow-md border border-[#E6EAF0] overflow-hidden">
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.3, 5))}
                className="w-8 h-8 flex items-center justify-center text-[#172033] hover:bg-[#F7F9FC] border-b border-[#E6EAF0] transition-colors"
                title="Zoom In"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.3, 0.5))}
                className="w-8 h-8 flex items-center justify-center text-[#172033] hover:bg-[#F7F9FC] transition-colors"
                title="Zoom Out"
              >
                <Minus size={16} strokeWidth={3} />
              </button>
            </div>

            {geoJsonLoaded ? (
              <ReactECharts 
                ref={eChartsRef}
                option={getMapOption()} 
                style={{ height: "100%", width: "100%", flex: 1 }}
                onEvents={handleMapEvents}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#98A2B3] text-sm font-medium">Loading Map...</div>
            )}
            
            {/* Map Legend */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur border border-[#E6EAF0] rounded-md p-3 shadow-md pointer-events-none">
              <div className="text-[11px] font-bold text-[#172033] mb-2 uppercase tracking-wider">{mode} Density</div>
              <div className="flex items-center gap-2">
                <div className={clsx(
                  "w-32 h-2.5 rounded-sm bg-gradient-to-r",
                  mode === "Growth" ? "from-[#E2F8F0] to-[#047857]" :
                  mode === "Students" ? "from-[#F0EBFF] to-[#5B21B6]" :
                  mode === "Enrolment" ? "from-[#E3F6FB] to-[#0369A1]" :
                  "from-[#EAF2FF] to-[#1E3A8A]"
                )} />
              </div>
            </div>
          </div>

          {/* Right: District Leaders */}
          <div className="lg:w-1/3 flex flex-col bg-[#F7F9FC] rounded-xl border border-[#E6EAF0] p-6">
            <h3 className="text-[14px] font-bold text-[#172033] uppercase tracking-wider mb-6">District Leaders: {mode}</h3>
            
            <div className="space-y-5 flex-1 overflow-y-auto">
              {sortedDistricts.map((dist, idx) => {
                const val = getLeaderValue(dist);
                const topValNum = parseFloat(getLeaderValue(sortedDistricts[0]).toString().replace(/[^0-9.]/g, ''));
                const currValNum = parseFloat(val.toString().replace(/[^0-9.]/g, ''));
                const pct = (currValNum / topValNum) * 100;

                return (
                  <div key={dist.id} className="relative group bg-white p-3 rounded-lg border border-[#E6EAF0] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-[#98A2B3] font-bold text-[13px] w-5">{String(idx + 1).padStart(2, '0')}</div>
                      <div className="font-bold text-[#172033] text-[15px] flex-1">{dist.name}</div>
                      <div className={clsx("font-black text-[16px]", mode === "Growth" ? "text-[#25B98A]" : mode === "Students" ? "text-[#8B6FE8]" : mode === "Enrolment" ? "text-[#48B9D9]" : "text-[#2563EB]")}>{val}</div>
                    </div>
                    <div className="pl-8">
                      <div className="h-1.5 w-full bg-[#E6EAF0] rounded-full overflow-hidden">
                        <div 
                          className={clsx("h-full rounded-full transition-all duration-700 ease-out", getLeaderBarColor())} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-[#E6EAF0]">
              <button className="w-full py-2.5 rounded-lg text-[13px] font-bold text-white bg-[#2563EB] hover:bg-[#1E3A8A] transition-colors shadow-sm">
                View All Districts Analysis
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* CUSTOM HOVER TOOLTIP */}
      <AnimatePresence>
        {hoveredDistrict && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none bg-[#172033] text-white rounded-lg shadow-2xl p-4 w-56"
            style={{ left: mousePos.x + 16, top: mousePos.y + 16 }}
          >
            <div className="font-bold text-[15px] border-b border-white/10 pb-2 mb-3">{hoveredDistrict.name}</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-white/60 font-medium">Institutions</span>
                <span className="text-[13px] font-bold text-[#6FA8FF]">{hoveredDistrict.institutions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-white/60 font-medium">Students</span>
                <span className="text-[13px] font-bold text-[#A78BFA]">{(hoveredDistrict.students / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-white/60 font-medium">Enrolment</span>
                <span className="text-[13px] font-bold text-[#38BDF8]">{hoveredDistrict.enrolment}%</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-1">
                <span className="text-[12px] text-white/60 font-medium">Growth</span>
                <span className="text-[13px] font-bold text-[#34D399]">{hoveredDistrict.growth}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

