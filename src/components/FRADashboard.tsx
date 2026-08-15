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

  // --- YoY Chart State ---
  const [courseLevel, setCourseLevel] = useState("All");
  const [collegeName, setCollegeName] = useState("All");
  const [hoveredYoY, setHoveredYoY] = useState<{
    program: string;
    year: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const [hoveredDonut, setHoveredDonut] = useState<string | null>(null);

  const [selectedFeeRange, setSelectedFeeRange] = useState<{ course: string; type: string; value: number; x: number; y: number } | null>(null);
  const [selectedYoY, setSelectedYoY] = useState<{ program: string; year: string; value: number; x: number; y: number } | null>(null);
  const [selectedYoYCourseWise, setSelectedYoYCourseWise] = useState<{ program: string; year: string } | null>(null);
  const [selectedFeeDiff, setSelectedFeeDiff] = useState<string | null>(null);

  // Year on Year Average Fee Data
  const yoyData = [
    {
      program: "Master of Pharmacy",
      years: [
        { year: "2023-24", value: 100831 },
        { year: "2024-25", value: 106825 },
        { year: "2025-26", value: 109837 },
      ],
    },
    {
      program: "Bachelor of Design",
      years: [
        { year: "2023-24", value: 102279 },
        { year: "2024-25", value: 110105 },
        { year: "2025-26", value: 99110 },
      ],
    },
    {
      program: "Bachelor of Architecture",
      years: [
        { year: "2023-24", value: 98103 },
        { year: "2024-25", value: 104801 },
        { year: "2025-26", value: 109110 },
      ],
    },
    {
      program: "Bachelor of Hotel Management and Catering Technology",
      years: [
        { year: "2023-24", value: 102805 },
        { year: "2024-25", value: 98424 },
        { year: "2025-26", value: 89894 },
      ],
    },
    {
      program: "Master of Architecture",
      years: [
        { year: "2023-24", value: 91462 },
        { year: "2024-25", value: 90679 },
        { year: "2025-26", value: 95912 },
      ],
    },
    {
      program: "Master of Business Administration/M. of Management Studies",
      years: [
        { year: "2023-24", value: 87089 },
        { year: "2024-25", value: 93551 },
        { year: "2025-26", value: 95179 },
      ],
    },
    {
      program: "Bachelor in Fine Art",
      years: [
        { year: "2023-24", value: 75731 },
        { year: "2024-25", value: 84491 },
        { year: "2025-26", value: 87942 },
      ],
    },
    {
      program: "Doctor of Pharmacy (Pharm D)",
      years: [
        { year: "2023-24", value: 75372 },
        { year: "2024-25", value: 84007 },
        { year: "2025-26", value: 87570 },
      ],
    },
    {
      program: "Bachelor of Pharmacy",
      years: [
        { year: "2023-24", value: 75995 },
        { year: "2024-25", value: 79654 },
        { year: "2025-26", value: 81613 },
      ],
    },
    {
      program: "Master of Computer Application",
      years: [
        { year: "2023-24", value: 72660 },
        { year: "2024-25", value: 78359 },
        { year: "2025-26", value: 81514 },
      ],
    },
    {
      program: "Master of Engineering/Masters of Technology",
      years: [
        { year: "2023-24", value: 65195 },
        { year: "2024-25", value: 66204 },
        { year: "2025-26", value: 68266 },
      ],
    },
    {
      program: "Master of Business Administration-Part Time",
      years: [
        { year: "2023-24", value: 49486 },
        { year: "2024-25", value: 49902 },
        { year: "2025-26", value: 56870 },
      ],
    },
    {
      program: "Dual Degree in Master of Computer Application",
      years: [
        { year: "2023-24", value: 46140 },
        { year: "2024-25", value: 46140 },
        { year: "2025-26", value: 46140 },
      ],
    },
    {
      program: "Master of Hotel Management and Catering Technology",
      years: [
        { year: "2023-24", value: 25000 },
        { year: "2024-25", value: 45046 },
        { year: "2025-26", value: 48889 },
      ],
    },
    {
      program: "Bachelor of Laws (3 Years)",
      years: [
        { year: "2023-24", value: 19000 },
        { year: "2024-25", value: 22000 },
        { year: "2025-26", value: 24000 },
      ],
    },
    {
      program: "Bachelor of Laws (5 Years)",
      years: [
        { year: "2023-24", value: 15000 },
        { year: "2024-25", value: 17000 },
        { year: "2025-26", value: 19000 },
      ],
    },
    {
      program: "Bachelor of Engineering/Bachelor of Technology",
      years: [
        { year: "2023-24", value: 82000 },
        { year: "2024-25", value: 86000 },
        { year: "2025-26", value: 89423 },
      ],
    },
    {
      program: "Bachelor of Hotel Management",
      years: [
        { year: "2023-24", value: 78000 },
        { year: "2024-25", value: 82000 },
        { year: "2025-26", value: 85000 },
      ],
    },
  ];

  const yoyBarColors = ["#60a5fa", "#0284c7", "#0c3b6e"];
  const yoyGradients = [
    "linear-gradient(to top, #3b82f6, #93c5fd)",
    "linear-gradient(to top, #0284c7, #38bdf8)",
    "linear-gradient(to top, #0c3b6e, #1e40af)",
  ];
  const yoyMaxValue = 120000;

  // Stacked Chart Data - all courses
  const feeRangeData = [
    { course: "Doctor of Pharmacy (Pharm D)", min: 67567, avg: 87570, max: 158261 },
    { course: "Bachelor of Design", min: 59090, avg: 99110, max: 139130 },
    { course: "Bachelor of Hotel Management and Catering Technology", min: 50576, avg: 89894, max: 165217 },
    { course: "Master of Hotel Management and Catering Technology", min: 48889, avg: 48889, max: 48889 },
    { course: "Dual Degree in Master of Computer Application", min: 46140, avg: 46140, max: 46140 },
    { course: "Master of Business Administration-Part Time", min: 45045, avg: 56870, max: 68696 },
    { course: "Bachelor in Fine Art", min: 0, avg: 87942, max: 183334 },
    { course: "Master of Pharmacy", min: 0, avg: 109837, max: 217391 },
    { course: "Master of Engineering/Masters of Technology", min: 0, avg: 68266, max: 141228 },
    { course: "Master of Business Administration/M. of Management", min: 0, avg: 95179, max: 374782 },
    { course: "Bachelor of Laws (3 Years)", min: 54585, avg: 54585, max: 54585 },
    { course: "Bachelor of Laws (5 Years)", min: 82174, avg: 82174, max: 82174 },
    { course: "Bachelor of Architecture", min: 34546, avg: 109110, max: 219697 },
    { course: "Master of Architecture", min: 33185, avg: 95912, max: 234666 },
    { course: "Bachelor of Pharmacy", min: 0, avg: 81613, max: 196087 },
    { course: "Master of Computer Application", min: 0, avg: 81514, max: 203478 },
    { course: "Bachelor of Engineering/Bachelor of Technology", min: 0, avg: 89423, max: 198696 },
  ];

  const formatCurrency = (num: number) => {
    return "₹ " + num.toLocaleString("en-IN");
  };

  // Stacked Chart Math - max sum across all courses
  const globalMaxStack = Math.max(...feeRangeData.map((d) => d.min + d.avg + d.max));

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn pb-8">
      {/* PRIMARY CARD: Course-wise Stacked Fee Range Chart */}
      <div
        onClick={() => setSelectedFeeRange(null)}
        className={`rounded-3xl shadow-soft transition-all duration-300 p-6 flex flex-col gap-6 w-full relative overflow-hidden min-h-[480px] ${
          selectedFeeRange !== null
            ? "bg-[#e9f2fc] border border-blue-200/60"
            : "bg-slate-50/40 hover:bg-[#e9f2fc] border border-slate-100 hover:border-blue-200/60"
        }`}
      >
        
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
          <div className="relative h-[360px] flex items-end justify-start gap-6 px-6 mt-6 select-none pb-16 pt-6" style={{ width: `${feeRangeData.length * 170}px` }}>
            
            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-16 pt-6 pr-4">
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
            </div>

            {/* Bars */}
            {feeRangeData.map((item) => {
              const minHeight = (item.min / globalMaxStack) * 100;
              const avgHeight = (item.avg / globalMaxStack) * 100;
              const maxHeight = (item.max / globalMaxStack) * 100;

              const isAnySelected = selectedFeeRange !== null;
              const isMaxSelected = selectedFeeRange?.course === item.course && selectedFeeRange?.type === "Maximum Fee";
              const isAvgSelected = selectedFeeRange?.course === item.course && selectedFeeRange?.type === "Average Fee";
              const isMinSelected = selectedFeeRange?.course === item.course && selectedFeeRange?.type === "Minimum Fee";
              const isBarSelected = selectedFeeRange?.course === item.course;

              return (
                <div key={item.course} className="flex flex-col items-center relative" style={{ width: "150px", flexShrink: 0 }}>
                  
                  {/* Stack Container */}
                  <div
                    style={{
                      height: "260px",
                      transform: isBarSelected ? "scale(1.03)" : "none",
                      boxShadow: isBarSelected ? "0 0 12px rgba(2, 132, 199, 0.4)" : "none"
                    }}
                    className="w-36 flex flex-col justify-end rounded-lg overflow-hidden border border-slate-200/20 shadow-sm transition-all duration-300"
                  >
                    
                    {/* Maximum Fee (Dark Teal Blue) */}
                    <div
                      style={{
                        height: `${maxHeight}%`,
                        opacity: isAnySelected ? (isMaxSelected ? 1 : 0.25) : 1,
                        filter: isAnySelected && !isMaxSelected ? "grayscale(40%)" : "none"
                      }}
                      className="bg-gradient-to-t from-[#005f96] to-[#0088cc] hover:brightness-105 transition-all cursor-pointer flex items-center justify-center text-[13px] font-black text-white px-1 select-none text-center rounded-t-[7px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFeeRange(isMaxSelected ? null : { course: item.course, type: "Maximum Fee", value: item.max, x: e.clientX, y: e.clientY });
                      }}
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

                    {/* Average Fee (Sky Blue) */}
                    <div
                      style={{
                        height: `${avgHeight}%`,
                        opacity: isAnySelected ? (isAvgSelected ? 1 : 0.25) : 1,
                        filter: isAnySelected && !isAvgSelected ? "grayscale(40%)" : "none"
                      }}
                      className={`bg-gradient-to-t from-[#7bb4f3] to-[#b3d7ff] hover:brightness-105 transition-all cursor-pointer flex items-center justify-center text-[13px] font-black text-[#0c3b6e] px-1 select-none text-center ${item.min === 0 ? "rounded-b-[7px]" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFeeRange(isAvgSelected ? null : { course: item.course, type: "Average Fee", value: item.avg, x: e.clientX, y: e.clientY });
                      }}
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
                    {item.min > 0 && (
                      <div
                        style={{
                          height: `${minHeight}%`,
                          opacity: isAnySelected ? (isMinSelected ? 1 : 0.25) : 1,
                          filter: isAnySelected && !isMinSelected ? "grayscale(40%)" : "none"
                        }}
                        className="bg-gradient-to-t from-[#828282] to-[#b8b8b8] hover:brightness-105 transition-all cursor-pointer flex items-center justify-center text-[13px] font-black text-white px-1 select-none text-center rounded-b-[7px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFeeRange(isMinSelected ? null : { course: item.course, type: "Minimum Fee", value: item.min, x: e.clientX, y: e.clientY });
                        }}
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
                    )}

                  </div>

                  {/* X-Axis labels */}
                  <div className="text-[12px] font-black text-brand-900 mt-3 text-center h-14 overflow-hidden text-ellipsis line-clamp-3 select-none px-1 leading-tight w-full">
                    {item.course}
                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* Dynamic Tooltip Overlay */}
        {(selectedFeeRange || hoveredSegment) && (() => {
          const activeSegment = selectedFeeRange || hoveredSegment;
          if (!activeSegment) return null;
          return (
            <div 
              className="fixed bg-blue-50/95 border border-blue-200/80 p-3 rounded-xl shadow-lg z-50 pointer-events-none backdrop-blur-sm transition-all duration-75 text-[13px] font-extrabold max-w-[300px]"
              style={{ 
                left: `${activeSegment.x + 15}px`, 
                top: `${activeSegment.y - 10}px` 
              }}
            >
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="text-slate-400 font-bold w-14">Course</span>
                  <span className="text-brand-950 flex-1">{activeSegment.course}</span>
                </div>
                <div className="flex gap-2 border-t border-blue-200/40 pt-1 mt-1">
                  <span className="text-slate-400 font-bold w-14">{activeSegment.type}</span>
                  <span className="text-brand-900">{formatCurrency(activeSegment.value)}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Legend */}
        <div className="flex justify-center items-center gap-8 text-sm font-bold text-slate-700 mt-2 border-t border-slate-100/50 pt-4 select-none">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#9e9e9e]" style={{ boxShadow: '0 2px 8px #9e9e9e80' }} />
            Minimum Fee
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#90caf9]" style={{ boxShadow: '0 2px 8px #90caf980' }} />
            Average Fee
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#0077b6]" style={{ boxShadow: '0 2px 8px #0077b680' }} />
            Maximum Fee
          </span>
        </div>

      </div>

      {/* SECONDARY CARD: Year on Year Average Fee by Program */}
      <div
        onClick={() => setSelectedYoY(null)}
        className={`rounded-3xl shadow-soft transition-all duration-300 p-6 flex flex-col gap-6 w-full relative overflow-hidden min-h-[440px] ${
          selectedYoY !== null
            ? "bg-[#e9f2fc] border border-blue-200/60"
            : "bg-slate-50/40 hover:bg-[#e9f2fc] border border-slate-100 hover:border-blue-200/60"
        }`}
      >

        {/* Header Row with Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Course Level Filter */}
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs font-bold text-brand-600 tracking-wide">Course Level</label>
            <select
              value={courseLevel}
              onChange={(e) => setCourseLevel(e.target.value)}
              className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-600/30 cursor-pointer appearance-none"
            >
              <option value="All">All</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
            </select>
          </div>

          {/* Title */}
          <h3 className="text-lg font-extrabold text-brand-900 tracking-tight text-center flex-1">
            Year on Year Average Fee by Program (In ₹)
          </h3>

          {/* College Name Filter */}
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs font-bold text-brand-600 tracking-wide">College Name</label>
            <select
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-600/30 cursor-pointer appearance-none"
            >
              <option value="All">All</option>
            </select>
          </div>
        </div>

        {/* Grouped Bar Chart */}
        <div className="w-full overflow-x-auto scrollbar-thin pb-4 relative">
          <div className="relative h-[320px] flex items-end justify-start gap-10 px-6 mt-2 select-none pb-14 pt-6" style={{ width: `${yoyData.length * 190}px` }}>

            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-14 pt-6 pr-4">
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
            </div>

            {/* Bar Groups */}
              {yoyData.map((item) => (
                <div key={item.program} className="flex flex-col items-center relative" style={{ width: "140px", flexShrink: 0 }}>
                  {/* Bars row */}
                  <div className="flex items-end gap-1 h-52">
                    {item.years.map((yr, idx) => {
                      const barHeight = (yr.value / yoyMaxValue) * 100;
                      const isSelected = selectedYoY?.program === item.program && selectedYoY?.year === yr.year;
                      const isAnySelected = selectedYoY !== null;

                      return (
                        <div
                          key={yr.year}
                          className="w-8 rounded-t-md cursor-pointer transition-all duration-200 hover:brightness-110 relative group flex items-end justify-center"
                          style={{
                            height: `${barHeight}%`,
                            background: yoyGradients[idx],
                            opacity: isAnySelected ? (isSelected ? 1 : 0.25) : 1,
                            filter: isAnySelected && !isSelected ? "grayscale(40%)" : "none",
                            transform: isSelected ? "scale(1.08)" : "none",
                            boxShadow: isSelected ? "0 0 10px rgba(96, 165, 250, 0.6)" : "none",
                            zIndex: isSelected ? 30 : 10
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedYoY(isSelected ? null : { program: item.program, year: yr.year, value: yr.value, x: e.clientX, y: e.clientY });
                          }}
                          onMouseEnter={(e) => {
                            setHoveredYoY({
                              program: item.program,
                              year: yr.year,
                              value: yr.value,
                              x: e.clientX,
                              y: e.clientY,
                            });
                          }}
                          onMouseMove={(e) => {
                            if (hoveredYoY) {
                              setHoveredYoY({
                                ...hoveredYoY,
                                x: e.clientX,
                                y: e.clientY,
                              });
                            }
                          }}
                          onMouseLeave={() => setHoveredYoY(null)}
                        >
                          {/* Value label inside bar, rotated */}
                          <span
                            className="absolute text-[11px] font-black text-white select-none whitespace-nowrap"
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              bottom: "6px",
                              color: "#fff",
                            }}
                          >
                            {yr.value.toLocaleString("en-IN")}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* X-Axis label */}
                  <div className="text-xs font-black text-brand-900 mt-3 text-center h-12 overflow-hidden text-ellipsis line-clamp-3 select-none px-1 leading-tight">
                    {item.program}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* YoY Tooltip */}
        {(selectedYoY || hoveredYoY) && (() => {
          const active = selectedYoY || hoveredYoY;
          if (!active) return null;
          return (
            <div
              className="fixed bg-blue-50/95 border border-blue-200/80 p-3 rounded-xl shadow-lg z-50 pointer-events-none backdrop-blur-sm transition-all duration-75 text-[12px] font-extrabold max-w-[280px]"
              style={{
                left: `${active.x + 15}px`,
                top: `${active.y - 10}px`,
              }}
            >
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="text-slate-400 font-bold w-14">Program</span>
                  <span className="text-brand-950 flex-1">{active.program}</span>
                </div>
                <div className="flex gap-2 border-t border-blue-200/40 pt-1 mt-1">
                  <span className="text-slate-400 font-bold w-14">{active.year}</span>
                  <span className="text-brand-900">₹ {active.value.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Legend */}
        <div className="flex justify-center items-center gap-8 text-sm font-bold text-slate-700 mt-2 border-t border-slate-100/50 pt-4 select-none">
          {["2023-24", "2024-25", "2025-26"].map((yr, idx) => (
            <span key={yr} className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: yoyBarColors[idx], boxShadow: `0 2px 8px ${yoyBarColors[idx]}80` }}
              />
              {yr}
            </span>
          ))}
        </div>

      </div>

      {/* ROW: Donut Chart + Horizontal Bar Chart side by side */}
      <div className="flex flex-col lg:flex-row gap-8 w-full">

        {/* LEFT CARD: Course-wise Institution Donut Chart */}
        <div className="bg-slate-50/40 hover:bg-[#e9f2fc] rounded-3xl border border-slate-100 hover:border-blue-200/60 shadow-soft transition-all duration-300 p-6 flex flex-col gap-4 flex-1 relative overflow-hidden min-h-[420px]">
          <h3 className="text-base font-extrabold text-brand-900 tracking-tight border-b border-slate-100 pb-3">
            Course-wise Institution : FRA (Unaided Private Colleges)
          </h3>

          {(() => {
            const donutData = [
              { label: "Bachelor of Pharmacy", value: 424, pct: "24%", color: "#0c4a8a" },
              { label: "Master of Business Administration", value: 312, pct: "18%", color: "#0284c7" },
              { label: "Bachelor of Engineering", value: 305, pct: "17%", color: "#1d4ed8" },
              { label: "Master of Engineering", value: 153, pct: "9%", color: "#7c3aed" },
              { label: "Bachelor of Architecture", value: 135, pct: "8%", color: "#db2777" },
              { label: "Master of Computer Application", value: 110, pct: "6%", color: "#eab308" },
              { label: "Bachelor of Hotel Mgmt", value: 105, pct: "6%", color: "#16a34a" },
              { label: "Master of Pharmacy", value: 103, pct: "6%", color: "#ea580c" },
              { label: "Bachelor of Design", value: 57, pct: "3%", color: "#06b6d4" },
              { label: "Others", value: 7, pct: "0%", color: "#94a3b8" },
            ];
            const total = donutData.reduce((s, d) => s + d.value, 0);
            const size = 240;
            const cx = size / 2;
            const cy = size / 2;
            const outerR = 105;
            const innerR = 60;
            let cumAngle = -90;

            return (
              <div className="flex items-center justify-center flex-1 gap-6 flex-wrap">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
                  {donutData.map((seg) => {
                    const angle = (seg.value / total) * 360;
                    const startAngle = cumAngle;
                    const endAngle = cumAngle + angle;
                    cumAngle = endAngle;

                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const largeArc = angle > 180 ? 1 : 0;

                    const x1 = cx + outerR * Math.cos(startRad);
                    const y1 = cy + outerR * Math.sin(startRad);
                    const x2 = cx + outerR * Math.cos(endRad);
                    const y2 = cy + outerR * Math.sin(endRad);
                    const x3 = cx + innerR * Math.cos(endRad);
                    const y3 = cy + innerR * Math.sin(endRad);
                    const x4 = cx + innerR * Math.cos(startRad);
                    const y4 = cy + innerR * Math.sin(startRad);

                    const d = [
                      `M ${x1} ${y1}`,
                      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
                      `L ${x3} ${y3}`,
                      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
                      "Z",
                    ].join(" ");

                    // Label position
                    const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
                    const labelR = outerR + 18;
                    const lx = cx + labelR * Math.cos(midAngle);
                    const ly = cy + labelR * Math.sin(midAngle);

                    const isHovered = hoveredDonut === seg.label;
                    const someActive = hoveredDonut !== null;
                    const opacity = someActive ? (isHovered ? 1 : 0.3) : 1;
                    const filter = someActive && !isHovered ? "grayscale(45%)" : "none";

                    return (
                      <g key={seg.label}>
                        <path
                          d={d}
                          fill={seg.color}
                          stroke="white"
                          strokeWidth={isHovered ? "3.5" : "2"}
                          className="transition-all duration-300 cursor-pointer"
                          style={{
                            opacity,
                            filter,
                          }}
                          onMouseEnter={() => setHoveredDonut(seg.label)}
                          onMouseLeave={() => setHoveredDonut(null)}
                        />
                        {seg.value > 50 && (
                          <text
                            x={lx}
                            y={ly}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-[9px] font-black fill-slate-700 select-none pointer-events-none transition-opacity duration-300"
                            style={{ opacity: someActive && !isHovered ? 0.2 : 1 }}
                          >
                            {seg.value} ({seg.pct})
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="flex flex-col gap-1.5 text-[11px] font-bold text-slate-700 select-none">
                  {donutData.map((seg) => {
                    const isSelected = hoveredDonut === seg.label;
                    const someActive = hoveredDonut !== null;
                    return (
                      <span
                        key={seg.label}
                        className={`flex items-center gap-2 cursor-pointer transition-all duration-350 p-1 rounded-lg ${
                          isSelected ? "bg-brand-50 font-black text-brand-900 scale-[1.03]" : (someActive ? "opacity-30" : "hover:bg-slate-50")
                        }`}
                        onMouseEnter={() => setHoveredDonut(seg.label)}
                        onMouseLeave={() => setHoveredDonut(null)}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white/20 transition-all duration-350"
                          style={{
                            backgroundColor: seg.color,
                            boxShadow: isSelected ? `0 2px 8px ${seg.color}cc` : `0 1px 4px ${seg.color}60`,
                            transform: isSelected ? "scale(1.15)" : "none"
                          }}
                        />
                        <span className="truncate max-w-[160px]">{seg.label}</span>
                        <span className="text-slate-400 ml-auto pl-2">{seg.value}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* RIGHT CARD: Year on Year Course wise Institutes - Horizontal Bar Chart */}
        <div
          onClick={() => setSelectedYoYCourseWise(null)}
          className={`rounded-3xl shadow-soft transition-all duration-300 p-6 flex flex-col gap-4 flex-1 relative overflow-hidden min-h-[420px] ${
            selectedYoYCourseWise !== null
              ? "bg-[#e9f2fc] border border-blue-200/60"
              : "bg-slate-50/40 hover:bg-[#e9f2fc] border border-slate-100 hover:border-blue-200/60"
          }`}
        >
          <h3 className="text-base font-extrabold text-brand-900 tracking-tight border-b border-slate-100 pb-3">
            Year on Year Course wise Institutes (FRA - Unaided Private)
          </h3>

          {(() => {
            const hBarData = [
              {
                program: "Bachelor of Pharmacy",
                short: "Bachelor of Ph...",
                years: [
                  { year: "2023-24", value: 376 },
                  { year: "2024-25", value: 381 },
                  { year: "2025-26", value: 424 },
                ],
              },
              {
                program: "Master of Business Administration",
                short: "Master of Busi...",
                years: [
                  { year: "2023-24", value: 306 },
                  { year: "2024-25", value: 299 },
                  { year: "2025-26", value: 312 },
                ],
              },
              {
                program: "Bachelor of Engineering",
                short: "Bachelor of En...",
                years: [
                  { year: "2023-24", value: 303 },
                  { year: "2024-25", value: 298 },
                  { year: "2025-26", value: 305 },
                ],
              },
              {
                program: "Master of Engineering",
                short: "Master of Engi...",
                years: [
                  { year: "2023-24", value: 163 },
                  { year: "2024-25", value: 159 },
                  { year: "2025-26", value: 153 },
                ],
              },
              {
                program: "Bachelor of Architecture",
                short: "Bachelor of Ar...",
                years: [
                  { year: "2023-24", value: 125 },
                  { year: "2024-25", value: 129 },
                  { year: "2025-26", value: 135 },
                ],
              },
              {
                program: "Master of Computer Application",
                short: "Master of Comp...",
                years: [
                  { year: "2023-24", value: 98 },
                  { year: "2024-25", value: 104 },
                  { year: "2025-26", value: 110 },
                ],
              },
              {
                program: "Bachelor of Hotel Mgmt",
                short: "Bachelor of Ho...",
                years: [
                  { year: "2023-24", value: 95 },
                  { year: "2024-25", value: 99 },
                  { year: "2025-26", value: 105 },
                ],
              },
              {
                program: "Master of Pharmacy",
                short: "Master of Phar...",
                years: [
                  { year: "2023-24", value: 90 },
                  { year: "2024-25", value: 96 },
                  { year: "2025-26", value: 103 },
                ],
              },
              {
                program: "Bachelor of Design",
                short: "Bachelor of De...",
                years: [
                  { year: "2023-24", value: 48 },
                  { year: "2024-25", value: 52 },
                  { year: "2025-26", value: 57 },
                ],
              },
              {
                program: "Others",
                short: "Others",
                years: [
                  { year: "2023-24", value: 5 },
                  { year: "2024-25", value: 6 },
                  { year: "2025-26", value: 7 },
                ],
              },
            ];
            const hBarColors = ["#60a5fa", "#0284c7", "#0c3b6e"];
            const hBarMax = 450;
            const isAnySelected = selectedYoYCourseWise !== null;

            return (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 overflow-y-auto overflow-x-auto scrollbar-thin flex flex-col gap-5 pr-2 max-h-[290px] mb-4">
                  <div className="min-w-[360px] flex flex-col gap-4.5">
                    {hBarData.map((item) => (
                      <div key={item.program} className="flex items-center gap-3">
                        {/* Label */}
                        <div className="w-[120px] flex-shrink-0 text-[11px] font-black text-brand-900 text-right truncate" title={item.program}>
                          {item.short}
                        </div>
                        {/* Bars */}
                        <div className="flex flex-col gap-1 flex-1">
                          {item.years.map((yr, idx) => {
                            const isSelected = selectedYoYCourseWise?.program === item.program && selectedYoYCourseWise?.year === yr.year;
                            return (
                              <div
                                key={yr.year}
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedYoYCourseWise(isSelected ? null : { program: item.program, year: yr.year });
                                }}
                                style={{
                                  opacity: isAnySelected ? (isSelected ? 1 : 0.25) : 1,
                                  filter: isAnySelected && !isSelected ? "grayscale(40%)" : "none",
                                  transform: isSelected ? "scale(1.02)" : "none",
                                  transition: "all 0.3s ease"
                                }}
                              >
                                <div
                                  className="h-4.5 rounded-r-md transition-all duration-300 hover:brightness-110"
                                  style={{
                                    width: `${(yr.value / hBarMax) * 100}%`,
                                    backgroundColor: hBarColors[idx],
                                    boxShadow: isSelected ? `0 0 8px ${hBarColors[idx]}` : "none"
                                  }}
                                />
                                <span className="text-[10px] font-black text-brand-900 whitespace-nowrap">
                                  {yr.value.toLocaleString("en-IN")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center items-center gap-6 text-xs font-bold text-slate-700 mt-2 border-t border-slate-100/50 pt-3 select-none">
                  {["2023-24", "2024-25", "2025-26"].map((yr, idx) => (
                    <span key={yr} className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: hBarColors[idx], boxShadow: `0 2px 6px ${hBarColors[idx]}80` }}
                      />
                      {yr}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

      </div>

      {/* CARD: Course-wise Maximum Fee Difference */}
      <div
        onClick={() => setSelectedFeeDiff(null)}
        className={`rounded-3xl shadow-soft transition-all duration-300 p-6 flex flex-col gap-6 w-full relative overflow-hidden min-h-[380px] ${
          selectedFeeDiff !== null
            ? "bg-[#e9f2fc] border border-blue-200/60"
            : "bg-slate-50/40 hover:bg-[#e9f2fc] border border-slate-100 hover:border-blue-200/60"
        }`}
      >

        {/* Header */}
        <div className="text-center border-b border-slate-100 pb-4">
          <h3 className="text-lg font-extrabold text-brand-900 tracking-tight">
            Course-wise Maximum Fee Difference
          </h3>
          <p className="text-sm text-brand-600 font-bold mt-0.5">2025-26</p>
        </div>

        {(() => {
          const feeDiffData = [
            { course: "Master of Pharmacy", short: "Master of\nPharmacy", value: 52000 },
            { course: "Master of Business Administration", short: "Master of\nBusiness\nAdministrati...", value: 36500 },
            { course: "Master of Engineering/Technology", short: "Master of\nEngineering/...\nof Technology", value: 33500 },
            { course: "Bachelor of Pharmacy", short: "Bachelor of\nPharmacy", value: 33000 },
            { course: "Master of Computer Application", short: "Master of\nComputer\nApplication", value: 26000 },
            { course: "Master of Architecture", short: "Master of\nArchitecture", value: 25500 },
            { course: "Bachelor of Architecture", short: "Bachelor of\nArchitecture", value: 22500 },
            { course: "Bachelor of Engineering/Technology", short: "Bachelor of\nEngineering/...\nof Technology", value: 22000 },
          ];
          const maxVal = 55000;
          const isAnySelected = selectedFeeDiff !== null;

          return (
            <div className="w-full overflow-x-auto scrollbar-thin pb-2">
              <div className="min-w-[900px] flex items-end justify-around px-4 pt-8 pb-2 select-none" style={{ height: "280px" }}>
                {feeDiffData.map((item) => {
                  const barHeight = (item.value / maxVal) * 100;
                  const isSelected = selectedFeeDiff === item.course;
                  return (
                    <div
                      key={item.course}
                      className="flex flex-col items-center w-full max-w-[120px]"
                      style={{
                        opacity: isAnySelected ? (isSelected ? 1 : 0.25) : 1,
                        filter: isAnySelected && !isSelected ? "grayscale(40%)" : "none",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {/* Value label */}
                      <span className="text-xs font-black text-brand-900 mb-1.5" style={{ opacity: isAnySelected && !isSelected ? 0.3 : 1 }}>
                        {item.value.toLocaleString("en-IN")}
                      </span>
                      {/* Bar */}
                      <div
                        className="w-16 rounded-t-md transition-all duration-300 hover:brightness-105 cursor-pointer"
                        style={{
                          height: `${barHeight}%`,
                          background: "linear-gradient(to top, #91a0cc, #c3cded)",
                          transform: isSelected ? "scale(1.05)" : "none",
                          boxShadow: isSelected ? "0 0 10px rgba(145, 160, 204, 0.8)" : "none",
                          zIndex: isSelected ? 30 : 10
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFeeDiff(isSelected ? null : item.course);
                        }}
                      />
                      {/* X label */}
                      <div className="text-[11px] font-black text-brand-800 mt-2.5 text-center leading-tight h-14 flex items-start justify-center select-none px-1" style={{ opacity: isAnySelected && !isSelected ? 0.3 : 1 }}>
                        <span className="whitespace-pre-line text-center line-clamp-3">
                          {item.short}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

      </div>

      {/* CARD: Course-wise Fees Inflation Table */}
      <div className="bg-slate-50/40 hover:bg-[#e9f2fc] rounded-3xl border border-slate-100 hover:border-blue-200/60 shadow-soft transition-all duration-300 p-6 flex flex-col gap-6 w-full relative overflow-hidden">

        {/* Header Row with Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Course Filter */}
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs font-bold text-brand-600 tracking-wide">Course</label>
            <select className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-600/30 cursor-pointer appearance-none">
              <option value="All">All</option>
            </select>
          </div>

          {/* Title */}
          <h3 className="text-lg font-extrabold text-brand-900 tracking-tight text-center flex-1">
            Course-wise Fees Inflation
          </h3>

          {/* District & Institute Filter */}
          <div className="flex flex-col gap-1 min-w-[220px]">
            <label className="text-xs font-bold text-brand-600 tracking-wide">District & Institute Name</label>
            <select className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-600/30 cursor-pointer appearance-none">
              <option value="All">All</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto scrollbar-thin rounded-xl border border-blue-100">
          <table className="w-full text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#0c3b6e] text-white">
                <th className="px-4 py-3 text-left font-extrabold text-xs tracking-wide border-r border-blue-800/30">District</th>
                <th className="px-4 py-3 text-left font-extrabold text-xs tracking-wide border-r border-blue-800/30">Institute Name</th>
                <th className="px-4 py-3 text-left font-extrabold text-xs tracking-wide border-r border-blue-800/30">Program Name</th>
                <th className="px-4 py-3 text-right font-extrabold text-xs tracking-wide border-r border-blue-800/30">Total Fee 2024-25</th>
                <th className="px-4 py-3 text-right font-extrabold text-xs tracking-wide border-r border-blue-800/30">Total Fee 2025-26</th>
                <th className="px-4 py-3 text-right font-extrabold text-xs tracking-wide">Fee Difference ▼</th>
              </tr>
            </thead>
            <tbody>
              {[
                { district: "Ahmadnagar", institute: "PRATIBHATAI PAWAR COLLEGE OF PHARMACY", program: "Bachelor of Pharmacy", fee2425: 69500, fee2526: 76500, diff: 7000 },
                { district: "Jalgaon", institute: "K.C.E. SOCIETY'S INSTITUTE OF MANAGEMENT AND RESEARCH, JALGAON", program: "Master of Computer Application", fee2425: 69500, fee2526: 76500, diff: 7000 },
                { district: "Pune", institute: "ISB&M SCHOOL OF TECHNOLOGY", program: "Bachelor of Engineering/Bachelor of Technology", fee2425: 70000, fee2526: 77000, diff: 7000 },
                { district: "Pune", institute: "MAHARASHTRA STATE INSTITUTE OF HOTEL MANAGEMENT & CATERING TECHNOLOGY, PUNE", program: "Bachelor of Hotel Management and Catering Technology", fee2425: 70000, fee2526: 77000, diff: 7000 },
                { district: "Raigad", institute: "B K PATIL INSTITUTE OF PHARMACY", program: "Bachelor of Pharmacy", fee2425: 70000, fee2526: 77000, diff: 7000 },
                { district: "Kolhapur", institute: "KIT'S INSTITUTE OF MANAGEMENT EDUCATION & RESEARCH, KOLHAPUR", program: "Master of Computer Application", fee2425: 70000, fee2526: 77000, diff: 7000 },
                { district: "Nagpur", institute: "LOKMANYA TILAK JANKALYAN SHIKSHAN SANSTHA", program: "Master of Engineering/Masters of Technology", fee2425: 70000, fee2526: 77000, diff: 7000 },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-blue-50 transition-colors duration-150 hover:bg-blue-50/60 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                >
                  <td className="px-4 py-3 font-bold text-brand-900 text-xs border-r border-blue-50">{row.district}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700 text-xs border-r border-blue-50 max-w-[220px]">{row.institute}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700 text-xs border-r border-blue-50">{row.program}</td>
                  <td className="px-4 py-3 font-bold text-brand-900 text-xs text-right border-r border-blue-50">₹ {row.fee2425.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 font-bold text-brand-900 text-xs text-right border-r border-blue-50">{row.fee2526.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 font-extrabold text-red-600 text-xs text-right">₹ {row.diff.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
