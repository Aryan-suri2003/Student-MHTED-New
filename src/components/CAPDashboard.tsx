"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Filter,
  X,
  ChevronDown,
  Building2,
  Layers,
  MoveVertical,
  MoveHorizontal,
  TrendingUp,
  ArrowRight,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { GlobalFilterState } from "@/components/Filters";
import ChartTooltip, { ChartTooltipData } from "@/components/ChartTooltip";

// ─── Interactive Doughnut Chart Component ──────────────────────────────────────
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
  onTooltip?: (data: ChartTooltipData | null, pos?: { x: number; y: number } | null) => void;
}

function InteractiveDoughnut({ slices, totalLabel, totalValue, onTooltip }: DoughnutChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<Slice | null>(null);
  const [activeLegendIndex, setActiveLegendIndex] = useState<number | null>(null);

  const circumference = 301.59;
  let cumulativePercentage = 0;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-48 h-48 select-none">
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
                strokeWidth={isHovered ? "22" : "18"}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transform: `rotate(${startAngle - 90}deg)`,
                  transformOrigin: "60px 60px",
                }}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={(e) => {
                  setHoveredSlice(slice);
                  onTooltip?.({
                    title: `Category: ${slice.label}`,
                    subtitle: "Centralized Admission Process Distribution",
                    items: [
                      { label: "Category / Classification", value: slice.label },
                      { label: "Student Volume", value: slice.raw, highlight: true },
                      { label: "Percentage Share", value: `${slice.value}%` },
                    ],
                  }, { x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => {
                  setHoveredSlice(null);
                  onTooltip?.(null);
                }}
              />
            );
          })}
          <circle cx="60" cy="60" r="38" className="fill-white" />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
          {hoveredSlice ? (
            <>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate max-w-[85px]">
                {hoveredSlice.label}
              </span>
              <span className="text-base font-extrabold text-brand-900 mt-0.5 truncate max-w-[85px]">
                {hoveredSlice.raw}
              </span>
              <span className="text-xs font-bold text-brand-600 mt-0.5">
                {hoveredSlice.value}%
              </span>
            </>
          ) : activeLegendIndex !== null ? (
            <>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate max-w-[85px]">
                {slices[activeLegendIndex].label}
              </span>
              <span className="text-base font-extrabold text-brand-900 mt-0.5 truncate max-w-[85px]">
                {slices[activeLegendIndex].raw}
              </span>
              <span className="text-xs font-bold text-brand-600 mt-0.5">
                {slices[activeLegendIndex].value}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {totalLabel}
              </span>
              <span className="text-base font-extrabold text-brand-950 mt-0.5">
                {totalValue}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-2 text-xs">
        {slices.map((slice, index) => {
          const isSelected = activeLegendIndex === index || hoveredSlice?.label === slice.label;
          return (
            <button
              key={slice.label}
              onClick={() => setActiveLegendIndex(activeLegendIndex === index ? null : index)}
              onMouseEnter={() => setHoveredSlice(slice)}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`flex items-center gap-2 p-1.5 rounded-lg text-left transition-all duration-200 cursor-pointer ${isSelected ? "bg-brand-50 font-bold text-brand-900" : "hover:bg-slate-50 text-slate-600"
                }`}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="truncate">{slice.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── End Doughnut ──────────────────────────────────────────────────────────────

interface CourseAdmittedItem {
  name: string;
  level: "UG" | "PG" | "Diploma" | "Other";
  applied: number;
  admitted: number;
}

interface GenderCAPItem {
  gender: "Male" | "Female" | "Transgender";
  applied: number;
  admitted: number;
}

interface YoYCourseItem {
  course: string;
  growth: string;
  y2022: number;
  y2023: number;
  y2024: number;
  y2025: number;
}

interface TopInstituteItem {
  rank: number;
  name: string;
  fullName: string;
  location: string;
  university: string;
  admitted: number;
  fillRate: string;
}

interface UniversityAdmittedItem {
  code: string;
  name: string;
  admitted: number;
}

interface CAPDashboardProps {
  globalFilters?: GlobalFilterState;
  onUniversityChange?: (uni: string) => void;
}

export default function CAPDashboard({
  globalFilters,
  onUniversityChange,
}: CAPDashboardProps) {
  const [selectedCourseLevel, setSelectedCourseLevel] = useState<"All" | "UG" | "PG" | "Diploma">("All");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");
  const [genderViewMode, setGenderViewMode] = useState<"Admitted" | "Applied">("Admitted");

  // Floating Info Box Tooltip State
  const [tooltip, setTooltip] = useState<{ data: ChartTooltipData; pos: { x: number; y: number } } | null>(null);

  // Multiplier from Global Filter
  const multiplier = useMemo(() => {
    if (!globalFilters?.university || globalFilters.university === "All") return 1;
    switch (globalFilters.university) {
      case "CU":
        return 0.280;
      case "MAKAUT":
        return 0.220;
      case "BU":
        return 0.140;
      case "KU":
        return 0.080;
      case "VU":
        return 0.075;
      case "WBSU":
        return 0.065;
      case "NBU":
        return 0.050;
      case "JU":
        return 0.035;
      case "UGB":
        return 0.025;
      case "KNU":
        return 0.020;
      case "SKBU":
        return 0.015;
      case "BKU":
        return 0.012;
      case "CBPBU":
        return 0.010;
      case "Presidency":
        return 0.008;
      case "Visva-Bharati":
        return 0.010;
      case "Aliah":
        return 0.006;
      case "RBU":
        return 0.008;
      default:
        return 0.035;
    }
  }, [globalFilters?.university]);

  // Discipline Multiplier
  const disciplineMultiplier = useMemo(() => {
    switch (selectedDiscipline) {
      case "Engineering & Technology":
        return 0.46;
      case "Management":
        return 0.12;
      case "Pharmacy":
        return 0.10;
      case "Architecture":
        return 0.03;
      case "Hotel Management":
        return 0.02;
      case "Teacher Education":
        return 0.09;
      case "Law":
        return 0.08;
      case "Computer Applications":
        return 0.05;
      default:
        return 1.0;
    }
  }, [selectedDiscipline]);

  // Top Summary Cards Base Numbers
  const summary = useMemo(() => {
    return {
      totalApplications: Math.round(678628 * multiplier),
      admissionsTaken: Math.round(447131 * multiplier),
      totalCourses: 31,
    };
  }, [multiplier]);

  // 2. Applied Course-wise Applied v/s Admitted Students
  const courseAdmittedData: CourseAdmittedItem[] = useMemo(() => {
    const list: CourseAdmittedItem[] = [
      { name: "B.E./B.Tech.", level: "UG", applied: 248600, admitted: 167068 },
      { name: "JELET (Direct 2nd Yr Engg)", level: "UG", applied: 58900, admitted: 42731 },
      { name: "MBA / MMS", level: "PG", applied: 65400, admitted: 42668 },
      { name: "B.Ed. (General / Special)", level: "UG", applied: 48900, admitted: 33877 },
      { name: "B.Pharm (Pharmacy)", level: "UG", applied: 49500, admitted: 32989 },
      { name: "L.L.B. (3 Yrs.)", level: "UG", applied: 34200, admitted: 22917 },
      { name: "MCA (JECA)", level: "PG", applied: 26800, admitted: 18635 },
      { name: "D.Pharm (Pharmacy)", level: "Diploma", applied: 21500, admitted: 14757 },
      { name: "L.L.B. (5 Yrs. Integrated)", level: "UG", applied: 17800, admitted: 12151 },
      { name: "B.P.Ed. (Physical Education)", level: "UG", applied: 11200, admitted: 8008 },
      { name: "M.E./M.Tech.", level: "PG", applied: 12400, admitted: 7467 },
      { name: "B.HMCT (Hotel Management)", level: "UG", applied: 7800, admitted: 5362 },
      { name: "B.Des (Design)", level: "UG", applied: 6400, admitted: 4349 },
      { name: "M.Ed. (Master in Education)", level: "PG", applied: 5900, admitted: 4125 },
      { name: "M.Pharm (Pharmacy)", level: "PG", applied: 5600, admitted: 3950 },
      { name: "M.P.Ed. (Physical Ed)", level: "PG", applied: 3100, admitted: 2125 },
      { name: "M.Arch (Architecture)", level: "PG", applied: 2700, admitted: 1850 },
    ];

    return list.map((item) => ({
      ...item,
      applied: Math.round(item.applied * multiplier),
      admitted: Math.round(item.admitted * multiplier),
    }));
  }, [multiplier]);

  // Filtered Course list based on level
  const filteredCoursesList = useMemo(() => {
    if (selectedCourseLevel === "All") return courseAdmittedData;
    return courseAdmittedData.filter((c) => c.level === selectedCourseLevel);
  }, [courseAdmittedData, selectedCourseLevel]);

  // 3. Gender-wise Change in Total Students Applied v/s Admitted
  const genderData: GenderCAPItem[] = useMemo(() => {
    return [
      {
        gender: "Male",
        applied: Math.round(369181 * multiplier),
        admitted: Math.round(239596 * multiplier),
      },
      {
        gender: "Female",
        applied: Math.round(309437 * multiplier),
        admitted: Math.round(207529 * multiplier),
      },
      {
        gender: "Transgender",
        applied: Math.max(1, Math.round(7 * multiplier)),
        admitted: Math.max(1, Math.round(5 * multiplier)),
      },
    ];
  }, [multiplier]);

  // 4. Year on Year Applied Course-wise Admitted Students
  const yoyCourseData: YoYCourseItem[] = useMemo(() => {
    const list: YoYCourseItem[] = [
      { course: "B.E./B.Tech.", growth: "+41.6%", y2022: 118005, y2023: 149078, y2024: 162400, y2025: 167068 },
      { course: "JELET (Direct 2nd Year)", growth: "+1572%", y2022: 2555, y2023: 45466, y2024: 41862, y2025: 42731 },
      { course: "MBA / MMS", growth: "+16.2%", y2022: 36716, y2023: 37131, y2024: 42207, y2025: 42668 },
      { course: "B.Ed.", growth: "+0.8%", y2022: 33600, y2023: 30038, y2024: 33072, y2025: 33877 },
      { course: "B.Pharm", growth: "+16.1%", y2022: 28400, y2023: 30120, y2024: 31800, y2025: 32989 },
      { course: "L.L.B. (3 Yrs.)", growth: "+21.2%", y2022: 18900, y2023: 20450, y2024: 21820, y2025: 22917 },
      { course: "MCA (JECA)", growth: "+31.2%", y2022: 14200, y2023: 16100, y2024: 17850, y2025: 18635 },
    ];

    return list.map((item) => ({
      ...item,
      y2022: Math.round(item.y2022 * multiplier),
      y2023: Math.round(item.y2023 * multiplier),
      y2024: Math.round(item.y2024 * multiplier),
      y2025: Math.round(item.y2025 * multiplier),
    }));
  }, [multiplier]);

  // 5. Top 10 Institutes by Admitted Students 2025-26 (Elite Institute Leaderboard)
  const topInstitutesList: TopInstituteItem[] = useMemo(() => {
    const list = [
      { rank: 1, name: "Heritage Tech", fullName: "Heritage Institute of Technology, Anandapur, Kolkata", location: "Kolkata", university: "MAKAUT", admitted: 4086, fillRate: "99.4%" },
      { rank: 2, name: "St. Xavier's College", fullName: "St. Xavier's College (Autonomous), Park Street, Kolkata", location: "Kolkata", university: "CU", admitted: 2432, fillRate: "98.8%" },
      { rank: 3, name: "KGEC Kalyani", fullName: "Kalyani Government Engineering College, Nadia", location: "Nadia", university: "MAKAUT", admitted: 2427, fillRate: "99.1%" },
      { rank: 4, name: "JGEC Jalpaiguri", fullName: "Jalpaiguri Government Engineering College, Jalpaiguri", location: "Jalpaiguri", university: "MAKAUT", admitted: 2357, fillRate: "97.5%" },
      { rank: 5, name: "Haldia Institute", fullName: "Haldia Institute of Technology, Purba Medinipur", location: "Purba Medinipur", university: "MAKAUT", admitted: 2211, fillRate: "98.2%" },
      { rank: 6, name: "Presidency College", fullName: "Presidency College & Autonomous Departments, Kolkata", location: "Kolkata", university: "Presidency", admitted: 1933, fillRate: "98.6%" },
      { rank: 7, name: "Scottish Church", fullName: "Scottish Church College, Hedua, Kolkata", location: "Kolkata", university: "CU", admitted: 1842, fillRate: "96.8%" },
      { rank: 8, name: "RKM Vidyamandira", fullName: "Ramakrishna Mission Vidyamandira, Belur Math, Howrah", location: "Howrah", university: "CU", admitted: 1807, fillRate: "100%" },
      { rank: 9, name: "Midnapore College", fullName: "Midnapore College (Autonomous), Paschim Medinipur", location: "Paschim Medinipur", university: "VU", admitted: 1724, fillRate: "95.4%" },
      { rank: 10, name: "Burdwan Raj College", fullName: "Burdwan Raj College, Aftab Avenue, Bardhaman", location: "Purba Bardhaman", university: "BU", admitted: 1721, fillRate: "94.9%" },
    ];

    return list.map((inst) => ({
      ...inst,
      admitted: Math.round(inst.admitted * multiplier),
    }));
  }, [multiplier]);

  // 6. University-wise Admitted Students
  const universityAdmittedList: UniversityAdmittedItem[] = useMemo(() => {
    const list: UniversityAdmittedItem[] = [
      { code: "CU", name: "University of Calcutta", admitted: 128450 },
      { code: "MAKAUT", name: "Maulana Abul Kalam Azad University of Tech", admitted: 88900 },
      { code: "BU", name: "University of Burdwan", admitted: 54200 },
      { code: "KU", name: "University of Kalyani", admitted: 36800 },
      { code: "VU", name: "Vidyasagar University Midnapore", admitted: 34100 },
      { code: "WBSU", name: "West Bengal State University Barasat", admitted: 28500 },
      { code: "NBU", name: "North Bengal University Siliguri", admitted: 22400 },
      { code: "JU", name: "Jadavpur University Kolkata", admitted: 18900 },
      { code: "UGB", name: "University of Gour Banga Malda", admitted: 14600 },
      { code: "KNU", name: "Kazi Nazrul University Asansol", admitted: 12300 },
      { code: "SKBU", name: "Sidho-Kanho-Birsha University Purulia", admitted: 9800 },
      { code: "BKU", name: "Bankura University", admitted: 8900 },
      { code: "CBPBU", name: "Cooch Behar Panchanan Barma University", admitted: 7600 },
      { code: "Presidency", name: "Presidency University Kolkata", admitted: 4800 },
      { code: "Visva-Bharati", name: "Visva-Bharati Central University Santiniketan", admitted: 5400 },
      { code: "Aliah", name: "Aliah University Kolkata", admitted: 3900 },
      { code: "RBU", name: "Rabindra Bharati University Kolkata", admitted: 4200 },
    ];

    return list.map((uni) => ({
      ...uni,
      admitted: Math.round(uni.admitted * disciplineMultiplier),
    }));
  }, [disciplineMultiplier]);

  const handleReset = () => {
    setSelectedCourseLevel("All");
    setSelectedDiscipline("All");
    if (onUniversityChange) {
      onUniversityChange("All");
    }
  };

  const fillRatePct = ((summary.admissionsTaken / summary.totalApplications) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn pb-12 relative">

      {/* Floating Info Box Tooltip */}
      <ChartTooltip data={tooltip?.data || null} pos={tooltip?.pos || null} />

      {/* ========================================================================= */}
      {/* 1. TOP SUMMARY KPI BANNER WITH PROGRESS GAUGES */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600" />
            <span className="text-xs font-bold text-slate-600">
              Centralized Admission Process (Banglar Uchchashiksha / WBJEEB) • F.Y. 2025-26
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 italic">
            *Data updated as on 14-Aug-2026
          </p>
        </div>

        {/* 3 Executive Command KPI Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Total CAP Applications */}
          <div
            onMouseMove={(e) =>
              setTooltip({
                data: {
                  title: "Total Centralized Admission Process (CAP) Registrations",
                  subtitle: "Higher Education Department GoWB • Academic Year 2025-26",
                  items: [
                    { label: "Total Applications", value: summary.totalApplications.toLocaleString("en-IN"), highlight: true },
                    { label: "Merit Verified", value: "5,97,193 (88.0%)" },
                    { label: "Eligible Disciplines", value: "31 Professional Courses" },
                  ],
                },
                pos: { x: e.clientX, y: e.clientY },
              })
            }
            onMouseLeave={() => setTooltip(null)}
            className="bg-gradient-to-br from-blue-50/90 via-white to-blue-50/40 rounded-3xl border border-blue-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all duration-300 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-100/40 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/20">
                    <Users size={24} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">Total CAP Applications</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">CET Registrations</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200">
                  100% Volume
                </span>
              </div>

              <h3 className="text-3xl lg:text-4xl font-black text-blue-950 tracking-tight mt-1">
                {summary.totalApplications.toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-100/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Merit Verified Velocity:</span>
              <span className="font-extrabold text-blue-900">88.0% (5.97 Lakh)</span>
            </div>
          </div>

          {/* Card 2: Admissions Taken */}
          <div
            onMouseMove={(e) =>
              setTooltip({
                data: {
                  title: "Confirmed Admissions via Central Allotment",
                  subtitle: "CAP Round 1, 2, 3 + Spot Round Direct Seat Allotments",
                  items: [
                    { label: "Confirmed Admissions", value: summary.admissionsTaken.toLocaleString("en-IN"), highlight: true },
                    { label: "State Conversion Rate", value: `${fillRatePct}%` },
                    { label: "Direct CET Allotted", value: "96.3% Merit Based" },
                  ],
                },
                pos: { x: e.clientX, y: e.clientY },
              })
            }
            onMouseLeave={() => setTooltip(null)}
            className="bg-gradient-to-br from-teal-50/90 via-white to-teal-50/40 rounded-3xl border border-teal-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-teal-300 transition-all duration-300 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-teal-100/40 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-600/20">
                    <GraduationCap size={24} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-teal-950 uppercase tracking-wider">Admissions Confirmed</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Seats Allotted & Taken</p>
                  </div>
                </div>
                <span className="text-xs font-black bg-teal-100 text-teal-900 px-2.5 py-1 rounded-lg border border-teal-200">
                  {fillRatePct}%
                </span>
              </div>

              <h3 className="text-3xl lg:text-4xl font-black text-teal-950 tracking-tight mt-1">
                {summary.admissionsTaken.toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-teal-100/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Seat Fill Rate:</span>
                <span className="font-extrabold text-teal-800">{fillRatePct}% conversion</span>
              </div>
              <div className="w-full h-2 bg-teal-100 rounded-full overflow-hidden">
                <div style={{ width: `${fillRatePct}%` }} className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Card 3: Total Courses Applied */}
          <div
            onMouseMove={(e) =>
              setTooltip({
                data: {
                  title: "Approved Professional Academic Streams",
                  subtitle: "Technical, Medical, Management, Legal, and Teacher Education",
                  items: [
                    { label: "Total Courses", value: `${summary.totalCourses} Professional Streams`, highlight: true },
                    { label: "CAP Rounds", value: "3 Regular + 1 Institutional Spot Round" },
                    { label: "Participating Institutes", value: "3,240+ Colleges Statewide" },
                  ],
                },
                pos: { x: e.clientX, y: e.clientY },
              })
            }
            onMouseLeave={() => setTooltip(null)}
            className="bg-gradient-to-br from-indigo-50/90 via-white to-indigo-50/40 rounded-3xl border border-indigo-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all duration-300 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-100/40 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-700 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-600/20">
                    <BookOpen size={24} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">Applied Disciplines</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Academic Streams</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-indigo-100 text-indigo-900 px-2.5 py-1 rounded-lg border border-indigo-200">
                  Active
                </span>
              </div>

              <h3 className="text-3xl lg:text-4xl font-black text-indigo-950 tracking-tight mt-1">
                {summary.totalCourses} <span className="text-lg font-bold text-slate-500">Courses</span>
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-100/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">CAP Rounds Concluded:</span>
              <span className="font-extrabold text-indigo-900">3 Regular + 1 Spot Round</span>
            </div>
          </div>

        </div>

        {/* Executive Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-3.5 px-6 text-white flex flex-wrap items-center justify-between gap-4 shadow-sm border border-slate-800">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-300">
              <Building2 size={15} /> 3,240+ Participating Institutes
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-teal-300">
              <Award size={15} /> 100% Merit-Based CAP Allocation
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Layers size={15} /> 31 Technical Disciplines
            </span>
          </div>
          <span className="text-xs font-black text-blue-300 bg-blue-950/80 border border-blue-500/40 px-3 py-1 rounded-xl">
            ✓ Official CET Cell Direct Allotment Pipeline
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ROW 2: COURSE-WISE APPLIED V/S ADMITTED MATRIX & GENDER DONUT */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Interactive Course Applied vs Admitted Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
                  Applied Course-wise Applied v/s Admitted Students
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">2025-26 — CET Applications vs Confirmed Admissions</p>
              </div>

              {/* Level Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                {(["All", "UG", "PG", "Diploma"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedCourseLevel(lvl)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${selectedCourseLevel === lvl
                        ? "bg-white text-blue-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend Indicator */}
            <div className="flex items-center justify-between text-xs font-semibold px-1 mb-3 text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span> Applied Candidates
                </span>
                <span className="flex items-center gap-1.5 text-blue-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-blue-700 to-indigo-500"></span> Admitted Candidates
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Conversion %</span>
            </div>

            {/* Course Matrix List with Dual Bars and Floating Tooltips */}
            <div className="max-h-[490px] overflow-y-auto custom-scrollbar pr-2 space-y-3 mt-1">
              {filteredCoursesList.map((c) => {
                const maxApplied = 260000 * multiplier;
                const appliedWidthPct = Math.max(8, (c.applied / maxApplied) * 100);
                const admittedWidthPct = Math.max(6, (c.admitted / maxApplied) * 100);
                const conversionPct = ((c.admitted / c.applied) * 100).toFixed(1);
                const shareOfTotal = ((c.admitted / summary.admissionsTaken) * 100).toFixed(1);

                return (
                  <div
                    key={c.name}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: `Course: ${c.name}`,
                          subtitle: `Academic Level: ${c.level === "UG" ? "Undergraduate Degree" : c.level === "PG" ? "Postgraduate Degree" : "Diploma Program"}`,
                          items: [
                            { label: "Course Name", value: c.name },
                            { label: "Applied Candidates", value: c.applied.toLocaleString("en-IN") },
                            { label: "Admitted Candidates", value: c.admitted.toLocaleString("en-IN"), highlight: true },
                            { label: "Admission Conversion Rate", value: `${conversionPct}%` },
                            { label: "Share of Total Admissions", value: `${shareOfTotal}%` },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className="bg-slate-50/80 hover:bg-blue-50/60 p-3 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors space-y-2 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors truncate max-w-[200px]" title={c.name}>
                        {c.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">
                          Applied: <b className="text-slate-700">{c.applied.toLocaleString("en-IN")}</b>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[11px] font-bold text-blue-900">
                          Admitted: <b className="text-blue-700 font-extrabold">{c.admitted.toLocaleString("en-IN")}</b>
                        </span>
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md border border-blue-200/60">
                          {conversionPct}%
                        </span>
                      </div>
                    </div>

                    {/* Dual Comparative Progress Bars */}
                    <div className="space-y-1">
                      {/* Applied Bar (Upper / Background) */}
                      <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden flex shadow-inner">
                        <div
                          style={{ width: `${appliedWidthPct}%` }}
                          className="bg-slate-400 rounded-full transition-all duration-500"
                        />
                      </div>
                      {/* Admitted Bar (Lower / Vibrant Blue) */}
                      <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden flex shadow-inner">
                        <div
                          style={{ width: `${admittedWidthPct}%` }}
                          className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-500 rounded-full transition-all duration-500 shadow-xs group-hover:brightness-110"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Summary / Analytics Footer */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span className="flex items-center gap-1.5 text-blue-900 font-bold text-[11px]">
                <Sparkles size={13} className="text-amber-500" />
                Showing {filteredCoursesList.length} Technical Disciplines
              </span>
              <span className="text-[11px] text-slate-400">
                Intake Allotment: <b className="text-slate-800">{summary.admissionsTaken.toLocaleString("en-IN")}</b> / {summary.totalApplications.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Gender-wise Applied v/s Admitted (INTERACTIVE DONUT & COMPARISON) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
                  Gender-wise Applied v/s Admitted
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">2025-26 — CET Applications vs Confirmed Admissions</p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto">
                <button
                  onClick={() => setGenderViewMode("Admitted")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${genderViewMode === "Admitted"
                      ? "bg-white text-blue-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Admitted ({summary.admissionsTaken.toLocaleString("en-IN")})
                </button>
                <button
                  onClick={() => setGenderViewMode("Applied")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${genderViewMode === "Applied"
                      ? "bg-white text-blue-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Applied ({summary.totalApplications.toLocaleString("en-IN")})
                </button>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="py-1">
              <InteractiveDoughnut
                onTooltip={(data, pos) => setTooltip(data && pos ? { data, pos } : null)}
                slices={(() => {
                  const isAdmitted = genderViewMode === "Admitted";
                  const total = isAdmitted ? summary.admissionsTaken : summary.totalApplications;
                  return genderData.map((g) => {
                    const count = isAdmitted ? g.admitted : g.applied;
                    const pct = Number(((count / total) * 100).toFixed(1));
                    return {
                      label: `${g.gender} (${isAdmitted ? "Admitted" : "Applied"})`,
                      value: pct,
                      raw: count.toLocaleString("en-IN"),
                      color: g.gender === "Male" ? "#2563eb" : g.gender === "Female" ? "#0d9488" : "#64748b",
                    };
                  });
                })()}
                totalLabel={genderViewMode === "Admitted" ? "Total Admitted" : "Total Applied"}
                totalValue={(genderViewMode === "Admitted" ? summary.admissionsTaken : summary.totalApplications).toLocaleString("en-IN")}
              />
            </div>

            {/* Gender Comparative Breakdown Table / Cards */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
              {genderData.map((g) => {
                const maxApplied = 400000 * multiplier;
                const appliedBarPct = Math.max(6, (g.applied / maxApplied) * 100);
                const admittedBarPct = Math.max(6, (g.admitted / maxApplied) * 100);
                const conversionRate = ((g.admitted / g.applied) * 100).toFixed(1);

                return (
                  <div
                    key={g.gender}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: `Gender Category: ${g.gender}`,
                          subtitle: `Centralized Admission Process Breakdown F.Y. 2025-26`,
                          items: [
                            { label: "Gender Group", value: g.gender },
                            { label: "Total Applied Candidates", value: g.applied.toLocaleString("en-IN") },
                            { label: "Confirmed Admitted", value: g.admitted.toLocaleString("en-IN"), highlight: true },
                            { label: "Admission Conversion Rate", value: `${conversionRate}%` },
                            { label: "Non-allotted / Dropouts", value: (g.applied - g.admitted).toLocaleString("en-IN") },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className="bg-slate-50/80 hover:bg-blue-50/60 p-2.5 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-extrabold text-slate-900 group-hover:text-blue-900 flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: g.gender === "Male" ? "#2563eb" : g.gender === "Female" ? "#0d9488" : "#64748b" }}
                        />
                        {g.gender}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">
                          Applied: <b className="text-slate-700">{g.applied.toLocaleString("en-IN")}</b>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[11px] font-bold text-blue-900">
                          Admitted: <b className="text-blue-700 font-extrabold">{g.admitted.toLocaleString("en-IN")}</b>
                        </span>
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md border border-blue-200/60">
                          {conversionRate}%
                        </span>
                      </div>
                    </div>

                    {/* Dual Comparative Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden flex">
                        <div style={{ width: `${appliedBarPct}%` }} className="bg-slate-400 rounded-full" />
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                        <div
                          style={{
                            width: `${admittedBarPct}%`,
                            backgroundColor: g.gender === "Male" ? "#2563eb" : g.gender === "Female" ? "#0d9488" : "#64748b",
                          }}
                          className="rounded-full shadow-xs group-hover:brightness-110"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic text-center mt-3 pt-2 border-t border-slate-100">
            *Disclaimer : Few candidates have not disclosed their gender during online form registration.
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2b. ADMISSION FUNNEL + CATEGORY DONUT */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Admission Conversion Funnel with Hover Tooltips */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 lg:p-7">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
              CAP Admission Conversion Funnel
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">2025-26 — Application to Admission Pipeline</p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {/* Step 1: Total Applications */}
            <div
              onMouseMove={(e) =>
                setTooltip({
                  data: {
                    title: "Stage 1: CET Portal Registration",
                    subtitle: "Centralized Admission Process Pipeline F.Y. 2025-26",
                    items: [
                      { label: "Total Applications", value: summary.totalApplications.toLocaleString("en-IN"), highlight: true },
                      { label: "Pipeline Stage Share", value: "100.0%" },
                      { label: "Eligibility Criteria", value: "Passed CET / JEE / Equivalent" },
                    ],
                  },
                  pos: { x: e.clientX, y: e.clientY },
                })
              }
              onMouseLeave={() => setTooltip(null)}
              className="relative cursor-pointer"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-4 text-white shadow-sm hover:brightness-105 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users size={22} className="stroke-[2.2]" />
                    <div>
                      <p className="text-[11px] font-bold text-blue-100 uppercase tracking-wider">Total CAP Applications</p>
                      <p className="text-2xl font-black tracking-tight">{summary.totalApplications.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold bg-white/20 px-2.5 py-1 rounded-lg">100%</span>
                </div>
              </div>
              <div className="flex justify-center my-1">
                <ArrowRight size={20} className="text-slate-300 rotate-90" />
              </div>
            </div>

            {/* Step 2: Merit List Verified */}
            {(() => {
              const meritCount = Math.round(summary.totalApplications * 0.88);
              const meritPct = ((meritCount / summary.totalApplications) * 100).toFixed(1);
              return (
                <div
                  onMouseMove={(e) =>
                    setTooltip({
                      data: {
                        title: "Stage 2: Document Verification & Merit List",
                        subtitle: "Scrutiny Centers / E-Scrutiny Verification",
                        items: [
                          { label: "Verified Candidates", value: meritCount.toLocaleString("en-IN"), highlight: true },
                          { label: "Verification Rate", value: `${meritPct}%` },
                          { label: "Status", value: "Merit Rank Assigned" },
                        ],
                      },
                      pos: { x: e.clientX, y: e.clientY },
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  className="relative cursor-pointer"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-4 text-white shadow-sm mx-4 hover:brightness-105 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GraduationCap size={22} className="stroke-[2.2]" />
                        <div>
                          <p className="text-[11px] font-bold text-indigo-100 uppercase tracking-wider">Merit List Verified</p>
                          <p className="text-2xl font-black tracking-tight">{meritCount.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold bg-white/20 px-2.5 py-1 rounded-lg">{meritPct}%</span>
                    </div>
                  </div>
                  <div className="flex justify-center my-1">
                    <ArrowRight size={20} className="text-slate-300 rotate-90" />
                  </div>
                </div>
              );
            })()}

            {/* Step 3: Seat Allotted */}
            {(() => {
              const allotCount = Math.round(summary.totalApplications * 0.76);
              const allotPct = ((allotCount / summary.totalApplications) * 100).toFixed(1);
              return (
                <div
                  onMouseMove={(e) =>
                    setTooltip({
                      data: {
                        title: "Stage 3: Central Choice Allotment",
                        subtitle: "Round 1, 2, 3 Direct Seat Allotment by State CET Cell",
                        items: [
                          { label: "Seats Allotted", value: allotCount.toLocaleString("en-IN"), highlight: true },
                          { label: "Allotment Ratio", value: `${allotPct}%` },
                          { label: "Option Choice Rules", value: "Strict Merit & Preference Matrix" },
                        ],
                      },
                      pos: { x: e.clientX, y: e.clientY },
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  className="relative cursor-pointer"
                >
                  <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-4 text-white shadow-sm mx-8 hover:brightness-105 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Layers size={22} className="stroke-[2.2]" />
                        <div>
                          <p className="text-[11px] font-bold text-teal-100 uppercase tracking-wider">Seat Allotted via CAP</p>
                          <p className="text-2xl font-black tracking-tight">{allotCount.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold bg-white/20 px-2.5 py-1 rounded-lg">{allotPct}%</span>
                    </div>
                  </div>
                  <div className="flex justify-center my-1">
                    <ArrowRight size={20} className="text-slate-300 rotate-90" />
                  </div>
                </div>
              );
            })()}

            {/* Step 4: Admissions Confirmed */}
            <div
              onMouseMove={(e) =>
                setTooltip({
                  data: {
                    title: "Stage 4: Institutional Reporting & Final Confirmation",
                    subtitle: "Direct Fee Payment & Document Submission at College",
                    items: [
                      { label: "Confirmed Admissions", value: summary.admissionsTaken.toLocaleString("en-IN"), highlight: true },
                      { label: "Final Fill Rate", value: `${fillRatePct}%` },
                      { label: "Status", value: "Enrolled & Student ID Generated" },
                    ],
                  },
                  pos: { x: e.clientX, y: e.clientY },
                })
              }
              onMouseLeave={() => setTooltip(null)}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-4 text-white shadow-sm mx-12 hover:brightness-105 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen size={22} className="stroke-[2.2]" />
                  <div>
                    <p className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">Admissions Confirmed</p>
                    <p className="text-2xl font-black tracking-tight">{summary.admissionsTaken.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold bg-white/20 px-2.5 py-1 rounded-lg">
                  {fillRatePct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Category-wise Distribution of Admitted Students (DONUT) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 lg:p-7">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
              Category-wise Distribution of Admitted Students
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">2025-26 — Interactive Donut Chart</p>
          </div>

          <InteractiveDoughnut
            slices={[
              { label: "Open / General", value: 38.2, raw: Math.round(170800 * multiplier).toLocaleString("en-IN"), color: "#2563eb" },
              { label: "SC", value: 22.0, raw: Math.round(98300 * multiplier).toLocaleString("en-IN"), color: "#4338ca" },
              { label: "OBC-A", value: 10.0, raw: Math.round(44700 * multiplier).toLocaleString("en-IN"), color: "#0d9488" },
              { label: "OBC-B", value: 7.0, raw: Math.round(31300 * multiplier).toLocaleString("en-IN"), color: "#0f766e" },
              { label: "ST", value: 6.0, raw: Math.round(26800 * multiplier).toLocaleString("en-IN"), color: "#b45309" },
              { label: "EWS", value: 10.0, raw: Math.round(44700 * multiplier).toLocaleString("en-IN"), color: "#64748b" },
              { label: "PwD / Sports", value: 6.8, raw: Math.round(30531 * multiplier).toLocaleString("en-IN"), color: "#475569" },
            ]}
            totalLabel="Total Admitted"
            totalValue={summary.admissionsTaken.toLocaleString("en-IN")}
          />
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. ROW 3: YOY COURSE TRAJECTORY & TOP 10 INSTITUTES BY ADMITTED STUDENTS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Year on Year Course Trajectory Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
                    Year on Year Applied Course-wise Admitted Students
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">4-Year Admission Progression & Trajectory</p>
                </div>
                <TrendingUp size={18} className="text-blue-600" />
              </div>
            </div>

            {/* Trajectory Course Cards with Hover Tooltip */}
            <div className="max-h-[340px] overflow-y-auto custom-scrollbar pr-2 space-y-3 mt-2">
              {yoyCourseData.map((item) => (
                <div
                  key={item.course}
                  onMouseMove={(e) =>
                    setTooltip({
                      data: {
                        title: `${item.course} — 4-Year Multi-Year Admission History`,
                        subtitle: "West Bengal Centralized Portal Historic Allotment Trend",
                        items: [
                          { label: "Course Name", value: item.course },
                          { label: "2025-26 Admissions", value: item.y2025.toLocaleString("en-IN"), highlight: true },
                          { label: "2024-25 Admissions", value: item.y2024.toLocaleString("en-IN") },
                          { label: "2023-24 Admissions", value: item.y2023.toLocaleString("en-IN") },
                          { label: "2022-23 Admissions", value: item.y2022.toLocaleString("en-IN") },
                          { label: "4-Year Cumulative Growth", value: item.growth },
                        ],
                      },
                      pos: { x: e.clientX, y: e.clientY },
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  className="bg-slate-50/80 hover:bg-blue-50/50 p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors space-y-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">{item.course}</span>
                    <span className="font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px]">
                      {item.growth} 4-Yr Growth
                    </span>
                  </div>

                  {/* 4-Year Mini Stepped Visual */}
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-center font-bold">
                    <div className="bg-white p-1.5 rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-slate-400 block text-[9px]">2022-23</span>
                      <span className="text-slate-700">{item.y2022.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-slate-400 block text-[9px]">2023-24</span>
                      <span className="text-slate-700">{item.y2023.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-slate-400 block text-[9px]">2024-25</span>
                      <span className="text-slate-700">{item.y2024.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="bg-blue-50/90 p-1.5 rounded-xl border border-blue-200 text-blue-900 font-extrabold shadow-2xs">
                      <span className="text-blue-500 block text-[9px]">2025-26</span>
                      <span>{item.y2025.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Top 10 Institutes by Admitted Students 2025-26 with Exact Horizontal Bars + Floating Tooltips */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
                    Top 10 Institutes by Admitted Students
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">2025-26 — Hover bars to view full institution info box</p>
                </div>
                <Trophy size={18} className="text-amber-500" />
              </div>
            </div>

            {/* Horizontal Bar Chart for Top 10 Institutes with Floating Info Box on Hover */}
            <div className="max-h-[340px] overflow-y-auto custom-scrollbar pr-2 space-y-3 mt-2">
              {topInstitutesList.map((inst) => {
                const maxVal = 4500 * multiplier;
                const barWidthPct = Math.max(8, (inst.admitted / maxVal) * 100);

                return (
                  <div
                    key={inst.rank}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: inst.fullName,
                          subtitle: `Rank #${inst.rank} in West Bengal State`,
                          items: [
                            { label: "Institute", value: inst.fullName },
                            { label: "Admitted Students", value: inst.admitted.toLocaleString("en-IN"), highlight: true },
                            { label: "University", value: inst.university },
                            { label: "Location", value: inst.location },
                            { label: "Intake Fill Rate", value: inst.fillRate },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-blue-50/60 transition-colors cursor-pointer group"
                  >
                    <div className="w-6 text-center text-xs font-black text-slate-500 group-hover:text-blue-900">
                      #{inst.rank}
                    </div>
                    <span
                      className="w-36 text-right text-xs font-bold text-slate-700 truncate flex-shrink-0 group-hover:text-blue-950 transition-colors"
                      title={inst.fullName}
                    >
                      {inst.name}
                    </span>
                    <div className="flex-1 h-5 bg-slate-100 rounded-sm overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${barWidthPct}%` }}
                        className="bg-[#5c6bc0] group-hover:bg-[#3b82f6] rounded-sm transition-all duration-300 shadow-xs"
                      />
                    </div>
                    <span className="w-16 text-left text-xs font-black text-slate-800 flex-shrink-0">
                      {inst.admitted.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-blue-600 font-bold bg-blue-50/80 p-2 rounded-xl border border-blue-200/60 text-center mt-3">
            💡 Hover over any institute bar above to reveal full official institution title, university affiliation & fill rate
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. ROW 4: UNIVERSITY-WISE ADMITTED (COMBO BAR + TREND LINE) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 lg:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-100">

          {/* Discipline Filter on Top-Left */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Discipline</label>
              <div className="relative w-48">
                <select
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="All">All Disciplines</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Management">Management</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Education">Education</option>
                  <option value="Law">Law</option>
                  <option value="Computer Applications">Computer Applications</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-2.5 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Title & Legend */}
          <div className="text-center sm:text-right">
            <h3 className="text-base md:text-lg font-extrabold text-slate-800 tracking-tight">
              University-wise Admitted Students
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-0.5">2025-26 — Combo Bar + Admission Rate Trend Line</p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-900">
              <span className="w-3 h-3 rounded-sm bg-[#5c6bc0]"></span> Admitted
            </span>
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span> Admission %
            </span>
          </div>
        </div>

        {/* Combo Bar Chart with SVG Trend Line Overlay and Hover Tooltip */}
        <div className="w-full overflow-x-auto custom-scrollbar pb-3">
          <div className="min-w-[950px] h-72 relative flex flex-col justify-end pt-8 pb-10 px-4">

            {/* Grid lines */}
            <div className="absolute inset-x-0 top-8 bottom-10 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-slate-100 w-full flex justify-end text-[10px] text-slate-300">100%</div>
              <div className="border-b border-slate-100 w-full flex justify-end text-[10px] text-slate-300">75%</div>
              <div className="border-b border-slate-100 w-full flex justify-end text-[10px] text-slate-300">50%</div>
              <div className="border-b border-slate-200 w-full flex justify-end text-[10px] text-slate-400">0</div>
            </div>

            {/* SVG Trend Line for Admission Rate % */}
            {(() => {
              const admissionRates = universityAdmittedList.map((u) => {
                const maxAdmitted = 150000 * disciplineMultiplier;
                return Math.min(100, Math.max(50, (u.admitted / maxAdmitted) * 100 + 20));
              });
              return (
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-x-4 top-8 bottom-10 w-[calc(100%-32px)] h-48 overflow-visible pointer-events-none"
                >
                  <defs>
                    <linearGradient id="capTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    fill="url(#capTrendGrad)"
                    points={`0,100 ${admissionRates.map((rate, i) => {
                      const x = ((i + 0.5) / universityAdmittedList.length) * 100;
                      const y = 100 - rate;
                      return `${x},${y}`;
                    }).join(" ")} 100,100`}
                  />
                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={admissionRates.map((rate, i) => {
                      const x = ((i + 0.5) / universityAdmittedList.length) * 100;
                      const y = 100 - rate;
                      return `${x},${y}`;
                    }).join(" ")}
                  />
                </svg>
              );
            })()}

            {/* Vertical Bars + Floating Dots with Info Tooltips */}
            <div className="relative z-10 flex items-end justify-between w-full h-full gap-2">
              {universityAdmittedList.map((u) => {
                const maxVal = 150000 * disciplineMultiplier;
                const barHeight = Math.max(6, (u.admitted / maxVal) * 100);
                const admRate = Math.min(100, Math.max(50, barHeight + 20));
                const dotTopPct = 100 - admRate;

                return (
                  <div
                    key={u.code}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: `${u.name} (${u.code})`,
                          subtitle: "State University Allotments F.Y. 2025-26",
                          items: [
                            { label: "University", value: u.name },
                            { label: "Admitted Students", value: u.admitted.toLocaleString("en-IN"), highlight: true },
                            { label: "Discipline", value: selectedDiscipline === "All" ? "All Professional Streams" : selectedDiscipline },
                            { label: "Admission Rate %", value: `${admRate.toFixed(1)}%` },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className="flex flex-col items-center flex-1 max-w-[68px] group cursor-pointer relative"
                  >
                    {/* Floating dot for admission rate */}
                    <div
                      className="absolute w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white shadow-md z-20 group-hover:scale-150 transition-all"
                      style={{ top: `${dotTopPct}%`, transform: "translateY(-50%)" }}
                    />

                    {/* Top Value Label */}
                    <span className="text-[10px] font-bold text-slate-700 mb-1.5 whitespace-nowrap">
                      {u.admitted.toLocaleString("en-IN")}
                    </span>

                    {/* Vertical Column Bar */}
                    <div className="w-full h-44 flex flex-col justify-end items-center">
                      <div
                        style={{ height: `${barHeight}%` }}
                        className="w-10 bg-gradient-to-t from-[#5c6bc0] to-[#7986cb] group-hover:from-[#3b82f6] group-hover:to-[#60a5fa] rounded-t-sm transition-all duration-300 shadow-sm"
                      />
                    </div>

                    {/* University Code */}
                    <span className="text-[11px] font-bold text-slate-800 mt-2.5 transition-transform group-hover:text-blue-600">
                      {u.code}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
