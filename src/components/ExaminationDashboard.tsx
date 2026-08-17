"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  GraduationCap,
  RotateCcw,
  CheckCircle2,
  XCircle,
  UserX,
  ChevronDown,
  Layers,
  ChevronRight,
  Filter,
  X,
  MoveHorizontal,
  MoveVertical,
  Maximize2,
} from "lucide-react";
import { GlobalFilterState } from "@/components/Filters";
import ChartTooltip, { ChartTooltipData } from "@/components/ChartTooltip";
import { PieChart3DModal, Slice } from "./PieChart3DModal";

// ─── Interactive Doughnut Chart Component ──────────────────────────────────────
interface DoughnutChartProps {
  slices: Slice[];
  totalLabel: string;
  totalValue: string;
  title?: string;
  onExpand?: (title: string, slices: Slice[]) => void;
  onTooltip?: (data: ChartTooltipData | null, pos?: { x: number; y: number } | null) => void;
  columns?: 1 | 2;
}

function InteractiveDoughnut({
  slices,
  totalLabel,
  totalValue,
  title,
  onExpand,
  onTooltip,
  columns = 2,
}: DoughnutChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<Slice | null>(null);
  const [activeLegendIndex, setActiveLegendIndex] = useState<number | null>(null);

  const circumference = 301.59;
  let cumulativePercentage = 0;

  return (
    <div className="flex flex-col items-center gap-5 w-full relative group">
      {onExpand && title && (
        <button
          onClick={() => onExpand(title, slices)}
          className="absolute -top-3 -right-1 p-1.5 bg-slate-100/80 hover:bg-blue-100 text-slate-500 hover:text-blue-700 rounded-lg transition-all border border-slate-200 shadow-xs z-10 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider cursor-pointer"
          title="Expand 3D Chart"
        >
          <Maximize2 size={13} /> Expand
        </button>
      )}

      {/* SVG Doughnut Chart */}
      <div className="relative w-44 h-44 select-none flex-shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {slices.map((slice, index) => {
            const percentage = slice.value;
            const strokeDashoffset = circumference - (circumference * percentage) / 100;
            const startAngle = (cumulativePercentage * 360) / 100;
            cumulativePercentage += percentage;

            const isHovered = hoveredSlice?.label === slice.label || activeLegendIndex === index;
            const someActive = hoveredSlice !== null || activeLegendIndex !== null;
            const opacity = someActive ? (isHovered ? 1 : 0.28) : 1;
            const filter = someActive && !isHovered ? "grayscale(45%)" : "none";

            return (
              <circle
                key={slice.label}
                cx="60"
                cy="60"
                r="48"
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? "26" : "21"}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transform: `rotate(${startAngle - 90}deg)`,
                  transformOrigin: "60px 60px",
                  opacity,
                  filter,
                }}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={(e) => {
                  setHoveredSlice(slice);
                  onTooltip?.(
                    {
                      title: `Examination Status: ${slice.label}`,
                      subtitle: "Candidate Result Classification",
                      items: [
                        { label: "Result Outcome", value: slice.label },
                        { label: "Candidate Count", value: String(slice.raw), highlight: true },
                        { label: "Percentage Share", value: `${slice.value}%` },
                      ],
                    },
                    { x: e.clientX, y: e.clientY }
                  );
                }}
                onMouseLeave={() => {
                  setHoveredSlice(null);
                  onTooltip?.(null);
                }}
              />
            );
          })}
          {/* Inner white circle */}
          <circle cx="60" cy="60" r="37" className="fill-white" />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
          {hoveredSlice ? (
            <>
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider truncate max-w-[100px]">
                {hoveredSlice.label}
              </span>
              <span className="text-base font-black text-slate-900 mt-0.5 tracking-tight truncate max-w-[100px]">
                {hoveredSlice.raw}
              </span>
              <span className="text-xs font-black text-blue-600 mt-0.5">
                {hoveredSlice.value}%
              </span>
            </>
          ) : activeLegendIndex !== null ? (
            <>
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider truncate max-w-[100px]">
                {slices[activeLegendIndex].label}
              </span>
              <span className="text-base font-black text-slate-900 mt-0.5 tracking-tight truncate max-w-[100px]">
                {slices[activeLegendIndex].raw}
              </span>
              <span className="text-xs font-black text-blue-600 mt-0.5">
                {slices[activeLegendIndex].value}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                {totalLabel}
              </span>
              <span className="text-base font-black text-slate-900 mt-0.5 tracking-tight">
                {totalValue}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend Container: Shows Label, Data (Raw Count), and Percentage */}
      <div className={`w-full grid ${columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-2 text-xs`}>
        {slices.map((slice, index) => {
          const isSelected = activeLegendIndex === index || hoveredSlice?.label === slice.label;
          return (
            <button
              key={slice.label}
              onClick={() => setActiveLegendIndex(activeLegendIndex === index ? null : index)}
              onMouseEnter={() => setHoveredSlice(slice)}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`flex items-center justify-between gap-2.5 p-2 rounded-xl text-left transition-all duration-200 cursor-pointer w-full group ${
                isSelected
                  ? "bg-blue-50/90 font-black text-blue-950 scale-[1.01] shadow-xs ring-1 ring-blue-300"
                  : "hover:bg-slate-50 text-slate-700 font-semibold"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 border border-white/40 shadow-2xs"
                  style={{
                    backgroundColor: slice.color,
                    boxShadow: isSelected ? `0 0 8px ${slice.color}99` : `0 1px 3px ${slice.color}44`,
                  }}
                />
                <span className="truncate text-xs font-bold group-hover:text-blue-900 transition-colors" title={slice.label}>
                  {slice.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="font-extrabold text-slate-900 text-xs">
                  {slice.raw}
                </span>
                <span className="bg-slate-100 text-slate-700 border border-slate-200/80 px-1.5 py-0.5 rounded-md text-[10px] font-black group-hover:bg-blue-100 group-hover:text-blue-900 transition-colors">
                  {slice.value}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Master Dataset per University
interface UniversityRecord {
  code: string;
  name: string;
  students: number;
  papers: number;
  fresherPct: number;
  repeaterPct: number;
  medium: {
    english: { female: number; male: number };
    bengali: { female: number; male: number };
    hindi: { female: number; male: number };
  };
  results: {
    pass: number;
    fail: number;
    atkt: number;
    absent: number;
    backlog: number;
  };
}

const UNIVERSITIES_DATA: Record<string, UniversityRecord> = {
  CU: {
    code: "CU",
    name: "University of Calcutta",
    students: 485000,
    papers: 6850,
    fresherPct: 78,
    repeaterPct: 22,
    medium: {
      english: { female: 185000, male: 175000 },
      bengali: { female: 58000, male: 61000 },
      hindi: { female: 3000, male: 3000 },
    },
    results: { pass: 48200, fail: 8900, atkt: 11200, absent: 1100, backlog: 5800 },
  },
  JU: {
    code: "JU",
    name: "Jadavpur University",
    students: 82400,
    papers: 4920,
    fresherPct: 92,
    repeaterPct: 8,
    medium: {
      english: { female: 36000, male: 41400 },
      bengali: { female: 2400, male: 2200 },
      hindi: { female: 200, male: 200 },
    },
    results: { pass: 18400, fail: 920, atkt: 800, absent: 210, backlog: 720 },
  },
  MAKAUT: {
    code: "MAKAUT",
    name: "Maulana Abul Kalam Azad Univ of Tech",
    students: 215600,
    papers: 6420,
    fresherPct: 84,
    repeaterPct: 16,
    medium: {
      english: { female: 85000, male: 115600 },
      bengali: { female: 6500, male: 7500 },
      hindi: { female: 500, male: 500 },
    },
    results: { pass: 32400, fail: 4800, atkt: 5100, absent: 650, backlog: 3100 },
  },
  BU: {
    code: "BU",
    name: "University of Burdwan",
    students: 298500,
    papers: 5640,
    fresherPct: 76,
    repeaterPct: 24,
    medium: {
      english: { female: 95000, male: 98500 },
      bengali: { female: 48000, male: 52000 },
      hindi: { female: 2500, male: 2500 },
    },
    results: { pass: 29500, fail: 7800, atkt: 7400, absent: 890, backlog: 4600 },
  },
  WBSU: {
    code: "WBSU",
    name: "West Bengal State University Barasat",
    students: 176400,
    papers: 4210,
    fresherPct: 79,
    repeaterPct: 21,
    medium: {
      english: { female: 64000, male: 66400 },
      bengali: { female: 21000, male: 23000 },
      hindi: { female: 1000, male: 1000 },
    },
    results: { pass: 18900, fail: 4100, atkt: 3800, absent: 520, backlog: 2700 },
  },
  KU: {
    code: "KU",
    name: "University of Kalyani",
    students: 189200,
    papers: 4560,
    fresherPct: 81,
    repeaterPct: 19,
    medium: {
      english: { female: 72000, male: 75200 },
      bengali: { female: 19000, male: 21000 },
      hindi: { female: 1000, male: 1000 },
    },
    results: { pass: 21200, fail: 4600, atkt: 4200, absent: 580, backlog: 2900 },
  },
  VU: {
    code: "VU",
    name: "Vidyasagar University Midnapore",
    students: 194800,
    papers: 4380,
    fresherPct: 80,
    repeaterPct: 20,
    medium: {
      english: { female: 74000, male: 78800 },
      bengali: { female: 19500, male: 21000 },
      hindi: { female: 750, male: 750 },
    },
    results: { pass: 22400, fail: 5100, atkt: 4600, absent: 610, backlog: 3200 },
  },
  NBU: {
    code: "NBU",
    name: "North Bengal University Siliguri",
    students: 142300,
    papers: 3890,
    fresherPct: 77,
    repeaterPct: 23,
    medium: {
      english: { female: 54000, male: 58300 },
      bengali: { female: 13500, male: 14500 },
      hindi: { female: 1000, male: 1000 },
    },
    results: { pass: 15600, fail: 3900, atkt: 3400, absent: 480, backlog: 2400 },
  },
  UGB: {
    code: "UGB",
    name: "University of Gour Banga Malda",
    students: 118500,
    papers: 3240,
    fresherPct: 75,
    repeaterPct: 25,
    medium: {
      english: { female: 44000, male: 48500 },
      bengali: { female: 12000, male: 13000 },
      hindi: { female: 500, male: 500 },
    },
    results: { pass: 12400, fail: 3600, atkt: 2900, absent: 420, backlog: 2100 },
  },
  KNU: {
    code: "KNU",
    name: "Kazi Nazrul University Asansol",
    students: 96400,
    papers: 2780,
    fresherPct: 79,
    repeaterPct: 21,
    medium: {
      english: { female: 37000, male: 41400 },
      bengali: { female: 8500, male: 8500 },
      hindi: { female: 500, male: 500 },
    },
    results: { pass: 10800, fail: 2600, atkt: 2200, absent: 340, backlog: 1700 },
  },
  SKBU: {
    code: "SKBU",
    name: "Sidho-Kanho-Birsha University Purulia",
    students: 84200,
    papers: 2460,
    fresherPct: 76,
    repeaterPct: 24,
    medium: {
      english: { female: 32000, male: 36200 },
      bengali: { female: 7500, male: 8000 },
      hindi: { female: 250, male: 250 },
    },
    results: { pass: 9200, fail: 2400, atkt: 1900, absent: 310, backlog: 1500 },
  },
  BKU: {
    code: "BKU",
    name: "Bankura University",
    students: 76900,
    papers: 2190,
    fresherPct: 78,
    repeaterPct: 22,
    medium: {
      english: { female: 29000, male: 33900 },
      bengali: { female: 6500, male: 7000 },
      hindi: { female: 250, male: 250 },
    },
    results: { pass: 8600, fail: 2100, atkt: 1700, absent: 280, backlog: 1300 },
  },
  CBPBU: {
    code: "CBPBU",
    name: "Cooch Behar Panchanan Barma Univ",
    students: 68400,
    papers: 1980,
    fresherPct: 77,
    repeaterPct: 23,
    medium: {
      english: { female: 26000, male: 30400 },
      bengali: { female: 5500, male: 6000 },
      hindi: { female: 250, male: 250 },
    },
    results: { pass: 7800, fail: 1900, atkt: 1500, absent: 250, backlog: 1200 },
  },
  Presidency: {
    code: "Presidency",
    name: "Presidency University Kolkata",
    students: 28600,
    papers: 1840,
    fresherPct: 91,
    repeaterPct: 9,
    medium: {
      english: { female: 13500, male: 14100 },
      bengali: { female: 450, male: 450 },
      hindi: { female: 50, male: 50 },
    },
    results: { pass: 6200, fail: 420, atkt: 380, absent: 95, backlog: 240 },
  },
  "Visva-Bharati": {
    code: "Visva-Bharati",
    name: "Visva-Bharati Central University Santiniketan",
    students: 34200,
    papers: 1920,
    fresherPct: 88,
    repeaterPct: 12,
    medium: {
      english: { female: 15000, male: 16200 },
      bengali: { female: 1400, male: 1400 },
      hindi: { female: 100, male: 100 },
    },
    results: { pass: 7400, fail: 680, atkt: 590, absent: 120, backlog: 380 },
  },
  Aliah: {
    code: "Aliah",
    name: "Aliah University Kolkata",
    students: 24800,
    papers: 1420,
    fresherPct: 85,
    repeaterPct: 15,
    medium: {
      english: { female: 10500, male: 12300 },
      bengali: { female: 900, male: 1000 },
      hindi: { female: 50, male: 50 },
    },
    results: { pass: 5400, fail: 720, atkt: 610, absent: 140, backlog: 390 },
  },
  RBU: {
    code: "RBU",
    name: "Rabindra Bharati University",
    students: 38900,
    papers: 1650,
    fresherPct: 87,
    repeaterPct: 13,
    medium: {
      english: { female: 16500, male: 18400 },
      bengali: { female: 1900, male: 2000 },
      hindi: { female: 50, male: 50 },
    },
    results: { pass: 8100, fail: 890, atkt: 780, absent: 160, backlog: 490 },
  },
};

const TOTAL_AGGREGATE: UniversityRecord = {
  code: "TOTAL",
  name: "All Universities (West Bengal State)",
  students: 2311967,
  papers: 38714,
  fresherPct: 86,
  repeaterPct: 14,
  medium: {
    english: { female: 847440, male: 858017 },
    bengali: { female: 141230, male: 152155 },
    hindi: { female: 19896, male: 42030 },
  },
  results: {
    pass: 121355,
    fail: 73789,
    atkt: 22260,
    absent: 9539,
    backlog: 24512,
  },
};

// Full list of universities for the main exam comparison chart
const UNIVERSITY_EXAMS_LIST = [
  { name: "CU", papers: 6850, students: 485000 },
  { name: "MAKAUT", papers: 6420, students: 215600 },
  { name: "BU", papers: 5640, students: 298500 },
  { name: "JU", papers: 4920, students: 82400 },
  { name: "KU", papers: 4560, students: 189200 },
  { name: "VU", papers: 4380, students: 194800 },
  { name: "WBSU", papers: 4210, students: 176400 },
  { name: "NBU", papers: 3890, students: 142300 },
  { name: "UGB", papers: 3240, students: 118500 },
  { name: "KNU", papers: 2780, students: 96400 },
  { name: "SKBU", papers: 2460, students: 84200 },
  { name: "BKU", papers: 2190, students: 76900 },
  { name: "CBPBU", papers: 1980, students: 68400 },
  { name: "Visva-Bharati", papers: 1920, students: 34200 },
  { name: "Presidency", papers: 1840, students: 28600 },
  { name: "RBU", papers: 1650, students: 38900 },
  { name: "Aliah", papers: 1420, students: 24800 },
];

// Full list of universities for Fresher vs Repeater
const FRESHER_REPEATER_LIST = [
  { name: "UGB", fresher: 75, repeater: 25 },
  { name: "BU", fresher: 76, repeater: 24 },
  { name: "SKBU", fresher: 76, repeater: 24 },
  { name: "NBU", fresher: 77, repeater: 23 },
  { name: "CBPBU", fresher: 77, repeater: 23 },
  { name: "CU", fresher: 78, repeater: 22 },
  { name: "BKU", fresher: 78, repeater: 22 },
  { name: "WBSU", fresher: 79, repeater: 21 },
  { name: "KNU", fresher: 79, repeater: 21 },
  { name: "VU", fresher: 80, repeater: 20 },
  { name: "KU", fresher: 81, repeater: 19 },
  { name: "MAKAUT", fresher: 84, repeater: 16 },
  { name: "Aliah", fresher: 85, repeater: 15 },
  { name: "RBU", fresher: 87, repeater: 13 },
  { name: "Visva-Bharati", fresher: 88, repeater: 12 },
  { name: "Presidency", fresher: 91, repeater: 9 },
  { name: "JU", fresher: 92, repeater: 8 },
];

// Full list of universities for Results Breakup
const RESULTS_BREAKUP_LIST = [
  { name: "CU", pass: 48200, fail: 8900, percentage: 84 },
  { name: "JU", pass: 18400, fail: 920, percentage: 95 },
  { name: "MAKAUT", pass: 32400, fail: 4800, percentage: 87 },
  { name: "BU", pass: 29500, fail: 7800, percentage: 79 },
  { name: "WBSU", pass: 18900, fail: 4100, percentage: 82 },
  { name: "KU", pass: 21200, fail: 4600, percentage: 82 },
  { name: "VU", pass: 22400, fail: 5100, percentage: 81 },
  { name: "NBU", pass: 15600, fail: 3900, percentage: 80 },
  { name: "UGB", pass: 12400, fail: 3600, percentage: 77 },
  { name: "KNU", pass: 10800, fail: 2600, percentage: 81 },
  { name: "SKBU", pass: 9200, fail: 2400, percentage: 79 },
  { name: "BKU", pass: 8600, fail: 2100, percentage: 80 },
  { name: "CBPBU", pass: 7800, fail: 1900, percentage: 80 },
  { name: "Presidency", pass: 6200, fail: 420, percentage: 94 },
  { name: "Visva-Bharati", pass: 7400, fail: 680, percentage: 92 },
  { name: "Aliah", pass: 5400, fail: 720, percentage: 88 },
  { name: "RBU", pass: 8100, fail: 890, percentage: 90 },
];

interface ExaminationDashboardProps {
  globalFilters?: GlobalFilterState;
  onUniversityChange?: (uni: string) => void;
}

export default function ExaminationDashboard({
  globalFilters,
  onUniversityChange,
}: ExaminationDashboardProps) {
  // Chart click / cross-filtering selection state
  const [clickedUniversity, setClickedUniversity] = useState<string | null>(null);
  const [expandedPieData, setExpandedPieData] = useState<{ title: string; slices: Slice[] } | null>(null);
  const [tooltip, setTooltip] = useState<{ data: ChartTooltipData; pos: { x: number; y: number } } | null>(null);

  // Local section filter states
  const [programType, setProgramType] = useState("All");
  const [season, setSeason] = useState("Winter");
  const [session, setSession] = useState("2025-26");
  const [genderFilter, setGenderFilter] = useState("All");
  const [collegeTypeFilter, setCollegeTypeFilter] = useState("All");
  const [collegeNameFilter, setCollegeNameFilter] = useState("All");
  const [progTypeUniFilter, setProgTypeUniFilter] = useState("All");
  const [progTypeCollegeTypeFilter, setProgTypeCollegeTypeFilter] = useState("All");
  const [decompCollegeType, setDecompCollegeType] = useState("All");

  // Filtered University Exams List based on Program Type
  const filteredUniversityExamsList = useMemo(() => {
    const multiplier =
      programType === "UG"
        ? 0.62
        : programType === "PG"
          ? 0.28
          : programType === "Diploma"
            ? 0.07
            : programType === "Certificate"
              ? 0.03
              : 1;

    return UNIVERSITY_EXAMS_LIST.map((u) => ({
      name: u.name,
      papers: Math.round(u.papers * multiplier),
      students: Math.round(u.students * multiplier),
    }));
  }, [programType]);

  // Decomposition tree state
  const [selectedSeason, setSelectedSeason] = useState("Winter");
  const [selectedUniversity, setSelectedUniversity] = useState("CU");
  const [selectedCourse, setSelectedCourse] = useState("B.E - B.Tech");
  const [selectedExamType, setSelectedExamType] = useState("Repeater");
  const [selectedSemester, setSelectedSemester] = useState("Sem 2");

  // Determine active effective university (either selected in top global filter or clicked in chart)
  const effectiveUniCode = useMemo(() => {
    if (globalFilters?.university && globalFilters.university !== "All") {
      return globalFilters.university;
    }
    if (clickedUniversity && clickedUniversity !== "All") {
      return clickedUniversity;
    }
    return null;
  }, [clickedUniversity, globalFilters?.university]);

  useEffect(() => {
    if (globalFilters?.university === "All") {
      setClickedUniversity(null);
    } else if (globalFilters?.university) {
      setClickedUniversity(globalFilters.university);
    }
  }, [globalFilters?.university]);

  // Current active data record
  const currentData: UniversityRecord = useMemo(() => {
    if (effectiveUniCode && UNIVERSITIES_DATA[effectiveUniCode]) {
      return UNIVERSITIES_DATA[effectiveUniCode];
    }
    return TOTAL_AGGREGATE;
  }, [effectiveUniCode]);

  // Click handler for bar chart cross-filtering (toggle on/off)
  const handleBarClick = (uniName: string) => {
    if (effectiveUniCode === uniName || clickedUniversity === uniName) {
      setClickedUniversity(null);
      if (onUniversityChange) {
        onUniversityChange("All");
      }
    } else {
      setClickedUniversity(uniName);
      if (onUniversityChange) {
        onUniversityChange(uniName);
      }
    }
  };

  // Clear cross-filter selection
  const clearSelection = () => {
    setClickedUniversity(null);
    if (onUniversityChange) {
      onUniversityChange("All");
    }
  };

  // Dynamic Gender Result Slices
  const dynamicGenderSlices: Slice[] = useMemo(() => {
    const total = currentData.results.pass + currentData.results.fail + currentData.results.atkt + currentData.results.absent;
    if (!total) return [];
    return [
      {
        label: "Pass",
        value: Math.round((currentData.results.pass / total) * 100),
        raw: currentData.results.pass.toLocaleString("en-IN"),
        color: "#2d8a6e",
      },
      {
        label: "Fail",
        value: Math.round((currentData.results.fail / total) * 100),
        raw: currentData.results.fail.toLocaleString("en-IN"),
        color: "#c0392b",
      },
      {
        label: "ATKT",
        value: Math.round((currentData.results.atkt / total) * 100),
        raw: currentData.results.atkt.toLocaleString("en-IN"),
        color: "#b8860b",
      },
      {
        label: "Absent",
        value: Math.round((currentData.results.absent / total) * 100),
        raw: currentData.results.absent.toLocaleString("en-IN"),
        color: "#7c8a99",
      },
    ];
  }, [currentData]);

  // Region result data (West Bengal Divisions / Zones)
  const regionResultData = [
    { name: "Kolkata", pass: 52400, fail: 8900, percentage: 85 },
    { name: "Presidency", pass: 42150, fail: 7200, percentage: 85 },
    { name: "Burdwan", pass: 38286, fail: 6624, percentage: 85 },
    { name: "Medinipur", pass: 29500, fail: 5800, percentage: 84 },
    { name: "Malda", pass: 19400, fail: 4800, percentage: 80 },
    { name: "Jalpaiguri", pass: 18200, fail: 4200, percentage: 81 },
    { name: "North Bengal", pass: 16400, fail: 3600, percentage: 82 },
    { name: "Howrah & Hooghly", pass: 22400, fail: 4100, percentage: 85 },
    { name: "South 24 Parganas", pass: 14200, fail: 3100, percentage: 82 },
  ];

  // Program Type passing rate
  const programPassingRateData = [
    { type: "Certificate", rate: 89, color: "#1a6b54" },
    { type: "Diploma", rate: 73, color: "#2980b9" },
    { type: "PG", rate: 69, color: "#4a7fb5" },
    { type: "UG", rate: 58, color: "#6a9bc3" },
    { type: "PG Diploma", rate: 48, color: "#8bb4d0" },
  ];

  // Tree nodes data
  const universitiesTree = [
    { name: "CU", count: 2450, max: 2500 },
    { name: "MAKAUT", count: 2210, max: 2500 },
    { name: "BU", count: 1724, max: 2500 },
    { name: "JU", count: 1628, max: 2500 },
    { name: "KU", count: 1450, max: 2500 },
    { name: "VU", count: 1280, max: 2500 },
    { name: "WBSU", count: 831, max: 2500 },
    { name: "NBU", count: 647, max: 2500 },
    { name: "Presidency", count: 605, max: 2500 },
    { name: "Visva-Bharati", count: 332, max: 2500 },
    { name: "KNU", count: 290, max: 2500 },
    { name: "SKBU", count: 180, max: 2500 },
  ];

  const coursesTree = [
    { name: "B.E - B.Tech", count: 504, max: 647 },
    { name: "M.Sc.", count: 97, max: 647 },
    { name: "M.E - M.Tech", count: 46, max: 647 },
    { name: "MBA", count: 38, max: 647 },
    { name: "MCA", count: 29, max: 647 },
    { name: "B.Sc.", count: 22, max: 647 },
    { name: "B.Com", count: 18, max: 647 },
  ];

  const semestersTree = [
    { name: "Sem 3", count: 224, max: 504 },
    { name: "Sem 1", count: 194, max: 504 },
    { name: "Sem 5", count: 149, max: 504 },
    { name: "Sem 2", count: 56, max: 504 },
    { name: "Sem 4", count: 23, max: 504 },
    { name: "Sem 6", count: 18, max: 504 },
    { name: "Sem 7", count: 14, max: 504 },
    { name: "Sem 8", count: 9, max: 504 },
  ];

  const resultStatusTree = [
    { name: "Fail", count: 32, max: 56, color: "#c0392b" },
    { name: "Pass", count: 24, max: 56, color: "#2d8a6e" },
  ];

  // Medium of Appearance items (English, Bengali, Hindi)
  const mediumList = [
    {
      medium: "English",
      totalFemale: TOTAL_AGGREGATE.medium.english.female,
      totalMale: TOTAL_AGGREGATE.medium.english.male,
      activeFemale: currentData.medium.english.female,
      activeMale: currentData.medium.english.male,
    },
    {
      medium: "Bengali",
      totalFemale: TOTAL_AGGREGATE.medium.bengali.female,
      totalMale: TOTAL_AGGREGATE.medium.bengali.male,
      activeFemale: currentData.medium.bengali.female,
      activeMale: currentData.medium.bengali.male,
    },
    {
      medium: "Hindi",
      totalFemale: TOTAL_AGGREGATE.medium.hindi.female,
      totalMale: TOTAL_AGGREGATE.medium.hindi.male,
      activeFemale: currentData.medium.hindi.female,
      activeMale: currentData.medium.hindi.male,
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn pb-12 relative">

      {/* Floating Info Box Tooltip */}
      <ChartTooltip data={tooltip?.data || null} pos={tooltip?.pos || null} />

      {/* ========================================================================= */}
      {/* 1. TOP 3 SUMMARY KPI CARDS (SEPARATE BOXES WITH SHADES & SHADOWS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Total Students */}
        <div
          onMouseMove={(e) =>
            setTooltip({
              data: {
                title: "Total Examination Candidates",
                subtitle: effectiveUniCode ? `University: ${UNIVERSITIES_DATA[effectiveUniCode]?.name || effectiveUniCode}` : "West Bengal State Universities Aggregate",
                items: [
                  { label: "Total Candidates", value: currentData.students.toLocaleString("en-IN"), highlight: true },
                  { label: "Examination Papers", value: currentData.papers.toLocaleString("en-IN") },
                  { label: "Evaluation Mode", value: "OMR / Digital Evaluation Active" },
                ],
              },
              pos: { x: e.clientX, y: e.clientY },
            })
          }
          onMouseLeave={() => setTooltip(null)}
          className="bg-gradient-to-br from-[#dbeafe]/70 via-slate-50 to-[#d0e5ff]/50 rounded-3xl border border-blue-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all duration-300 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/40 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/20">
                <Users size={24} className="stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">No. of Students</h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block animate-pulse"></span>
                  {effectiveUniCode ? `${effectiveUniCode} Registered` : "Total Registered"}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black bg-blue-100/70 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200/50">
              100%
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-3xl lg:text-4xl font-black text-brand-900 tracking-tight">
              {currentData.students.toLocaleString("en-IN")}
            </h3>
            <p className="text-xs text-blue-700 font-bold mt-1.5">
              Enrolled across all programs
            </p>
          </div>
        </div>

        {/* Card 2: Fresher Percentage */}
        <div
          onMouseMove={(e) =>
            setTooltip({
              data: {
                title: "Fresher Candidates (First-time Appear)",
                subtitle: "Regular Academic Cycle Candidates",
                items: [
                  { label: "Fresher Share", value: `${currentData.fresherPct}%`, highlight: true },
                  { label: "Fresher Count", value: ((currentData.students * currentData.fresherPct) / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 }) },
                  { label: "Total Candidates", value: currentData.students.toLocaleString("en-IN") },
                ],
              },
              pos: { x: e.clientX, y: e.clientY },
            })
          }
          onMouseLeave={() => setTooltip(null)}
          className="bg-gradient-to-br from-[#ccfbf1]/60 via-slate-50 to-[#99f6e4]/30 rounded-3xl border border-teal-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-teal-300 transition-all duration-300 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100/40 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-600/20">
                <GraduationCap size={24} className="stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-teal-950 uppercase tracking-wider">Fresher</h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">First-time Candidates</p>
              </div>
            </div>
            <span className="text-xs font-black bg-teal-100/70 text-teal-900 px-2.5 py-1 rounded-lg border border-teal-200/50">
              {currentData.fresherPct}%
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-3xl lg:text-4xl font-black text-teal-950 tracking-tight">
              {currentData.fresherPct}%
            </h3>
            <p className="text-xs text-teal-800 font-bold mt-1.5">
              {((currentData.students * currentData.fresherPct) / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })} Students
            </p>
          </div>
        </div>

        {/* Card 3: Repeater Percentage */}
        <div
          onMouseMove={(e) =>
            setTooltip({
              data: {
                title: "Repeater Candidates (Re-appearing)",
                subtitle: "Semester Backlog / Improvement Candidates",
                items: [
                  { label: "Repeater Share", value: `${currentData.repeaterPct}%`, highlight: true },
                  { label: "Repeater Count", value: ((currentData.students * currentData.repeaterPct) / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 }) },
                  { label: "Total Candidates", value: currentData.students.toLocaleString("en-IN") },
                ],
              },
              pos: { x: e.clientX, y: e.clientY },
            })
          }
          onMouseLeave={() => setTooltip(null)}
          className="bg-gradient-to-br from-[#e2e8f0]/70 via-slate-50 to-[#cbd5e1]/40 rounded-3xl border border-slate-200 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200/40 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-slate-600/20">
                <RotateCcw size={22} className="stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Repeater</h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Re-appearing Students</p>
              </div>
            </div>
            <span className="text-xs font-black bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/70">
              {currentData.repeaterPct}%
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {currentData.repeaterPct}%
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-1.5">
              {((currentData.students * currentData.repeaterPct) / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })} Students
            </p>
          </div>
        </div>

      </div>

      {/* Disclaimer */}
      <div className="-mt-3 text-right">
        <p className="text-[11px] font-medium text-slate-400 italic">
          *Disclaimer: Data updated as on 14-Aug-2026
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. NO. OF EXAMS BY SUBJECTS CONDUCTED BY UNIVERSITIES (SCROLLABLE) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg md:text-xl font-extrabold text-brand-900 tracking-tight">
                No. of Exams by Subjects Conducted by Universities
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                <MoveHorizontal size={12} /> {filteredUniversityExamsList.length} Universities (Scrollable)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Click any university bar to highlight and cross-filter all dashboard charts (click again to deselect)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend Indicator */}
            <div className="flex items-center gap-4 text-xs font-semibold mr-2">
              <span className="flex items-center gap-1.5 text-blue-700">
                <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-blue-600 to-sky-400"></span> Total Papers
              </span>
              <span className="flex items-center gap-1.5 text-indigo-900">
                <span className="w-3 h-3 rounded-full bg-indigo-800"></span> Total Students
              </span>
            </div>

            {/* Program Type Filter */}
            <div className="relative">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Program Type</label>
              <div className="relative">
                <select
                  value={programType}
                  onChange={(e) => setProgramType(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="UG">UG</option>
                  <option value="PG">PG</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Certificate">Certificate</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-2 text-slate-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Dual Axis Combo Chart (SVG-based with full scrollable width) */}
        <div className="w-full overflow-x-auto custom-scrollbar pb-3">
          <div className="min-w-[1350px] h-72 relative flex flex-col justify-end pt-8 pb-10 px-4">

            {/* Grid Lines */}
            <div className="absolute inset-x-0 top-8 bottom-12 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-slate-100 w-full flex justify-between text-[10px] text-slate-300">
                <span></span>
                <span>600,000</span>
              </div>
              <div className="border-b border-slate-100 w-full flex justify-between text-[10px] text-slate-300">
                <span></span>
                <span>400,000</span>
              </div>
              <div className="border-b border-slate-100 w-full flex justify-between text-[10px] text-slate-300">
                <span></span>
                <span>200,000</span>
              </div>
              <div className="border-b border-slate-200 w-full flex justify-between text-[10px] text-slate-400">
                <span></span>
                <span>0</span>
              </div>
            </div>

            {/* SVG Connecting Area & Line for Total Students */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-x-4 top-8 bottom-12 w-[calc(100%-32px)] h-48 overflow-visible pointer-events-none"
            >
              <defs>
                <linearGradient id="examStudentGradArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#examStudentGradArea)"
                points={`0,100 ${filteredUniversityExamsList.map((d, i) => {
                  const x = ((i + 0.5) / filteredUniversityExamsList.length) * 100;
                  const maxStudents = 650000;
                  const y = 100 - (d.students / maxStudents) * 100;
                  return `${x},${y}`;
                }).join(" ")} 100,100`}
              />
              <polyline
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={filteredUniversityExamsList.map((d, i) => {
                  const x = ((i + 0.5) / filteredUniversityExamsList.length) * 100;
                  const maxStudents = 650000;
                  const y = 100 - (d.students / maxStudents) * 100;
                  return `${x},${y}`;
                }).join(" ")}
              />
            </svg>

            {/* Bars and Data Points for all universities */}
            <div
              className="relative z-10 grid gap-4 h-full items-end"
              style={{ gridTemplateColumns: `repeat(${filteredUniversityExamsList.length}, minmax(72px, 1fr))` }}
            >
              {filteredUniversityExamsList.map((uni) => {
                const maxPapers = 7000;
                const barHeight = Math.max(12, (uni.papers / maxPapers) * 100);
                const maxStudents = 650000;
                const studentTopPct = 100 - (uni.students / maxStudents) * 100;

                const isSelected = effectiveUniCode === uni.name;
                const isDimmed = effectiveUniCode !== null && !isSelected;

                return (
                  <div
                    key={uni.name}
                    onClick={() => handleBarClick(uni.name)}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: UNIVERSITIES_DATA[uni.name]?.name || uni.name,
                          subtitle: `University Code: ${uni.name} • Exam Papers Analysis`,
                          items: [
                            { label: "University", value: UNIVERSITIES_DATA[uni.name]?.name || uni.name },
                            { label: "Conducted Exam Papers", value: uni.papers.toLocaleString("en-IN"), highlight: true },
                            { label: "Appeared Candidates", value: uni.students.toLocaleString("en-IN") },
                            { label: "Program Type", value: programType },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className={`flex flex-col items-center h-full justify-end group relative cursor-pointer transition-all duration-300 ${isDimmed ? "opacity-35 grayscale-40" : "opacity-100"
                      }`}
                  >
                    {/* Floating student dot */}
                    <div
                      className={`absolute rounded-full border-2 border-white shadow-md transition-all z-20 ${isSelected ? "w-4 h-4 bg-blue-600 scale-125 ring-2 ring-blue-300 shadow-blue-500/40" : "w-2.5 h-2.5 bg-indigo-800 group-hover:scale-150"
                        }`}
                      style={{ top: `${studentTopPct}%`, transform: "translateY(-50%)" }}
                    />

                    {/* Student count label over line */}
                    <span
                      className={`absolute text-[9px] font-black transition-all z-20 whitespace-nowrap px-1.5 py-0.5 rounded shadow-xs ${isSelected ? "bg-blue-900 text-white font-extrabold scale-110 shadow-md" : "bg-white/95 text-blue-950 border border-slate-100 opacity-90 group-hover:opacity-100"
                        }`}
                      style={{ top: `calc(${studentTopPct}% - 20px)` }}
                    >
                      {uni.students.toLocaleString("en-IN")}
                    </span>

                    {/* Bar Value (Papers) */}
                    <span className={`text-[10px] font-extrabold mb-1 ${isSelected ? "text-blue-950 scale-110" : "text-blue-900"}`}>
                      {uni.papers.toLocaleString("en-IN")}
                    </span>

                    {/* Blue Gradient Bar */}
                    <div
                      style={{ height: `${barHeight}%` }}
                      className={`w-full max-w-[36px] rounded-t-md transition-all duration-300 shadow-sm ${isSelected
                          ? "bg-gradient-to-t from-indigo-700 via-blue-600 to-sky-300 ring-2 ring-blue-400 shadow-md shadow-blue-500/30 scale-105"
                          : "bg-gradient-to-t from-blue-600 via-blue-500 to-sky-400 group-hover:from-blue-700 group-hover:to-sky-300"
                        }`}
                    />

                    {/* University Name Label */}
                    <span
                      className={`text-xs mt-2 text-center transition-all truncate max-w-[70px] ${isSelected ? "font-black text-blue-900 scale-110" : "font-semibold text-slate-700 group-hover:text-blue-900"
                        }`}
                    >
                      {uni.name}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ROW 2: FRESHER VS REPEATER (VERTICALLY SCROLLABLE) + MEDIUM & GENDER */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart A: University-wise Fresher vs Repeater (Scrollable through all universities) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                    University-wise Fresher vs Repeater
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                    <MoveVertical size={11} /> {FRESHER_REPEATER_LIST.length} Universities
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">
                  {effectiveUniCode ? `Highlighting: ${effectiveUniCode}` : "2025-26 State Distribution (Scrollable)"}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-teal-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-600 to-teal-400"></span> Fresher %
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-slate-600 to-slate-400"></span> Repeater %
                </span>
              </div>
            </div>

            {/* Vertically Scrollable Stacked Bars for ALL Universities */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar pr-2 space-y-2.5 mt-2">
              {FRESHER_REPEATER_LIST.map((uni) => {
                const isSelected = effectiveUniCode === uni.name;
                const isDimmed = effectiveUniCode !== null && !isSelected;

                return (
                  <div
                    key={uni.name}
                    onClick={() => handleBarClick(uni.name)}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: UNIVERSITIES_DATA[uni.name]?.name || uni.name,
                          subtitle: `Candidate Composition: ${uni.name}`,
                          items: [
                            { label: "Fresher Candidates", value: `${uni.fresher}%`, highlight: true },
                            { label: "Repeater Candidates", value: `${uni.repeater}%` },
                            { label: "Total Candidates", value: (UNIVERSITIES_DATA[uni.name]?.students || 50000).toLocaleString("en-IN") },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className={`flex items-center gap-3 text-xs p-1.5 rounded-xl transition-all duration-300 cursor-pointer ${isSelected
                        ? "bg-blue-50/90 ring-2 ring-blue-500 scale-[1.01] shadow-sm"
                        : isDimmed
                          ? "opacity-30 grayscale-[50%]"
                          : "hover:bg-slate-50 opacity-100"
                      }`}
                  >
                    <span className={`w-18 font-bold text-right truncate ${isSelected ? "text-blue-900 font-black" : "text-slate-700"}`}>
                      {uni.name}
                    </span>
                    <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden flex relative shadow-inner">
                      {/* Fresher Segment */}
                      <div
                        style={{ width: `${uni.fresher}%` }}
                        className={`transition-all flex items-center justify-center text-[10px] font-extrabold ${isSelected ? "bg-gradient-to-r from-teal-700 to-teal-500 text-white shadow-xs" : "bg-gradient-to-r from-teal-600 to-teal-400 text-white"
                          }`}
                      >
                        {uni.fresher}%
                      </div>
                      {/* Repeater Segment */}
                      <div
                        style={{ width: `${uni.repeater}%` }}
                        className={`transition-all flex items-center justify-center text-[10px] font-extrabold ${isSelected ? "bg-gradient-to-r from-slate-700 to-slate-500 text-white shadow-xs" : "bg-gradient-to-r from-slate-600 to-slate-400 text-white"
                          }`}
                      >
                        {uni.repeater}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic text-center mt-4 pt-3 border-t border-slate-100">
            *Disclaimer: Repeater students also appear as freshers for their current semester
          </p>
        </div>

        {/* Chart B: No. of Students by Medium of Appearance and Gender (Proportional Cross-Highlight) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                  No. of Students by Medium of Appearance & Gender
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  {effectiveUniCode ? `Showing ${effectiveUniCode} share of Total` : "2025-26 Breakdown"}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-t from-indigo-500 to-indigo-300"></span> Female
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-t from-slate-500 to-slate-300"></span> Male
                </span>
              </div>
            </div>

            {/* Proportional Cross-Filtered Clustered Columns */}
            <div className="grid grid-cols-3 gap-6 h-64 pt-6 pb-2 items-end border-b border-slate-100">
              {mediumList.map((item) => {
                const maxVal = 900000;

                // Total bar heights
                const totalFemaleHeightPct = Math.min(100, Math.max(12, (item.totalFemale / maxVal) * 100));
                const totalMaleHeightPct = Math.min(100, Math.max(12, (item.totalMale / maxVal) * 100));

                // Active proportion percentage of total
                const activeFemaleShare = item.totalFemale > 0 ? (item.activeFemale / item.totalFemale) * 100 : 0;
                const activeMaleShare = item.totalMale > 0 ? (item.activeMale / item.totalMale) * 100 : 0;

                const isCrossFiltered = effectiveUniCode !== null;

                return (
                  <div
                    key={item.medium}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: `Medium of Exam: ${item.medium}`,
                          subtitle: effectiveUniCode ? `Filtered University: ${effectiveUniCode}` : "West Bengal Statewide Examination Medium",
                          items: [
                            { label: "Language Medium", value: item.medium },
                            { label: "Female Candidates", value: (isCrossFiltered ? item.activeFemale : item.totalFemale).toLocaleString("en-IN"), highlight: true },
                            { label: "Male Candidates", value: (isCrossFiltered ? item.activeMale : item.totalMale).toLocaleString("en-IN") },
                            { label: "Medium Share of Total", value: `${(((item.totalFemale + item.totalMale) / 1950000) * 100).toFixed(1)}%` },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className="flex flex-col items-center h-full justify-end cursor-pointer"
                  >
                    <div className="flex items-end justify-center gap-2.5 w-full h-48">

                      {/* Female Bar Container */}
                      <div className="flex flex-col items-center flex-1 max-w-[48px] h-full justify-end group relative">
                        <span className="text-[9px] font-bold text-indigo-900 mb-1 truncate max-w-[52px]">
                          {isCrossFiltered ? item.activeFemale.toLocaleString("en-IN") : item.totalFemale.toLocaleString("en-IN")}
                        </span>

                        {/* Bar Body */}
                        <div
                          style={{ height: `${totalFemaleHeightPct}%` }}
                          className={`w-full rounded-t-lg transition-all duration-300 shadow-sm relative overflow-hidden flex flex-col justify-end ${isCrossFiltered ? "bg-indigo-100" : "bg-gradient-to-t from-indigo-500 to-indigo-300 group-hover:from-indigo-600 group-hover:to-indigo-200"
                            }`}
                        >
                          {/* Inner Highlighted Fraction for Selected University */}
                          {isCrossFiltered && (
                            <div
                              style={{ height: `${activeFemaleShare}%` }}
                              className="w-full bg-gradient-to-t from-indigo-600 to-indigo-300 transition-all duration-500 shadow-xs"
                            />
                          )}
                        </div>
                        {isCrossFiltered && (
                          <span className="text-[8px] font-black text-indigo-900 mt-0.5">
                            {activeFemaleShare.toFixed(1)}%
                          </span>
                        )}
                      </div>

                      {/* Male Bar Container */}
                      <div className="flex flex-col items-center flex-1 max-w-[48px] h-full justify-end group relative">
                        <span className="text-[9px] font-bold text-slate-800 mb-1 truncate max-w-[52px]">
                          {isCrossFiltered ? item.activeMale.toLocaleString("en-IN") : item.totalMale.toLocaleString("en-IN")}
                        </span>

                        {/* Bar Body */}
                        <div
                          style={{ height: `${totalMaleHeightPct}%` }}
                          className={`w-full rounded-t-lg transition-all duration-300 shadow-sm relative overflow-hidden flex flex-col justify-end ${isCrossFiltered ? "bg-slate-200" : "bg-gradient-to-t from-slate-500 to-slate-300 group-hover:from-slate-600 group-hover:to-slate-200"
                            }`}
                        >
                          {/* Inner Highlighted Fraction for Selected University */}
                          {isCrossFiltered && (
                            <div
                              style={{ height: `${activeMaleShare}%` }}
                              className="w-full bg-gradient-to-t from-slate-600 to-slate-300 transition-all duration-500 shadow-xs"
                            />
                          )}
                        </div>
                        {isCrossFiltered && (
                          <span className="text-[8px] font-black text-slate-800 mt-0.5">
                            {activeMaleShare.toFixed(1)}%
                          </span>
                        )}
                      </div>

                    </div>
                    <span className="text-xs font-bold text-slate-700 mt-2">{item.medium}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic text-center mt-4 pt-2">
            *Disclaimer: Few students have not disclosed the medium of appearance and gender
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. RESULT SECTION (ROYAL BLUE ACCENT BANNER + FILTERS) */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-950 via-brand-900 to-indigo-950 p-4 lg:p-5 rounded-2xl md:rounded-3xl shadow-xl text-white border border-blue-800/40">

        {/* Session Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Session:</span>
          <div className="relative flex-1 md:flex-initial">
            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="w-full md:w-36 bg-white/15 hover:bg-white/20 text-white font-bold py-1.5 pl-3 pr-8 rounded-xl border border-white/20 text-xs focus:outline-none cursor-pointer appearance-none"
            >
              <option className="text-slate-900" value="2025-26">2025-26</option>
              <option className="text-slate-900" value="2024-25">2024-25</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-2 text-white/90" />
          </div>
        </div>

        {/* Big Center Title */}
        <div className="text-center px-4">
          <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-widest text-white drop-shadow-sm">
            Result {effectiveUniCode ? `(${effectiveUniCode})` : ""}
          </h2>
        </div>

        {/* Season Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Season:</span>
          <div className="relative flex-1 md:flex-initial">
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full md:w-36 bg-white/15 hover:bg-white/20 text-white font-bold py-1.5 pl-3 pr-8 rounded-xl border border-white/20 text-xs focus:outline-none cursor-pointer appearance-none"
            >
              <option className="text-slate-900" value="Winter">Winter</option>
              <option className="text-slate-900" value="Summer">Summer</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-2 text-white/90" />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. RESULT 4 KPI METRIC CARDS (DYNAMICALLY FILTERED) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Pass Students */}
        <div
          onMouseMove={(e) =>
            setTooltip({
              data: {
                title: "Cleared / Pass Candidates",
                subtitle: effectiveUniCode ? `${effectiveUniCode} Results` : "State Universities Aggregate",
                items: [
                  { label: "Successful Candidates", value: currentData.results.pass.toLocaleString("en-IN"), highlight: true },
                  { label: "Passing Rate", value: `${((currentData.results.pass / (currentData.results.pass + currentData.results.fail + currentData.results.atkt + currentData.results.absent || 1)) * 100).toFixed(1)}%` },
                  { label: "Audit Status", value: "Declared on State Digilocker" },
                ],
              },
              pos: { x: e.clientX, y: e.clientY },
            })
          }
          onMouseLeave={() => setTooltip(null)}
          className="bg-gradient-to-br from-teal-50/70 via-white to-white rounded-3xl border border-teal-200/60 shadow-soft p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider">Pass Students</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-600/15">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl lg:text-4xl font-black text-teal-900 tracking-tight">
              {currentData.results.pass.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-teal-700 font-bold mt-1">Cleared All Examinations</p>
          </div>
        </div>

        {/* Students Not Cleared */}
        <div
          onMouseMove={(e) =>
            setTooltip({
              data: {
                title: "Students Not Cleared (Failed)",
                subtitle: "Eligible for Supplementary / Re-evaluation Examination",
                items: [
                  { label: "Failed Candidates", value: currentData.results.fail.toLocaleString("en-IN"), highlight: true },
                  { label: "Failure Rate", value: `${((currentData.results.fail / (currentData.results.pass + currentData.results.fail + currentData.results.atkt + currentData.results.absent || 1)) * 100).toFixed(1)}%` },
                  { label: "Next Re-exam", value: "Summer 2026 Supplementary" },
                ],
              },
              pos: { x: e.clientX, y: e.clientY },
            })
          }
          onMouseLeave={() => setTooltip(null)}
          className="bg-gradient-to-br from-red-50/50 via-white to-white rounded-3xl border border-red-200/50 shadow-soft p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-red-800 uppercase tracking-wider">Students Not Cleared</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-700 to-red-500 text-white flex items-center justify-center shadow-md shadow-red-600/15">
              <XCircle size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl lg:text-4xl font-black text-red-900 tracking-tight">
              {currentData.results.fail.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-red-700 font-bold mt-1">Failed / Require Re-exam</p>
          </div>
        </div>

        {/* Absent Students */}
        <div
          onMouseMove={(e) =>
            setTooltip({
              data: {
                title: "Absent Candidates",
                subtitle: "Registered but did not attend examination hall",
                items: [
                  { label: "Absent Candidates", value: currentData.results.absent.toLocaleString("en-IN"), highlight: true },
                  { label: "Absent Rate", value: `${((currentData.results.absent / (currentData.results.pass + currentData.results.fail + currentData.results.atkt + currentData.results.absent || 1)) * 100).toFixed(1)}%` },
                ],
              },
              pos: { x: e.clientX, y: e.clientY },
            })
          }
          onMouseLeave={() => setTooltip(null)}
          className="bg-gradient-to-br from-amber-50/50 via-white to-white rounded-3xl border border-amber-200/50 shadow-soft p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Absent Students</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-600/15">
              <UserX size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl lg:text-4xl font-black text-amber-900 tracking-tight">
              {currentData.results.absent.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-amber-700 font-bold mt-1">Did Not Attend Exam</p>
          </div>
        </div>

        {/* Backlog Students */}
        <div
          onMouseMove={(e) =>
            setTooltip({
              data: {
                title: "Allowed to Keep Terms (ATKT) / Backlogs",
                subtitle: "Promoted with active subject backlogs",
                items: [
                  { label: "ATKT / Backlog Count", value: currentData.results.atkt.toLocaleString("en-IN"), highlight: true },
                  { label: "Backlog Ratio", value: `${((currentData.results.atkt / (currentData.results.pass + currentData.results.fail + currentData.results.atkt + currentData.results.absent || 1)) * 100).toFixed(1)}%` },
                ],
              },
              pos: { x: e.clientX, y: e.clientY },
            })
          }
          onMouseLeave={() => setTooltip(null)}
          className="bg-gradient-to-br from-slate-50/70 via-white to-white rounded-3xl border border-slate-200 shadow-soft p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Backlog Students</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-500 text-white flex items-center justify-center shadow-md shadow-slate-600/15">
              <RotateCcw size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">
              {currentData.results.atkt.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-600 font-bold mt-1">Pending Semester Backlogs</p>
          </div>
        </div>

      </div>

      <p className="text-xs text-slate-400 italic text-center -mt-3">
        *Disclaimer: Few students have appeared in more than one semester examination.
      </p>

      {/* ========================================================================= */}
      {/* 6. ROW 3: GENDER-WISE RESULTS + REGION-WISE RESULT ANALYSIS (SCROLLABLE) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Gender-wise Results (Donut Chart) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                Gender-wise Results
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                {effectiveUniCode ? `${effectiveUniCode} Result Breakdown` : "2025-26 Result Breakdown"}
              </p>
            </div>

            <div className="relative">
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 pr-7 appearance-none cursor-pointer"
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2 text-slate-400" />
            </div>
          </div>

          <div className="py-2">
            <InteractiveDoughnut
              title={`Gender-wise Result Breakdown (${genderFilter === "All" ? "All Genders" : genderFilter})`}
              onExpand={(title, slices) => setExpandedPieData({ title, slices })}
              onTooltip={(data, pos) => setTooltip(data && pos ? { data, pos } : null)}
              columns={2}
              slices={dynamicGenderSlices}
              totalLabel={effectiveUniCode || "Total Results"}
              totalValue={currentData.students.toLocaleString("en-IN")}
            />
          </div>
        </div>

        {/* Region-wise Result Analysis (Vertically Scrollable through all Divisions) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                    Region-wise Result Analysis
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                    <MoveVertical size={11} /> {regionResultData.length} Regions
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">2025-26 Administrative Divisions (Scrollable)</p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-teal-700">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-600"></span> Pass
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span> Fail
                </span>
                <span className="flex items-center gap-1.5 text-blue-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Pass %
                </span>
              </div>
            </div>

            {/* Region List with Custom Vertical Scroll */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar pr-2 space-y-3.5 mt-2">
              {regionResultData.map((reg) => (
                <div
                  key={reg.name}
                  onMouseMove={(e) =>
                    setTooltip({
                      data: {
                        title: `Division: ${reg.name}`,
                        subtitle: "Administrative Division Examination Performance",
                        items: [
                          { label: "Region", value: reg.name },
                          { label: "Pass Percentage", value: `${reg.percentage}%`, highlight: true },
                          { label: "Passed Students", value: reg.pass.toLocaleString("en-IN") },
                          { label: "Failed Students", value: reg.fail.toLocaleString("en-IN") },
                        ],
                      },
                      pos: { x: e.clientX, y: e.clientY },
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  className="space-y-1.5 cursor-pointer hover:bg-blue-50/30 p-1.5 rounded-xl transition-colors"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-900">{reg.name}</span>
                    <span className="text-slate-500 font-semibold text-[11px]">
                      Pass: <b className="text-teal-700">{reg.pass.toLocaleString("en-IN")}</b> | Fail: <b className="text-slate-700">{reg.fail.toLocaleString("en-IN")}</b> | Pass: <b className="text-blue-700 font-extrabold">{reg.percentage}%</b>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${reg.percentage}%` }}
                      className="bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all shadow-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 7. RESULTS BREAKUP (BY UNIVERSITY COMBINATION CHART - HORIZONTALLY SCROLLABLE) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg md:text-xl font-extrabold text-brand-900 tracking-tight">
                Results Breakup
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                <MoveHorizontal size={12} /> {RESULTS_BREAKUP_LIST.length} Universities (Scrollable)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">2025-26 University Comparison across all institutions</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 text-xs font-semibold mr-2">
              <span className="flex items-center gap-1.5 text-teal-700">
                <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-teal-700 to-teal-400"></span> Pass Students
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-slate-500 to-slate-300"></span> Fail Students
              </span>
              <span className="flex items-center gap-1.5 text-blue-900">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span> Pass Percentage
              </span>
            </div>

            {/* College Type Filter */}
            <div className="relative">
              <select
                value={collegeTypeFilter}
                onChange={(e) => setCollegeTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 pr-7 appearance-none cursor-pointer"
              >
                <option value="All">College Type: All</option>
                <option value="Affiliated">Affiliated</option>
                <option value="Autonomous">Autonomous</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2 text-slate-400" />
            </div>

            {/* College Name Filter */}
            <div className="relative">
              <select
                value={collegeNameFilter}
                onChange={(e) => setCollegeNameFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 pr-7 appearance-none cursor-pointer"
              >
                <option value="All">College Name: All</option>
                <option value="COEP">COEP</option>
                <option value="VJTI">VJTI</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Combination Bar & Line Chart with Horizontal Scroll */}
        <div className="w-full overflow-x-auto custom-scrollbar pb-3">
          <div className="min-w-[1350px] h-72 relative flex flex-col justify-end pt-8 pb-10 px-4">

            {/* Background grid */}
            <div className="absolute inset-x-0 top-8 bottom-12 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-slate-100 w-full flex justify-end text-[10px] text-slate-300">100%</div>
              <div className="border-b border-slate-100 w-full flex justify-end text-[10px] text-slate-300">80%</div>
              <div className="border-b border-slate-100 w-full flex justify-end text-[10px] text-slate-300">60%</div>
              <div className="border-b border-slate-200 w-full flex justify-end text-[10px] text-slate-400">0%</div>
            </div>

            {/* Trend line for Pass Percentage */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-x-4 top-8 bottom-12 w-[calc(100%-32px)] h-48 overflow-visible pointer-events-none"
            >
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={RESULTS_BREAKUP_LIST.map((d, i) => {
                  const x = ((i + 0.5) / RESULTS_BREAKUP_LIST.length) * 100;
                  const y = 100 - (d.percentage / 100) * 100;
                  return `${x},${y}`;
                }).join(" ")}
              />
            </svg>

            {/* Bars for all universities */}
            <div
              className="relative z-10 grid gap-4 h-52 items-end"
              style={{ gridTemplateColumns: `repeat(${RESULTS_BREAKUP_LIST.length}, minmax(72px, 1fr))` }}
            >
              {RESULTS_BREAKUP_LIST.map((d) => {
                const maxStudents = 75000;
                const passHeight = Math.max(12, (d.pass / maxStudents) * 100);
                const failHeight = Math.max(12, (d.fail / maxStudents) * 100);
                const pctTop = 100 - (d.percentage / 100) * 100;

                const isSelected = effectiveUniCode === d.name;

                return (
                  <div
                    key={d.name}
                    onClick={() => handleBarClick(d.name)}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: UNIVERSITIES_DATA[d.name]?.name || d.name,
                          subtitle: `Results Breakup: ${d.name}`,
                          items: [
                            { label: "University", value: UNIVERSITIES_DATA[d.name]?.name || d.name },
                            { label: "Pass Percentage", value: `${d.percentage}%`, highlight: true },
                            { label: "Passed Students", value: d.pass.toLocaleString("en-IN") },
                            { label: "Failed Students", value: d.fail.toLocaleString("en-IN") },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className={`flex flex-col items-center h-full justify-end group relative cursor-pointer transition-all ${effectiveUniCode && !isSelected ? "opacity-35 grayscale-40" : "opacity-100"
                      }`}
                  >
                    {/* Pass % dot & label */}
                    <div
                      className={`absolute rounded-full border-2 border-white shadow-sm transition-transform z-20 ${isSelected ? "w-4 h-4 bg-blue-600 scale-125 ring-2 ring-blue-300" : "w-3 h-3 bg-blue-600 group-hover:scale-150"
                        }`}
                      style={{ top: `${pctTop}%`, transform: "translateY(-50%)" }}
                    />
                    <span
                      className={`absolute text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs z-20 ${isSelected ? "bg-blue-900 text-white font-extrabold" : "bg-white/95 text-blue-700 border border-slate-100"
                        }`}
                      style={{ top: `calc(${pctTop}% - 22px)` }}
                    >
                      {d.percentage}%
                    </span>

                    {/* Dual Bars (Pass vs Fail) */}
                    <div className="flex items-end justify-center gap-1.5 w-full h-40">
                      {/* Pass Bar */}
                      <div className="flex flex-col items-center flex-1 max-w-[34px] h-full justify-end">
                        <span className="text-[9px] font-bold text-teal-900 mb-1 truncate max-w-[36px]">
                          {d.pass.toLocaleString("en-IN")}
                        </span>
                        <div
                          style={{ height: `${passHeight}%` }}
                          className="w-full bg-gradient-to-t from-teal-700 via-teal-500 to-teal-400 group-hover:from-teal-800 group-hover:to-teal-300 rounded-t-md transition-all duration-300 shadow-sm"
                        />
                      </div>
                      {/* Fail Bar */}
                      <div className="flex flex-col items-center flex-1 max-w-[34px] h-full justify-end">
                        <span className="text-[9px] font-bold text-slate-600 mb-1 truncate max-w-[36px]">
                          {d.fail.toLocaleString("en-IN")}
                        </span>
                        <div
                          style={{ height: `${failHeight}%` }}
                          className="w-full bg-gradient-to-t from-slate-500 to-slate-300 group-hover:from-slate-600 group-hover:to-slate-200 rounded-t-md transition-all duration-300 shadow-sm"
                        />
                      </div>
                    </div>

                    <span className={`text-xs mt-2 text-center truncate max-w-[70px] ${isSelected ? "font-black text-blue-900 scale-110" : "font-semibold text-slate-700 group-hover:text-blue-900"}`}>
                      {d.name}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. PROGRAM TYPE WISE PASSING RATE (RESPONSIVE SCROLL) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-brand-900 tracking-tight">
              Program Type wise Passing Rate
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">2025-26 Passing Efficiency</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={progTypeUniFilter}
                onChange={(e) => setProgTypeUniFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 pr-7 appearance-none cursor-pointer"
              >
                <option value="All">University: All</option>
                <option value="SPPU">SPPU</option>
                <option value="SUK">SUK</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={progTypeCollegeTypeFilter}
                onChange={(e) => setProgTypeCollegeTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 pr-7 appearance-none cursor-pointer"
              >
                <option value="All">College Type: All</option>
                <option value="Affiliated">Affiliated</option>
                <option value="Autonomous">Autonomous</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Big Blue & Sky Gradient Bars */}
        <div className="w-full overflow-x-auto custom-scrollbar pb-2">
          <div className="min-w-[600px] grid grid-cols-5 gap-4 h-64 items-end pt-4 pb-2">
            {programPassingRateData.map((item) => (
              <div
                key={item.type}
                onMouseMove={(e) =>
                  setTooltip({
                    data: {
                      title: `${item.type} — Academic Level`,
                      subtitle: "Passing Efficiency Analysis",
                      items: [
                        { label: "Academic Level", value: item.type },
                        { label: "Passing Rate", value: `${item.rate}%`, highlight: true },
                        { label: "State Benchmark", value: "65.0% Average Pass Rate" },
                      ],
                    },
                    pos: { x: e.clientX, y: e.clientY },
                  })
                }
                onMouseLeave={() => setTooltip(null)}
                className="flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                <span className="text-base font-black text-blue-900 mb-2 group-hover:scale-110 transition-transform">
                  {item.rate}%
                </span>
                <div
                  style={{ height: `${item.rate}%` }}
                  className="w-full max-w-[85px] rounded-t-2xl shadow-sm transition-all duration-300 group-hover:scale-y-[1.03] group-hover:shadow-md bg-gradient-to-t from-blue-700 via-blue-500 to-sky-400 group-hover:from-blue-800 group-hover:to-sky-300"
                />
                <span className="text-xs font-bold text-slate-700 mt-3 text-center truncate w-full group-hover:text-blue-900">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. RESULT ANALYSIS DECOMPOSITION TREE (SCROLLABLE IN BOTH DIRECTIONS) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg md:text-xl font-extrabold text-brand-900 tracking-tight flex items-center gap-2">
                <Layers className="text-blue-600" size={22} /> Result Analysis (Decomposition Tree)
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                <MoveHorizontal size={12} /> Drill-down tree (Scrollable)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Click nodes to drill down and explore specific university, course, semester & result paths
            </p>
          </div>

          <div className="relative">
            <select
              value={decompCollegeType}
              onChange={(e) => setDecompCollegeType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 pr-7 appearance-none cursor-pointer"
            >
              <option value="All">College Type: All</option>
              <option value="Affiliated">Affiliated</option>
              <option value="Autonomous">Autonomous</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2 text-slate-400" />
          </div>
        </div>

        {/* Tree Breadcrumb Controls */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto custom-scrollbar pb-3 mb-4">
          <span className="text-slate-400 flex-shrink-0">Path:</span>
          <span className="bg-blue-50 text-blue-900 border border-blue-100 px-2.5 py-1 rounded-lg flex-shrink-0">Season: <b>{selectedSeason}</b></span>
          <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
          <span className="bg-blue-50 text-blue-900 border border-blue-100 px-2.5 py-1 rounded-lg flex-shrink-0">University: <b>{selectedUniversity}</b></span>
          <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
          <span className="bg-blue-50 text-blue-900 border border-blue-100 px-2.5 py-1 rounded-lg flex-shrink-0">Course: <b>{selectedCourse}</b></span>
          <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
          <span className="bg-blue-50 text-blue-900 border border-blue-100 px-2.5 py-1 rounded-lg flex-shrink-0">Type: <b>{selectedExamType}</b></span>
          <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
          <span className="bg-blue-50 text-blue-900 border border-blue-100 px-2.5 py-1 rounded-lg flex-shrink-0">Sem: <b>{selectedSemester}</b></span>
        </div>

        {/* Interactive Decomposition Tree Visualization (Horizontal Scroll Container) */}
        <div className="w-full overflow-x-auto custom-scrollbar py-4">
          <div className="min-w-[1050px] flex items-start gap-8">

            {/* Level 0: Total Records */}
            <div
              onMouseMove={(e) =>
                setTooltip({
                  data: {
                    title: "Decomposition Root: Total Records",
                    subtitle: "West Bengal Higher Education Department Exam Database",
                    items: [
                      { label: "Total Examination Records", value: "202,368", highlight: true },
                      { label: "Status", value: "Multi-level Drill-down Active" },
                    ],
                  },
                  pos: { x: e.clientX, y: e.clientY },
                })
              }
              onMouseLeave={() => setTooltip(null)}
              className="flex flex-col items-center justify-center w-36 flex-shrink-0 cursor-pointer"
            >
              <span className="text-[11px] font-extrabold uppercase text-slate-400 mb-2">Total Records</span>
              <div className="w-full bg-slate-50/90 border-2 border-blue-900 rounded-2xl p-3 shadow-sm text-center">
                <span className="text-xs font-bold text-blue-900 block">Total Records</span>
                <span className="text-base font-black text-blue-950">202,368</span>
                <div className="w-full h-1.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full mt-2" />
              </div>
            </div>

            {/* Level 1: Season */}
            <div className="flex flex-col items-center justify-center w-36 flex-shrink-0">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 mb-2">Season</span>
              <div
                onClick={() => setSelectedSeason("Winter")}
                onMouseMove={(e) =>
                  setTooltip({
                    data: {
                      title: "Season: Winter 2025-26",
                      subtitle: "Winter Examination Cycle",
                      items: [
                        { label: "Season Name", value: "Winter" },
                        { label: "Records", value: "202,368", highlight: true },
                      ],
                    },
                    pos: { x: e.clientX, y: e.clientY },
                  })
                }
                onMouseLeave={() => setTooltip(null)}
                className="w-full bg-gradient-to-br from-blue-50 to-indigo-50/60 border-2 border-blue-600 rounded-2xl p-3 shadow-sm text-center cursor-pointer transition-all hover:scale-105"
              >
                <span className="text-xs font-bold text-blue-900 block">Winter</span>
                <span className="text-base font-black text-blue-950">202,368</span>
                <div className="w-full h-1.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full mt-2" />
              </div>
            </div>

            {/* Level 2: Universities (Vertically Scrollable column with all institutions) */}
            <div className="flex flex-col w-44 flex-shrink-0">
              <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                <span>University</span>
                <MoveVertical size={10} />
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar pr-1.5 space-y-2">
                {universitiesTree.map((u) => {
                  const isSelected = selectedUniversity === u.name;
                  const fillPct = (u.count / u.max) * 100;
                  return (
                    <div
                      key={u.name}
                      onClick={() => setSelectedUniversity(u.name)}
                      onMouseMove={(e) =>
                        setTooltip({
                          data: {
                            title: `Tree Node: ${u.name}`,
                            subtitle: "University Hierarchy Level",
                            items: [
                              { label: "University", value: u.name },
                              { label: "Candidate Nodes", value: u.count.toLocaleString("en-IN"), highlight: true },
                            ],
                          },
                          pos: { x: e.clientX, y: e.clientY },
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      className={`rounded-2xl p-2.5 border transition-all cursor-pointer ${isSelected
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50/80 border-blue-600 shadow-sm scale-102 ring-1 ring-blue-400"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                      <div className="flex justify-between text-xs">
                        <span className={`font-bold ${isSelected ? "text-blue-900 font-black" : "text-slate-800"}`}>{u.name}</span>
                        <span className="font-extrabold text-slate-600">{u.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden shadow-inner">
                        <div style={{ width: `${fillPct}%` }} className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level 3: Courses (Vertically Scrollable column) */}
            <div className="flex flex-col w-44 flex-shrink-0">
              <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                <span>Course</span>
                <MoveVertical size={10} />
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar pr-1.5 space-y-2">
                {coursesTree.map((c) => {
                  const isSelected = selectedCourse === c.name;
                  const fillPct = (c.count / c.max) * 100;
                  return (
                    <div
                      key={c.name}
                      onClick={() => setSelectedCourse(c.name)}
                      onMouseMove={(e) =>
                        setTooltip({
                          data: {
                            title: `Course: ${c.name}`,
                            subtitle: "Academic Degree Program Level",
                            items: [
                              { label: "Course Name", value: c.name },
                              { label: "Candidate Nodes", value: c.count.toLocaleString("en-IN"), highlight: true },
                            ],
                          },
                          pos: { x: e.clientX, y: e.clientY },
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      className={`rounded-2xl p-2.5 border transition-all cursor-pointer ${isSelected
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50/80 border-blue-600 shadow-sm scale-102 ring-1 ring-blue-400"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                      <div className="flex justify-between text-xs">
                        <span className={`font-bold truncate max-w-[95px] ${isSelected ? "text-blue-900 font-black" : "text-slate-800"}`}>
                          {c.name}
                        </span>
                        <span className="font-extrabold text-slate-600">{c.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden shadow-inner">
                        <div style={{ width: `${fillPct}%` }} className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level 4: Exam Type */}
            <div className="flex flex-col gap-2 w-36 flex-shrink-0">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 mb-1 text-center">Exam Type</span>
              <div
                onClick={() => setSelectedExamType("Repeater")}
                onMouseMove={(e) =>
                  setTooltip({
                    data: {
                      title: "Exam Type: Repeater",
                      subtitle: "Exam Pattern Node",
                      items: [
                        { label: "Exam Type", value: "Repeater" },
                        { label: "Candidate Count", value: "504", highlight: true },
                      ],
                    },
                    pos: { x: e.clientX, y: e.clientY },
                  })
                }
                onMouseLeave={() => setTooltip(null)}
                className={`rounded-2xl p-2.5 border transition-all cursor-pointer ${selectedExamType === "Repeater"
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50/80 border-blue-600 shadow-sm ring-1 ring-blue-400"
                    : "bg-white border-slate-200"
                  }`}
              >
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-blue-900">Repeater</span>
                  <span className="font-extrabold text-slate-600">504</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden shadow-inner">
                  <div style={{ width: "100%" }} className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Level 5: Semester (Vertically Scrollable Semesters list) */}
            <div className="flex flex-col w-36 flex-shrink-0">
              <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                <span>Semester</span>
                <MoveVertical size={10} />
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar pr-1.5 space-y-2">
                {semestersTree.map((s) => {
                  const isSelected = selectedSemester === s.name;
                  const fillPct = (s.count / s.max) * 100;
                  return (
                    <div
                      key={s.name}
                      onClick={() => setSelectedSemester(s.name)}
                      onMouseMove={(e) =>
                        setTooltip({
                          data: {
                            title: `Semester: ${s.name}`,
                            subtitle: "Academic Term Level",
                            items: [
                              { label: "Semester", value: s.name },
                              { label: "Candidate Count", value: s.count.toLocaleString("en-IN"), highlight: true },
                            ],
                          },
                          pos: { x: e.clientX, y: e.clientY },
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      className={`rounded-2xl p-2.5 border transition-all cursor-pointer ${isSelected
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50/80 border-blue-600 shadow-sm scale-102 ring-1 ring-blue-400"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                      <div className="flex justify-between text-xs">
                        <span className={`font-bold ${isSelected ? "text-blue-900 font-black" : "text-slate-800"}`}>{s.name}</span>
                        <span className="font-extrabold text-slate-600">{s.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden shadow-inner">
                        <div style={{ width: `${fillPct}%` }} className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level 6: Result Status */}
            <div className="flex flex-col gap-2 w-36 flex-shrink-0">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 mb-1 text-center">Result Status</span>
              {resultStatusTree.map((r) => {
                const fillPct = (r.count / r.max) * 100;
                return (
                  <div
                    key={r.name}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: `Result: ${r.name}`,
                          subtitle: "Terminal Decomposition Status",
                          items: [
                            { label: "Outcome", value: r.name },
                            { label: "Candidate Count", value: r.count.toLocaleString("en-IN"), highlight: true },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className="rounded-2xl p-2.5 border bg-white border-slate-200 shadow-xs cursor-pointer"
                  >
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-800">{r.name}</span>
                      <span className="font-extrabold text-slate-700">{r.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden shadow-inner">
                      <div
                        style={{ width: `${fillPct}%`, backgroundColor: r.color }}
                        className="h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

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
