"use client";

import React, { useEffect, useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useYear } from "@/contexts/YearContext";
import { stateOverviewData } from "@/data/overview";
import { districtsData } from "@/data/districts";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// Tiny sparkline component using ECharts
const Sparkline = ({ color, data }: { color: string, data: number[] }) => {
  const option = {
    animation: false,
    tooltip: { show: false },
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false, min: 'dataMin' },
    series: [{
      data,
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2, color },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: `${color}40` },
          { offset: 1, color: `${color}00` }
        ])
      }
    }]
  };
  return <ReactECharts option={option} style={{ height: "40px", width: "100px" }} />;
};

export default function StateSnapshot() {
  const { academicYear } = useYear();
  const overview = stateOverviewData[academicYear] || stateOverviewData["2025–26"];
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
        zoom: 1.1,
        itemStyle: {
          areaColor: "#EEF5FF", // Pastel Blue base
          borderColor: "#2563EB", // Primary Blue border
          borderWidth: 0.5,
        },
        emphasis: { disabled: true }
      },
      series: [{
        type: "map",
        geoIndex: 0,
        data: districts.map(d => ({ name: d.name, value: d.institutions }))
      }],
      visualMap: {
        min: 0, max: 200,
        inRange: { color: ["#EEF5FF", "#DBEAFE", "#2563EB"] },
        show: false
      }
    };
  };

  const sparklineData = {
    institutions: [2100, 2150, 2200, 2250, 2280, 2338, 2450],
    students: [9.8, 10.1, 10.5, 10.8, 11.2, 11.5, 12.4],
    faculty: [41.5, 42.1, 43.8, 45.0, 46.5, 47.2, 48.2],
    enrolment: [78.5, 79.0, 79.8, 81.2, 82.5, 83.0, 84.5]
  };

  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto w-full px-8 py-16 lg:py-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: TEXT */}
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-[#2563EB] font-semibold tracking-widest text-sm uppercase">
              State Overview
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black text-[#173B7A] tracking-tight leading-[1.1] mb-6"
            >
              WEST BENGAL <br />
              <span className="text-slate-900">HIGHER EDUCATION</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 leading-relaxed font-medium mb-10"
            >
              Understanding the scale, distribution and growth of higher education across the state.
            </motion.p>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center px-4 py-2 rounded-full bg-[#EEF5FF] text-[#173B7A] font-bold">
              AY {academicYear}
            </motion.div>
          </div>

          {/* RIGHT: MAP */}
          <div className="relative h-[500px] flex items-center justify-center">
            {geoJsonLoaded ? (
              <ReactECharts option={getMapOption()} style={{ height: "100%", width: "100%" }} />
            ) : (
              <div className="text-slate-400">Loading Map...</div>
            )}
          </div>
        </div>

        {/* BOTTOM: METRICS WITH SPARKLINES */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-slate-100">
          
          {/* Institutions (Blue) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-4xl font-black text-[#2563EB] tracking-tighter">{overview.institutions.value}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Institutions</div>
              </div>
              <Sparkline color="#2563EB" data={sparklineData.institutions} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-sm">
              <ArrowUpRight size={14} /> +3.2% YoY
            </div>
          </motion.div>
          
          {/* Students (Purple) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-4xl font-black text-[#8B5CF6] tracking-tighter">{overview.students.value.replace(" Lakh", "L")}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Students</div>
              </div>
              <Sparkline color="#8B5CF6" data={sparklineData.students} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-sm">
              <ArrowUpRight size={14} /> {overview.students.change} YoY
            </div>
          </motion.div>
          
          {/* Faculty (Cyan) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-4xl font-black text-[#38BDF8] tracking-tighter">{overview.faculty.value}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Faculty</div>
              </div>
              <Sparkline color="#38BDF8" data={sparklineData.faculty} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-sm">
              <ArrowUpRight size={14} /> +2.1% YoY
            </div>
          </motion.div>

          {/* Enrolment (Green) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-4xl font-black text-[#10B981] tracking-tighter">78.4%</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Enrolment</div>
              </div>
              <Sparkline color="#10B981" data={sparklineData.enrolment} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-sm">
              <ArrowUpRight size={14} /> +1.5% YoY
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
