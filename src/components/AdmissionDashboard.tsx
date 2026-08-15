"use client";

import React, { useState } from "react";
import { Users, BookOpen, School, Info, Percent, Maximize2, Minimize2 } from "lucide-react";

interface Slice {
  label: string;
  value: number;
  raw: string;
  color: string;
}

interface DoughnutChartProps {
  slices: Slice[];
  totalLabel: string;
  totalValue: string;
}

function InteractiveDoughnut({ slices, totalLabel, totalValue }: DoughnutChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<Slice | null>(null);
  const [activeLegendIndex, setActiveLegendIndex] = useState<number | null>(null);

  // Circumference calculation for r=48
  const circumference = 301.59;
  let cumulativePercentage = 0;

  return (
    <div className="flex flex-row items-center justify-between gap-8 w-full h-full mt-auto">
      {/* Chart Wrapper */}
      <div className="relative w-40 h-40 select-none flex-shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {slices.map((slice, index) => {
            const percentage = slice.value;
            const strokeDashoffset = circumference - (circumference * percentage) / 100;
            const startAngle = (cumulativePercentage * 360) / 100;
            cumulativePercentage += percentage;

            const isHovered = hoveredSlice?.label === slice.label || activeLegendIndex === index;

            return (
              <circle
                key={slice.label}
                cx="60"
                cy="60"
                r="48"
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? "26" : "22"}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transform: `rotate(${startAngle - 90}deg)`,
                  transformOrigin: "60px 60px",
                }}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredSlice(slice)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            );
          })}
          {/* Inner white hole */}
          <circle cx="60" cy="60" r="37" className="fill-white dark:fill-surface" />
        </svg>

        {/* Center Text Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
          {hoveredSlice ? (
            <>
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider truncate max-w-[80px]">
                {hoveredSlice.label}
              </span>
              <span className="text-base font-extrabold text-brand-900 mt-0.5 truncate max-w-[80px]">
                {hoveredSlice.raw}
              </span>
              <span className="text-xs font-bold text-brand-600 mt-0.5">
                {hoveredSlice.value}%
              </span>
            </>
          ) : activeLegendIndex !== null ? (
            <>
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider truncate max-w-[80px]">
                {slices[activeLegendIndex].label}
              </span>
              <span className="text-base font-extrabold text-brand-900 mt-0.5 truncate max-w-[80px]">
                {slices[activeLegendIndex].raw}
              </span>
              <span className="text-xs font-bold text-brand-600 mt-0.5">
                {slices[activeLegendIndex].value}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                {totalLabel}
              </span>
              <span className="text-base font-extrabold text-brand-955 mt-0.5">
                {totalValue}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend Container */}
      <div className="flex-1 flex flex-col justify-center gap-1.5 text-xs pl-12">
        {slices.map((slice, index) => {
          const isSelected = activeLegendIndex === index || hoveredSlice?.label === slice.label;
          return (
            <button
              key={slice.label}
              onClick={() => setActiveLegendIndex(activeLegendIndex === index ? null : index)}
              onMouseEnter={() => setHoveredSlice(slice)}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`flex items-center gap-2.5 p-1.5 rounded-lg text-left transition-all duration-200 cursor-pointer w-full ${
                isSelected ? "bg-brand-50 font-black text-brand-900 scale-[1.02]" : "hover:bg-slate-50 text-slate-650 font-bold"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white/10"
                style={{ backgroundColor: slice.color, boxShadow: `0 2px 8px ${slice.color}80` }}
              />
              <span className="truncate max-w-[130px] font-semibold">{slice.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AdmissionDashboard() {
  const [expandedChart, setExpandedChart] = useState<"program" | "region" | null>(null);

  // Card 1: Fresh Admissions Data
  const freshAdmissionsSlices: Slice[] = [
    { label: "Generated", value: 92.5, raw: "14,24,688", color: "#2563eb" },
    { label: "Pending", value: 7.5, raw: "1,15,515", color: "#ff60b5" },
  ];

  // Card 2: Courses Data
  const coursesSlices: Slice[] = [
    { label: "PhD", value: 13, raw: "66", color: "#2563eb" },
    { label: "PG", value: 11, raw: "56", color: "#8b5cf6" },
    { label: "PG Diploma", value: 14, raw: "71", color: "#f59e0b" },
    { label: "UG", value: 11, raw: "56", color: "#10b981" },
    { label: "Diploma", value: 38, raw: "193", color: "#ec4899" },
    { label: "Certificate", value: 13, raw: "66", color: "#64748b" },
  ];

  // Card 3: College Types Data
  const collegeSlices: Slice[] = [
    { label: "Affiliated", value: 96.0, raw: "7,741", color: "#2563eb" },
    { label: "Recognized", value: 2.5, raw: "202", color: "#f59e0b" },
    { label: "Autonomous", value: 1.5, raw: "121", color: "#10b981" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn pb-8">
      
      {/* 1. TOP GENERAL ENROLLMENT STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Enrolled */}
        <div className="bg-gradient-to-br from-[#dbeafe] via-slate-50 to-[#d0e5ff] rounded-3xl border border-blue-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-brand-700/80 uppercase tracking-widest">Total Enrolled</h4>
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-inner border border-brand-100/50">
              <Users size={20} className="stroke-[2]" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-brand-900 tracking-tight">30,78,792</p>
            <p className="text-sm text-brand-650 font-bold mt-2">100% Enrolled</p>
          </div>
        </div>

        {/* Card 2: Male Students */}
        <div className="bg-gradient-to-br from-[#dbeafe] via-slate-50 to-[#d0e5ff] rounded-3xl border border-blue-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-brand-700/80 uppercase tracking-wider">Male Enrolled</h4>
            <span className="text-xs font-black bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100/50">52.5%</span>
          </div>
          <div>
            <p className="text-3xl font-black text-brand-900 tracking-tight">16,16,936</p>
            <p className="text-sm text-blue-600 font-bold mt-2">52.52% Share</p>
          </div>
        </div>

        {/* Card 3: Female Students */}
        <div className="bg-gradient-to-br from-[#fce7f3] via-slate-50 to-[#fbcfe8] rounded-3xl border border-pink-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-pink-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-pink-700/80 uppercase tracking-wider">Female Enrolled</h4>
            <span className="text-xs font-black bg-pink-50 text-pink-700 px-2.5 py-1 rounded-lg border border-pink-100/50">47.5%</span>
          </div>
          <div>
            <p className="text-3xl font-black text-brand-900 tracking-tight">14,61,274</p>
            <p className="text-sm text-pink-600 font-bold mt-2">47.46% Share</p>
          </div>
        </div>

        {/* Card 4: Transgender */}
        <div className="bg-gradient-to-br from-[#f3e8ff] via-slate-50 to-[#e9d5ff] rounded-3xl border border-purple-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-purple-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-purple-700/80 uppercase tracking-wider">Transgender</h4>
            <span className="text-xs font-black bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-100/50">0.003%</span>
          </div>
          <div>
            <p className="text-3xl font-black text-brand-900 tracking-tight">117</p>
            <p className="text-sm text-purple-650 font-bold mt-2">0.003% Share</p>
          </div>
        </div>

      </div>

      {/* 2. THREE COLUMNS GRAPHICAL ADMISSION DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Fresh Admissions */}
        <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#f0f6ff] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col justify-between min-h-[310px] hover:shadow-md hover:border-blue-200/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50/50 rounded-full -mr-8 -mt-8 pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs bg-brand-50 text-brand-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-brand-100">
                A.Y. 2025-26
              </span>
              <Users size={18} className="text-brand-500" />
            </div>
            
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Fresh Admissions</h3>
            <p className="text-2xl font-extrabold text-brand-900 mt-1">15,40,203</p>
            <p className="text-xs text-brand-600 font-semibold mt-1">Admitted Students with APAAR ID</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mt-4">
            <InteractiveDoughnut
              slices={freshAdmissionsSlices}
              totalLabel="Total"
              totalValue="15.4L"
            />
          </div>
        </div>

        {/* Card 2: Courses */}
        <div className="bg-gradient-to-br from-[#faf5ff] via-white to-[#f5ebff] rounded-3xl border border-violet-100/50 shadow-soft p-6 flex flex-col justify-between min-h-[310px] hover:shadow-md hover:border-violet-200/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50/50 rounded-full -mr-8 -mt-8 pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs bg-violet-50 text-avatar font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-violet-100">
                A.Y. 2025-26
              </span>
              <BookOpen size={18} className="text-avatar" />
            </div>
            
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Courses</h3>
            <p className="text-2xl font-extrabold text-brand-900 mt-1">508</p>
            <p className="text-xs text-avatar font-semibold mt-1">Courses by Program Type</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mt-4">
            <InteractiveDoughnut
              slices={coursesSlices}
              totalLabel="Total"
              totalValue="508"
            />
          </div>
        </div>

        {/* Card 3: Colleges & Polytechnics */}
        <div className="bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfdf5] rounded-3xl border border-emerald-100/50 shadow-soft p-6 flex flex-col justify-between min-h-[310px] hover:shadow-md hover:border-emerald-200/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full -mr-8 -mt-8 pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                A.Y. 2025-26
              </span>
              <School size={18} className="text-emerald-500" />
            </div>
            
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Colleges & Polytechnics</h3>
            <p className="text-2xl font-extrabold text-brand-900 mt-1">8,064</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Admitted Students by College Type</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mt-4">
            <InteractiveDoughnut
              slices={collegeSlices}
              totalLabel="Total"
              totalValue="8,064"
            />
          </div>
        </div>

      </div>

      {/* 3. CHARTS SIDE-BY-SIDE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {expandedChart !== "region" && (
          <div className={expandedChart === "program" ? "col-span-1 xl:col-span-2" : "col-span-1"}>
            <ProgramTypeBarChart
              isExpanded={expandedChart === "program"}
              onToggleExpand={() => setExpandedChart(expandedChart === "program" ? null : "program")}
            />
          </div>
        )}
        {expandedChart !== "program" && (
          <div className={expandedChart === "region" ? "col-span-1 xl:col-span-2" : "col-span-1"}>
            <RegionCoverageChart
              isExpanded={expandedChart === "region"}
              onToggleExpand={() => setExpandedChart(expandedChart === "region" ? null : "region")}
            />
          </div>
        )}
      </div>

      {/* 4. UNIVERSITY-WISE APAAR ID COVERAGE (FULL WIDTH) */}
      <UniversityCoverageChart />

      {/* 5. GENDER & PROGRAM AND CATEGORY GENDER CHARTS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full mt-6">
        <GenderProgramUniversityChart />
        <CategoryGenderChart />
      </div>

      {/* 6. CATEGORY-WISE DISTRIBUTION IN UNIVERSITIES AND PROGRAMS (FULL WIDTH) */}
      <CategoryUniversityDistributionChart />

      {/* 7. ADMISSION BASED - TOP 5 PROGRAM (FULL WIDTH) */}
      <AdmissionTopProgramsChart />

      {/* 8. ADMITTED STUDENTS MAP & IMPACT OF FEE WAIVER (TWO CARDS GRID) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full mt-6">
        <AdmittedStudentsMapCard />
        <FeeWaiverImpactChartCard />
      </div>
    </div>
  );
}

function ProgramTypeBarChart({ isExpanded, onToggleExpand }: { isExpanded: boolean; onToggleExpand: () => void }) {
  const [selectedUniv, setSelectedUniv] = useState("All");
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [hoveredBar, setHoveredBar] = useState<{ group: string; gender: string; value: string } | null>(null);

  // Raw base data
  const baseData = {
    UG: { female: 743200, male: 810200, trans: 50 },
    PG: { female: 95000, male: 88000, trans: 10 },
    Diploma: { female: 42000, male: 68000, trans: 5 },
    PhD: { female: 1200, male: 1400, trans: 2 },
    Certificate: { female: 1033, male: 1068, trans: 0 },
    PGDiploma: { female: 350, male: 410, trans: 0 },
  };

  // Scale multiplier based on filters
  let multiplier = 1;
  if (selectedUniv !== "All") multiplier *= 0.4;
  if (selectedCollege !== "All") multiplier *= 0.3;

  const data = {
    UG: {
      female: Math.round(baseData.UG.female * multiplier),
      male: Math.round(baseData.UG.male * multiplier),
      trans: Math.round(baseData.UG.trans * multiplier),
    },
    PG: {
      female: Math.round(baseData.PG.female * multiplier),
      male: Math.round(baseData.PG.male * multiplier),
      trans: Math.round(baseData.PG.trans * multiplier),
    },
    Diploma: {
      female: Math.round(baseData.Diploma.female * multiplier),
      male: Math.round(baseData.Diploma.male * multiplier),
      trans: Math.round(baseData.Diploma.trans * multiplier),
    },
    PhD: {
      female: Math.round(baseData.PhD.female * multiplier),
      male: Math.round(baseData.PhD.male * multiplier),
      trans: Math.round(baseData.PhD.trans * multiplier),
    },
    Certificate: {
      female: Math.round(baseData.Certificate.female * multiplier),
      male: Math.round(baseData.Certificate.male * multiplier),
      trans: Math.round(baseData.Certificate.trans * multiplier),
    },
    PGDiploma: {
      female: Math.round(baseData.PGDiploma.female * multiplier),
      male: Math.round(baseData.PGDiploma.male * multiplier),
      trans: Math.round(baseData.PGDiploma.trans * multiplier),
    },
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  // Find max value to determine heights
  const maxValue = 810200;

  const groups = [
    { key: "UG", label: "UG", data: data.UG },
    { key: "PG", label: "PG", data: data.PG },
    { key: "Diploma", label: "Diploma", data: data.Diploma },
    { key: "PhD", label: "PhD", data: data.PhD },
    { key: "Certificate", label: "Certificate", data: data.Certificate },
    { key: "PGDiploma", label: "PG Diploma", data: data.PGDiploma },
  ];

  return (
    <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#f0f6ff] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-6 w-full relative overflow-hidden">
      
      {/* Expand/Collapse Float Button */}
      <button
        onClick={onToggleExpand}
        className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
        title={isExpanded ? "Collapse View" : "Enlarge View"}
      >
        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
      
      {/* Top Filter & Header Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
        
        {/* Left Dropdown */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            University
          </label>
          <select
            value={selectedUniv}
            onChange={(e) => setSelectedUniv(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-3 rounded-xl border border-slate-200 cursor-pointer text-sm focus:outline-none transition-colors duration-200"
          >
            <option value="All">All</option>
            <option value="Mumbai University">Mumbai University</option>
            <option value="Savitribai Phule Pune University">SPPU</option>
            <option value="COEP Technological University">COEP Tech</option>
          </select>
        </div>

        {/* Center Title */}
        <div className="text-center">
          <h3 className="text-lg font-extrabold text-brand-900 tracking-tight">
            Program Type wise Admitted Students
          </h3>
          <p className="text-sm text-brand-600 font-bold mt-0.5">2025-26</p>
        </div>

        {/* Right Dropdown */}
        <div className="flex flex-col w-full sm:w-48 sm:items-end">
          <div className="w-full">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              College Name
            </label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-3 rounded-xl border border-slate-200 cursor-pointer text-sm focus:outline-none transition-colors duration-200"
            >
              <option value="All">All</option>
              <option value="COEP Pune">COEP Pune</option>
              <option value="VJTI Mumbai">VJTI Mumbai</option>
              <option value="ICT Mumbai">ICT Mumbai</option>
            </select>
          </div>
        </div>

      </div>

      {/* Bar Chart Graphic Area */}
      <div className="w-full overflow-x-auto scrollbar-thin pb-2">
        <div className={`relative min-w-[1350px] flex items-end gap-2 px-2 mt-4 select-none transition-all duration-300 ${isExpanded ? "h-96" : "h-64"}`}>
          
          {/* Render Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-12 pb-8">
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
          </div>

          {/* Render Bars */}
          <div className="w-full h-full flex items-end justify-around pb-8 z-10">
            {groups.map((group) => {
              // Calculate height percentages relative to max value
              const femalePercent = (group.data.female / maxValue) * 100;
              const malePercent = (group.data.male / maxValue) * 100;
              const transPercent = (group.data.trans / maxValue) * 100;

              return (
                <div key={group.key} className="flex flex-col items-center w-full max-w-[180px]">
                  {/* Visual Bars Container */}
                  <div className={`w-full flex items-end justify-center gap-2 relative transition-all duration-300 ${isExpanded ? "h-72" : "h-44"}`}>
                    
                    {/* Female Bar */}
                    <div
                      style={{ height: `${Math.max(femalePercent, 1.5)}%` }}
                      className="w-12 bg-[#ff60b5] hover:bg-[#ec4899] rounded-t transition-all duration-500 cursor-pointer relative group"
                      onMouseEnter={() =>
                        setHoveredBar({ group: group.label, gender: "Female", value: formatNumber(group.data.female) })
                      }
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Hover indicator tag above UG etc. in screenshot */}
                      {group.key === "Certificate" && (
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[13px] font-black text-[#ff60b5] whitespace-nowrap">
                          {formatNumber(group.data.female)}
                        </span>
                      )}
                      
                      {hoveredBar && hoveredBar.group === group.label && hoveredBar.gender === "Female" && (
                        <ChartTooltip
                          label1="Program Type"
                          val1={group.label}
                          label2="Gender"
                          val2="Female"
                          label3="Admitted Students"
                          val3={formatNumber(group.data.female)}
                          isLeft={group.key === "PhD" || group.key === "Certificate" || group.key === "PGDiploma"}
                        />
                      )}
                    </div>

                    {/* Male Bar */}
                    <div
                      style={{ height: `${Math.max(malePercent, 1.5)}%` }}
                      className="w-12 bg-[#3b82f6] hover:bg-[#2563eb] rounded-t transition-all duration-500 cursor-pointer relative group"
                      onMouseEnter={() =>
                        setHoveredBar({ group: group.label, gender: "Male", value: formatNumber(group.data.male) })
                      }
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Hover indicator tag above UG etc. in screenshot */}
                      {group.key === "Certificate" && (
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[13px] font-black text-[#3b82f6] whitespace-nowrap">
                          {formatNumber(group.data.male)}
                        </span>
                      )}
                      
                      {hoveredBar && hoveredBar.group === group.label && hoveredBar.gender === "Male" && (
                        <ChartTooltip
                          label1="Program Type"
                          val1={group.label}
                          label2="Gender"
                          val2="Male"
                          label3="Admitted Students"
                          val3={formatNumber(group.data.male)}
                          isLeft={group.key === "PhD" || group.key === "Certificate" || group.key === "PGDiploma"}
                        />
                      )}
                    </div>

                    {/* Transgender Bar */}
                    <div
                      style={{ height: `${Math.max(transPercent, 1.5)}%` }}
                      className="w-12 bg-[#8b5cf6] hover:bg-[#7c3aed] rounded-t transition-all duration-500 cursor-pointer relative"
                      onMouseEnter={() =>
                        setHoveredBar({ group: group.label, gender: "Transgender", value: formatNumber(group.data.trans) })
                      }
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {hoveredBar && hoveredBar.group === group.label && hoveredBar.gender === "Transgender" && (
                        <ChartTooltip
                          label1="Program Type"
                          val1={group.label}
                          label2="Gender"
                          val2="Transgender"
                          label3="Admitted Students"
                          val3={formatNumber(group.data.trans)}
                          isLeft={group.key === "PhD" || group.key === "Certificate" || group.key === "PGDiploma"}
                        />
                      )}
                    </div>

                  </div>
                  
                  {/* X-Axis label */}
                  <span className="text-xs md:text-sm font-extrabold text-brand-900 mt-3 select-none">
                    {group.label}
                  </span>
                </div>
              );
            })}
          </div>



        </div>
      </div>

      {/* Legend Container */}
      <div className="flex justify-center items-center gap-6 text-sm font-bold text-slate-700 mt-2">
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#ff60b5]" style={{ boxShadow: '0 2px 8px #ff60b580' }} />
          Female
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#3b82f6]" style={{ boxShadow: '0 2px 8px #3b82f680' }} />
          Male
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#8b5cf6]" style={{ boxShadow: '0 2px 8px #8b5cf680' }} />
          Transgender
        </span>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-slate-500 font-medium border-t border-slate-100 pt-4 flex items-center justify-center gap-1.5">
        <Info size={14} className="text-brand-500" />
        <span>*Disclaimer: Some students pursue multiple programs simultaneously and some have not disclosed their gender</span>
      </div>

    </div>
  );
}

function RegionCoverageChart({ isExpanded, onToggleExpand }: { isExpanded: boolean; onToggleExpand: () => void }) {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [hoveredBar, setHoveredBar] = useState<{ region: string; type: string; value: string } | null>(null);

  // Raw base data
  const baseData = [
    { name: "Amravati", admitted: 147, generated: 147 },
    { name: "Konkan", admitted: 406, generated: 364 },
    { name: "Chhatrapati Sambhajinagar", admitted: 330, generated: 328 },
    { name: "Pune", admitted: 588, generated: 588 },
    { name: "Nashik", admitted: 461, generated: 461 },
    { name: "Nagpur", admitted: 135, generated: 133 },
  ];

  // Scale multiplier based on filters
  let multiplier = 1;
  if (selectedRegion !== "All") multiplier *= 0.45;
  if (selectedDistrict !== "All") multiplier *= 0.35;

  const data = baseData.map((item) => {
    const isSelected = selectedRegion === "All" || selectedRegion === item.name;
    const finalMultiplier = isSelected ? multiplier : multiplier * 0.2;

    const admitted = Math.round(item.admitted * finalMultiplier);
    const generated = Math.round(item.generated * finalMultiplier);
    const percentage = admitted > 0 ? (generated / admitted) * 100 : 100;

    return {
      name: item.name,
      admitted,
      generated,
      percentage: parseFloat(percentage.toFixed(2)),
    };
  });

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  const maxValue = 650;
  const minPercent = 85;

  // Calculate coordinates for SVG elements
  const centers = [70, 202, 334, 466, 598, 730];
  const barWidth = 32;

  const points = data.map((item, i) => {
    const x = centers[i];
    const p = item.percentage;
    const y = 240 - ((p - minPercent) / (100 - minPercent)) * 200;
    return { x, y, value: p };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="bg-gradient-to-br from-[#f5f3ff] via-white to-[#ecfeff] rounded-3xl border border-indigo-100/40 shadow-soft p-6 flex flex-col gap-6 w-full relative overflow-hidden">
      
      {/* Expand/Collapse Float Button */}
      <button
        onClick={onToggleExpand}
        className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
        title={isExpanded ? "Collapse View" : "Enlarge View"}
      >
        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
      
      {/* Top Header Row with Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
        
        {/* Left Dropdown */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Region
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-3 rounded-xl border border-slate-200 cursor-pointer text-sm focus:outline-none transition-colors duration-200"
          >
            <option value="All">All Regions</option>
            <option value="Amravati">Amravati</option>
            <option value="Konkan">Konkan</option>
            <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
            <option value="Pune">Pune</option>
            <option value="Nashik">Nashik</option>
            <option value="Nagpur">Nagpur</option>
          </select>
        </div>

        {/* Center Title */}
        <div className="text-center">
          <h3 className="text-lg font-extrabold text-brand-900 tracking-tight">
            Region and District-wise APAAR ID Coverage
          </h3>
          <p className="text-sm text-brand-600 font-bold mt-0.5">2025-26</p>
        </div>

        {/* Right Dropdown */}
        <div className="flex flex-col w-full sm:w-48 sm:items-end">
          <div className="w-full">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-3 rounded-xl border border-slate-200 cursor-pointer text-sm focus:outline-none transition-colors duration-200"
            >
              <option value="All">All Districts</option>
              <option value="Thane">Thane</option>
              <option value="Pune District">Pune District</option>
              <option value="Nagpur District">Nagpur District</option>
              <option value="Amravati District">Amravati District</option>
            </select>
          </div>
        </div>

      </div>

      {/* SVG Graphics Container */}
      <div className="w-full overflow-x-auto scrollbar-thin pb-2">
        <div className={`relative min-w-[700px] mt-4 select-none transition-all duration-300 ${isExpanded ? "h-[450px]" : "h-80"}`}>
          
          <svg viewBox="0 0 800 300" className="w-full h-full">
            {/* Y Axis Grid lines (horizontal) */}
            {[40, 90, 140, 190, 240].map((y, idx) => (
              <line
                key={idx}
                x1="60"
                y1={y}
                x2="740"
                y2={y}
                className="stroke-slate-100 stroke-1"
              />
            ))}

            {/* Left Y Axis Label (Counts) */}
            <text x="50" y="44" textAnchor="end" fontSize="13" className="font-bold fill-slate-500">650</text>
            <text x="50" y="94" textAnchor="end" fontSize="13" className="font-bold fill-slate-500">480</text>
            <text x="50" y="144" textAnchor="end" fontSize="13" className="font-bold fill-slate-500">320</text>
            <text x="50" y="194" textAnchor="end" fontSize="13" className="font-bold fill-slate-500">160</text>
            <text x="50" y="244" textAnchor="end" fontSize="13" className="font-bold fill-slate-500">0</text>

            {/* Right Y Axis Label (Percentages) */}
            <text x="750" y="44" textAnchor="start" fontSize="13" className="font-bold fill-slate-500">100%</text>
            <text x="750" y="94" textAnchor="start" fontSize="13" className="font-bold fill-slate-500">96%</text>
            <text x="750" y="144" textAnchor="start" fontSize="13" className="font-bold fill-slate-500">93%</text>
            <text x="750" y="194" textAnchor="start" fontSize="13" className="font-bold fill-slate-500">89%</text>
            <text x="750" y="244" textAnchor="start" fontSize="13" className="font-bold fill-slate-500">85%</text>

            {/* Bar Groups */}
            {data.map((item, i) => {
              const cx = centers[i];
              const admittedHeight = (item.admitted / maxValue) * 200;
              const generatedHeight = (item.generated / maxValue) * 200;

              const admittedY = 240 - admittedHeight;
              const generatedY = 240 - generatedHeight;

              const admittedX = cx - 35;
              const generatedX = cx + 3;

              return (
                <g key={item.name} className="group">
                  {/* Admitted Students Bar */}
                  <rect
                    x={admittedX}
                    y={admittedY}
                    width={barWidth}
                    height={admittedHeight}
                    fill="#c7d2fe"
                    rx="2"
                    className="transition-all duration-300 hover:fill-indigo-300 cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredBar({ region: item.name, type: "Admitted Students", value: formatNumber(item.admitted) })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                  {/* Count Badge inside Admitted Bar */}
                  {admittedHeight > 30 && (
                    <g>
                      <rect
                        x={admittedX - 2}
                        y={213}
                        width={36}
                        height={18}
                        fill="white"
                        rx="4"
                        className="opacity-95 shadow-sm"
                      />
                      <text
                        x={admittedX + 16}
                        y={226}
                        textAnchor="middle"
                        fontSize="11"
                        className="font-black fill-indigo-700"
                      >
                        {item.admitted}
                      </text>
                    </g>
                  )}

                  {/* APAAR ID Generated Bar */}
                  <rect
                    x={generatedX}
                    y={generatedY}
                    width={barWidth}
                    height={generatedHeight}
                    fill="#cffafe"
                    rx="2"
                    className="transition-all duration-300 hover:fill-cyan-200 cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredBar({ region: item.name, type: "APAAR ID Generated", value: formatNumber(item.generated) })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                  {/* Count Badge inside Generated Bar */}
                  {generatedHeight > 30 && (
                    <g>
                      <rect
                        x={generatedX - 2}
                        y={213}
                        width={36}
                        height={18}
                        fill="white"
                        rx="4"
                        className="opacity-95 shadow-sm"
                      />
                      <text
                        x={generatedX + 16}
                        y={226}
                        textAnchor="middle"
                        fontSize="11"
                        className="font-black fill-cyan-700"
                      >
                        {item.generated}
                      </text>
                    </g>
                  )}

                  {/* X Axis Region Name label */}
                  <text
                    x={cx}
                    y="262"
                    textAnchor="middle"
                    fontSize="13"
                    className="font-extrabold fill-brand-900"
                  >
                    {item.name}
                  </text>
                </g>
              );
            })}

            {/* Percentage Line Plot */}
            <path
              d={pathD}
              fill="none"
              stroke="#ea580c"
              strokeWidth="3"
              className="transition-all duration-500"
            />

            {/* Percentage Circular Nodes and Labels */}
            {points.map((p, idx) => {
              const labelY = p.y < 50 ? p.y + 22 : p.y - 12;

              return (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    className="fill-orange-600 stroke-white stroke-2 cursor-pointer transition-all duration-200 hover:r-7"
                    onMouseEnter={() =>
                      setHoveredBar({ region: data[idx].name, type: "Generation Rate", value: `${p.value}%` })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                  <text
                    x={p.x}
                    y={labelY}
                    textAnchor="middle"
                    fontSize="13"
                    className="font-black fill-slate-800"
                  >
                    {p.value}%
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Box */}
          {hoveredBar && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-50 border border-blue-200 shadow-xl rounded-2xl p-4 text-brand-900 w-64 select-none z-35 animate-fadeIn pointer-events-none">
              <div className="grid grid-cols-[110px_1fr] gap-y-1.5 text-xs text-left">
                <span className="font-bold text-blue-700/90 pr-2">Region</span>
                <span className="font-black text-brand-950">{hoveredBar.region}</span>
                
                <span className="font-bold text-blue-700/90 pr-2">Metric</span>
                <span className="font-black text-brand-950">{hoveredBar.type}</span>
                
                <span className="font-bold text-blue-700/90 pr-2">Value</span>
                <span className="font-black text-brand-950">{hoveredBar.value}</span>
              </div>
              
              <div className="border-t border-blue-200 my-2.5" />
              
              <div className="flex items-center gap-1.5 text-xs text-blue-700 font-extrabold">
                <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-blue-100 font-bold text-[10px]">
                  ↓
                </span>
                <span>Drill down</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Legend Container */}
      <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-bold text-slate-700 mt-2">
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-[#c7d2fe] border border-slate-300" />
          Admitted Students
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-[#cffafe] border border-slate-200" />
          APAAR ID Generated
        </span>
        <span className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-[#ea580c] relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] border border-white" />
          </span>
          APAAR ID Generation Percentage
        </span>
      </div>

    </div>
  );
}

function UniversityCoverageChart() {
  const [hoveredUni, setHoveredUni] = useState<any | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const universityData = [
    { name: "MGM", pct: 78.26, admitted: 15200, apaar: 11895, color: "#ec8c8c" },
    { name: "RTMNU", pct: 96.04, admitted: 105482, apaar: 101302, color: "#ec8c8c" },
    { name: "SPPU", pct: 98.87, admitted: 180500, apaar: 178460, color: "#66bba2" },
    { name: "DBATU", pct: 99.71, admitted: 42300, apaar: 42177, color: "#66bba2" },
    { name: "MU", pct: 99.91, admitted: 250000, apaar: 249775, color: "#66bba2" },
    { name: "HSNC", pct: 99.98, admitted: 12400, apaar: 12397, color: "#66bba2" },
    { name: "YCMOU", pct: 99.98, admitted: 145000, apaar: 144971, color: "#66bba2" },
    { name: "GUG", pct: 100.00, admitted: 8900, apaar: 8900, color: "#66bba2" },
    { name: "SRTMU", pct: 100.00, admitted: 38000, apaar: 38000, color: "#66bba2" },
    { name: "PAHSU", pct: 100.00, admitted: 24500, apaar: 24500, color: "#66bba2" },
    { name: "KKSU", pct: 100.00, admitted: 5400, apaar: 5400, color: "#66bba2" },
    { name: "KBCNMU", pct: 100.00, admitted: 31000, apaar: 31000, color: "#66bba2" },
    { name: "BAMU", pct: 100.00, admitted: 65000, apaar: 65000, color: "#66bba2" },
    { name: "(Blank)", pct: 100.00, admitted: 12000, apaar: 12000, color: "#66bba2" }
  ];

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  return (
    <div className="bg-gradient-to-br from-[#f0fdfa] via-white to-[#f0f9ff] rounded-3xl border border-teal-100/50 shadow-soft p-6 flex flex-col gap-6 w-full relative overflow-hidden">
      {/* Top Header */}
      <div className="text-center border-b border-slate-100 pb-4">
        <h3 className="text-lg font-extrabold text-brand-900 tracking-tight">
          University-wise APAAR ID Coverage
        </h3>
        <p className="text-sm text-brand-600 font-bold mt-0.5">2025-26</p>
      </div>

      {/* Bar Chart Graphic Area */}
      <div className="w-full overflow-x-auto scrollbar-thin pb-2">
        <div className="relative min-w-[900px] h-72 flex items-end justify-between px-4 mt-8 select-none pb-12 pt-8">
          
          {/* Render Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-4 pb-12 pt-8">
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
          </div>

          {/* Render Bars */}
          <div className="w-full h-full flex items-end justify-around z-10">
            {universityData.map((uni, index) => {
              const isLow = uni.pct < 98;
              const barPercent = uni.pct;

              return (
                <div
                  key={uni.name}
                  className={`flex flex-col items-center w-full max-w-[70px] relative ${
                    hoveredIndex === index ? "z-50" : "z-10"
                  }`}
                >
                  
                  {/* Visual Bar Container */}
                  <div className="h-44 w-full flex flex-col justify-end items-center relative">
                    
                    {/* Pct Label */}
                    <span
                      className="absolute bottom-full mb-1.5 text-[11px] font-black whitespace-nowrap select-none animate-fadeIn"
                      style={{ color: isLow ? "#e07a5f" : "#3d7a66" }}
                    >
                      {uni.pct.toFixed(2)}%
                    </span>

                    {/* Bar Rect */}
                    <div
                      style={{
                        height: `${barPercent}%`,
                        backgroundColor: uni.color,
                      }}
                      className="w-12 rounded-t transition-all duration-300 hover:opacity-90 cursor-pointer relative"
                      onMouseEnter={() => {
                        setHoveredUni(uni);
                        setHoveredIndex(index);
                      }}
                      onMouseLeave={() => {
                        setHoveredUni(null);
                        setHoveredIndex(null);
                      }}
                    >
                      {/* Tooltip Popup */}
                      {hoveredUni && hoveredIndex === index && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 z-45 bg-[#dbebff]/95 border border-[#b9d7ff] backdrop-blur-sm shadow-xl rounded-2xl p-4 text-brand-900 w-64 select-none pointer-events-none animate-fadeIn ${
                            index < 7 ? "left-full ml-4" : "right-full mr-4"
                          }`}
                        >
                          <div className="grid grid-cols-[130px_1fr] gap-y-1.5 text-xs text-left">
                            <span className="font-bold text-blue-800/80 pr-2">University</span>
                            <span className="font-extrabold text-brand-950 text-right">{uni.name}</span>
                            
                            <span className="font-bold text-blue-800/80 pr-2">APAAR ID Generated</span>
                            <span className="font-extrabold text-brand-950 text-right">{uni.pct.toFixed(2)}%</span>
                            
                            <span className="font-bold text-blue-800/80 pr-2">Admitted Students</span>
                            <span className="font-extrabold text-brand-950 text-right">{formatNumber(uni.admitted)}</span>
                            
                            <span className="font-bold text-blue-800/80 pr-2">APAAR ID Students</span>
                            <span className="font-extrabold text-brand-950 text-right">{formatNumber(uni.apaar)}</span>
                          </div>
                          
                          <div className="border-t border-[#b9d7ff] my-2.5" />
                          
                          <div className="flex items-center justify-between text-xs text-blue-800 font-extrabold">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-blue-700 stroke-[3] fill-none">
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                              </div>
                              <span>Drill through</span>
                            </div>
                            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-blue-600 stroke-[2.5] fill-none">
                              <path d="M9 5l7 7-7 7" />
                            </svg>
                          </div>

                          {/* Tooltip Arrow */}
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#dbebff]/95 border-[#b9d7ff] transform rotate-45 ${
                              index < 7
                                ? "-left-1.5 border-l border-b"
                                : "-right-1.5 border-t border-r"
                            }`}
                          />
                        </div>
                      )}
                    </div>

                  </div>

                  {/* University Name vertical label */}
                  <div className="h-16 w-full flex items-end justify-center mt-3">
                    <span
                      className="text-xs font-extrabold text-brand-900 select-none whitespace-nowrap"
                      style={{ writingMode: "vertical-lr" }}
                    >
                      {uni.name}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

interface ChartTooltipProps {
  label1: string;
  val1: string;
  label2: string;
  val2: string;
  label3: string;
  val3: string;
  isLeft?: boolean;
}

function ChartTooltip({
  label1,
  val1,
  label2,
  val2,
  label3,
  val3,
  isLeft,
}: ChartTooltipProps) {
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none animate-fadeIn bg-blue-50 border border-blue-200 shadow-xl rounded-2xl p-4 text-brand-900 w-64 select-none ${
        isLeft ? "right-full mr-3" : "left-full ml-3"
      }`}
    >
      <div className="grid grid-cols-[120px_1fr] gap-y-1.5 text-xs text-left">
        <span className="font-bold text-blue-700/90 pr-2">{label1}</span>
        <span className="font-black text-brand-950">{val1}</span>
        
        <span className="font-bold text-blue-700/90 pr-2">{label2}</span>
        <span className="font-black text-brand-950">{val2}</span>
        
        <span className="font-bold text-blue-700/90 pr-2">{label3}</span>
        <span className="font-black text-brand-950">{val3}</span>
      </div>
      
      <div className="border-t border-blue-200 my-2.5" />
      
      <div className="flex items-center gap-1.5 text-xs text-blue-700 font-extrabold">
        <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-blue-100 font-bold text-[10px]">
          ↓
        </span>
        <span>Drill down</span>
      </div>

      {/* Tooltip Arrow pointing left/right to the bar */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-blue-50 border-blue-200 transform rotate-45 ${
          isLeft
            ? "-right-1.5 border-t border-r border-l-0 border-b-0"
            : "-left-1.5 border-l border-b border-r-0 border-t-0"
        }`}
      />
    </div>
  );
}

function GenderProgramUniversityChart() {
  const [hoveredRow, setHoveredRow] = useState<{
    name: string;
    gender: "Male" | "Female";
    val: string;
    pct: number;
  } | null>(null);

  const uniData = [
    { name: "Deccan", male: 29.07, female: 70.93, total: 289, maleCount: 84, femaleCount: 205 },
    { name: "COEP", male: 72.00, female: 28.00, total: 1250, maleCount: 900, femaleCount: 350 },
    { name: "BAMU", male: 60.00, female: 40.00, total: 4500, maleCount: 2700, femaleCount: 1800 },
    { name: "ALARD", male: 60.00, female: 40.00, total: 850, maleCount: 510, femaleCount: 340 },
    { name: "(Blank)", male: 59.00, female: 41.00, total: 2100, maleCount: 1239, femaleCount: 861 },
    { name: "BALAJI", male: 56.00, female: 44.00, total: 920, maleCount: 515, femaleCount: 405 },
    { name: "DBATU", male: 53.00, female: 47.00, total: 3100, maleCount: 1643, femaleCount: 1457 },
    { name: "GIPE Pune", male: 59.00, female: 41.00, total: 780, maleCount: 460, femaleCount: 320 },
    { name: "GUG", male: 39.00, female: 61.00, total: 1400, maleCount: 546, femaleCount: 854 },
    { name: "HBSU", male: 54.00, female: 46.00, total: 1150, maleCount: 621, femaleCount: 529 },
    { name: "HSNC", male: 48.00, female: 52.00, total: 2500, maleCount: 1200, femaleCount: 1300 },
    { name: "ICT Mumbai", male: 67.00, female: 33.00, total: 600, maleCount: 402, femaleCount: 198 },
    { name: "KBCNMU", male: 51.00, female: 49.00, total: 5800, maleCount: 2958, femaleCount: 2842 },
    { name: "KBPU", male: 39.00, female: 61.00, total: 1850, maleCount: 722, femaleCount: 1128 },
    { name: "KKSU", male: 67.00, female: 33.00, total: 420, maleCount: 281, femaleCount: 139 },
    { name: "LIT", male: 53.00, female: 47.00, total: 640, maleCount: 339, femaleCount: 301 }
  ];

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  return (
    <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#fdf2f8] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-6 w-full relative overflow-hidden h-[540px]">
      {/* Title */}
      <div className="text-center border-b border-slate-100 pb-4">
        <h3 className="text-base font-extrabold text-brand-900 tracking-tight">
          Gender and Program wise Percentage of Admitted Students in Universities
        </h3>
        <p className="text-xs text-brand-600 font-bold mt-0.5">2025-26</p>
      </div>

      {/* Chart Content Area with Scrollbar */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin flex flex-col gap-4 relative">
        {uniData.map((uni) => {
          return (
            <div key={uni.name} className="grid grid-cols-[110px_1fr] items-center gap-4 relative group">
              {/* Name */}
              <span className="text-xs font-bold text-slate-700 truncate text-right">
                {uni.name}
              </span>

              {/* Stacked Bar Container */}
              <div className="relative h-7 w-full bg-slate-50 rounded-lg overflow-visible flex select-none">
                
                {/* 50% Dashed Divider line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0 border-l border-dashed border-white/60 z-20 pointer-events-none" />

                {/* Male Segment (Blue) */}
                <div
                  style={{ width: `${uni.male}%` }}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] transition-colors h-full flex items-center justify-center relative cursor-pointer first:rounded-l-lg last:rounded-r-lg"
                  onMouseEnter={() =>
                    setHoveredRow({
                      name: uni.name,
                      gender: "Male",
                      val: formatNumber(uni.maleCount),
                      pct: uni.male
                    })
                  }
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {uni.male > 15 && (
                    <span className="text-[10px] font-black text-white">{Math.round(uni.male)}%</span>
                  )}
                </div>

                {/* Female Segment (Pink) */}
                <div
                  style={{ width: `${uni.female}%` }}
                  className="bg-[#ff60b5] hover:bg-[#ec4899] transition-colors h-full flex items-center justify-center relative cursor-pointer first:rounded-l-lg last:rounded-r-lg"
                  onMouseEnter={() =>
                    setHoveredRow({
                      name: uni.name,
                      gender: "Female",
                      val: formatNumber(uni.femaleCount),
                      pct: uni.female
                    })
                  }
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {uni.female > 15 && (
                    <span className="text-[10px] font-black text-white">{Math.round(uni.female)}%</span>
                  )}
                </div>

                {/* Speech Bubble Tooltip positioned relative to the bar container */}
                {hoveredRow && hoveredRow.name === uni.name && (
                  <div
                    className="absolute z-50 bg-[#dbebff]/95 border border-[#b9d7ff] backdrop-blur-sm shadow-xl rounded-2xl p-4 text-brand-900 w-64 select-none pointer-events-none animate-fadeIn bottom-full mb-3"
                    style={{
                      left: hoveredRow.gender === "Male" ? "10%" : "auto",
                      right: hoveredRow.gender === "Female" ? "10%" : "auto"
                    }}
                  >
                    <div className="grid grid-cols-[100px_1fr] gap-y-1 text-xs text-left">
                      <span className="font-bold text-blue-800/80 pr-2">University</span>
                      <span className="font-extrabold text-brand-950 text-right">{uni.name}</span>
                      
                      <span className="font-bold text-blue-800/80 pr-2">{hoveredRow.gender}</span>
                      <span className="font-extrabold text-brand-950 text-right">
                        {hoveredRow.val} ({hoveredRow.pct.toFixed(2)}%)
                      </span>
                    </div>

                    {/* Tooltip Arrow */}
                    <div
                      className="absolute top-full -translate-y-1.5 w-3 h-3 bg-[#dbebff]/95 border-b border-r border-[#b9d7ff] transform rotate-45"
                      style={{
                        left: hoveredRow.gender === "Male" ? "30px" : "auto",
                        right: hoveredRow.gender === "Female" ? "30px" : "auto"
                      }}
                    />
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Axis Scale and Legend */}
      <div className="mt-2 border-t border-slate-100 pt-4 flex flex-col gap-3">
        {/* Scale labels */}
        <div className="flex justify-between text-[11px] font-extrabold text-slate-400 px-[110px]">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-6 text-xs font-bold text-slate-700">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff60b5]" />
            Female
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3b82f6]" />
            Male
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
            Transgender
          </span>
        </div>
      </div>
    </div>
  );
}

function CategoryGenderChart() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [hoveredBar, setHoveredBar] = useState<{
    cat: string;
    gender: "Male" | "Female";
    pct: number;
    total: number;
    femaleVal: number;
    maleVal: number;
  } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const baseCategoryData = [
    { name: "General", female: 47, male: 53, total: 124500 },
    { name: "OBC", female: 49, male: 51, total: 98400 },
    { name: "SC", female: 50, male: 50, total: 45200 },
    { name: "ST", female: 46, male: 54, total: 28900 },
    { name: "EWS", female: 48, male: 52, total: 35000 },
    { name: "EBC", female: 50, male: 50, total: 64000 },
    { name: "NT", female: 45, male: 55, total: 18400 },
    { name: "SBC", female: 50, male: 50, total: 47814 },
    { name: "SEBC", female: 45, male: 55, total: 12300 },
    { name: "Foreign National", female: 48, male: 52, total: 9800 },
    { name: "NA", female: 32, male: 68, total: 12000 }
  ];

  // Scale multiplier based on selected region
  let multiplier = 1;
  if (selectedRegion === "Pune") multiplier = 1.3;
  else if (selectedRegion === "Nagpur") multiplier = 0.8;
  else if (selectedRegion === "Konkan") multiplier = 1.15;
  else if (selectedRegion === "Nashik") multiplier = 0.95;
  else if (selectedRegion === "Amravati") multiplier = 0.7;
  else if (selectedRegion === "Chhatrapati Sambhajinagar") multiplier = 0.9;

  const categoryData = baseCategoryData.map((cat) => {
    const scaledTotal = Math.round(cat.total * multiplier);
    const femaleVal = Math.round(scaledTotal * (cat.female / 100));
    const maleVal = scaledTotal - femaleVal;

    return {
      name: cat.name,
      femalePct: cat.female,
      malePct: cat.male,
      total: scaledTotal,
      femaleVal,
      maleVal
    };
  });

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  return (
    <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#fdf2f8] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-6 w-full relative overflow-hidden h-[540px]">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
        {/* Left Dropdown */}
        <div className="flex flex-col w-full sm:w-32">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Region
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-1.5 px-2.5 rounded-xl border border-slate-200 cursor-pointer text-xs focus:outline-none transition-colors duration-200"
          >
            <option value="All">All</option>
            <option value="Pune">Pune</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Konkan">Konkan</option>
            <option value="Nashik">Nashik</option>
            <option value="Amravati">Amravati</option>
            <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
          </select>
        </div>

        {/* Center Title */}
        <div className="text-center sm:pr-32">
          <h3 className="text-base font-extrabold text-brand-900 tracking-tight">
            Category and Gender wise Percentages
          </h3>
          <p className="text-xs text-brand-600 font-bold mt-0.5">2025-26</p>
        </div>
      </div>

      {/* Bar Chart Graphic Area */}
      <div className="w-full overflow-x-auto scrollbar-thin flex-1 pb-4">
        <div className="relative min-w-[700px] h-72 flex items-end justify-between px-2 mt-8 select-none pb-12 pt-8">
          
          {/* Grid lines behind */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12 pt-8">
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
          </div>

          {/* Render Bars */}
          <div className="w-full h-full flex items-end justify-around z-10">
            {categoryData.map((cat, index) => {
              return (
                <div
                  key={cat.name}
                  className={`flex flex-col items-center w-full max-w-[64px] relative ${
                    hoveredIndex === index ? "z-50" : "z-10"
                  }`}
                  onMouseLeave={() => {
                    setHoveredBar(null);
                    setHoveredIndex(null);
                  }}
                >
                  
                  {/* Vertical Stacked Bar */}
                  <div className="h-44 w-10 flex flex-col rounded-md overflow-hidden cursor-pointer relative shadow-sm border border-slate-200/10">
                    {/* Male Segment (Blue, on top) */}
                    <div
                      style={{ height: `${cat.malePct}%` }}
                      className="bg-[#3b82f6] hover:bg-[#2563eb] transition-colors w-full flex items-center justify-center relative"
                      onMouseEnter={() => {
                        setHoveredBar({
                          cat: cat.name,
                          gender: "Male",
                          pct: cat.malePct,
                          total: cat.total,
                          femaleVal: cat.femaleVal,
                          maleVal: cat.maleVal
                        });
                        setHoveredIndex(index);
                      }}
                    >
                      <span className="text-[11px] font-black text-white">{cat.malePct}%</span>
                    </div>

                    {/* Female Segment (Pink, on bottom) */}
                    <div
                      style={{ height: `${cat.femalePct}%` }}
                      className="bg-[#ff60b5] hover:bg-[#ec4899] transition-colors w-full flex items-center justify-center relative"
                      onMouseEnter={() => {
                        setHoveredBar({
                          cat: cat.name,
                          gender: "Female",
                          pct: cat.femalePct,
                          total: cat.total,
                          femaleVal: cat.femaleVal,
                          maleVal: cat.maleVal
                        });
                        setHoveredIndex(index);
                      }}
                    >
                      <span className="text-[11px] font-black text-white">{cat.femalePct}%</span>
                    </div>

                  </div>

                  {/* Tooltip for Category & Gender (Moved outside the overflow-hidden bar container) */}
                  {hoveredBar && hoveredIndex === index && (
                    <div
                      className={`absolute top-[88px] -translate-y-1/2 z-45 bg-[#dbebff]/95 border border-[#b9d7ff] backdrop-blur-sm shadow-xl rounded-2xl p-4 text-brand-900 w-64 select-none animate-fadeIn ${
                        index < 7 ? "left-full ml-4" : "right-full mr-4"
                      }`}
                    >
                      <div className="grid grid-cols-[130px_1fr] gap-y-1.5 text-xs text-left">
                        <span className="font-bold text-blue-800/80 pr-2">Category</span>
                        <span className="font-extrabold text-brand-950 text-right">{cat.name}</span>
                        
                        <span className="font-bold text-blue-800/80 pr-2">{hoveredBar.gender}</span>
                        <span className="font-extrabold text-brand-950 text-right">{hoveredBar.pct}%</span>
                        
                        <span className="font-bold text-blue-800/80 pr-2">Total Students</span>
                        <span className="font-extrabold text-brand-950 text-right">{formatNumber(hoveredBar.total)}</span>
                        
                        <span className="font-bold text-blue-800/80 pr-2">Female Students</span>
                        <span className="font-extrabold text-brand-950 text-right">{formatNumber(hoveredBar.femaleVal)}</span>
                        
                        <span className="font-bold text-blue-800/80 pr-2">Male Students</span>
                        <span className="font-extrabold text-brand-950 text-right">{formatNumber(hoveredBar.maleVal)}</span>
                      </div>

                      {/* Tooltip Arrow */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#dbebff]/95 border-[#b9d7ff] transform rotate-45 ${
                          index < 7
                            ? "-left-1.5 border-l border-b"
                            : "-right-1.5 border-t border-r"
                        }`}
                      />
                    </div>
                  )}

                  {/* Diagonal X Axis Label */}
                  <span
                    className="text-xs font-black text-brand-900 select-none whitespace-nowrap mt-7 block transform -rotate-45 origin-top-left translate-x-2 translate-y-1"
                  >
                    {cat.name}
                  </span>

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Legend Container */}
      <div className="mt-auto border-t border-slate-100 pt-4 flex justify-center items-center gap-6 text-xs font-bold text-slate-700">
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#ff60b5]" style={{ boxShadow: '0 2px 8px #ff60b580' }} />
          Female
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#3b82f6]" style={{ boxShadow: '0 2px 8px #3b82f680' }} />
          Male
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#8b5cf6]" style={{ boxShadow: '0 2px 8px #8b5cf680' }} />
          Transgender
        </span>
      </div>

    </div>
  );
}

function CategoryUniversityDistributionChart() {
  const [hoveredSegment, setHoveredSegment] = useState<{
    uni: string;
    cat: string;
    pct: number;
    count: number;
    splits: Record<string, number>;
    total: number;
  } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const uniData = [
    { name: "SPPU", total: 48900, splits: { General: 40.00, OBC: 27.00, SC: 12.00, ST: 9.00, EWS: 12.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "MU", total: 35600, splits: { General: 68.00, OBC: 16.00, SC: 8.00, ST: 8.00, EWS: 0, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "YCMOU", total: 54100, splits: { General: 50.00, OBC: 20.00, SC: 12.00, ST: 9.00, EWS: 9.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "SUK", total: 18900, splits: { General: 63.00, OBC: 13.00, SC: 12.00, ST: 8.00, EWS: 4.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "BAMU", total: 24500, splits: { General: 48.00, OBC: 18.00, SC: 17.00, ST: 11.00, EWS: 6.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "DBATU", total: 12800, splits: { General: 50.00, OBC: 23.00, SC: 10.00, ST: 10.00, EWS: 7.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "MSBTE", total: 42100, splits: { General: 43.00, OBC: 25.00, SC: 13.00, ST: 9.00, EWS: 10.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "SGBAU", total: 15600, splits: { General: 18.00, OBC: 44.00, SC: 19.00, ST: 8.00, EWS: 11.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "SNDT", total: 9800, splits: { General: 35.00, OBC: 24.00, SC: 23.00, ST: 8.00, EWS: 10.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "SRTMU", total: 11400, splits: { General: 44.00, OBC: 13.00, SC: 22.00, ST: 11.00, EWS: 10.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "KKSU", total: 4200, splits: { General: 32.00, OBC: 19.00, SC: 14.00, ST: 11.00, EWS: 24.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "KBCNMU", total: 28900, splits: { General: 21.00, OBC: 43.00, SC: 8.00, ST: 19.00, EWS: 9.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "PAHUSH", total: 8500, splits: { General: 35.00, OBC: 18.00, SC: 17.00, ST: 15.00, EWS: 15.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "DBAMU", total: 19200, splits: { General: 94.00, OBC: 6.00, SC: 0, ST: 0, EWS: 0, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "GUG", total: 6400, splits: { General: 100.00, OBC: 0, SC: 0, ST: 0, EWS: 0, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "HBSU", total: 7200, splits: { General: 37.00, OBC: 14.00, SC: 23.00, ST: 9.00, EWS: 17.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "KBPU", total: 7480, splits: { General: 48.75, OBC: 15.34, SC: 11.84, ST: 0.75, EWS: 7.91, NT: 6.57, VJ: 2.92, SBC: 0.71, SEBC: 5.21, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "COEP", total: 15400, splits: { General: 49.00, OBC: 16.00, SC: 12.00, ST: 8.00, EWS: 15.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "BALAJI", total: 9600, splits: { General: 50.00, OBC: 21.00, SC: 10.00, ST: 10.00, EWS: 9.00, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "TMV", total: 4300, splits: { General: 63.00, OBC: 25.00, SC: 9.00, ST: 3.00, EWS: 0, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "MGM", total: 8200, splits: { General: 70.00, OBC: 15.00, SC: 9.00, ST: 6.00, EWS: 0, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "MIT AD...", total: 11200, splits: { General: 55.00, OBC: 21.00, SC: 8.00, ST: 16.00, EWS: 0, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "(Blank)", total: 18400, splits: { General: 73.00, OBC: 19.00, SC: 8.00, ST: 0, EWS: 0, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "Sanjivani", total: 6400, splits: { General: 72.00, OBC: 17.00, SC: 11.00, ST: 0, EWS: 0, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "Pimpri...", total: 9800, splits: { General: 37.00, OBC: 56.00, SC: 7.00, ST: 0, EWS: 0, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "GIPE Pu...", total: 7200, splits: { General: 61.00, OBC: 28.00, SC: 11.00, ST: 0, EWS: 0, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } },
    { name: "Ramdeo...", total: 10400, splits: { General: 67.00, OBC: 16.00, SC: 9.00, ST: 8.00, EWS: 0, NT: 0, VJ: 0, SBC: 0, SEBC: 0, EBC: 0, DT: 0, FN: 0, NA: 0 } }
  ];

  const categoryColors: Record<string, string> = {
    General: "#06b6d4",
    OBC: "#f97316",
    SC: "#facc15",
    ST: "#a855f7",
    EWS: "#ec4899",
    EBC: "#4b5563",
    NT: "#3b82f6",
    SBC: "#0d9488",
    SEBC: "#8b5cf6",
    "Foreign National": "#6366f1",
    NA: "#94a3b8"
  };

  const uniDataMapped = uniData.map(uni => {
    const raw = uni.splits as any;
    const general = raw.General || 0;
    const obc = raw.OBC || 0;
    const sc = raw.SC || 0;
    const st = raw.ST || 0;
    const ews = raw.EWS || 0;
    const ebc = raw.EBC || 0;
    const nt = (raw.NT || 0) + (raw.VJ || 0);
    const sbc = raw.SBC || 0;
    const sebc = raw.SEBC || 0;
    const fn = (raw["Foreign National"] || 0) + (raw.FN || 0);
    const na = (raw.NA || 0) + (raw.DT || 0);

    const sum = general + obc + sc + st + ews + ebc + nt + sbc + sebc + fn + na;
    const diff = 100 - sum;
    const adjustedGeneral = Math.max(0, general + diff);

    return {
      name: uni.name,
      total: uni.total,
      splits: {
        General: parseFloat(adjustedGeneral.toFixed(2)),
        OBC: obc,
        SC: sc,
        ST: st,
        EWS: ews,
        EBC: ebc,
        NT: nt,
        SBC: sbc,
        SEBC: sebc,
        "Foreign National": fn,
        NA: na
      }
    };
  });

  const categories = Object.keys(categoryColors);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  return (
    <div className="bg-gradient-to-br from-[#f0fdfa] via-white to-[#f0f9ff] rounded-3xl border border-teal-100/50 shadow-soft p-6 flex flex-col gap-6 w-full relative overflow-hidden mt-6">
      {/* Title */}
      <div className="text-center border-b border-slate-100 pb-4">
        <h3 className="text-base font-extrabold text-brand-900 tracking-tight">
          Category-wise Distribution in Universities and Programs
        </h3>
        <p className="text-xs text-brand-600 font-bold mt-0.5">2025-26</p>
      </div>

      {/* Scrollable Chart Wrapper */}
      <div className="w-full overflow-x-auto scrollbar-thin pb-4 relative">
        <div className="min-w-[2200px] h-[360px] relative flex items-end justify-between px-4 mt-4 select-none pb-16">
          
          {/* Y Axis Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-16 pt-4">
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
          </div>

          {/* Render Bars */}
          <div className="w-full h-full flex items-end justify-between z-10 relative">
            {uniDataMapped.map((uni, idx) => {
              // Convert splits to active segment array (in reverse order to stack correctly from bottom to top)
              const activeSplits = Object.entries(uni.splits)
                .map(([cat, pct]) => ({ cat, pct }))
                .filter(s => s.pct > 0)
                .reverse();

              return (
                <div
                  key={uni.name}
                  className={`flex flex-col items-center w-full max-w-[80px] relative ${
                    hoveredIndex === idx ? "z-50" : "z-10"
                  }`}
                  onMouseLeave={() => {
                    setHoveredSegment(null);
                    setHoveredIndex(null);
                  }}
                >
                  {/* Vertical Stacked Bar Container */}
                  <div className="h-64 w-12 flex flex-col rounded-md overflow-hidden cursor-pointer relative shadow-sm border border-slate-200/10">
                    {activeSplits.map(({ cat, pct }) => {
                      const color = categoryColors[cat] || "#94a3b8";
                      return (
                        <div
                          key={cat}
                          style={{ height: `${pct}%`, backgroundColor: color }}
                          className="w-full flex items-center justify-center relative transition-colors duration-200 hover:brightness-95"
                          onMouseEnter={() => {
                            setHoveredSegment({
                              uni: uni.name,
                              cat,
                              pct,
                              count: Math.round(uni.total * (pct / 100)),
                              splits: uni.splits,
                              total: uni.total
                            });
                            setHoveredIndex(idx);
                          }}
                        >
                          {pct >= 5 && (
                            <span className="text-[11px] font-black text-white">{Math.round(pct)}%</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Tooltip (Positioned relative to the Column wrapper, outside the overflow-hidden bar container) */}
                  {hoveredSegment && hoveredIndex === idx && (
                    <div
                      className={`absolute top-[128px] -translate-y-1/2 z-50 bg-[#dbebff]/95 border border-[#b9d7ff] backdrop-blur-sm shadow-xl rounded-2xl p-4 text-brand-900 w-[270px] select-none animate-fadeIn ${
                        idx < 14 ? "left-full ml-4" : "right-full mr-4"
                      }`}
                    >
                      <div className="grid grid-cols-[100px_1fr] gap-y-1 text-xs text-left">
                        <span className="font-bold text-blue-800/80 pr-2">University</span>
                        <span className="font-extrabold text-brand-950 text-right">{uni.name}</span>
                        
                        <span className="font-bold text-blue-800/80 pr-2">{hoveredSegment.cat}</span>
                        <span className="font-extrabold text-brand-950 text-right">
                          {formatNumber(hoveredSegment.count)} ({hoveredSegment.pct.toFixed(2)}%)
                        </span>
                      </div>

                      <div className="border-t border-blue-200/50 my-2" />
                      <div className="text-[10px] font-extrabold text-blue-800/80 uppercase tracking-wider mb-1">
                        All Percentages
                      </div>

                      <div className="flex flex-col gap-0.5 text-xs text-left max-h-[160px] overflow-y-auto pr-1">
                        {Object.entries(hoveredSegment.splits).map(([cat, pct]) => {
                          const displayPct = pct > 0 ? `${pct.toFixed(2)}%` : "-";
                          return (
                            <div key={cat} className="flex justify-between items-center text-[11px]">
                              <span className="font-bold text-slate-600">{cat} Percentage</span>
                              <span className="font-extrabold text-brand-950">{displayPct}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Tooltip Arrow */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#dbebff]/95 border-[#b9d7ff] transform rotate-45 ${
                          idx < 14
                            ? "-left-1.5 border-l border-b"
                            : "-right-1.5 border-t border-r"
                        }`}
                      />
                    </div>
                  )}

                  {/* Vertical / Rotated Label */}
                  <span
                    className="text-xs font-black text-brand-900 mt-3 block select-none h-12 flex items-center justify-center"
                    style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
                  >
                    {uni.name}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Legend Container */}
      <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-700 mt-2 border-t border-slate-100 pt-4">
        {categories.map(cat => (
          <span key={cat} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[cat], boxShadow: `0 2px 8px ${categoryColors[cat]}80` }} />
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}

function AdmissionTopProgramsChart() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "PhD",
    "PG",
    "PG Diploma",
    "UG",
    "Diploma",
    "Certificate",
    "Other"
  ]);

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const programDatabase = [
    // UG
    { name: "B.A.", type: "UG", female: 310000, male: 312000 },
    { name: "B.Sc.", type: "UG", female: 250000, male: 242008 },
    { name: "B.Com", type: "UG", female: 245000, male: 264000 },
    { name: "B.E - B.Tech", type: "UG", female: 135000, male: 250000 },
    { name: "B.Pharm", type: "UG", female: 65000, male: 46000 },
    
    // PG
    { name: "B.A.", type: "PG", female: 11167, male: 10865 },
    { name: "B.Sc.", type: "PG", female: 11958, male: 12200 },
    { name: "B.Com", type: "PG", female: 11250, male: 12812 },
    { name: "B.E - B.Tech", type: "PG", female: 10031, male: 12318 },
    { name: "B.Pharm", type: "PG", female: 3877, male: 4348 },

    // PhD
    { name: "Ph.D. Arts", type: "PhD", female: 1500, male: 1800 },
    { name: "Ph.D. Science", type: "PhD", female: 2200, male: 2500 },

    // PG Diploma
    { name: "PGD CA", type: "PG Diploma", female: 800, male: 950 },
    { name: "PGD Business", type: "PG Diploma", female: 1200, male: 1100 },

    // Diploma
    { name: "Diploma Eng.", type: "Diploma", female: 600, male: 900 },
    { name: "Diploma Pharm.", type: "Diploma", female: 450, male: 550 },

    // Certificate
    { name: "Cert. IT", type: "Certificate", female: 2000, male: 3000 },
    { name: "Cert. Language", type: "Certificate", female: 1500, male: 1200 },

    // Other
    { name: "Other Voc.", type: "Other", female: 3000, male: 4000 }
  ];

  const filteredData = programDatabase.filter(item => selectedTypes.includes(item.type));

  const femaleAggregated: Record<string, number> = {};
  filteredData.forEach(item => {
    femaleAggregated[item.name] = (femaleAggregated[item.name] || 0) + item.female;
  });
  const femaleList = Object.entries(femaleAggregated)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const maleAggregated: Record<string, number> = {};
  filteredData.forEach(item => {
    maleAggregated[item.name] = (maleAggregated[item.name] || 0) + item.male;
  });
  const maleList = Object.entries(maleAggregated)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const maxFemale = femaleList.length > 0 ? Math.max(...femaleList.map(d => d.value)) : 1;
  const maxMale = maleList.length > 0 ? Math.max(...maleList.map(d => d.value)) : 1;
  const globalMax = Math.max(maxFemale, maxMale);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  const types = ["PhD", "PG", "PG Diploma", "UG", "Diploma", "Certificate", "Other"];

  return (
    <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#f0f6ff] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-6 w-full relative mt-6">
      {/* Header & Title */}
      <div className="text-center border-b border-slate-100 pb-4">
        <h3 className="text-base font-extrabold text-brand-900 tracking-tight">
          Admission Based - Top 5 Program
        </h3>
        <p className="text-xs text-brand-600 font-bold mt-0.5">2025-26</p>
      </div>

      {/* Modern Filter Pills at Top */}
      <div className="w-[80%] mx-auto flex flex-wrap justify-around items-center gap-x-3 gap-y-3 border-b border-slate-100 pb-5">
        {types.map(t => {
          const isChecked = selectedTypes.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`px-6 py-2 rounded-xl text-xs font-black min-w-[120px] flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                isChecked
                  ? "bg-brand-900 text-white shadow-soft"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {isChecked && (
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              <span>{t}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Female vs Male side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
        
        {/* Left Side: Female Admissions */}
        <div className="flex flex-col gap-5 bg-pink-50/10 p-5 rounded-2xl border border-pink-100/20">
          <div className="flex items-center gap-2 pb-2 border-b border-pink-100/50">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff60b5] shadow-[0_0_8px_#ff60b5]" />
            <span className="text-xs font-black uppercase tracking-wider text-pink-700">Female Enrollment</span>
          </div>

          <div className="flex flex-col gap-4">
            {femaleList.map((item) => {
              const pct = globalMax > 0 ? (item.value / globalMax) * 100 : 0;
              return (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-black text-brand-900">
                    <span>{item.name}</span>
                    <span className="text-slate-600 font-bold">{formatNumber(item.value)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-lg h-7 overflow-hidden relative shadow-inner">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-[#ff60b5] hover:bg-[#ec4899] transition-all duration-500 h-full rounded-lg"
                    />
                  </div>
                </div>
              );
            })}
            {femaleList.length === 0 && (
              <div className="text-center text-xs text-slate-400 py-8 font-bold">No programs selected</div>
            )}
          </div>
        </div>

        {/* Right Side: Male Admissions */}
        <div className="flex flex-col gap-5 bg-blue-50/10 p-5 rounded-2xl border border-blue-100/20">
          <div className="flex items-center gap-2 pb-2 border-b border-blue-100/50">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]" />
            <span className="text-xs font-black uppercase tracking-wider text-blue-700">Male Enrollment</span>
          </div>

          <div className="flex flex-col gap-4">
            {maleList.map((item) => {
              const pct = globalMax > 0 ? (item.value / globalMax) * 100 : 0;
              return (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-black text-brand-900">
                    <span>{item.name}</span>
                    <span className="text-slate-600 font-bold">{formatNumber(item.value)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-lg h-7 overflow-hidden relative shadow-inner">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-[#3b82f6] hover:bg-[#2563eb] transition-all duration-500 h-full rounded-lg"
                    />
                  </div>
                </div>
              );
            })}
            {maleList.length === 0 && (
              <div className="text-center text-xs text-slate-400 py-8 font-bold">No programs selected</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function AdmittedStudentsMapCard() {
  const [hoveredState, setHoveredState] = useState<{ name: string; x: number; y: number; count: number } | null>(null);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  const otherStatesData = [
    { name: "Gujarat", x: 30, y: 49, count: 1240 },
    { name: "Karnataka", x: 45, y: 74, count: 980 },
    { name: "Madhya Pradesh", x: 49, y: 48, count: 850 },
    { name: "Telangana", x: 53, y: 65, count: 620 },
    { name: "Goa", x: 41, y: 70, count: 320 },
    { name: "Uttar Pradesh", x: 56, y: 35, count: 540 },
    { name: "Rajasthan", x: 37, y: 36, count: 480 },
    { name: "Delhi NCR", x: 48, y: 28, count: 710 },
    { name: "West Bengal", x: 71, y: 47, count: 390 },
    { name: "Tamil Nadu", x: 51, y: 84, count: 430 }
  ];

  return (
    <div className="bg-gradient-to-br from-[#f4f8ff] via-white to-[#f0f6ff] rounded-3xl border border-blue-100/50 shadow-soft p-6 flex flex-col gap-4 w-full relative">
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <h3 className="text-base font-extrabold text-brand-900 tracking-tight">
          Admitted Students from Other States
        </h3>
      </div>

      <div className="relative w-full h-[320px] bg-slate-50/50 rounded-2xl border border-slate-100/50 flex items-center justify-center overflow-hidden">
        {/* Simplified vector SVG map of India in background */}
        <svg viewBox="0 0 100 100" className="w-[280px] h-[280px] select-none opacity-80">
          <path
            d="M 48 8 L 52 14 L 46 22 L 48 26 L 38 32 L 32 40 L 26 48 L 30 52 L 34 50 L 40 56 L 44 64 L 41 72 L 44 82 L 47 90 L 51 92 L 53 86 L 56 80 L 54 70 L 60 62 L 66 56 L 72 50 L 74 46 L 68 40 L 64 36 L 58 36 L 54 30 L 50 18 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
        </svg>

        {/* State concentration markers (pulsing blue beacons) */}
        {otherStatesData.map((state) => (
          <div
            key={state.name}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: `${state.x}%`, top: `${state.y}%` }}
            onMouseEnter={() => setHoveredState(state)}
            onMouseLeave={() => setHoveredState(null)}
          >
            <span className="flex h-5 w-5 items-center justify-center relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3b82f6] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1d4ed8] border border-white shadow-soft"></span>
            </span>
          </div>
        ))}

        {/* Map Tooltip */}
        {hoveredState && (
          <div
            className="absolute bg-brand-950 text-white text-[11px] font-black px-2.5 py-1.5 rounded-lg shadow-lg z-30 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full mt-[-10px]"
            style={{ left: `${hoveredState.x}%`, top: `${hoveredState.y}%` }}
          >
            <div className="text-center">{hoveredState.name}</div>
            <div className="text-center text-blue-300 font-bold mt-0.5">{formatNumber(hoveredState.count)} Students</div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeeWaiverImpactChartCard() {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  const years = ["2022-23", "2023-24", "2024-25", "2025-26"];
  const ewsValues = [2346, 2548, 2353, 1766];
  const obcValues = [15441, 22929, 46274, 55856];
  const sebcValues = [null, null, 9640, 14810];

  // Coordinates computed for viewBox 0 0 500 250
  // X = 60 + index * 133.33
  // Y = 215 - (value / 60000) * 180
  
  const getObcPoints = () => "60,168.68 193.33,146.21 326.67,76.18 460,47.43";
  const getSebcPoints = () => "326.67,186.08 460,170.57";
  const getEwsPoints = () => "60,207.96 193.33,207.36 326.67,207.94 460,209.70";

  return (
    <div className="bg-gradient-to-br from-[#fdf2f8] via-white to-[#f0fdfa] rounded-3xl border border-pink-100/40 shadow-soft p-6 flex flex-col gap-4 w-full relative">
      <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h3 className="text-base font-extrabold text-brand-900 tracking-tight">
          Impact of Fee Waiver in Professional Courses for Females
        </h3>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-black text-slate-700">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Category</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> EWS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]" /> OBC
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" /> SEBC
          </span>
        </div>
      </div>

      <div className="relative w-full h-[320px] flex items-center justify-center mt-2 select-none">
        {/* SVG Container for the Line Chart */}
        <svg viewBox="0 0 500 250" className="w-full h-full">
          {/* Horizontal Gridlines */}
          <line x1="60" y1="215" x2="460" y2="215" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="60" y1="155" x2="460" y2="155" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="95" x2="460" y2="95" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="35" x2="460" y2="35" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

          {/* Y-axis Labels */}
          <text x="50" y="218" textAnchor="end" className="text-[10px] font-bold fill-slate-400">0</text>
          <text x="50" y="158" textAnchor="end" className="text-[10px] font-bold fill-slate-400">20K</text>
          <text x="50" y="98" textAnchor="end" className="text-[10px] font-bold fill-slate-400">40K</text>
          <text x="50" y="38" textAnchor="end" className="text-[10px] font-bold fill-slate-400">60K</text>

          {/* Y-axis Title */}
          <text x="18" y="125" textAnchor="middle" transform="rotate(-90 18 125)" className="text-[10px] font-black fill-slate-500 uppercase tracking-wider">
            Allotted University-wise Students
          </text>

          {/* X-axis Labels */}
          <text x="60" y="235" textAnchor="middle" className="text-[11px] font-black fill-slate-700">2022-23</text>
          <text x="193.33" y="235" textAnchor="middle" className="text-[11px] font-black fill-slate-700">2023-24</text>
          <text x="326.67" y="235" textAnchor="middle" className="text-[11px] font-black fill-slate-700">2024-25</text>
          <text x="460" y="235" textAnchor="middle" className="text-[11px] font-black fill-slate-700">2025-26</text>

          {/* Line: OBC (Dark Blue) */}
          <polyline
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={getObcPoints()}
            className="transition-all duration-300"
          />
          {/* OBC Labels above points */}
          <text x="60" y="158" textAnchor="middle" className="text-[11px] font-extrabold fill-[#1d4ed8]">15,441</text>
          <text x="193.33" y="136" textAnchor="middle" className="text-[11px] font-extrabold fill-[#1d4ed8]">22,929</text>
          <text x="326.67" y="66" textAnchor="middle" className="text-[11px] font-extrabold fill-[#1d4ed8]">46,274</text>
          <text x="460" y="37" textAnchor="middle" className="text-[11px] font-extrabold fill-[#1d4ed8]">55,856</text>

          {/* Line: SEBC (Orange) */}
          <polyline
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={getSebcPoints()}
            className="transition-all duration-300"
          />
          {/* SEBC Labels above points */}
          <text x="326.67" y="176" textAnchor="middle" className="text-[11px] font-extrabold fill-[#f97316]">9,640</text>
          <text x="460" y="160" textAnchor="middle" className="text-[11px] font-extrabold fill-[#f97316]">14,810</text>

          {/* Line: EWS (Light Blue) */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={getEwsPoints()}
            className="transition-all duration-300"
          />
          {/* EWS Labels below points */}
          <text x="60" y="196" textAnchor="middle" className="text-[11px] font-extrabold fill-[#3b82f6]">2,346</text>
          <text x="193.33" y="195" textAnchor="middle" className="text-[11px] font-extrabold fill-[#3b82f6]">2,548</text>
          <text x="326.67" y="196" textAnchor="middle" className="text-[11px] font-extrabold fill-[#3b82f6]">2,353</text>
          <text x="460" y="198" textAnchor="middle" className="text-[11px] font-extrabold fill-[#3b82f6]">1,766</text>

          {/* Markers */}
          <circle cx="60" cy="168.68" r="4.5" fill="#1d4ed8" stroke="white" strokeWidth="1.5" />
          <circle cx="193.33" cy="146.21" r="4.5" fill="#1d4ed8" stroke="white" strokeWidth="1.5" />
          <circle cx="326.67" cy="76.18" r="4.5" fill="#1d4ed8" stroke="white" strokeWidth="1.5" />
          <circle cx="460" cy="47.43" r="4.5" fill="#1d4ed8" stroke="white" strokeWidth="1.5" />

          <circle cx="326.67" cy="186.08" r="4.5" fill="#f97316" stroke="white" strokeWidth="1.5" />
          <circle cx="460" cy="170.57" r="4.5" fill="#f97316" stroke="white" strokeWidth="1.5" />

          <circle cx="60" cy="207.96" r="4.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
          <circle cx="193.33" cy="207.36" r="4.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
          <circle cx="326.67" cy="207.94" r="4.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
          <circle cx="460" cy="209.70" r="4.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />

          {/* Active selection vertical line and pulsing markers */}
          {hoveredYear !== null && (
            <>
              <line
                x1={60 + hoveredYear * 133.33}
                y1="35"
                x2={60 + hoveredYear * 133.33}
                y2="215"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle cx={60 + hoveredYear * 133.33} cy={215 - (ewsValues[hoveredYear]/60000)*180} r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
              <circle cx={60 + hoveredYear * 133.33} cy={215 - (obcValues[hoveredYear]/60000)*180} r="6" fill="#1d4ed8" stroke="white" strokeWidth="2" />
              {sebcValues[hoveredYear] !== null && (
                <circle cx={60 + hoveredYear * 133.33} cy={215 - (sebcValues[hoveredYear]!/60000)*180} r="6" fill="#f97316" stroke="white" strokeWidth="2" />
              )}
            </>
          )}

          {/* Invisible interactive hover slices */}
          {years.map((year, index) => {
            const x = 60 + index * 133.33;
            return (
              <rect
                key={year}
                x={x - 66}
                y="35"
                width="133.33"
                height="180"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredYear(index)}
                onMouseLeave={() => setHoveredYear(null)}
              />
            );
          })}
        </svg>

        {/* Line Chart Tooltip */}
        {hoveredYear !== null && (
          <div
            className="absolute bg-white/95 border border-slate-200 backdrop-blur shadow-xl rounded-xl p-3 text-brand-900 w-44 select-none z-30 pointer-events-none transition-all duration-150"
            style={{
              left: `${60 + hoveredYear * 133.33 + 12}px`,
              top: `45px`,
              transform: hoveredYear >= 2 ? `translateX(-210px)` : `none`
            }}
          >
            <div className="text-xs font-black text-brand-950 border-b border-slate-100 pb-1 mb-1.5">
              {years[hoveredYear]}
            </div>
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 font-bold text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                  EWS
                </span>
                <span className="font-extrabold text-brand-950">
                  {formatNumber(ewsValues[hoveredYear])}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 font-bold text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-[#1d4ed8]" />
                  OBC
                </span>
                <span className="font-extrabold text-brand-950">
                  {formatNumber(obcValues[hoveredYear])}
                </span>
              </div>
              {sebcValues[hoveredYear] !== null && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-bold text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                    SEBC
                  </span>
                  <span className="font-extrabold text-brand-950">
                    {formatNumber(sebcValues[hoveredYear]!)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
