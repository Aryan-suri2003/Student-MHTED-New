"use client";

import React, { useState, useEffect } from "react";
import { Users, BookOpen, School, Info, Percent, Maximize2, Minimize2 } from "lucide-react";
import { WestBengalAdmissionsSection, DistrictMapItem, ALL_BENGAL_TOTALS, WB_DISTRICTS } from "./WestBengalMap";
import { GlobalFilterState } from "./Filters";

import { PieChart3DModal, Slice } from "./PieChart3DModal";

interface DoughnutChartProps {
  slices: Slice[];
  totalLabel: string;
  totalValue: string;
  title?: string;
  onExpand?: (title: string, slices: Slice[]) => void;
}

function InteractiveDoughnut({ slices, totalLabel, totalValue, title, onExpand }: DoughnutChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<Slice | null>(null);
  const [activeLegendIndex, setActiveLegendIndex] = useState<number | null>(null);

  // Circumference calculation for r=48
  const circumference = 301.59;
  let cumulativePercentage = 0;

  return (
    <div className="flex flex-row items-center justify-between gap-8 w-full h-full mt-auto relative group">
      {onExpand && title && (
        <button
          onClick={() => onExpand(title, slices)}
          className="absolute -top-4 -right-2 p-1.5 bg-slate-100/50 hover:bg-blue-100 text-slate-500 hover:text-blue-700 rounded-lg transition-colors border border-slate-200 shadow-sm z-10 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
          title="Expand Chart"
        >
          <Maximize2 size={14} /> Expand
        </button>
      )}
      {/* Chart Wrapper */}
      <div className="relative w-40 h-40 select-none flex-shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {slices.map((slice, index) => {
            const percentage = slice.value;
            const strokeDashoffset = circumference - (circumference * percentage) / 100;
            const startAngle = (cumulativePercentage * 360) / 100;
            cumulativePercentage += percentage;

            const isHovered = hoveredSlice?.label === slice.label || activeLegendIndex === index;
            const someActive = hoveredSlice !== null || activeLegendIndex !== null;
            const opacity = someActive ? (isHovered ? 1 : 0.3) : 1;
            const filter = someActive && !isHovered ? "grayscale(45%)" : "none";

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
                  opacity,
                  filter,
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
                isSelected ? "bg-brand-100/80 font-black text-brand-900 scale-[1.02]" : "hover:bg-slate-50 text-slate-650 font-bold"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white/20"
                style={{ backgroundColor: slice.color, boxShadow: `0 2px 8px ${slice.color}cc` }}
              />
              <span className="truncate max-w-[130px] font-semibold">{slice.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface UniversityStatEntry {
  name: string;
  total: number;
  femalePct: number;
  malePct: number;
  transCount: number;
  freshAdmitted: number;
  coursesUG: number;
  coursesPG: number;
  coursesDip: number;
  coursesPhD: number;
  coursesCert: number;
  collegesAided: number;
  collegesGovt: number;
  collegesAuto: number;
}

const officialUniversityDirectory: Record<string, UniversityStatEntry> = {
  "CU": {
    name: "University of Calcutta",
    total: 214500,
    femalePct: 53.8,
    malePct: 46.2,
    transCount: 18,
    freshAdmitted: 148200,
    coursesUG: 164,
    coursesPG: 98,
    coursesDip: 22,
    coursesPhD: 38,
    coursesCert: 14,
    collegesAided: 154,
    collegesGovt: 14,
    collegesAuto: 8,
  },
  "MAKAUT": {
    name: "MAKAUT (WBUT)",
    total: 162400,
    femalePct: 31.8,
    malePct: 68.2,
    transCount: 12,
    freshAdmitted: 112600,
    coursesUG: 88,
    coursesPG: 74,
    coursesDip: 46,
    coursesPhD: 28,
    coursesCert: 18,
    collegesAided: 180,
    collegesGovt: 8,
    collegesAuto: 16,
  },
  "BU": {
    name: "University of Burdwan",
    total: 148200,
    femalePct: 51.9,
    malePct: 48.1,
    transCount: 14,
    freshAdmitted: 98400,
    coursesUG: 128,
    coursesPG: 68,
    coursesDip: 18,
    coursesPhD: 26,
    coursesCert: 10,
    collegesAided: 112,
    collegesGovt: 9,
    collegesAuto: 4,
  },
  "WBSU": {
    name: "West Bengal State University",
    total: 132600,
    femalePct: 54.5,
    malePct: 45.5,
    transCount: 12,
    freshAdmitted: 88500,
    coursesUG: 114,
    coursesPG: 48,
    coursesDip: 12,
    coursesPhD: 18,
    coursesCert: 8,
    collegesAided: 92,
    collegesGovt: 6,
    collegesAuto: 2,
  },
  "VU": {
    name: "Vidyasagar University",
    total: 122800,
    femalePct: 53.2,
    malePct: 46.8,
    transCount: 10,
    freshAdmitted: 81200,
    coursesUG: 106,
    coursesPG: 52,
    coursesDip: 14,
    coursesPhD: 22,
    coursesCert: 8,
    collegesAided: 84,
    collegesGovt: 8,
    collegesAuto: 3,
  },
  "KU": {
    name: "University of Kalyani",
    total: 118500,
    femalePct: 52.6,
    malePct: 47.4,
    transCount: 11,
    freshAdmitted: 77800,
    coursesUG: 98,
    coursesPG: 56,
    coursesDip: 12,
    coursesPhD: 24,
    coursesCert: 8,
    collegesAided: 76,
    collegesGovt: 7,
    collegesAuto: 2,
  },
  "NBU": {
    name: "North Bengal University",
    total: 84200,
    femalePct: 51.0,
    malePct: 49.0,
    transCount: 8,
    freshAdmitted: 54600,
    coursesUG: 84,
    coursesPG: 42,
    coursesDip: 10,
    coursesPhD: 20,
    coursesCert: 6,
    collegesAided: 62,
    collegesGovt: 5,
    collegesAuto: 2,
  },
  "UGB": {
    name: "University of Gour Banga",
    total: 76800,
    femalePct: 49.2,
    malePct: 50.8,
    transCount: 6,
    freshAdmitted: 49200,
    coursesUG: 72,
    coursesPG: 34,
    coursesDip: 8,
    coursesPhD: 14,
    coursesCert: 4,
    collegesAided: 48,
    collegesGovt: 4,
    collegesAuto: 1,
  },
  "KNU": {
    name: "Kazi Nazrul University",
    total: 64500,
    femalePct: 51.5,
    malePct: 48.5,
    transCount: 5,
    freshAdmitted: 41800,
    coursesUG: 68,
    coursesPG: 32,
    coursesDip: 8,
    coursesPhD: 12,
    coursesCert: 4,
    collegesAided: 42,
    collegesGovt: 3,
    collegesAuto: 1,
  },
  "SKBU": {
    name: "Sidho-Kanho-Birsha University",
    total: 48200,
    femalePct: 48.8,
    malePct: 51.2,
    transCount: 4,
    freshAdmitted: 31200,
    coursesUG: 54,
    coursesPG: 26,
    coursesDip: 6,
    coursesPhD: 10,
    coursesCert: 2,
    collegesAided: 34,
    collegesGovt: 3,
    collegesAuto: 1,
  },
  "BKU": {
    name: "Bankura University",
    total: 42600,
    femalePct: 53.0,
    malePct: 47.0,
    transCount: 3,
    freshAdmitted: 27500,
    coursesUG: 48,
    coursesPG: 24,
    coursesDip: 4,
    coursesPhD: 8,
    coursesCert: 2,
    collegesAided: 28,
    collegesGovt: 2,
    collegesAuto: 1,
  },
  "CBPBU": {
    name: "Cooch Behar Panchanan Barma Univ",
    total: 36800,
    femalePct: 50.5,
    malePct: 49.5,
    transCount: 3,
    freshAdmitted: 23600,
    coursesUG: 44,
    coursesPG: 22,
    coursesDip: 4,
    coursesPhD: 8,
    coursesCert: 2,
    collegesAided: 24,
    collegesGovt: 2,
    collegesAuto: 1,
  },
  "JU": {
    name: "Jadavpur University",
    total: 18400,
    femalePct: 45.5,
    malePct: 54.5,
    transCount: 4,
    freshAdmitted: 6800,
    coursesUG: 42,
    coursesPG: 58,
    coursesDip: 8,
    coursesPhD: 46,
    coursesCert: 12,
    collegesAided: 4,
    collegesGovt: 1,
    collegesAuto: 4,
  },
  "Presidency": {
    name: "Presidency University",
    total: 6200,
    femalePct: 52.0,
    malePct: 48.0,
    transCount: 2,
    freshAdmitted: 2400,
    coursesUG: 28,
    coursesPG: 34,
    coursesDip: 2,
    coursesPhD: 24,
    coursesCert: 6,
    collegesAided: 2,
    collegesGovt: 1,
    collegesAuto: 2,
  },
  "Visva-Bharati": {
    name: "Visva-Bharati Central University",
    total: 8900,
    femalePct: 52.5,
    malePct: 47.5,
    transCount: 2,
    freshAdmitted: 3200,
    coursesUG: 38,
    coursesPG: 44,
    coursesDip: 6,
    coursesPhD: 32,
    coursesCert: 10,
    collegesAided: 4,
    collegesGovt: 1,
    collegesAuto: 3,
  },
  "Aliah": {
    name: "Aliah University",
    total: 9400,
    femalePct: 42.0,
    malePct: 58.0,
    transCount: 2,
    freshAdmitted: 3600,
    coursesUG: 32,
    coursesPG: 28,
    coursesDip: 8,
    coursesPhD: 14,
    coursesCert: 4,
    collegesAided: 3,
    collegesGovt: 1,
    collegesAuto: 2,
  },
  "RBU": {
    name: "Rabindra Bharati University",
    total: 14200,
    femalePct: 56.5,
    malePct: 43.5,
    transCount: 3,
    freshAdmitted: 5800,
    coursesUG: 34,
    coursesPG: 38,
    coursesDip: 12,
    coursesPhD: 18,
    coursesCert: 8,
    collegesAided: 6,
    collegesGovt: 1,
    collegesAuto: 2,
  }
};

export default function AdmissionDashboard({
  globalFilters,
  onDistrictChange,
}: {
  globalFilters?: GlobalFilterState;
  onDistrictChange?: (district: string) => void;
}) {
  const [expandedChart, setExpandedChart] = useState<"program" | "region" | null>(null);
  const [selectedMapDistrict, setSelectedMapDistrict] = useState<DistrictMapItem | null>(null);
  const [expandedPieData, setExpandedPieData] = useState<{ title: string; slices: Slice[] } | null>(null);

  // Sync selectedMapDistrict when globalFilters.district changes
  useEffect(() => {
    if (globalFilters?.district && globalFilters.district !== "All") {
      const match = WB_DISTRICTS.find(
        (d) =>
          d.name.toLowerCase() === globalFilters.district.toLowerCase() ||
          d.id.toLowerCase() === globalFilters.district.toLowerCase()
      );
      if (match) {
        setSelectedMapDistrict(match);
      }
    } else if (globalFilters?.district === "All") {
      setSelectedMapDistrict(null);
    }
  }, [globalFilters?.district]);

  // Year scaling multiplier
  const yearMultiplier = 
    globalFilters?.academicYear === "2024-25" ? 0.93 :
    globalFilters?.academicYear === "2023-24" ? 0.86 :
    globalFilters?.academicYear === "2022-23" ? 0.80 : 1.0;

  const activeUniKey = globalFilters?.university && globalFilters.university !== "All"
    ? Object.keys(officialUniversityDirectory).find(k => k.toLowerCase() === globalFilters.university.toLowerCase()) || globalFilters.university
    : null;

  const uniStats = activeUniKey ? officialUniversityDirectory[activeUniKey] : null;

  const isCollegeFilterActive = Boolean(globalFilters?.college && globalFilters.college !== "All");
  const collegeScale = isCollegeFilterActive ? 0.025 : 1.0;

  // Compute exact metrics based on selected institution
  let rawTotal = 2453480;
  let rawFemalePct = 51.11;
  let rawMalePct = 48.89;
  let rawTrans = 168;
  let rawFresh = 1642850;
  let coursesUG = 362;
  let coursesPG = 218;
  let coursesDip = 114;
  let coursesPhD = 46;
  let coursesCert = 24;
  let collegesAided = 1222;
  let collegesGovt = 138;
  let collegesAuto = 92;

  if (uniStats) {
    rawTotal = uniStats.total;
    rawFemalePct = uniStats.femalePct;
    rawMalePct = uniStats.malePct;
    rawTrans = uniStats.transCount;
    rawFresh = uniStats.freshAdmitted;
    coursesUG = uniStats.coursesUG;
    coursesPG = uniStats.coursesPG;
    coursesDip = uniStats.coursesDip;
    coursesPhD = uniStats.coursesPhD;
    coursesCert = uniStats.coursesCert;
    collegesAided = uniStats.collegesAided;
    collegesGovt = uniStats.collegesGovt;
    collegesAuto = uniStats.collegesAuto;
  }

  // District scaling: if a map district is selected, proportion the data to that district
  // based on that district's outside-student count relative to total outside students
  const totalOutsideAll = ALL_BENGAL_TOTALS.count;
  const districtScale = selectedMapDistrict
    ? Math.min(1, selectedMapDistrict.count / totalOutsideAll + 0.12) // base 12% local + proportional outside
    : 1.0;

  const totalEnrolledNum = Math.round(rawTotal * yearMultiplier * collegeScale * districtScale);
  const femaleEnrolledNum = selectedMapDistrict
    ? Math.round(totalEnrolledNum * (selectedMapDistrict.female / selectedMapDistrict.count))
    : Math.round(totalEnrolledNum * (rawFemalePct / 100));
  const maleEnrolledNum = selectedMapDistrict
    ? Math.round(totalEnrolledNum * (selectedMapDistrict.male / selectedMapDistrict.count))
    : totalEnrolledNum - femaleEnrolledNum;
  const transEnrolledNum = Math.max(1, Math.round(rawTrans * yearMultiplier * collegeScale * districtScale));
  const freshAdmittedNum = Math.round(rawFresh * yearMultiplier * collegeScale * districtScale);

  const totalCourses = coursesUG + coursesPG + coursesDip + coursesPhD + coursesCert;
  const totalInstitutions = collegesAided + collegesGovt + collegesAuto;

  const formatNumber = (num: number) => num.toLocaleString("en-IN");

  // Card 1: Fresh Admissions Data
  const freshAdmissionsSlices: Slice[] = [
    { label: "Generated", value: 92.5, raw: formatNumber(Math.round(freshAdmittedNum * 0.925)), color: "#2563eb" },
    { label: "Pending", value: 7.5, raw: formatNumber(Math.round(freshAdmittedNum * 0.075)), color: "#ff60b5" },
  ];

  // Card 2: Courses Data
  const coursesSlices: Slice[] = [
    { label: "UG Programs", value: Math.round((coursesUG / totalCourses) * 100), raw: String(coursesUG), color: "#10b981" },
    { label: "PG Programs", value: Math.round((coursesPG / totalCourses) * 100), raw: String(coursesPG), color: "#8b5cf6" },
    { label: "Diploma / Poly", value: Math.round((coursesDip / totalCourses) * 100), raw: String(coursesDip), color: "#ec4899" },
    { label: "PhD / Research", value: Math.round((coursesPhD / totalCourses) * 100), raw: String(coursesPhD), color: "#2563eb" },
    { label: "Certificate", value: Math.round((coursesCert / totalCourses) * 100), raw: String(coursesCert), color: "#64748b" },
  ];

  // Card 3: College Types Data
  const collegeSlices: Slice[] = [
    { label: "State-Aided & Affiliated", value: parseFloat(((collegesAided / totalInstitutions) * 100).toFixed(1)), raw: String(collegesAided), color: "#2563eb" },
    { label: "Govt Colleges", value: parseFloat(((collegesGovt / totalInstitutions) * 100).toFixed(1)), raw: String(collegesGovt), color: "#10b981" },
    { label: "Autonomous & Deemed", value: parseFloat(((collegesAuto / totalInstitutions) * 100).toFixed(1)), raw: String(collegesAuto), color: "#f59e0b" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn pb-8">

      {/* 1. TOP GENERAL ENROLLMENT STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1: Total Enrolled */}
        <div className="bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 rounded-2xl border border-blue-100 hover:border-blue-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md relative overflow-hidden h-40 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[13px] font-black text-blue-600 uppercase tracking-widest">Total Enrolled</h4>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Users size={16} className="stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p className="text-[32px] leading-tight font-extrabold text-[#1e3a8a] tracking-tight">
              {formatNumber(totalEnrolledNum)}
            </p>
            <p className="text-[13px] text-[#1e3a8a] font-bold mt-1">
              {selectedMapDistrict
                ? `100% Enrolled in ${selectedMapDistrict.name}`
                : "100% Enrolled"}
            </p>
          </div>
        </div>

        {/* Card 2: Male Students */}
        <div className="bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 rounded-2xl border border-blue-100 hover:border-blue-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md relative overflow-hidden h-40 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[13px] font-black text-blue-600 uppercase tracking-widest">Male Enrolled</h4>
            <div className="px-2 py-1 bg-blue-50 text-blue-600 text-[11px] font-extrabold rounded-md">
              {rawMalePct.toFixed(1)}%
            </div>
          </div>
          <div>
            <p className="text-[32px] leading-tight font-extrabold text-[#1e3a8a] tracking-tight">
              {formatNumber(maleEnrolledNum)}
            </p>
            <p className="text-[13px] text-blue-600 font-bold mt-1">
              {rawMalePct.toFixed(2)}% Share
            </p>
          </div>
        </div>

        {/* Card 3: Female Students */}
        <div className="bg-gradient-to-r from-pink-100/60 to-white hover:from-pink-100 rounded-2xl border border-pink-200 hover:border-pink-300 p-6 flex flex-col justify-between shadow-sm hover:shadow-md relative overflow-hidden h-40 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[13px] font-black text-pink-600 uppercase tracking-widest">Female Enrolled</h4>
            <div className="px-2 py-1 bg-pink-50 text-pink-600 text-[11px] font-extrabold rounded-md">
              {rawFemalePct.toFixed(1)}%
            </div>
          </div>
          <div>
            <p className="text-[32px] leading-tight font-extrabold text-[#1e3a8a] tracking-tight">
              {formatNumber(femaleEnrolledNum)}
            </p>
            <p className="text-[13px] text-pink-600 font-bold mt-1">
              {rawFemalePct.toFixed(2)}% Share
            </p>
          </div>
        </div>

        {/* Card 4: Transgender */}
        <div className="bg-gradient-to-r from-purple-100/60 to-white hover:from-purple-100 rounded-2xl border border-purple-200 hover:border-purple-300 p-6 flex flex-col justify-between shadow-sm hover:shadow-md relative overflow-hidden h-40 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[13px] font-black text-purple-600 uppercase tracking-widest">Transgender</h4>
            <div className="px-2 py-1 bg-purple-50 text-purple-600 text-[11px] font-extrabold rounded-md">
              0.003%
            </div>
          </div>
          <div>
            <p className="text-[32px] leading-tight font-extrabold text-[#1e3a8a] tracking-tight">
              {formatNumber(transEnrolledNum)}
            </p>
            <p className="text-[13px] text-purple-600 font-bold mt-1">
              0.003% Share
            </p>
          </div>
        </div>

      </div>

      {/* 2. THREE COLUMNS GRAPHICAL ADMISSION DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Card 1: Fresh Admissions */}
        <div className="bg-slate-50/40 hover:bg-[#e9f2fc] rounded-3xl border border-slate-100 hover:border-blue-200/60 shadow-soft p-6 flex flex-col justify-between min-h-[310px] hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50/50 rounded-full -mr-8 -mt-8 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs bg-brand-50 text-brand-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-brand-100">
                A.Y. {globalFilters?.academicYear || "2025-26"}
              </span>
              <Users size={18} className="text-brand-500" />
            </div>

            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Fresh Admissions</h3>
            <p className="text-2xl font-extrabold text-brand-900 mt-1">{formatNumber(freshAdmittedNum)}</p>
            <p className="text-xs text-brand-600 font-semibold mt-1">Banglar Uchchashiksha / APAAR ID</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mt-4">
            <InteractiveDoughnut
              slices={freshAdmissionsSlices}
              totalLabel="Total"
              totalValue={freshAdmittedNum >= 100000 ? `${(freshAdmittedNum / 100000).toFixed(1)}L` : formatNumber(freshAdmittedNum)}
              title="Fresh Admissions"
              onExpand={(title, slices) => setExpandedPieData({ title, slices })}
            />
          </div>
        </div>

        {/* Card 2: Courses */}
        <div className="bg-[#faf5ff] hover:bg-[#eedffb] rounded-3xl border border-purple-100/50 hover:border-purple-250 shadow-soft p-6 flex flex-col justify-between min-h-[310px] hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50/50 rounded-full -mr-8 -mt-8 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs bg-violet-50 text-avatar font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-violet-100">
                A.Y. {globalFilters?.academicYear || "2025-26"}
              </span>
              <BookOpen size={18} className="text-avatar" />
            </div>

            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Courses</h3>
            <p className="text-2xl font-extrabold text-brand-900 mt-1">{formatNumber(totalCourses)}</p>
            <p className="text-xs text-avatar font-semibold mt-1">Courses by Program Type across HEIs</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mt-4">
            <InteractiveDoughnut
              slices={coursesSlices}
              totalLabel="Total"
              totalValue={formatNumber(totalCourses)}
              title="Total Courses by Program"
              onExpand={(title, slices) => setExpandedPieData({ title, slices })}
            />
          </div>
        </div>

        {/* Card 3: Colleges & Polytechnics */}
        <div className="bg-[#f0fdf4] hover:bg-[#dff7e7] rounded-3xl border border-emerald-100/50 hover:border-emerald-250 shadow-soft p-6 flex flex-col justify-between min-h-[310px] hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full -mr-8 -mt-8 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                A.Y. {globalFilters?.academicYear || "2025-26"}
              </span>
              <School size={18} className="text-emerald-500" />
            </div>

            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Colleges & Institutions</h3>
            <p className="text-2xl font-extrabold text-brand-900 mt-1">{formatNumber(totalInstitutions)}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Higher Education Institutions in WB</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mt-4">
            <InteractiveDoughnut
              slices={collegeSlices}
              totalLabel="Total"
              totalValue={formatNumber(totalInstitutions)}
              title="Colleges & Institutions"
              onExpand={(title, slices) => setExpandedPieData({ title, slices })}
            />
          </div>
        </div>

      </div>

      {/* 3. CHARTS SIDE-BY-SIDE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {expandedChart !== "region" && (
          <div className={expandedChart === "program" ? "col-span-1 xl:col-span-2" : "col-span-1"}>
            <ProgramTypeBarChart
              globalFilters={globalFilters}
              academicYear={globalFilters?.academicYear || "2025-26"}
              isExpanded={expandedChart === "program"}
              onToggleExpand={() => setExpandedChart(expandedChart === "program" ? null : "program")}
            />
          </div>
        )}
        {expandedChart !== "program" && (
          <div className={expandedChart === "region" ? "col-span-1 xl:col-span-2" : "col-span-1"}>
            <RegionCoverageChart
              globalFilters={globalFilters}
              academicYear={globalFilters?.academicYear || "2025-26"}
              isExpanded={expandedChart === "region"}
              onToggleExpand={() => setExpandedChart(expandedChart === "region" ? null : "region")}
            />
          </div>
        )}
      </div>

      {/* 4. UNIVERSITY-WISE APAAR ID COVERAGE (FULL WIDTH) */}
      <UniversityCoverageChart
        globalFilters={globalFilters}
        academicYear={globalFilters?.academicYear || "2025-26"}
      />

      {/* 5. GENDER & PROGRAM AND CATEGORY GENDER CHARTS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full mt-6">
        <GenderProgramUniversityChart
          globalFilters={globalFilters}
          academicYear={globalFilters?.academicYear || "2025-26"}
          selectedDistrict={selectedMapDistrict}
        />
        <CategoryGenderChart
          globalFilters={globalFilters}
          academicYear={globalFilters?.academicYear || "2025-26"}
          selectedDistrict={selectedMapDistrict}
        />
      </div>

      {/* 6. CATEGORY-WISE DISTRIBUTION IN UNIVERSITIES AND PROGRAMS (FULL WIDTH) */}
      <CategoryUniversityDistributionChart
        globalFilters={globalFilters}
        academicYear={globalFilters?.academicYear || "2025-26"}
      />

      {/* 7. ADMISSION BASED - TOP 5 PROGRAM (FULL WIDTH) */}
      <AdmissionTopProgramsChart
        globalFilters={globalFilters}
        academicYear={globalFilters?.academicYear || "2025-26"}
        selectedDistrict={selectedMapDistrict}
      />

      {/* 8. ADMITTED STUDENTS MAP & IMPACT OF FEE WAIVER (TWO SYNCHRONIZED CARDS) */}
      <WestBengalAdmissionsSection
        globalFilters={globalFilters}
        academicYear={globalFilters?.academicYear || "2025-26"}
        onDistrictChange={(distItem) => {
          setSelectedMapDistrict(distItem);
          if (onDistrictChange) {
            onDistrictChange(distItem ? distItem.name : "All");
          }
        }}
      />

      {expandedPieData && (
        <PieChart3DModal
          title={expandedPieData.title}
          slices={expandedPieData.slices}
          onClose={() => setExpandedPieData(null)}
        />
      )}
    </div>
  );
}

// Helper to match university filter IDs with names across charts
const matchUniversity = (filterUni?: string, targetUniName?: string) => {
  if (!filterUni || filterUni === "All") return true;
  if (!targetUniName) return false;
  const f = filterUni.toLowerCase().trim();
  const u = targetUniName.toLowerCase().trim();
  if (f === "cu" && (u.includes("calcutta") || u.includes("cu"))) return true;
  if (f === "ju" && (u.includes("jadavpur") || u.includes("ju"))) return true;
  if (f === "bu" && (u.includes("burdwan") || u.includes("bu"))) return true;
  if (f === "makaut" && (u.includes("makaut") || u.includes("wbut"))) return true;
  if (f === "ku" && (u.includes("kalyani") || u.includes("ku"))) return true;
  if (f === "vu" && (u.includes("vidyasagar") || u.includes("vu"))) return true;
  if (f === "nbu" && (u.includes("north bengal") || u.includes("nbu"))) return true;
  if (f === "ugb" && (u.includes("gour banga") || u.includes("ugb"))) return true;
  if (f === "knu" && (u.includes("kazi nazrul") || u.includes("knu"))) return true;
  if (f === "skbu" && (u.includes("sidho") || u.includes("skbu") || u.includes("purulia"))) return true;
  if (f === "bku" && (u.includes("bankura") || u.includes("bku"))) return true;
  if (f === "cbpbu" && (u.includes("panchanan") || u.includes("cooch") || u.includes("cbpbu"))) return true;
  if (f.includes("presidency") && u.includes("presidency")) return true;
  if (f.includes("visva") && u.includes("visva")) return true;
  if (f.includes("aliah") && u.includes("aliah")) return true;
  if (f.includes("rbu") && (u.includes("rabindra") || u.includes("rbu"))) return true;
  return u.includes(f) || f.includes(u);
};

function ProgramTypeBarChart({
  isExpanded,
  onToggleExpand,
  academicYear,
  globalFilters
}: {
  isExpanded: boolean;
  onToggleExpand: () => void;
  academicYear: string;
  globalFilters?: GlobalFilterState;
}) {
  const mappedGlobalUniv = (() => {
    if (!globalFilters?.university || globalFilters.university === "All") return "All";
    const u = globalFilters.university.toUpperCase();
    if (u === "CU") return "University of Calcutta";
    if (u === "JU") return "Jadavpur University";
    if (u === "BU") return "University of Burdwan";
    if (u === "MAKAUT") return "MAKAUT";
    if (u === "KU") return "University of Kalyani";
    if (u === "VU") return "Vidyasagar University";
    if (u === "NBU") return "University of North Bengal";
    if (u === "WBSU") return "West Bengal State University";
    if (u === "UGB") return "University of Gour Banga";
    if (u === "KNU") return "Kazi Nazrul University";
    if (u === "SKBU") return "Sidho-Kanho-Birsha University";
    if (u === "BKU") return "Bankura University";
    if (u === "CBPBU") return "Cooch Behar Panchanan Barma Univ";
    if (u === "PRESIDENCY") return "Presidency University";
    if (u.includes("VISVA")) return "Visva-Bharati";
    if (u === "ALIAH") return "Aliah University";
    if (u === "RBU") return "Rabindra Bharati University";
    return globalFilters.university;
  })();

  const [selectedUniv, setSelectedUniv] = useState(mappedGlobalUniv);
  const [selectedCollege, setSelectedCollege] = useState(globalFilters?.college || "All");
  const [hoveredBar, setHoveredBar] = useState<{
    group: string;
    gender: string;
    value: string;
    x: number;
    y: number;
  } | null>(null);
  const [selectedBar, setSelectedBar] = useState<{ group: string; gender: string } | null>(null);

  useEffect(() => {
    setSelectedUniv(mappedGlobalUniv);
    if (globalFilters?.college) {
      setSelectedCollege(globalFilters.college);
    }
  }, [globalFilters?.university, globalFilters?.college, mappedGlobalUniv]);

  const universityColleges: Record<string, string[]> = {
    "All": [
      "Presidency College Kolkata",
      "St. Xavier's College Kolkata",
      "Scottish Church College",
      "Bethune College",
      "Maulana Azad College",
      "Asutosh College",
      "Heritage Institute of Tech",
      "Haldia Institute of Tech",
      "Midnapore College",
      "Siliguri College",
      "Burdwan Raj College",
      "Krishnagar Govt College"
    ],
    "University of Calcutta": [
      "Presidency College Kolkata",
      "Scottish Church College",
      "Bethune College",
      "Maulana Azad College",
      "Asutosh College",
      "Lady Brabourne College",
      "Goenka College of Commerce"
    ],
    "Jadavpur University": [
      "JU Faculty of Engineering",
      "JU Faculty of Arts",
      "JU Faculty of Science",
      "JU Salt Lake Campus"
    ],
    "University of Burdwan": [
      "Burdwan Raj College",
      "Hooghly Mohsin College",
      "Chandernagore College",
      "MUC Women's College"
    ],
    "MAKAUT": [
      "Heritage Institute of Tech",
      "Haldia Institute of Tech",
      "Kalyani Govt Engineering College",
      "Jalpaiguri Govt Engineering College",
      "Techno Main Salt Lake"
    ],
    "University of Kalyani": [
      "Krishnagar Govt College",
      "Kalyani Mahavidyalaya",
      "Santipur College",
      "Berhampore College"
    ],
    "Vidyasagar University": [
      "Midnapore College",
      "Panskura Banamali College",
      "Haldia Govt College",
      "Jhargram Raj College"
    ],
    "University of North Bengal": [
      "Siliguri College",
      "Darjeeling Govt College",
      "St. Joseph's College Darjeeling",
      "Cooch Behar College"
    ],
    "West Bengal State University": [
      "Barasat Govt College",
      "APC College New Barrackpore",
      "Bhairab Ganguly College",
      "Dum Dum Motijheel College"
    ],
    "University of Gour Banga": [
      "Malda College",
      "Gour Mahavidyalaya",
      "South Malda College",
      "Chanchal College"
    ],
    "Kazi Nazrul University": [
      "Asansol Girls' College",
      "BB College Asansol",
      "Raniganj Girls' College",
      "Durgapur Women's College"
    ],
    "Sidho-Kanho-Birsha University": [
      "JK College Purulia",
      "Nistarini Women's College",
      "Raghunathpur College",
      "Kashipur Michael Madhusudan"
    ],
    "Bankura University": [
      "Bankura Sammilani College",
      "Bankura Christian College",
      "Ramananda College Bishnupur",
      "Barjora College"
    ],
    "Cooch Behar Panchanan Barma Univ": [
      "Acharya Brojendra Nath Seal College",
      "Dinhata College",
      "Tufanganj Mahavidyalaya",
      "Mathabhanga College"
    ],
    "Presidency University": [
      "Presidency Main Campus Kolkata",
      "Presidency Kurseong Center"
    ],
    "Visva-Bharati": [
      "Vidya Bhavana (Humanities)",
      "Siksha Bhavana (Science)",
      "Kala Bhavana (Fine Arts)",
      "Sangit Bhavana (Music)"
    ],
    "Aliah University": [
      "Aliah Park Circus Campus",
      "Aliah New Town Campus"
    ],
    "Rabindra Bharati University": [
      "RBU Jorasanko Campus",
      "RBU Emerald Bower Campus"
    ]
  };

  // Raw base data for West Bengal Higher Education
  const baseData = {
    UG: { female: 1012400, male: 971800, trans: 94 },
    PG: { female: 146200, male: 132200, trans: 42 },
    Diploma: { female: 72400, male: 90100, trans: 24 },
    PhD: { female: 8700, male: 8100, trans: 6 },
    Certificate: { female: 6800, male: 4780, trans: 2 },
    PGDiploma: { female: 7494, male: 2506, trans: 0 },
  };

  // Year scaling multiplier
  const yearMultiplier =
    academicYear === "2024-25" ? 0.93 :
    academicYear === "2023-24" ? 0.86 :
    academicYear === "2022-23" ? 0.80 : 1.0;

  // Scale multiplier based on selected university and college
  const activeUniKey = selectedUniv !== "All"
    ? Object.keys(officialUniversityDirectory).find(k => 
        k.toLowerCase() === selectedUniv.toLowerCase() ||
        officialUniversityDirectory[k].name.toLowerCase() === selectedUniv.toLowerCase() ||
        selectedUniv.toLowerCase().includes(k.toLowerCase())
      ) || selectedUniv
    : null;

  const uniStats = activeUniKey ? officialUniversityDirectory[activeUniKey] : null;
  const uniScale = uniStats ? (uniStats.total / 2453480) : 1.0;

  // College-specific scaling and metrics
  let collegeScale = 1.0;
  let collegeFemaleRatio = uniStats ? (uniStats.femalePct / 100) : 0.5111;
  let collegeMaleRatio = uniStats ? (uniStats.malePct / 100) : 0.4889;
  const isTechCollege = /tech|engineering|polytechnic/i.test(selectedCollege);
  const isWomenCollege = /women|girls|lady|bethune/i.test(selectedCollege);

  if (selectedCollege !== "All") {
    // Distinct college enrollment size (~2,200 to ~4,600 students)
    const collegeHash = selectedCollege.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const collegeBaseSize = 2200 + (collegeHash % 2400);
    const currentUniTotal = uniStats ? uniStats.total : 2453480;
    collegeScale = (collegeBaseSize / currentUniTotal);

    if (isWomenCollege) {
      collegeFemaleRatio = 0.98;
      collegeMaleRatio = 0.02;
    } else if (isTechCollege) {
      collegeFemaleRatio = 0.32;
      collegeMaleRatio = 0.68;
    } else {
      collegeFemaleRatio = 0.52;
      collegeMaleRatio = 0.48;
    }
  }

  const multiplier = yearMultiplier * uniScale * collegeScale;

  const rawUG = Math.round((baseData.UG.female + baseData.UG.male) * multiplier);
  const rawPG = Math.round((baseData.PG.female + baseData.PG.male) * multiplier);
  const rawDip = Math.round((baseData.Diploma.female + baseData.Diploma.male) * multiplier);
  const rawPhD = Math.round((baseData.PhD.female + baseData.PhD.male) * multiplier);
  const rawCert = Math.round((baseData.Certificate.female + baseData.Certificate.male) * multiplier);
  const rawPGDip = Math.round((baseData.PGDiploma.female + baseData.PGDiploma.male) * multiplier);

  const data = {
    UG: {
      female: Math.round(rawUG * collegeFemaleRatio),
      male: Math.round(rawUG * collegeMaleRatio),
      trans: Math.max(0, Math.round(baseData.UG.trans * multiplier)),
    },
    PG: {
      female: Math.round(rawPG * collegeFemaleRatio),
      male: Math.round(rawPG * collegeMaleRatio),
      trans: Math.max(0, Math.round(baseData.PG.trans * multiplier)),
    },
    Diploma: {
      female: Math.round(rawDip * (isTechCollege ? 0.28 : collegeFemaleRatio)),
      male: Math.round(rawDip * (isTechCollege ? 0.72 : collegeMaleRatio)),
      trans: Math.max(0, Math.round(baseData.Diploma.trans * multiplier)),
    },
    PhD: {
      female: Math.round(rawPhD * collegeFemaleRatio),
      male: Math.round(rawPhD * collegeMaleRatio),
      trans: Math.max(0, Math.round(baseData.PhD.trans * multiplier)),
    },
    Certificate: {
      female: Math.round(rawCert * collegeFemaleRatio),
      male: Math.round(rawCert * collegeMaleRatio),
      trans: Math.max(0, Math.round(baseData.Certificate.trans * multiplier)),
    },
    PGDiploma: {
      female: Math.round(rawPGDip * collegeFemaleRatio),
      male: Math.round(rawPGDip * collegeMaleRatio),
      trans: 0,
    },
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  // Find max value dynamically to determine heights
  const currentMax = Math.max(
    data.UG.female, data.UG.male,
    data.PG.female, data.PG.male,
    data.Diploma.female, data.Diploma.male
  );
  const maxValue = currentMax > 0 ? currentMax : 1012400;

  const groups = [
    { key: "UG", label: "UG", data: data.UG },
    { key: "PG", label: "PG", data: data.PG },
    { key: "Diploma", label: "Diploma", data: data.Diploma },
    { key: "PhD", label: "PhD", data: data.PhD },
    { key: "Certificate", label: "Certificate", data: data.Certificate },
    { key: "PGDiploma", label: "PG Diploma", data: data.PGDiploma },
  ];

  const currentColleges = universityColleges[selectedUniv] || universityColleges["All"];
  const isSpecificUniLocked = Boolean(globalFilters?.university && globalFilters.university !== "All");

  // Calculate Y-axis tick values for genuine graph appearance
  const yTicks = [
    maxValue,
    Math.round(maxValue * 0.75),
    Math.round(maxValue * 0.5),
    Math.round(maxValue * 0.25),
    0
  ];

  const formatYAxis = (val: number) => {
    if (val === 0) return "0";
    if (val >= 100000) return `${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L`;
    if (val >= 1000) return `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
    return val.toLocaleString("en-IN");
  };

  // Format compact label for on-bar numbers to avoid text collision
  const formatBarLabel = (num: number) => {
    if (num === 0) return "0";
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };

  return (
    <div
      onClick={() => setSelectedBar(null)}
      className={`rounded-3xl shadow-soft transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between w-full relative overflow-hidden ${
        selectedBar !== null
          ? "bg-[#e9f2fc] border border-blue-200/60"
          : "bg-slate-50/40 hover:bg-[#e9f2fc] border border-slate-100 hover:border-blue-200/60"
      }`}
    >

      {/* Expand/Collapse Float Button */}
      <button
        onClick={onToggleExpand}
        className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
        title={isExpanded ? "Collapse View" : "Enlarge View"}
      >
        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      {/* Top Filter & Header Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3">

        {/* Left Dropdown */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            University
          </label>
          <select
            value={selectedUniv}
            disabled={isSpecificUniLocked}
            onChange={(e) => {
              setSelectedUniv(e.target.value);
              setSelectedCollege("All");
            }}
            className={`w-full text-slate-700 font-semibold py-1.5 px-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none transition-colors duration-200 ${
              isSpecificUniLocked ? "bg-slate-100 cursor-not-allowed opacity-90" : "bg-slate-50 hover:bg-slate-100 cursor-pointer"
            }`}
          >
            {isSpecificUniLocked ? (
              <option value={selectedUniv}>{selectedUniv}</option>
            ) : (
              <>
                <option value="All">All Universities (West Bengal)</option>
                <option value="University of Calcutta">University of Calcutta (CU)</option>
                <option value="Jadavpur University">Jadavpur University (JU)</option>
                <option value="University of Burdwan">University of Burdwan (BU)</option>
                <option value="MAKAUT">MAKAUT (WBUT)</option>
                <option value="University of Kalyani">University of Kalyani (KU)</option>
                <option value="Vidyasagar University">Vidyasagar University (VU)</option>
                <option value="University of North Bengal">North Bengal University (NBU)</option>
                <option value="West Bengal State University">West Bengal State University (WBSU)</option>
                <option value="University of Gour Banga">University of Gour Banga (UGB)</option>
                <option value="Kazi Nazrul University">Kazi Nazrul University (KNU)</option>
                <option value="Sidho-Kanho-Birsha University">Sidho-Kanho-Birsha University (SKBU)</option>
                <option value="Bankura University">Bankura University (BKU)</option>
                <option value="Cooch Behar Panchanan Barma Univ">Cooch Behar Panchanan Barma Univ (CBPBU)</option>
                <option value="Presidency University">Presidency University</option>
                <option value="Visva-Bharati">Visva-Bharati University</option>
                <option value="Aliah University">Aliah University</option>
                <option value="Rabindra Bharati University">Rabindra Bharati University (RBU)</option>
              </>
            )}
          </select>
        </div>

        {/* Center Title */}
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-extrabold text-brand-900 tracking-tight">
            Program Type wise Admitted Students
          </h3>
          <p className="text-xs sm:text-sm text-brand-600 font-bold mt-0.5">
            {selectedCollege !== "All"
              ? `${selectedCollege}`
              : (selectedUniv !== "All" ? selectedUniv : "West Bengal")} — {academicYear}
          </p>
        </div>

        {/* Right Dropdown */}
        <div className="flex flex-col w-full sm:w-48 sm:items-end">
          <div className="w-full">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
              College Name
            </label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-1.5 px-2.5 rounded-xl border border-slate-200 cursor-pointer text-xs focus:outline-none transition-colors duration-200"
            >
              <option value="All">All Affiliated Colleges</option>
              {currentColleges.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* SVG Graphics Container with Horizontal Scroller */}
      <div className="w-full overflow-x-auto scrollbar-thin pb-3 pt-2">
        <div className={`relative min-w-[850px] sm:min-w-[960px] select-none transition-all duration-300 ${isExpanded ? "h-[420px]" : "h-[300px]"}`}>
          <svg
            viewBox="0 0 1020 300"
            className="w-full h-full overflow-visible select-none"
          >
            <defs>
              <linearGradient id="ptbFemaleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="ptbMaleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="ptbTransGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Ticks */}
            {[
              { val: maxValue, y: 40 },
              { val: Math.round(maxValue * 0.75), y: 88 },
              { val: Math.round(maxValue * 0.5), y: 137 },
              { val: Math.round(maxValue * 0.25), y: 186 },
              { val: 0, y: 235 },
            ].map((t, idx) => (
              <g key={idx}>
                {/* Y-Axis Label */}
                <text
                  x="56"
                  y={t.y + 4}
                  textAnchor="end"
                  className="fill-slate-400 font-bold text-[12px]"
                >
                  {formatYAxis(t.val)}
                </text>
                {/* Gridline */}
                {idx < 4 ? (
                  <line
                    x1="65"
                    y1={t.y}
                    x2="995"
                    y2={t.y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ) : (
                  /* X-Axis Baseline */
                  <line
                    x1="65"
                    y1={t.y}
                    x2="995"
                    y2={t.y}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            ))}

            {/* Clustered Bars for 6 Program Types */}
            {groups.map((group, i) => {
              const center = 145 + i * 160; // Centers: 145, 305, 465, 625, 785, 945
              const chartHeight = 195; // from y=40 to y=235
              const baselineY = 235;

              const fH = Math.max(4, (group.data.female / maxValue) * chartHeight);
              const mH = Math.max(4, (group.data.male / maxValue) * chartHeight);
              const tH = Math.max(3, (group.data.trans / maxValue) * chartHeight);

              const fY = baselineY - fH;
              const mY = baselineY - mH;
              const tY = baselineY - tH;

              const isAnyBarSelected = selectedBar !== null;
              const isFemaleSelected = selectedBar?.group === group.key && selectedBar?.gender === "Female";
              const isMaleSelected = selectedBar?.group === group.key && selectedBar?.gender === "Male";
              const isTransSelected = selectedBar?.group === group.key && selectedBar?.gender === "Transgender";

              return (
                <g key={group.key} className="cursor-pointer">
                  {/* 1. Female Bar - Extra Broad 42px */}
                  <g
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBar(isFemaleSelected ? null : { group: group.key, gender: "Female" });
                    }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        group: group.label,
                        gender: "Female",
                        value: formatNumber(group.data.female),
                        x: center - 27,
                        y: fY,
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <rect
                      x={center - 48}
                      y={fY}
                      width="42"
                      height={fH}
                      rx="6"
                      fill="url(#ptbFemaleGrad)"
                      opacity={isAnyBarSelected ? (isFemaleSelected ? 1 : 0.3) : 1}
                      className="transition-all duration-200 hover:brightness-110"
                    />
                    <text
                      x={center - 27}
                      y={fY - 5}
                      textAnchor="middle"
                      className="fill-pink-700 font-black text-[12px] select-none"
                    >
                      {formatBarLabel(group.data.female)}
                    </text>
                  </g>

                  {/* 2. Male Bar - Extra Broad 42px */}
                  <g
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBar(isMaleSelected ? null : { group: group.key, gender: "Male" });
                    }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        group: group.label,
                        gender: "Male",
                        value: formatNumber(group.data.male),
                        x: center + 18,
                        y: mY,
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <rect
                      x={center - 3}
                      y={mY}
                      width="42"
                      height={mH}
                      rx="6"
                      fill="url(#ptbMaleGrad)"
                      opacity={isAnyBarSelected ? (isMaleSelected ? 1 : 0.3) : 1}
                      className="transition-all duration-200 hover:brightness-110"
                    />
                    <text
                      x={center + 18}
                      y={mY - 5}
                      textAnchor="middle"
                      className="fill-blue-700 font-black text-[12px] select-none"
                    >
                      {formatBarLabel(group.data.male)}
                    </text>
                  </g>

                  {/* 3. Transgender Bar - Broad 18px */}
                  <g
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBar(isTransSelected ? null : { group: group.key, gender: "Transgender" });
                    }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        group: group.label,
                        gender: "Transgender",
                        value: formatNumber(group.data.trans),
                        x: center + 51,
                        y: tY,
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <rect
                      x={center + 42}
                      y={tY}
                      width="18"
                      height={tH}
                      rx="3.5"
                      fill="url(#ptbTransGrad)"
                      opacity={isAnyBarSelected ? (isTransSelected ? 1 : 0.3) : 1}
                      className="transition-all duration-200 hover:brightness-110"
                    />
                    <text
                      x={center + 51}
                      y={tY - 5}
                      textAnchor="middle"
                      className="fill-purple-700 font-bold text-[11px] select-none"
                    >
                      {group.data.trans}
                    </text>
                  </g>

                  {/* X-Axis Program Category Label */}
                  <text
                    x={center + 4}
                    y="262"
                    textAnchor="middle"
                    className="fill-brand-900 font-black text-[14px] select-none uppercase tracking-wider"
                  >
                    {group.label}
                  </text>
                </g>
              );
            })}

            {/* Hover Tooltip Box Anchored Directly to the Hovered Bar */}
            {hoveredBar && (() => {
              const tipX = Math.max(105, Math.min(915, hoveredBar.x));
              const tipY = Math.max(100, hoveredBar.y - 12);

              return (
                <g
                  className="pointer-events-none transition-all duration-150 ease-out"
                  transform={`translate(${tipX}, ${tipY})`}
                  style={{ filter: "drop-shadow(0 12px 24px rgba(30, 58, 138, 0.22))" }}
                >
                  {/* Tooltip Card with exact light-blue style */}
                  <rect
                    x="-95"
                    y="-94"
                    width="190"
                    height="90"
                    rx="16"
                    fill="#eff6ff"
                    stroke="#bfdbfe"
                    strokeWidth="1.5"
                  />
                  {/* Little Pointer Arrow pointing down to the bar */}
                  <polygon
                    points="-6,-4 6,-4 0,2"
                    fill="#eff6ff"
                    stroke="#bfdbfe"
                    strokeWidth="1.5"
                  />
                  <line x1="-5.5" y1="-4" x2="5.5" y2="-4" stroke="#eff6ff" strokeWidth="2" />

                  {/* Row 1: Program */}
                  <text x="-80" y="-74" fill="#1d4ed8" fontSize="10.5" fontWeight="700">Program</text>
                  <text x="-15" y="-74" fill="#030712" fontSize="11" fontWeight="900">{hoveredBar.group}</text>

                  {/* Row 2: Gender */}
                  <text x="-80" y="-59" fill="#1d4ed8" fontSize="10.5" fontWeight="700">Gender</text>
                  <text x="-15" y="-59" fill="#030712" fontSize="11" fontWeight="900">{hoveredBar.gender}</text>

                  {/* Row 3: Metric */}
                  <text x="-80" y="-44" fill="#1d4ed8" fontSize="10.5" fontWeight="700">Metric</text>
                  <text x="-15" y="-44" fill="#030712" fontSize="11" fontWeight="900">Admitted Students</text>

                  {/* Row 4: Value */}
                  <text x="-80" y="-29" fill="#1d4ed8" fontSize="10.5" fontWeight="700">Value</text>
                  <text x="-15" y="-29" fill="#030712" fontSize="11.5" fontWeight="900">{hoveredBar.value}</text>

                  {/* Divider */}
                  <line x1="-80" y1="-18" x2="80" y2="-18" stroke="#bfdbfe" strokeWidth="1" />

                  {/* Row 5: Drill down */}
                  <circle cx="-73" cy="-9" r="5" fill="#dbeafe" />
                  <text x="-73" y="-6.5" textAnchor="middle" fill="#1d4ed8" fontSize="7.5" fontWeight="900">↓</text>
                  <text x="-62" y="-6" fill="#1d4ed8" fontSize="10" fontWeight="800">Drill down</text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Bottom Legend */}
      <div className="mt-2 border-t border-slate-100 pt-3 flex justify-center items-center gap-6 text-xs font-bold text-slate-700">
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#ec4899]" style={{ boxShadow: '0 2px 6px rgba(236,72,153,0.4)' }} />
          Female
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#3b82f6]" style={{ boxShadow: '0 2px 6px rgba(59,130,246,0.4)' }} />
          Male
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#8b5cf6]" style={{ boxShadow: '0 2px 6px rgba(139,92,246,0.4)' }} />
          Transgender
        </span>
      </div>

    </div>
  );
}

function RegionCoverageChart({
  isExpanded,
  onToggleExpand,
  academicYear,
  globalFilters
}: {
  isExpanded: boolean;
  onToggleExpand: () => void;
  academicYear: string;
  globalFilters?: GlobalFilterState;
}) {
  const targetDivision = (() => {
    if (!globalFilters?.university || globalFilters.university === "All") return "All";
    const u = globalFilters.university.toUpperCase();
    if (["CU", "JU", "WBSU", "PRESIDENCY", "ALIAH", "RBU"].includes(u)) return "Presidency Division";
    if (["BU", "KNU"].includes(u)) return "Burdwan Division";
    if (["VU", "SKBU", "BKU"].includes(u)) return "Medinipur Division";
    if (["UGB"].includes(u)) return "Malda Division";
    if (["NBU", "CBPBU"].includes(u)) return "Jalpaiguri Division";
    return "All";
  })();

  const isDivisionLocked = Boolean(globalFilters?.university && globalFilters.university !== "All");

  const [selectedRegion, setSelectedRegion] = useState(targetDivision);
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [hoveredBar, setHoveredBar] = useState<{ region: string; type: string; value: string } | null>(null);

  useEffect(() => {
    setSelectedRegion(targetDivision);
  }, [targetDivision]);

  // Year scaling multiplier
  const yearMultiplier =
    academicYear === "2024-25" ? 0.93 :
    academicYear === "2023-24" ? 0.86 :
    academicYear === "2022-23" ? 0.80 : 1.0;

  // APAAR adoption rate scaling by year (rollout started nationwide in 2023)
  const apaarRateFactor =
    academicYear === "2024-25" ? 0.88 :
    academicYear === "2023-24" ? 0.72 :
    academicYear === "2022-23" ? 0.52 : 1.0;

  // 5 Official Administrative Divisions of West Bengal (in Thousands)
  const baseDivisions = [
    { name: "Presidency Division", admitted: Math.round(942 * yearMultiplier), generated: Math.round(840 * yearMultiplier * apaarRateFactor) },
    { name: "Burdwan Division", admitted: Math.round(568 * yearMultiplier), generated: Math.round(480 * yearMultiplier * apaarRateFactor) },
    { name: "Medinipur Division", admitted: Math.round(436 * yearMultiplier), generated: Math.round(355 * yearMultiplier * apaarRateFactor) },
    { name: "Malda Division", admitted: Math.round(312 * yearMultiplier), generated: Math.round(245 * yearMultiplier * apaarRateFactor) },
    { name: "Jalpaiguri Division", admitted: Math.round(195 * yearMultiplier), generated: Math.round(160 * yearMultiplier * apaarRateFactor) },
  ];

  const divisionDistricts: Record<string, { name: string; admitted: number; generated: number }[]> = {
    "Presidency Division": [
      { name: "Kolkata", admitted: Math.round(185 * yearMultiplier), generated: Math.round(168 * yearMultiplier * apaarRateFactor) },
      { name: "North 24 Parganas", admitted: Math.round(245 * yearMultiplier), generated: Math.round(218 * yearMultiplier * apaarRateFactor) },
      { name: "South 24 Parganas", admitted: Math.round(210 * yearMultiplier), generated: Math.round(186 * yearMultiplier * apaarRateFactor) },
      { name: "Howrah", admitted: Math.round(162 * yearMultiplier), generated: Math.round(145 * yearMultiplier * apaarRateFactor) },
      { name: "Nadia", admitted: Math.round(140 * yearMultiplier), generated: Math.round(123 * yearMultiplier * apaarRateFactor) }
    ],
    "Burdwan Division": [
      { name: "Purba Bardhaman", admitted: Math.round(165 * yearMultiplier), generated: Math.round(140 * yearMultiplier * apaarRateFactor) },
      { name: "Paschim Bardhaman", admitted: Math.round(195 * yearMultiplier), generated: Math.round(168 * yearMultiplier * apaarRateFactor) },
      { name: "Birbhum", admitted: Math.round(73 * yearMultiplier), generated: Math.round(60 * yearMultiplier * apaarRateFactor) },
      { name: "Hooghly", admitted: Math.round(135 * yearMultiplier), generated: Math.round(112 * yearMultiplier * apaarRateFactor) }
    ],
    "Medinipur Division": [
      { name: "Paschim Medinipur", admitted: Math.round(148 * yearMultiplier), generated: Math.round(122 * yearMultiplier * apaarRateFactor) },
      { name: "Purba Medinipur", admitted: Math.round(132 * yearMultiplier), generated: Math.round(108 * yearMultiplier * apaarRateFactor) },
      { name: "Bankura", admitted: Math.round(84 * yearMultiplier), generated: Math.round(68 * yearMultiplier * apaarRateFactor) },
      { name: "Purulia", admitted: Math.round(52 * yearMultiplier), generated: Math.round(42 * yearMultiplier * apaarRateFactor) },
      { name: "Jhargram", admitted: Math.round(20 * yearMultiplier), generated: Math.round(15 * yearMultiplier * apaarRateFactor) }
    ],
    "Malda Division": [
      { name: "Murshidabad", admitted: Math.round(142 * yearMultiplier), generated: Math.round(110 * yearMultiplier * apaarRateFactor) },
      { name: "Malda", admitted: Math.round(96 * yearMultiplier), generated: Math.round(76 * yearMultiplier * apaarRateFactor) },
      { name: "Uttar Dinajpur", admitted: Math.round(48 * yearMultiplier), generated: Math.round(38 * yearMultiplier * apaarRateFactor) },
      { name: "Dakshin Dinajpur", admitted: Math.round(26 * yearMultiplier), generated: Math.round(21 * yearMultiplier * apaarRateFactor) }
    ],
    "Jalpaiguri Division": [
      { name: "Jalpaiguri", admitted: Math.round(58 * yearMultiplier), generated: Math.round(48 * yearMultiplier * apaarRateFactor) },
      { name: "Darjeeling", admitted: Math.round(64 * yearMultiplier), generated: Math.round(53 * yearMultiplier * apaarRateFactor) },
      { name: "Cooch Behar", admitted: Math.round(42 * yearMultiplier), generated: Math.round(34 * yearMultiplier * apaarRateFactor) },
      { name: "Alipurduar", admitted: Math.round(24 * yearMultiplier), generated: Math.round(19 * yearMultiplier * apaarRateFactor) },
      { name: "Kalimpong", admitted: Math.round(7 * yearMultiplier), generated: Math.round(6 * yearMultiplier * apaarRateFactor) }
    ]
  };

  // Determine active display data
  const rawData = (() => {
    if (selectedRegion !== "All" && divisionDistricts[selectedRegion]) {
      const distList = divisionDistricts[selectedRegion];
      if (selectedDistrict !== "All") {
        return distList.filter(d => d.name === selectedDistrict);
      }
      return distList;
    }
    if (selectedDistrict !== "All") {
      for (const div of Object.values(divisionDistricts)) {
        const found = div.find(d => d.name === selectedDistrict);
        if (found) return [found];
      }
    }
    return baseDivisions;
  })();

  const data = rawData.map((item) => {
    const percentage = item.admitted > 0 ? (item.generated / item.admitted) * 100 : 100;
    return {
      name: item.name,
      admitted: item.admitted,
      generated: item.generated,
      percentage: parseFloat(percentage.toFixed(2)),
    };
  });

  const formatNumber = (num: number) => {
    return (num * 1000).toLocaleString("en-IN");
  };

  const currentMaxVal = Math.max(...data.map(d => d.admitted), 100);
  const maxValue = currentMaxVal * 1.15;
  const minPercent = 70;

  // Calculate coordinates for SVG elements dynamically based on number of items
  const count = data.length;
  const step = 700 / (count + 1);
  const centers = data.map((_, i) => 50 + step * (i + 1));
  const barWidth = Math.max(24, Math.min(42, 240 / count));

  const points = data.map((item, i) => {
    const x = centers[i];
    const p = item.percentage;
    const y = 240 - ((p - minPercent) / (100 - minPercent)) * 200;
    return { x, y, value: p };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Available districts for dropdown
  const availableDistricts = selectedRegion !== "All" && divisionDistricts[selectedRegion]
    ? divisionDistricts[selectedRegion].map(d => d.name)
    : Object.values(divisionDistricts).flatMap(div => div.map(d => d.name));

  return (
    <div className="bg-[#f5f3ff] hover:bg-[#e0e7ff] rounded-3xl border border-indigo-200/40 hover:border-indigo-300 shadow-soft transition-all duration-300 p-6 flex flex-col gap-6 w-full relative overflow-hidden">

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
        <div className="flex flex-col w-full sm:w-56">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Division
          </label>
          <select
            value={selectedRegion}
            disabled={isDivisionLocked}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedDistrict("All");
            }}
            className={`w-full text-slate-700 font-semibold py-2 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none transition-colors duration-200 ${
              isDivisionLocked ? "bg-slate-100 cursor-not-allowed opacity-90" : "bg-slate-50 hover:bg-slate-100 cursor-pointer"
            }`}
          >
            {isDivisionLocked ? (
              <option value={targetDivision}>{targetDivision}</option>
            ) : (
              <>
                <option value="All">All Divisions (West Bengal)</option>
                <option value="Presidency Division">Presidency Division</option>
                <option value="Burdwan Division">Burdwan Division</option>
                <option value="Medinipur Division">Medinipur Division</option>
                <option value="Malda Division">Malda Division</option>
                <option value="Jalpaiguri Division">Jalpaiguri Division</option>
              </>
            )}
          </select>
        </div>

        {/* Center Title */}
        <div className="text-center">
          <h3 className="text-lg font-extrabold text-brand-900 tracking-tight">
            Division and District-wise APAAR ID Coverage
          </h3>
          <p className="text-sm text-brand-600 font-bold mt-0.5">{academicYear}</p>
        </div>

        {/* Right Dropdown */}
        <div className="flex flex-col w-full sm:w-56 sm:items-end">
          <div className="w-full">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-3 rounded-xl border border-slate-200 cursor-pointer text-sm focus:outline-none transition-colors duration-200"
            >
              <option value="All">
                {selectedRegion !== "All" ? `All Districts in ${selectedRegion.replace(" Division", "")}` : "All Districts"}
              </option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
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

function UniversityCoverageChart({
  academicYear,
  globalFilters
}: {
  academicYear: string;
  globalFilters?: GlobalFilterState;
}) {
  const [hoveredUni, setHoveredUni] = useState<any | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedUniIndex, setSelectedUniIndex] = useState<number | null>(null);

  // Year scaling multiplier
  const yearMultiplier =
    academicYear === "2024-25" ? 0.93 :
    academicYear === "2023-24" ? 0.86 :
    academicYear === "2022-23" ? 0.80 : 1.0;

  const apaarRateFactor =
    academicYear === "2024-25" ? 0.88 :
    academicYear === "2023-24" ? 0.72 :
    academicYear === "2022-23" ? 0.52 : 1.0;

  // Official West Bengal State and Central Universities Data
  const rawUniData = [
    { name: "CU", basePct: 91.40, admitted: 214500 },
    { name: "MAKAUT", basePct: 89.60, admitted: 162400 },
    { name: "BU", basePct: 86.20, admitted: 148200 },
    { name: "WBSU", basePct: 84.50, admitted: 132600 },
    { name: "VU", basePct: 83.80, admitted: 122800 },
    { name: "KU", basePct: 83.10, admitted: 118500 },
    { name: "NBU", basePct: 81.50, admitted: 84200 },
    { name: "UGB", basePct: 79.40, admitted: 76800 },
    { name: "KNU", basePct: 80.20, admitted: 64500 },
    { name: "SKBU", basePct: 76.50, admitted: 48200 },
    { name: "BKU", basePct: 77.80, admitted: 42600 },
    { name: "CBPBU", basePct: 74.60, admitted: 36800 },
    { name: "JU", basePct: 96.80, admitted: 18400 },
    { name: "Presidency", basePct: 98.40, admitted: 6200 },
    { name: "Visva-Bharati", basePct: 95.20, admitted: 8900 }
  ];

  const universityData = rawUniData.map(u => {
    const scaledAdmitted = Math.round(u.admitted * yearMultiplier);
    const scaledPct = parseFloat((u.basePct * apaarRateFactor).toFixed(2));
    const apaar = Math.round(scaledAdmitted * (scaledPct / 100));
    return {
      name: u.name,
      pct: scaledPct,
      admitted: scaledAdmitted,
      apaar
    };
  });

  const isFilterActive = Boolean(globalFilters?.university && globalFilters.university !== "All");

  const getBarGradient = (pct: number) => {
    if (pct >= 85) return "linear-gradient(to top, #059669, #34d399)"; // High: Deep emerald
    if (pct >= 75) return "linear-gradient(to top, #10b981, #6ee7b7)"; // Good: Green
    if (pct >= 65) return "linear-gradient(to top, #65a30d, #a3e635)"; // Moderate-high: Lime
    if (pct >= 55) return "linear-gradient(to top, #d97706, #fbbf24)"; // Moderate: Amber/Yellow
    if (pct >= 45) return "linear-gradient(to top, #ea580c, #fb923c)"; // Low-moderate: Orange
    return "linear-gradient(to top, #dc2626, #f87171)"; // Low: Red
  };

  const getTextColor = (pct: number) => {
    if (pct >= 75) return "#047857";
    if (pct >= 65) return "#4d7c0f";
    if (pct >= 55) return "#b45309";
    if (pct >= 45) return "#c2410c";
    return "#b91c1c";
  };

  const getGlowColor = (pct: number) => {
    if (pct >= 75) return "0 0 16px rgba(16, 185, 129, 0.75)";
    if (pct >= 55) return "0 0 16px rgba(245, 158, 11, 0.75)";
    return "0 0 16px rgba(239, 68, 68, 0.75)";
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  return (
    <div
      onClick={() => setSelectedUniIndex(null)}
      className={`rounded-3xl shadow-soft transition-all duration-300 p-6 flex flex-col gap-6 w-full relative overflow-hidden ${
        selectedUniIndex !== null || isFilterActive
          ? "bg-[#e6f9ed] border-2 border-emerald-400/80 shadow-md"
          : "bg-[#f0fdfa] hover:bg-[#e6f9ed] border border-teal-200/50 hover:border-emerald-300/60"
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-extrabold text-brand-900 tracking-tight">
            University-wise APAAR ID Coverage
          </h3>
          <p className="text-sm text-brand-600 font-bold mt-0.5">
            {academicYear} — State Level Benchmark with Active Filter Highlighting
          </p>
        </div>
      </div>

      {/* Bar Chart Graphic Area */}
      <div className="w-full overflow-x-auto scrollbar-thin pb-2">
        <div className="relative min-w-[900px] h-76 flex items-end justify-between px-4 mt-8 select-none pb-12 pt-10">

          {/* Render Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-4 pb-12 pt-10">
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
          </div>

          {/* Render Bars */}
          <div className="w-full h-full flex items-end justify-around z-10">
            {universityData.map((uni, index) => {
              const isMatch = isFilterActive && matchUniversity(globalFilters?.university, uni.name);
              const barPercent = Math.min(100, Math.max(12, uni.pct));
              const isSelected = selectedUniIndex === index || isMatch;
              const isAnySelected = selectedUniIndex !== null || isFilterActive;
              const isTooltipVisible = selectedUniIndex !== null ? selectedUniIndex === index : (hoveredIndex === index);

              return (
                <div
                  key={uni.name}
                  className={`flex flex-col items-center w-full max-w-[70px] relative transition-all duration-300 ${
                    hoveredIndex === index || isSelected ? "z-50" : "z-10"
                  }`}
                  style={{
                    opacity: isAnySelected ? (isSelected ? 1 : 0.35) : 1,
                    filter: isAnySelected && !isSelected ? "grayscale(30%)" : "none"
                  }}
                >

                  {/* Visual Bar Container */}
                  <div className="h-44 w-full flex flex-col justify-end items-center relative">

                    {/* Pct Label */}
                    <span
                      className={`absolute bottom-full mb-1.5 text-[11.5px] font-black whitespace-nowrap select-none animate-fadeIn tracking-tight ${
                        isMatch ? "scale-110 text-emerald-900 bg-emerald-100/90 px-1.5 py-0.5 rounded-md border border-emerald-300" : ""
                      }`}
                      style={{ color: isMatch ? "#065f46" : getTextColor(uni.pct) }}
                    >
                      {uni.pct.toFixed(2)}%
                    </span>

                    {/* Bar Rect */}
                    <div
                      style={{
                        height: `${barPercent}%`,
                        background: getBarGradient(uni.pct),
                        transform: isSelected ? "scale(1.08)" : "none",
                        boxShadow: isSelected ? getGlowColor(uni.pct) : "none"
                      }}
                      className={`w-12 rounded-t-md transition-all duration-300 hover:brightness-110 cursor-pointer relative shadow-sm ${
                        isMatch ? "ring-4 ring-emerald-500 shadow-xl brightness-105" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUniIndex(selectedUniIndex === index ? null : index);
                      }}
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
                      {isTooltipVisible && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 z-45 bg-[#dbebff]/95 border border-[#b9d7ff] backdrop-blur-sm shadow-xl rounded-2xl p-4 text-brand-900 w-64 select-none pointer-events-none animate-fadeIn ${
                            index < 7 ? "left-full ml-4" : "right-full mr-4"
                          }`}
                        >
                          <div className="grid grid-cols-[130px_1fr] gap-y-1.5 text-xs text-left">
                            <span className="font-bold text-blue-800/80 pr-2">University</span>
                            <span className="font-extrabold text-brand-950 text-right">{uni.name}</span>

                            <span className="font-bold text-blue-800/80 pr-2">APAAR ID Generated</span>
                            <span className="font-black text-brand-950 text-right" style={{ color: getTextColor(uni.pct) }}>
                              {uni.pct.toFixed(2)}%
                            </span>

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
                      className={`text-xs select-none whitespace-nowrap ${
                        isMatch
                          ? "font-black text-emerald-950 bg-emerald-200/90 px-1.5 py-1 rounded-md shadow-sm border border-emerald-400"
                          : "font-extrabold text-brand-900"
                      }`}
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

function GenderProgramUniversityChart({
  academicYear,
  globalFilters,
  selectedDistrict
}: {
  academicYear: string;
  globalFilters?: GlobalFilterState;
  selectedDistrict?: DistrictMapItem | null;
}) {
  const [hoveredRow, setHoveredRow] = useState<{
    name: string;
    gender: "Male" | "Female";
    val: string;
    pct: number;
  } | null>(null);

  // Year scaling multiplier
  const yearMultiplier =
    academicYear === "2024-25" ? 0.93 :
    academicYear === "2023-24" ? 0.86 :
    academicYear === "2022-23" ? 0.80 : 1.0;

  const baseUniData = [
    { name: "Calcutta Univ", male: 46.20, female: 53.80, total: 214500 },
    { name: "Jadavpur Univ", male: 54.50, female: 45.50, total: 18400 },
    { name: "Burdwan Univ", male: 48.10, female: 51.90, total: 148200 },
    { name: "MAKAUT (WBUT)", male: 68.20, female: 31.80, total: 162400 },
    { name: "Kalyani Univ", male: 47.40, female: 52.60, total: 118500 },
    { name: "Vidyasagar Univ", male: 46.80, female: 53.20, total: 122800 },
    { name: "North Bengal Univ", male: 49.00, female: 51.00, total: 84200 },
    { name: "WBSU Barasat", male: 45.50, female: 54.50, total: 132600 },
    { name: "Gour Banga Univ", male: 50.80, female: 49.20, total: 76800 },
    { name: "Presidency Univ", male: 48.00, female: 52.00, total: 6200 },
    { name: "Visva-Bharati", male: 47.50, female: 52.50, total: 8900 },
    { name: "Kazi Nazrul Univ", male: 48.50, female: 51.50, total: 64500 },
    { name: "SKBU Purulia", male: 51.20, female: 48.80, total: 48200 },
    { name: "Bankura Univ", male: 47.00, female: 53.00, total: 42600 },
    { name: "CBPBU Cooch Behar", male: 49.50, female: 50.50, total: 36800 },
    { name: "Aliah University", male: 58.00, female: 42.00, total: 9400 }
  ];

  // District scale: if a district is selected, scale total down proportionally
  const totalOutsideAll = ALL_BENGAL_TOTALS.count;
  const districtScale = selectedDistrict
    ? Math.min(1, selectedDistrict.count / totalOutsideAll + 0.12)
    : 1.0;

  const districtFemalePct = selectedDistrict
    ? selectedDistrict.female / selectedDistrict.count
    : null;

  const allUniData = baseUniData.map(u => {
    const scaledTotal = Math.round(u.total * yearMultiplier * districtScale);
    const femalePct = districtFemalePct !== null ? districtFemalePct * 100 : u.female;
    const malePct = districtFemalePct !== null ? (1 - districtFemalePct) * 100 : u.male;
    const femaleCount = Math.round(scaledTotal * (femalePct / 100));
    const maleCount = scaledTotal - femaleCount;
    return {
      name: u.name,
      femalePct,
      malePct,
      femaleCount,
      maleCount,
      total: scaledTotal
    };
  });

  const uniData = (globalFilters?.university && globalFilters.university !== "All")
    ? allUniData.filter(u => matchUniversity(globalFilters.university, u.name))
    : allUniData;

  const formatNumber = (num: number) => num.toLocaleString("en-IN");

  return (
    <div className="bg-[#eff6ff] hover:bg-[#dbeafe] rounded-3xl border border-blue-200/60 hover:border-blue-350 shadow-soft transition-all duration-300 p-6 flex flex-col gap-6 w-full">
      {/* Title */}
      <div className="text-center border-b border-slate-100 pb-4">
        <h3 className="text-base font-extrabold text-brand-900 tracking-tight">
          Gender & Program-wise Distribution in Universities
        </h3>
        <p className="text-xs text-brand-600 font-bold mt-0.5">
          {selectedDistrict ? `${selectedDistrict.name} District · ` : ""}
          {globalFilters?.university && globalFilters.university !== "All" ? globalFilters.university : "West Bengal"} — {academicYear}
        </p>
      </div>

      {/* Bar Chart Graphic Area */}
      <div className="flex flex-col gap-3.5 max-h-[380px] overflow-y-auto pr-2">
        {uniData.map((uni) => (
          <div key={uni.name} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-brand-900 font-extrabold">{uni.name}</span>
              <span className="text-slate-500 font-semibold">{formatNumber(uni.total)} Students</span>
            </div>
            <div className="w-full flex h-6 rounded-lg overflow-hidden relative shadow-inner">
              <div
                style={{ width: `${uni.femalePct}%` }}
                className="bg-[#ff60b5] hover:bg-[#ec4899] transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white cursor-pointer"
                onMouseEnter={() => setHoveredRow({ name: uni.name, gender: "Female", val: formatNumber(uni.femaleCount), pct: uni.femalePct })}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {uni.femalePct >= 20 && `${uni.femalePct.toFixed(1)}%`}
              </div>
              <div
                style={{ width: `${uni.malePct}%` }}
                className="bg-[#3b82f6] hover:bg-[#2563eb] transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white cursor-pointer"
                onMouseEnter={() => setHoveredRow({ name: uni.name, gender: "Male", val: formatNumber(uni.maleCount), pct: uni.malePct })}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {uni.malePct >= 20 && `${uni.malePct.toFixed(1)}%`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-6 text-xs font-bold text-slate-700 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff60b5]" />
          Female
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          Male
        </span>
      </div>
    </div>
  );
}

function CategoryGenderChart({
  academicYear,
  globalFilters,
  selectedDistrict
}: {
  academicYear: string;
  globalFilters?: GlobalFilterState;
  selectedDistrict?: DistrictMapItem | null;
}) {
  const [hoveredItem, setHoveredItem] = useState<{ name: string; female: number; male: number; trans: number; total: number } | null>(null);

  const yearMultiplier =
    academicYear === "2024-25" ? 0.93 :
    academicYear === "2023-24" ? 0.86 :
    academicYear === "2022-23" ? 0.80 : 1.0;

  const isFilterActive = Boolean(globalFilters?.university && globalFilters.university !== "All");
  const scaleFactor = isFilterActive ? 0.12 : 1.0;

  const baseCategoryData = [
    { name: "General", female: 542000, male: 512000, trans: 54 },
    { name: "SC", female: 284000, male: 268000, trans: 38 },
    { name: "OBC-A", female: 178000, male: 162000, trans: 28 },
    { name: "OBC-B", female: 164000, male: 154000, trans: 26 },
    { name: "ST", female: 72000, male: 68000, trans: 18 },
    { name: "EWS", female: 34000, male: 32000, trans: 4 }
  ];

  const totalOutsideAll_cat = ALL_BENGAL_TOTALS.count;
  const districtScale_cat = selectedDistrict
    ? Math.min(1, selectedDistrict.count / totalOutsideAll_cat + 0.12)
    : 1.0;
  const combinedScale = scaleFactor * districtScale_cat;

  const districtFemalePct_cat = selectedDistrict
    ? selectedDistrict.female / selectedDistrict.count
    : null;

  const categoryData = baseCategoryData.map(c => {
    const scaledFemale = Math.round(c.female * yearMultiplier * combinedScale);
    const scaledMale = Math.round(c.male * yearMultiplier * combinedScale);
    const scaledTrans = Math.round(c.trans * yearMultiplier * combinedScale);
    if (districtFemalePct_cat !== null) {
      const total = scaledFemale + scaledMale;
      return {
        name: c.name,
        female: Math.round(total * districtFemalePct_cat),
        male: Math.round(total * (1 - districtFemalePct_cat)),
        trans: scaledTrans,
        total: total + scaledTrans
      };
    }
    return {
      name: c.name,
      female: scaledFemale,
      male: scaledMale,
      trans: scaledTrans,
      total: scaledFemale + scaledMale + scaledTrans
    };
  });

  const maxTotal = Math.max(...categoryData.map(c => c.total));

  const formatNumber = (num: number) => num.toLocaleString("en-IN");

  return (
    <div className="bg-[#f0fdf4] hover:bg-[#dcfce7] rounded-3xl border border-emerald-200/60 hover:border-emerald-350 shadow-soft transition-all duration-300 p-6 flex flex-col gap-6 w-full">
      {/* Title */}
      <div className="text-center border-b border-slate-100 pb-4">
        <h3 className="text-base font-extrabold text-brand-900 tracking-tight">
          Category and Gender Distribution
        </h3>
        <p className="text-xs text-brand-600 font-bold mt-0.5">
          {selectedDistrict ? `${selectedDistrict.name} District · ` : ""}
          {globalFilters?.university && globalFilters.university !== "All" ? globalFilters.university : "West Bengal"} — {academicYear}
        </p>
      </div>

      {/* Bar List */}
      <div className="flex flex-col gap-3.5 max-h-[380px] overflow-y-auto pr-2">
        {categoryData.map(cat => {
          const femalePct = (cat.female / cat.total) * 100;
          const malePct = (cat.male / cat.total) * 100;
          const widthPct = (cat.total / maxTotal) * 100;

          return (
            <div key={cat.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-brand-900 font-extrabold">{cat.name}</span>
                <span className="text-slate-500 font-semibold">{formatNumber(cat.total)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-lg h-6 overflow-hidden flex shadow-inner" style={{ width: `${Math.max(25, widthPct)}%` }}>
                <div style={{ width: `${femalePct}%` }} className="bg-[#ff60b5] h-full flex items-center justify-center text-[10px] font-black text-white">
                  {femalePct >= 25 && `${femalePct.toFixed(0)}%`}
                </div>
                <div style={{ width: `${malePct}%` }} className="bg-[#3b82f6] h-full flex items-center justify-center text-[10px] font-black text-white">
                  {malePct >= 25 && `${malePct.toFixed(0)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-6 text-xs font-bold text-slate-700 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff60b5]" />
          Female
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          Male
        </span>
      </div>
    </div>
  );
}

function CategoryUniversityDistributionChart({
  academicYear,
  globalFilters
}: {
  academicYear: string;
  globalFilters?: GlobalFilterState;
}) {
  const [hoveredSegment, setHoveredSegment] = useState<{
    uni: string;
    cat: string;
    pct: number;
    count: number;
    splits: Record<string, number>;
    total: number;
  } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<{ uni: string; cat: string } | null>(null);

  // Year scaling multiplier
  const yearMultiplier =
    academicYear === "2024-25" ? 0.93 :
    academicYear === "2023-24" ? 0.86 :
    academicYear === "2022-23" ? 0.80 : 1.0;

  const isFilterActive = Boolean(globalFilters?.university && globalFilters.university !== "All");

  // Official West Bengal Universities Category Distribution
  const baseUniData = [
    { name: "Calcutta Univ", total: 214500, splits: { General: 44.0, "OBC-A": 14.5, "OBC-B": 12.5, SC: 21.0, ST: 5.5, EWS: 2.5 } },
    { name: "MAKAUT (WBUT)", total: 162400, splits: { General: 48.0, "OBC-A": 12.0, "OBC-B": 14.0, SC: 18.0, ST: 5.0, EWS: 3.0 } },
    { name: "Burdwan Univ", total: 148200, splits: { General: 41.0, "OBC-A": 13.0, "OBC-B": 15.0, SC: 23.5, ST: 5.0, EWS: 2.5 } },
    { name: "WBSU Barasat", total: 132600, splits: { General: 39.0, "OBC-A": 18.0, "OBC-B": 12.0, SC: 24.0, ST: 4.5, EWS: 2.5 } },
    { name: "Vidyasagar Univ", total: 122800, splits: { General: 42.0, "OBC-A": 11.5, "OBC-B": 14.5, SC: 23.0, ST: 6.5, EWS: 2.5 } },
    { name: "Kalyani Univ", total: 118500, splits: { General: 40.0, "OBC-A": 16.5, "OBC-B": 12.5, SC: 23.5, ST: 5.0, EWS: 2.5 } },
    { name: "North Bengal Univ", total: 84200, splits: { General: 38.0, "OBC-A": 12.0, "OBC-B": 13.0, SC: 26.0, ST: 8.5, EWS: 2.5 } },
    { name: "Gour Banga Univ", total: 76800, splits: { General: 35.0, "OBC-A": 22.0, "OBC-B": 11.0, SC: 24.0, ST: 5.5, EWS: 2.5 } },
    { name: "Kazi Nazrul Univ", total: 64500, splits: { General: 43.0, "OBC-A": 13.0, "OBC-B": 13.0, SC: 22.0, ST: 6.5, EWS: 2.5 } },
    { name: "SKBU Purulia", total: 48200, splits: { General: 32.0, "OBC-A": 11.0, "OBC-B": 16.0, SC: 26.0, ST: 12.5, EWS: 2.5 } },
    { name: "Bankura Univ", total: 42600, splits: { General: 38.0, "OBC-A": 12.0, "OBC-B": 15.0, SC: 25.0, ST: 7.5, EWS: 2.5 } },
    { name: "CBPBU Cooch Behar", total: 36800, splits: { General: 34.0, "OBC-A": 12.0, "OBC-B": 12.0, SC: 34.0, ST: 5.5, EWS: 2.5 } },
    { name: "Jadavpur Univ", total: 18400, splits: { General: 52.0, "OBC-A": 10.0, "OBC-B": 11.0, SC: 18.0, ST: 5.5, EWS: 3.5 } },
    { name: "Presidency Univ", total: 6200, splits: { General: 54.0, "OBC-A": 9.5, "OBC-B": 10.5, SC: 17.5, ST: 5.0, EWS: 3.5 } },
    { name: "Visva-Bharati", total: 8900, splits: { General: 46.0, "OBC-A": 12.0, "OBC-B": 13.0, SC: 20.0, ST: 6.0, EWS: 3.0 } }
  ];

  const uniData = baseUniData.map(u => ({
    ...u,
    total: Math.round(u.total * yearMultiplier)
  }));

  const categoryColors: Record<string, string> = {
    General: "#06b6d4",
    SC: "#facc15",
    "OBC-A": "#f97316",
    "OBC-B": "#fb923c",
    ST: "#a855f7",
    EWS: "#ec4899"
  };

  const categoryGradients: Record<string, string> = {
    General: "linear-gradient(to top, #0891b2, #22d3ee)",
    SC: "linear-gradient(to top, #ca8a04, #fde047)",
    "OBC-A": "linear-gradient(to top, #ea580c, #f97316)",
    "OBC-B": "linear-gradient(to top, #c2410c, #fb923c)",
    ST: "linear-gradient(to top, #9333ea, #c084fc)",
    EWS: "linear-gradient(to top, #db2777, #f472b6)",
  };

  const uniDataMapped = uniData.map(uni => {
    const raw = uni.splits as any;
    return {
      name: uni.name,
      total: uni.total,
      splits: {
        General: raw.General || 0,
        SC: raw.SC || 0,
        "OBC-A": raw["OBC-A"] || 0,
        "OBC-B": raw["OBC-B"] || 0,
        ST: raw.ST || 0,
        EWS: raw.EWS || 0
      }
    };
  });

  const categories = Object.keys(categoryColors);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  return (
    <div
      onClick={() => setSelectedSegment(null)}
      className={`rounded-3xl border shadow-soft transition-all duration-300 p-6 flex flex-col gap-6 w-full relative overflow-hidden mt-6 ${
        selectedSegment !== null || isFilterActive
          ? "bg-[#ccfbf1]/90 border-2 border-teal-400 shadow-md"
          : "bg-[#f0fdfa] hover:bg-[#ccfbf1] border-teal-200/50 hover:border-teal-300"
      }`}
    >
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="text-center sm:text-left">
          <h3 className="text-base font-extrabold text-brand-900 tracking-tight">
            Category-wise Distribution in Universities and Programs
          </h3>
          <p className="text-xs text-brand-600 font-bold mt-0.5">
            {academicYear} — State Level Distribution with Selected University Highlight
          </p>
        </div>
      </div>

      {/* Scrollable Chart Wrapper */}
      <div className="w-full overflow-x-auto scrollbar-thin pb-4 relative">
        <div className="min-w-[1200px] h-[380px] relative flex items-end justify-between px-4 mt-6 select-none pb-16">

          {/* Y Axis Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-16 pt-6">
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
            <div className="w-full border-t border-slate-100 h-0" />
          </div>

          {/* Render Bars */}
          <div className="w-full h-full flex items-end justify-between z-10 relative">
            {uniDataMapped.map((uni, idx) => {
              const isMatch = isFilterActive && matchUniversity(globalFilters?.university, uni.name);
              const activeSplits = Object.entries(uni.splits)
                .map(([cat, pct]) => ({ cat, pct }))
                .filter(s => s.pct > 0)
                .reverse();

              const isAnySelected = selectedSegment !== null || isFilterActive;
              const isUniSelected = selectedSegment?.uni === uni.name || isMatch;
              const isTooltipVisible = selectedSegment !== null ? selectedSegment?.uni === uni.name : (hoveredIndex === idx);

              return (
                <div
                  key={uni.name}
                  className={`flex flex-col items-center w-full max-w-[80px] relative transition-all duration-300 ${
                    hoveredIndex === idx || isUniSelected ? "z-50" : "z-10"
                  }`}
                  onMouseLeave={() => {
                    setHoveredSegment(null);
                    setHoveredIndex(null);
                  }}
                  style={{
                    opacity: isAnySelected ? (isUniSelected ? 1 : 0.35) : 1,
                    filter: isAnySelected && !isUniSelected ? "grayscale(30%)" : "none"
                  }}
                >

                  {/* Vertical Stacked Bar Container */}
                  <div
                    style={{
                      transform: isUniSelected ? "scale(1.08)" : "none",
                      boxShadow: isMatch ? "0 0 18px rgba(13, 148, 136, 0.75)" : (isUniSelected ? "0 0 14px rgba(13, 148, 136, 0.45)" : "none")
                    }}
                    className={`h-64 w-12 flex flex-col rounded-md overflow-hidden cursor-pointer relative shadow-sm border border-slate-200/10 transition-all duration-300 ${
                      isMatch ? "ring-4 ring-teal-400 brightness-105" : ""
                    }`}
                  >
                    {activeSplits.map(({ cat, pct }, sIdx) => {
                      const background = categoryGradients[cat] || categoryColors[cat] || "#94a3b8";
                      const isSegmentSelected = selectedSegment?.uni === uni.name && selectedSegment?.cat === cat;
                      const isFirst = sIdx === 0;
                      const isLast = sIdx === activeSplits.length - 1;
                      return (
                        <div
                          key={cat}
                          style={{
                            height: `${pct}%`,
                            background,
                            opacity: selectedSegment !== null ? (isSegmentSelected ? 1 : 0.25) : 1,
                            filter: selectedSegment !== null && !isSegmentSelected ? "grayscale(40%)" : "none"
                          }}
                          className={`w-full flex items-center justify-center relative transition-all duration-300 hover:brightness-105 ${
                            isFirst ? "rounded-t-[5px]" : ""
                          } ${
                            isLast ? "rounded-b-[5px]" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSegment(isSegmentSelected ? null : { uni: uni.name, cat });
                          }}
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

                  {/* Tooltip */}
                  {isTooltipVisible && (() => {
                    const activeCat = selectedSegment?.cat || hoveredSegment?.cat;
                    if (!activeCat) return null;
                    const activePct = uni.splits[activeCat as keyof typeof uni.splits] || 0;
                    const activeCount = Math.round(uni.total * (activePct / 100));

                    return (
                      <div
                        className={`absolute top-[128px] -translate-y-1/2 z-50 bg-[#dbebff]/95 border border-[#b9d7ff] backdrop-blur-sm shadow-xl rounded-2xl p-4 text-brand-900 w-[270px] select-none animate-fadeIn ${
                          idx < 10 ? "left-full ml-4" : "right-full mr-4"
                        }`}
                      >
                        <div className="grid grid-cols-[100px_1fr] gap-y-1 text-xs text-left">
                          <span className="font-bold text-blue-800/80 pr-2">University</span>
                          <span className="font-extrabold text-brand-950 text-right">{uni.name}</span>

                          <span className="font-bold text-blue-800/80 pr-2">{activeCat}</span>
                          <span className="font-extrabold text-brand-950 text-right">
                            {formatNumber(activeCount)} ({activePct.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Vertical / Rotated Label */}
                  <span
                    className={`text-xs mt-3 block select-none h-12 flex items-center justify-center whitespace-nowrap ${
                      isMatch
                        ? "font-black text-teal-950 bg-teal-200/90 px-1.5 py-1 rounded-md shadow-sm border border-teal-400"
                        : "font-black text-brand-900"
                    }`}
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
            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: categoryColors[cat], boxShadow: `0 2px 8px ${categoryColors[cat]}cc` }} />
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}

function AdmissionTopProgramsChart({
  academicYear,
  globalFilters,
  selectedDistrict
}: {
  academicYear: string;
  globalFilters?: GlobalFilterState;
  selectedDistrict?: DistrictMapItem | null;
}) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "PhD",
    "PG",
    "PG Diploma",
    "UG",
    "Diploma",
    "Certificate",
    "Other"
  ]);

  const yearMultiplier =
    academicYear === "2024-25" ? 0.93 :
    academicYear === "2023-24" ? 0.86 :
    academicYear === "2022-23" ? 0.80 : 1.0;

  const isFilterActive = Boolean(globalFilters?.university && globalFilters.university !== "All");

  let instMultiplier = 1.0;
  if (isFilterActive) instMultiplier *= 0.18;
  if (globalFilters?.college && globalFilters.college !== "All") instMultiplier *= 0.06;

  // District scale factor
  const totalOutsideAll_prog = ALL_BENGAL_TOTALS.count;
  const districtScale_prog = selectedDistrict
    ? Math.min(1, selectedDistrict.count / totalOutsideAll_prog + 0.12)
    : 1.0;
  const districtFemalePct_prog = selectedDistrict
    ? selectedDistrict.female / selectedDistrict.count
    : null;

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const rawProgramDatabase = [
    { name: "B.A. (Arts)", type: "UG", female: 412000, male: 373000 },
    { name: "B.Sc. (Science)", type: "UG", female: 178000, male: 164000 },
    { name: "B.Com (Commerce)", type: "UG", female: 142000, male: 142000 },
    { name: "B.Tech / B.E", type: "UG", female: 54000, male: 120000 },
    { name: "B.Ed / D.El.Ed", type: "UG", female: 68000, male: 44000 },
    { name: "MBBS / BDS", type: "UG", female: 18400, male: 16200 },
    { name: "LLB (Law)", type: "UG", female: 14200, male: 17600 },
    { name: "M.A. (Arts)", type: "PG", female: 48500, male: 36200 },
    { name: "M.Sc. (Science)", type: "PG", female: 32400, male: 28600 },
    { name: "M.Com (Commerce)", type: "PG", female: 18900, male: 17400 },
    { name: "M.Tech / M.E", type: "PG", female: 8400, male: 14200 },
    { name: "MBA / MCA", type: "PG", female: 12200, male: 16800 },
    { name: "Ph.D. Arts & Humanities", type: "PhD", female: 4600, male: 3900 },
    { name: "Ph.D. Science & Tech", type: "PhD", female: 4100, male: 4200 },
    { name: "PGD Computer Apps", type: "PG Diploma", female: 3800, male: 1200 },
    { name: "PGD Management", type: "PG Diploma", female: 3694, male: 1306 },
    { name: "Diploma Engineering", type: "Diploma", female: 28400, male: 62100 },
    { name: "Diploma Pharmacy / D.Pharm", type: "Diploma", female: 18200, male: 16800 },
    { name: "Polytechnic Tech", type: "Diploma", female: 25800, male: 11200 },
    { name: "Cert. IT & Skill Dev", type: "Certificate", female: 3900, male: 2680 },
    { name: "Cert. Foreign Languages", type: "Certificate", female: 2900, male: 2100 },
    { name: "Vocational Studies", type: "Other", female: 8400, male: 7200 }
  ];

  const programDatabase = rawProgramDatabase.map(p => {
    let techBonus = 1.0;
    if (globalFilters?.university?.toUpperCase() === "MAKAUT" || (globalFilters?.college && globalFilters.college.toLowerCase().includes("tech"))) {
      if (p.name.includes("B.Tech") || p.name.includes("M.Tech") || p.name.includes("MCA") || p.name.includes("Diploma Engineering")) {
        techBonus = 3.5;
      }
    }
    const baseFemale = Math.round(p.female * yearMultiplier * instMultiplier * techBonus * districtScale_prog);
    const baseMale = Math.round(p.male * yearMultiplier * instMultiplier * techBonus * districtScale_prog);
    if (districtFemalePct_prog !== null) {
      const total = baseFemale + baseMale;
      return {
        ...p,
        female: Math.round(total * districtFemalePct_prog),
        male: Math.round(total * (1 - districtFemalePct_prog))
      };
    }
    return { ...p, female: baseFemale, male: baseMale };
  });

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
    <div className={`rounded-3xl border shadow-soft transition-all duration-300 p-6 flex flex-col gap-6 w-full relative mt-6 ${
      isFilterActive ? "bg-[#eef2ff]/70 border-2 border-indigo-300 shadow-md" : "bg-slate-50/40 hover:bg-[#e9f2fc] border-slate-100 hover:border-blue-200/60"
    }`}>
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="text-center sm:text-left">
          <h3 className="text-base font-extrabold text-brand-900 tracking-tight">
            Admission Based - Top 5 Program
          </h3>
          <p className="text-xs text-brand-600 font-bold mt-0.5">
            {selectedDistrict ? `${selectedDistrict.name} District · ` : ""}
            {isFilterActive ? `Top 5 Program Admissions for ${globalFilters?.university}` : "West Bengal"} — {academicYear}
          </p>
        </div>
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
        <div className="flex flex-col gap-5 bg-pink-50/20 p-5 rounded-2xl border border-pink-200/50 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-pink-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff60b5] shadow-[0_0_8px_#ff60b5]" />
              <span className="text-xs font-black uppercase tracking-wider text-pink-700">Female Enrollment</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {femaleList.map((item, idx) => {
              const pct = globalMax > 0 ? (item.value / globalMax) * 100 : 0;
              const isTopRank = idx === 0;
              return (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-black text-brand-900">
                    <span className="flex items-center gap-1.5">
                      <span>{item.name}</span>
                    </span>
                    <span className="text-slate-700 font-extrabold">{formatNumber(item.value)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-lg h-7 overflow-hidden relative shadow-inner">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-lg transition-all duration-500 ${
                        isTopRank
                          ? "bg-gradient-to-r from-[#ff60b5] to-[#f43f5e] shadow-md ring-2 ring-pink-300"
                          : "bg-[#ff60b5] hover:bg-[#ec4899]"
                      }`}
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
        <div className="flex flex-col gap-5 bg-blue-50/20 p-5 rounded-2xl border border-blue-200/50 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]" />
              <span className="text-xs font-black uppercase tracking-wider text-blue-700">Male Enrollment</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {maleList.map((item, idx) => {
              const pct = globalMax > 0 ? (item.value / globalMax) * 100 : 0;
              const isTopRank = idx === 0;
              return (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-black text-brand-900">
                    <span className="flex items-center gap-1.5">
                      <span>{item.name}</span>
                    </span>
                    <span className="text-slate-700 font-extrabold">{formatNumber(item.value)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-lg h-7 overflow-hidden relative shadow-inner">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-lg transition-all duration-500 ${
                        isTopRank
                          ? "bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] shadow-md ring-2 ring-blue-300"
                          : "bg-[#3b82f6] hover:bg-[#2563eb]"
                      }`}
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
