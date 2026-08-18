"use client";

import React, { useState, useMemo } from "react";
import { useYear } from "@/contexts/YearContext";
import { districtsData, DistrictData } from "@/data/districts";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Users, Globe2, Building2, TrendingUp, X, MapPin } from "lucide-react";
import { WB_DISTRICTS } from "@/components/WestBengalMap";
import ReactECharts from "echarts-for-react";

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
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  const getLeaderValue = (dist: DistrictData) => {
    if (mode === "Growth") return `${dist.growth}`;
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

  // Get color scale for map choropleth
  const getDistrictColor = (distId: string, isActive: boolean, isDimmed: boolean) => {
    if (isActive) return "url(#activeGradient)"; // Highlight gradient for selected/hovered
    if (isDimmed) return "#F8FAFC"; // Dimmed background color

    const dist = districts.find(d => d.id === distId);
    if (!dist) return "#F0F4F8";

    // Simple relative scale based on the top district's value
    const topDist = sortedDistricts[0];
    let ratio = 0;
    
    if (mode === "Institutions") ratio = dist.institutions / topDist.institutions;
    if (mode === "Students") ratio = dist.students / topDist.students;
    if (mode === "Enrolment") ratio = dist.enrolment / 100;
    if (mode === "Growth") ratio = parseFloat(dist.growth) / parseFloat(topDist.growth);

    // Color ranges with slightly deeper tones for better contrast against light blue borders
    if (mode === "Institutions") return ratio > 0.7 ? "#93C5FD" : ratio > 0.4 ? "#BFDBFE" : "#DBEAFE";
    if (mode === "Students") return ratio > 0.7 ? "#C4B5FD" : ratio > 0.4 ? "#DDD6FE" : "#EDE9FE";
    if (mode === "Growth") return ratio > 0.7 ? "#6EE7B7" : ratio > 0.4 ? "#A7F3D0" : "#D1FAE5";
    if (mode === "Enrolment") return ratio > 0.7 ? "#7DD3FC" : ratio > 0.4 ? "#BAE6FD" : "#E0F2FE";
    
    return "#F8FAFC";
  };

  const getPieChartOption = (districtId: string) => {
    const dist = districts.find(d => d.id === districtId);
    if (!dist) return {};
    
    const growthNum = parseFloat(dist.growth.replace(/[^0-9.-]/g, ''));

    return {
      title: {
        text: 'Relative\nScale',
        left: 'center',
        top: '37%',
        textStyle: { fontSize: 10, color: '#94A3B8', fontWeight: 800, lineHeight: 14, letterSpacing: 0.5 },
        textAlign: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          let val = params.value;
          if (params.name === "Students") val = (val / 100000).toFixed(1) + "L";
          else if (params.name === "Enrolment Rate") val = val + "%";
          else if (params.name === "Growth YoY") val = (val > 0 ? "+" : "") + val + "%";
          return `${params.name}: ${val}`;
        },
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        textStyle: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
        borderWidth: 0,
        padding: [10, 14],
        borderRadius: 8,
      },
      legend: {
        show: false // We will use labels directly on the pie instead of a legend to make it more explanatory
      },
      series: [
        {
          name: 'Metrics',
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          minAngle: 25, // Ensures even small values like Growth are easily visible
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 3
          },
          label: { 
            show: true, 
            formatter: '{b}',
            fontSize: 10,
            fontWeight: 800,
            color: '#64748B'
          },
          labelLine: {
            length: 12,
            length2: 12,
            smooth: true,
            lineStyle: { width: 2 }
          },
          data: [
            { 
              value: dist.institutions, 
              name: 'Institutions', 
              itemStyle: { 
                color: {
                  type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [{ offset: 0, color: '#60A5FA' }, { offset: 1, color: '#2563EB' }]
                } 
              } 
            },
            { 
              value: dist.students, 
              name: 'Students', 
              itemStyle: { 
                color: {
                  type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [{ offset: 0, color: '#A78BFA' }, { offset: 1, color: '#7C3AED' }]
                } 
              } 
            },
            { 
              value: dist.enrolment, 
              name: 'Enrolment Rate', 
              itemStyle: { 
                color: {
                  type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [{ offset: 0, color: '#38BDF8' }, { offset: 1, color: '#0284C7' }]
                } 
              } 
            },
            { 
              value: growthNum, 
              name: 'Growth YoY', 
              itemStyle: { 
                color: {
                  type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [{ offset: 0, color: '#34D399' }, { offset: 1, color: '#059669' }]
                } 
              } 
            }
          ]
        }
      ]
    };
  };

  const selectedData = selectedDistrictId ? districts.find(d => d.id === selectedDistrictId) : null;
  const hoveredData = hoveredDistrictId ? districts.find(d => d.id === hoveredDistrictId) : null;

  return (
    <section 
      className="bg-white py-16 relative"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <div className="max-w-7xl mx-auto w-full px-8 flex flex-col h-full">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6 border-b border-[#E6EAF0] pb-6">
          <div>
            <h2 className="text-[26px] font-bold text-[#172033] mb-1">West Bengal Education Map</h2>
            <p className="text-[14px] text-[#667085]">Explore the geographic distribution across 23 districts. Click on any district for details.</p>
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
          
          {/* Left: Interactive SVG Map */}
          <div className="lg:w-2/3 min-h-[600px] bg-[#F8FAFC] rounded-2xl border-2 border-blue-400/50 shadow-2xl shadow-blue-900/5 relative overflow-hidden flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            
            <svg
              viewBox="0 0 480 680"
              className="w-full h-full max-h-[650px] object-contain drop-shadow-xl"
            >
              <defs>
                <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>
              </defs>

              <g>
                {WB_DISTRICTS.map((dist) => {
                  const isHovered = hoveredDistrictId === dist.id;
                  const isSelected = selectedDistrictId === dist.id;
                  const isActive = isHovered || isSelected;
                  const isDimmed = selectedDistrictId !== null && !isSelected;
                  
                  return (
                    <path
                      key={dist.id}
                      d={dist.d}
                      fill={getDistrictColor(dist.id, isActive, isDimmed)}
                      stroke={isActive ? "#1E3A8A" : "#93C5FD"}
                      strokeWidth={isActive ? 2.5 : 1}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-300 ease-out"
                      style={{
                        filter: isActive ? "drop-shadow(0px 8px 16px rgba(37, 99, 235, 0.4))" : "none",
                        transformOrigin: `${dist.cx}px ${dist.cy}px`,
                        transform: isActive ? "scale(1.02)" : "scale(1)",
                      }}
                      onMouseEnter={() => setHoveredDistrictId(dist.id)}
                      onMouseLeave={() => setHoveredDistrictId(null)}
                      onClick={() => setSelectedDistrictId(isSelected ? null : dist.id)}
                    />
                  );
                })}
              </g>

              {/* District Center Markers & Labels */}
              <g className="pointer-events-none">
                {WB_DISTRICTS.map((dist) => {
                  const isHovered = hoveredDistrictId === dist.id;
                  const isSelected = selectedDistrictId === dist.id;
                  const isActive = isHovered || isSelected;
                  const isDimmed = selectedDistrictId !== null && !isSelected;

                  return (
                    <g key={`marker-${dist.id}`} style={{ opacity: isDimmed ? 0.4 : 1, transition: 'opacity 0.3s ease' }}>
                      <circle
                        cx={dist.cx}
                        cy={dist.cy}
                        r={isActive ? 4 : 2.5}
                        fill={isActive ? "#FFFFFF" : "#1E3A8A"}
                        stroke={isActive ? "#1E3A8A" : "#FFFFFF"}
                        strokeWidth={1.5}
                        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                      />
                      <text
                        x={dist.cx}
                        y={dist.cy - 7}
                        textAnchor="middle"
                        className="select-none tracking-tight"
                        style={{
                          fontSize: isActive ? "12px" : "8.5px",
                          fill: isActive ? "#0F172A" : "#1E3A8A",
                          fontWeight: isActive ? 900 : 700,
                          paintOrder: "stroke",
                          stroke: "#FFFFFF",
                          strokeWidth: isActive ? "3.5px" : "2.5px",
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        {dist.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
            
            {/* Map Legend */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-xl p-4 shadow-lg pointer-events-none">
              <div className="text-[11px] font-extrabold text-[#1E293B] mb-2.5 uppercase tracking-widest">{mode} Density</div>
              <div className="flex items-center gap-2">
                <div className={clsx(
                  "w-36 h-3 rounded-full bg-gradient-to-r border border-[#E2E8F0]",
                  mode === "Growth" ? "from-[#D1FAE5] to-[#047857]" :
                  mode === "Students" ? "from-[#EDE9FE] to-[#5B21B6]" :
                  mode === "Enrolment" ? "from-[#E0F2FE] to-[#0369A1]" :
                  "from-[#DBEAFE] to-[#1E3A8A]"
                )} />
              </div>
            </div>
          </div>

          {/* Right: District Leaders or Detailed View */}
          <div className="lg:w-1/3 flex flex-col bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] rounded-2xl border-2 border-blue-400/50 p-6 relative overflow-hidden shadow-2xl shadow-blue-900/5">
            
            <AnimatePresence mode="wait">
              {selectedData ? (
                /* DETAILED DISTRICT VIEW */
                <motion.div 
                  key="detail-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col h-full"
                >
                  <button 
                    onClick={() => setSelectedDistrictId(null)}
                    className="absolute top-4 right-4 p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-white rounded-full transition-all shadow-sm border border-transparent hover:border-[#E2E8F0]"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>

                  <div className="flex items-center gap-2 mb-1.5 mt-1">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <MapPin size={16} className="text-blue-600" />
                    </div>
                    <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">District Profile</span>
                  </div>
                  
                  <h3 className="text-[32px] font-black text-[#0F172A] mb-6 tracking-tight leading-none drop-shadow-sm">
                    {selectedData.name}
                  </h3>

                  <div className="flex-1 flex flex-col gap-4">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Stat Card 1 */}
                      <div className="bg-gradient-to-br from-white to-blue-50/80 p-3.5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-blue-600 mb-1.5">
                          <Building2 size={14} />
                          <span className="text-[10px] font-extrabold uppercase tracking-wider">Institutions</span>
                        </div>
                        <span className="text-[24px] font-black text-[#0F172A]">{selectedData.institutions}</span>
                      </div>

                      {/* Stat Card 2 */}
                      <div className="bg-gradient-to-br from-white to-purple-50/80 p-3.5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-purple-600 mb-1.5">
                          <Users size={14} />
                          <span className="text-[10px] font-extrabold uppercase tracking-wider">Students</span>
                        </div>
                        <span className="text-[24px] font-black text-[#0F172A]">{(selectedData.students / 100000).toFixed(1)}L</span>
                      </div>

                      {/* Stat Card 3 */}
                      <div className="bg-gradient-to-br from-white to-sky-50/80 p-3.5 rounded-xl border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-sky-600 mb-1.5">
                          <Globe2 size={14} />
                          <span className="text-[10px] font-extrabold uppercase tracking-wider">Enrolment</span>
                        </div>
                        <span className="text-[24px] font-black text-[#0F172A]">{selectedData.enrolment}%</span>
                      </div>

                      {/* Stat Card 4 */}
                      <div className="bg-gradient-to-br from-white to-emerald-50/80 p-3.5 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1.5">
                          <TrendingUp size={14} />
                          <span className="text-[10px] font-extrabold uppercase tracking-wider">Growth</span>
                        </div>
                        <span className="text-[24px] font-black text-[#0F172A]">{selectedData.growth}</span>
                      </div>
                    </div>

                    {/* Dynamic Pie Chart */}
                    <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col flex-1 min-h-[220px]">
                      <h4 className="text-[11px] font-extrabold text-[#64748B] uppercase tracking-widest text-center mb-1">Metrics Breakdown</h4>
                      <div className="flex-1 w-full relative">
                        <ReactECharts 
                          option={getPieChartOption(selectedData.id)} 
                          style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
                    <button className="w-full py-3.5 rounded-xl text-[13px] font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                      Open Full District Report
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* DISTRICT LEADERS VIEW */
                <motion.div 
                  key="leaders-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={18} className="text-[#0F172A]" />
                    <h3 className="text-[14px] font-extrabold text-[#0F172A] uppercase tracking-widest">District Leaders: {mode}</h3>
                  </div>
                  
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {sortedDistricts.map((dist, idx) => {
                      const val = getLeaderValue(dist);
                      const topValNum = parseFloat(getLeaderValue(sortedDistricts[0]).toString().replace(/[^0-9.]/g, ''));
                      const currValNum = parseFloat(val.toString().replace(/[^0-9.]/g, ''));
                      const pct = (currValNum / topValNum) * 100;

                      return (
                        <div 
                          key={dist.id} 
                          className="relative group bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all transform hover:-translate-y-0.5"
                          onClick={() => setSelectedDistrictId(dist.id)}
                          onMouseEnter={() => setHoveredDistrictId(dist.id)}
                          onMouseLeave={() => setHoveredDistrictId(null)}
                        >
                          <div className="flex items-center gap-3 mb-2.5">
                            <div className="text-[#94A3B8] font-black text-[14px] w-6 bg-slate-50 text-center rounded-md py-0.5">{String(idx + 1).padStart(2, '0')}</div>
                            <div className="font-extrabold text-[#0F172A] text-[15px] flex-1 group-hover:text-blue-600 transition-colors">{dist.name}</div>
                            <div className={clsx("font-black text-[17px]", mode === "Growth" ? "text-[#059669]" : mode === "Students" ? "text-[#7C3AED]" : mode === "Enrolment" ? "text-[#0284C7]" : "text-[#1D4ED8]")}>{val}</div>
                          </div>
                          <div className="pl-10">
                            <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                              <div 
                                className={clsx("h-full rounded-full transition-all duration-1000 ease-out", getLeaderBarColor())} 
                                style={{ width: `${pct}%` }} 
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-5 pt-5 border-t border-[#E2E8F0]">
                    <button className="w-full py-3 rounded-xl text-[13px] font-extrabold text-[#0F172A] bg-white border-2 border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-slate-50 transition-all shadow-sm">
                      View Complete Analysis
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* CUSTOM HOVER POPUP */}
      <AnimatePresence>
        {hoveredData && !selectedData && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none bg-gradient-to-b from-[#1E293B] to-[#0F172A] text-white rounded-xl shadow-2xl p-4 w-60 border border-slate-700/50"
            style={{ left: mousePos.x + 20, top: mousePos.y + 20 }}
          >
            <div className="font-black text-[16px] border-b border-slate-700 pb-2.5 mb-3 flex items-center justify-between">
              {hoveredData.name}
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-300 font-bold uppercase tracking-wide">Institutions</span>
                <span className="text-[14px] font-black text-blue-300">{hoveredData.institutions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-300 font-bold uppercase tracking-wide">Students</span>
                <span className="text-[14px] font-black text-purple-300">{(hoveredData.students / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-300 font-bold uppercase tracking-wide">Enrolment</span>
                <span className="text-[14px] font-black text-sky-300">{hoveredData.enrolment}%</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-700 pt-2.5 mt-1.5">
                <span className="text-[12px] text-slate-300 font-bold uppercase tracking-wide">Growth YoY</span>
                <span className="text-[14px] font-black text-emerald-400">{hoveredData.growth}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click for details</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94A3B8; }
      `}} />
    </section>
  );
}
