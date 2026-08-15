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
  ];

  const yoyBarColors = ["#0c3b6e", "#0284c7", "#60a5fa"];
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
      <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#f0f6ff] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-6 w-full relative overflow-hidden min-h-[480px]">
        
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

              return (
                <div key={item.course} className="flex flex-col items-center relative" style={{ width: "150px", flexShrink: 0 }}>
                  
                  {/* Stack Container */}
                  <div className="w-36 flex flex-col justify-end rounded-lg overflow-hidden border border-slate-200/20 shadow-sm" style={{ height: "260px" }}>
                    
                    {/* Maximum Fee (Dark Teal Blue) */}
                    <div
                      style={{ height: `${maxHeight}%` }}
                      className="bg-[#0077b6] hover:bg-[#006da6] transition-colors duration-200 cursor-pointer flex items-center justify-center text-[13px] font-black text-white px-1 select-none text-center"
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
                      style={{ height: `${avgHeight}%` }}
                      className="bg-[#90caf9] hover:bg-[#7dbef0] transition-colors duration-200 cursor-pointer flex items-center justify-center text-[13px] font-black text-[#0c3b6e] px-1 select-none text-center"
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
                        style={{ height: `${minHeight}%` }}
                        className="bg-[#9e9e9e] hover:bg-[#8e8e8e] transition-colors duration-200 cursor-pointer flex items-center justify-center text-[13px] font-black text-white px-1 select-none text-center"
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
        {hoveredSegment && (
          <div 
            className="fixed bg-blue-50/95 border border-blue-200/80 p-3 rounded-xl shadow-lg z-50 pointer-events-none backdrop-blur-sm transition-all duration-75 text-[13px] font-extrabold max-w-[300px]"
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
      <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#f0f6ff] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-6 w-full relative overflow-hidden min-h-[440px]">

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
          <div className="relative min-w-[1100px] h-[320px] flex items-end justify-around px-4 mt-2 select-none pb-14 pt-6">

            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-14 pt-6 pr-4">
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
              <div className="w-full border-t border-slate-100 h-0" />
            </div>

            {/* Bar Groups */}
            <div className="w-full h-full flex items-end justify-around z-10">
              {yoyData.map((item) => (
                <div key={item.program} className="flex flex-col items-center w-full max-w-[200px] relative">
                  {/* Bars row */}
                  <div className="flex items-end gap-1 h-52">
                    {item.years.map((yr, idx) => {
                      const barHeight = (yr.value / yoyMaxValue) * 100;
                      return (
                        <div
                          key={yr.year}
                          className="w-8 rounded-t-md cursor-pointer transition-all duration-200 hover:brightness-110 relative group flex items-end justify-center"
                          style={{
                            height: `${barHeight}%`,
                            backgroundColor: yoyBarColors[idx],
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
                              color: idx === 2 ? "#0c3b6e" : "#fff",
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
        </div>

        {/* YoY Tooltip */}
        {hoveredYoY && (
          <div
            className="fixed bg-blue-50/95 border border-blue-200/80 p-3 rounded-xl shadow-lg z-50 pointer-events-none backdrop-blur-sm transition-all duration-75 text-[12px] font-extrabold max-w-[280px]"
            style={{
              left: `${hoveredYoY.x + 15}px`,
              top: `${hoveredYoY.y - 10}px`,
            }}
          >
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <span className="text-slate-400 font-bold w-14">Program</span>
                <span className="text-brand-950 flex-1">{hoveredYoY.program}</span>
              </div>
              <div className="flex gap-2 border-t border-blue-200/40 pt-1 mt-1">
                <span className="text-slate-400 font-bold w-14">{hoveredYoY.year}</span>
                <span className="text-brand-900">₹ {hoveredYoY.value.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}

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
        <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#f0f6ff] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-4 flex-1 relative overflow-hidden min-h-[420px]">
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

                    return (
                      <g key={seg.label}>
                        <path d={d} fill={seg.color} stroke="white" strokeWidth="2" className="hover:opacity-80 transition-opacity cursor-pointer" />
                        {seg.value > 50 && (
                          <text
                            x={lx}
                            y={ly}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-[9px] font-black fill-slate-700 select-none pointer-events-none"
                          >
                            {seg.value} ({seg.pct})
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="flex flex-col gap-1.5 text-[11px] font-bold text-slate-700">
                  {donutData.map((seg) => (
                    <span key={seg.label} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                      <span className="truncate max-w-[160px]">{seg.label}</span>
                      <span className="text-slate-400 ml-auto">{seg.value}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* RIGHT CARD: Year on Year Course wise Institutes - Horizontal Bar Chart */}
        <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#f0f6ff] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-4 flex-1 relative overflow-hidden min-h-[420px]">
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
            ];
            const hBarColors = ["#60a5fa", "#0284c7", "#0c3b6e"];
            const hBarMax = 450;

            return (
              <div className="flex flex-col gap-6 flex-1 justify-center">
                {hBarData.map((item) => (
                  <div key={item.program} className="flex items-center gap-3">
                    {/* Label */}
                    <div className="w-[130px] flex-shrink-0 text-xs font-black text-brand-900 text-right truncate" title={item.program}>
                      {item.short}
                    </div>
                    {/* Bars */}
                    <div className="flex flex-col gap-1 flex-1">
                      {item.years.map((yr, idx) => (
                        <div key={yr.year} className="flex items-center gap-2">
                          <div
                            className="h-5 rounded-r-md transition-all duration-300 hover:brightness-110 cursor-pointer"
                            style={{
                              width: `${(yr.value / hBarMax) * 100}%`,
                              backgroundColor: hBarColors[idx],
                            }}
                          />
                          <span className="text-[11px] font-black text-brand-900 whitespace-nowrap">
                            {yr.value.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

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
      <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#f0f6ff] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-6 w-full relative overflow-hidden min-h-[380px]">

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

          return (
            <div className="w-full overflow-x-auto scrollbar-thin pb-2">
              <div className="min-w-[900px] flex items-end justify-around px-4 pt-8 pb-2 select-none" style={{ height: "280px" }}>
                {feeDiffData.map((item) => {
                  const barHeight = (item.value / maxVal) * 100;
                  return (
                    <div key={item.course} className="flex flex-col items-center w-full max-w-[120px]">
                      {/* Value label */}
                      <span className="text-xs font-black text-brand-900 mb-1.5">
                        {item.value.toLocaleString("en-IN")}
                      </span>
                      {/* Bar */}
                      <div
                        className="w-16 rounded-t-md transition-all duration-300 hover:brightness-95 cursor-pointer"
                        style={{
                          height: `${barHeight}%`,
                          backgroundColor: "#a8b4d4",
                        }}
                      />
                      {/* X label */}
                      <div className="text-[11px] font-black text-brand-800 mt-2.5 text-center leading-tight h-14 flex items-start justify-center select-none px-1">
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
      <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#f0f6ff] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-6 w-full relative overflow-hidden">

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
