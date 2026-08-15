"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  GraduationCap,
  IndianRupee,
  BookOpen,
  Filter,
  X,
  MoveVertical,
  CheckCircle2,
  TrendingUp,
  Search,
  Building2,
} from "lucide-react";
import { GlobalFilterState } from "@/components/Filters";

interface DualBarItem {
  name: string;
  applicants: number;
  beneficiaries: number;
}

interface SchemeItem {
  name: string;
  allotted: number;
  disbursed: number;
}

interface ApplicationStatusItem {
  status: string;
  count: number;
  color?: string;
}

interface DistrictItem {
  district: string;
  applicants: number;
  beneficiaries: number;
  disbursedCr: number;
  rate: number;
}

interface ScholarshipDashboardProps {
  globalFilters?: GlobalFilterState;
  onUniversityChange?: (uni: string) => void;
}

export default function ScholarshipDashboard({
  globalFilters,
  onUniversityChange,
}: ScholarshipDashboardProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [districtSearch, setDistrictSearch] = useState("");

  // Base Aggregates (Statewide F.Y. 2024-2025)
  const baseData = {
    applicants: 2501536,
    beneficiaries: 1924228,
    disbursedCr: 5350.3,
  };

  // Adjust metrics if a specific university is filtered in top bar
  const multiplier = useMemo(() => {
    if (!globalFilters?.university || globalFilters.university === "All") return 1;
    switch (globalFilters.university) {
      case "SPPU":
        return 0.245;
      case "MU":
        return 0.215;
      case "DBATU":
        return 0.072;
      case "SUK":
        return 0.081;
      case "SGBAU":
        return 0.086;
      case "PAHSU":
        return 0.024;
      case "KBCNMU":
        return 0.056;
      case "BAMU":
        return 0.134;
      case "COEP":
        return 0.006;
      default:
        return 0.035;
    }
  }, [globalFilters?.university]);

  const summary = useMemo(() => {
    return {
      applicants: Math.round(baseData.applicants * multiplier),
      beneficiaries: Math.round(baseData.beneficiaries * multiplier),
      disbursedCr: Number((baseData.disbursedCr * multiplier).toFixed(2)),
    };
  }, [baseData.applicants, baseData.beneficiaries, baseData.disbursedCr, multiplier]);

  // Gender Breakdown
  const genderData: DualBarItem[] = useMemo(() => {
    return [
      {
        name: "Female (F)",
        applicants: Math.round(1256238 * multiplier),
        beneficiaries: Math.round(974316 * multiplier),
      },
      {
        name: "Male (M)",
        applicants: Math.round(1245292 * multiplier),
        beneficiaries: Math.round(949909 * multiplier),
      },
      {
        name: "Other (O)",
        applicants: Math.max(1, Math.round(6 * multiplier)),
        beneficiaries: Math.max(1, Math.round(3 * multiplier)),
      },
    ];
  }, [multiplier]);

  // Category Breakdown
  const categoryData: DualBarItem[] = useMemo(() => {
    return [
      { name: "(OBC) Other Backward Class", applicants: Math.round(737269 * multiplier), beneficiaries: Math.round(591563 * multiplier) },
      { name: "General / EBC", applicants: Math.round(679380 * multiplier), beneficiaries: Math.round(508615 * multiplier) },
      { name: "(SC) Scheduled Caste", applicants: Math.round(468662 * multiplier), beneficiaries: Math.round(387631 * multiplier) },
      { name: "(ST) Scheduled Tribe", applicants: Math.round(284100 * multiplier), beneficiaries: Math.round(215400 * multiplier) },
      { name: "(VJNT) Vimukta Jati & Nomadic Tribes", applicants: Math.round(214300 * multiplier), beneficiaries: Math.round(172000 * multiplier) },
      { name: "(SBC) Special Backward Category", applicants: Math.round(117825 * multiplier), beneficiaries: Math.round(49019 * multiplier) },
    ];
  }, [multiplier]);

  // Stream Breakdown
  const streamData: DualBarItem[] = useMemo(() => {
    return [
      { name: "Engineering", applicants: Math.round(792207 * multiplier), beneficiaries: Math.round(649554 * multiplier) },
      { name: "Science", applicants: Math.round(614859 * multiplier), beneficiaries: Math.round(459792 * multiplier) },
      { name: "Commerce", applicants: Math.round(412300 * multiplier), beneficiaries: Math.round(320100 * multiplier) },
      { name: "Arts", applicants: Math.round(345100 * multiplier), beneficiaries: Math.round(268400 * multiplier) },
      { name: "Pharmacy", applicants: Math.round(184500 * multiplier), beneficiaries: Math.round(142300 * multiplier) },
      { name: "Management", applicants: Math.round(98200 * multiplier), beneficiaries: Math.round(78500 * multiplier) },
      { name: "Medical / Health", applicants: Math.round(54370 * multiplier), beneficiaries: Math.round(5582 * multiplier) },
    ];
  }, [multiplier]);

  // Admission Type Breakdown
  const admissionTypeData: DualBarItem[] = useMemo(() => {
    return [
      { name: "Through CAP / Govt. Round", applicants: Math.round(1198888 * multiplier), beneficiaries: Math.round(961168 * multiplier) },
      { name: "Through Spot / Institutional", applicants: Math.round(46084 * multiplier), beneficiaries: Math.round(32050 * multiplier) },
    ];
  }, [multiplier]);

  // Department Breakdown
  const departmentData: DualBarItem[] = useMemo(() => {
    return [
      { name: "Welfare Dept. / Social Justice", applicants: Math.round(1137146 * multiplier), beneficiaries: Math.round(922108 * multiplier) },
      { name: "Directorate of Technical Education (DTE)", applicants: Math.round(487467 * multiplier), beneficiaries: Math.round(391563 * multiplier) },
      { name: "VJNT, OBC & SBC Welfare Dept.", applicants: Math.round(345210 * multiplier), beneficiaries: Math.round(289140 * multiplier) },
      { name: "Tribal Development Dept.", applicants: Math.round(212400 * multiplier), beneficiaries: Math.round(184300 * multiplier) },
      { name: "Higher Education (DHE)", applicants: Math.round(185900 * multiplier), beneficiaries: Math.round(137117 * multiplier) },
    ];
  }, [multiplier]);

  // Scheme-wise Scholarship (₹ Cr)
  const schemeData: SchemeItem[] = useMemo(() => {
    return [
      { name: "Post Matric Scholarship Scheme", allotted: Number((1537.4 * multiplier).toFixed(2)), disbursed: Number((1154.35 * multiplier).toFixed(2)) },
      { name: "Rajarshi Chhatrapati Shahu Maharaj (EBC)", allotted: Number((1509.69 * multiplier).toFixed(2)), disbursed: Number((1486.12 * multiplier).toFixed(2)) },
      { name: "Post Matric Tuition & Exam Fee (Freeship)", allotted: Number((848.48 * multiplier).toFixed(2)), disbursed: Number((806.37 * multiplier).toFixed(2)) },
      { name: "Government of India Post-Matric", allotted: Number((504.94 * multiplier).toFixed(2)), disbursed: Number((499.96 * multiplier).toFixed(2)) },
      { name: "Dr. Panjabrao Deshmukh Vasatigruh (Hostel)", allotted: Number((380.2 * multiplier).toFixed(2)), disbursed: Number((362.4 * multiplier).toFixed(2)) },
      { name: "Pandit Deendayal Upadhyay Swayam", allotted: Number((182.5 * multiplier).toFixed(2)), disbursed: Number((174.1 * multiplier).toFixed(2)) },
    ];
  }, [multiplier]);

  // Application Status
  const applicationStatusData: ApplicationStatusItem[] = useMemo(() => {
    return [
      { status: "Fund Transfer Disbursed", count: Math.round(971495 * multiplier), color: "#0d9488" },
      { status: "Under DDO Forwarding", count: Math.round(738885 * multiplier), color: "#1e3a8a" },
      { status: "Application Cancelled / Rejected", count: Math.round(222523 * multiplier), color: "#ef4444" },
      { status: "Under DDO Scrutiny", count: Math.round(183799 * multiplier), color: "#3b82f6" },
      { status: "Bill Amount Credited", count: Math.round(171357 * multiplier), color: "#10b981" },
      { status: "Desk Scrutiny Completed", count: Math.round(112450 * multiplier), color: "#6366f1" },
    ];
  }, [multiplier]);

  // Qualification Level
  const qualificationData: DualBarItem[] = useMemo(() => {
    return [
      { name: "U.G. (Undergraduate)", applicants: Math.round(1542653 * multiplier), beneficiaries: Math.round(1181428 * multiplier) },
      { name: "Diploma", applicants: Math.round(332232 * multiplier), beneficiaries: Math.round(274963 * multiplier) },
      { name: "P.G. (Postgraduate)", applicants: Math.round(214500 * multiplier), beneficiaries: Math.round(178200 * multiplier) },
      { name: "Ph.D. / Research", applicants: Math.round(12151 * multiplier), beneficiaries: Math.round(9637 * multiplier) },
    ];
  }, [multiplier]);

  // Year on Year Disbursed Amount (₹ Cr)
  const yoyDisbursedData = [
    { year: "2021-22", amount: 3842.1 },
    { year: "2022-23", amount: 4418.5 },
    { year: "2023-24", amount: 4980.2 },
    { year: "2024-25", amount: 5350.3 },
  ];

  // District Table Data
  const districtData: DistrictItem[] = useMemo(() => {
    const list: DistrictItem[] = [
      { district: "Pune", applicants: 324150, beneficiaries: 261400, disbursedCr: 742.1, rate: 80.6 },
      { district: "Mumbai Suburban", applicants: 289400, beneficiaries: 231500, disbursedCr: 654.8, rate: 80.0 },
      { district: "Thane", applicants: 198500, beneficiaries: 154800, disbursedCr: 432.4, rate: 78.0 },
      { district: "Nagpur", applicants: 184200, beneficiaries: 147360, disbursedCr: 412.0, rate: 80.0 },
      { district: "Nashik", applicants: 172300, beneficiaries: 132670, disbursedCr: 368.5, rate: 77.0 },
      { district: "Kolhapur", applicants: 154800, beneficiaries: 122290, disbursedCr: 341.2, rate: 79.0 },
      { district: "Chhatrapati Sambhajinagar", applicants: 148900, beneficiaries: 114650, disbursedCr: 319.6, rate: 77.0 },
      { district: "Solapur", applicants: 128400, beneficiaries: 98860, disbursedCr: 275.4, rate: 77.0 },
      { district: "Amravati", applicants: 119500, beneficiaries: 93210, disbursedCr: 259.8, rate: 78.0 },
      { district: "Ahmednagar", applicants: 114200, beneficiaries: 89070, disbursedCr: 248.3, rate: 78.0 },
      { district: "Nanded", applicants: 104500, beneficiaries: 80460, disbursedCr: 224.5, rate: 77.0 },
      { district: "Jalgaon", applicants: 98400, beneficiaries: 75760, disbursedCr: 211.2, rate: 77.0 },
      { district: "Sangli", applicants: 89600, beneficiaries: 69880, disbursedCr: 194.8, rate: 78.0 },
      { district: "Satara", applicants: 84200, beneficiaries: 66510, disbursedCr: 185.4, rate: 79.0 },
      { district: "Latur", applicants: 78500, beneficiaries: 60440, disbursedCr: 168.6, rate: 77.0 },
      { district: "Dhule", applicants: 64200, beneficiaries: 49430, disbursedCr: 137.9, rate: 77.0 },
      { district: "Chandrapur", applicants: 58900, beneficiaries: 45940, disbursedCr: 128.2, rate: 78.0 },
      { district: "Yavatmal", applicants: 54100, beneficiaries: 41650, disbursedCr: 116.2, rate: 77.0 },
      { district: "Raigad", applicants: 52400, beneficiaries: 40340, disbursedCr: 112.5, rate: 77.0 },
      { district: "Beed", applicants: 48900, beneficiaries: 37160, disbursedCr: 103.7, rate: 76.0 },
    ];

    return list
      .filter((d) => d.district.toLowerCase().includes(districtSearch.toLowerCase()))
      .map((d) => ({
        ...d,
        applicants: Math.round(d.applicants * multiplier),
        beneficiaries: Math.round(d.beneficiaries * multiplier),
        disbursedCr: Number((d.disbursedCr * multiplier).toFixed(2)),
      }));
  }, [districtSearch, multiplier]);

  // Reset top university filter
  const handleReset = () => {
    if (onUniversityChange) {
      onUniversityChange("All");
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn pb-12">
      
      {/* ========================================================================= */}
      {/* ACTIVE FILTER BANNER */}
      {/* ========================================================================= */}
      {globalFilters?.university && globalFilters.university !== "All" && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-3 px-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <Filter size={16} className="text-brand-600 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600">
              Filtered by University:{" "}
              <b className="text-brand-900 font-bold">{globalFilters.university}</b>
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-bold text-brand-700 bg-white hover:bg-brand-100/60 border border-brand-200 px-3 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <X size={14} /> Clear Filter
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP SUMMARY KPI CARDS */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7 relative">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-slate-400 italic">
            *Disclaimer: Data updated as on 14-Aug-2026
          </p>
          <button
            onClick={handleReset}
            className="text-xs font-bold text-slate-600 hover:text-brand-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            Reset All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Card 1: Applicants */}
          <div className="flex items-center gap-5 px-4 first:pl-0">
            <div className="w-18 h-18 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0 shadow-sm">
              <BookOpen size={36} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-3xl lg:text-4xl font-black text-blue-900 tracking-tight">
                {summary.applicants.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs font-extrabold text-blue-600 uppercase tracking-wider mt-1">
                Applicants
              </p>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Total Registered</p>
            </div>
          </div>

          {/* Card 2: Beneficiaries */}
          <div className="flex items-center gap-5 px-4 pt-4 md:pt-0">
            <div className="w-18 h-18 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0 shadow-sm">
              <GraduationCap size={36} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-3xl lg:text-4xl font-black text-rose-600 tracking-tight">
                {summary.beneficiaries.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs font-extrabold text-rose-500 uppercase tracking-wider mt-1">
                Beneficiaries
              </p>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {((summary.beneficiaries / summary.applicants) * 100).toFixed(1)}% Conversion Rate
              </p>
            </div>
          </div>

          {/* Card 3: Disbursed Amount */}
          <div className="flex items-center gap-5 px-4 pt-4 md:pt-0 last:pr-0">
            <div className="w-18 h-18 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 flex-shrink-0 shadow-sm">
              <IndianRupee size={36} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-3xl lg:text-4xl font-black text-rose-500 tracking-tight">
                ₹ {summary.disbursedCr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs font-extrabold text-rose-400 uppercase tracking-wider mt-1">
                Disbursed Amount (in Cr)
              </p>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Direct Benefit Transfer</p>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEMOGRAPHIC & QUOTA BREAKDOWNS (2x2 GRID) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Gender-wise Applicants vs Beneficiaries */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                  Gender-wise Applicants vs Beneficiaries
                </h3>
                <p className="text-xs text-slate-400 font-semibold">F.Y. 2024-2025</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span> Applicants
                </span>
                <span className="flex items-center gap-1.5 text-teal-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-400"></span> Beneficiaries
                </span>
              </div>
            </div>

            {/* Bars */}
            <div className="space-y-4 mt-4">
              {genderData.map((g) => {
                const maxVal = 1350000 * multiplier;
                const appPct = Math.max(8, (g.applicants / maxVal) * 100);
                const benPct = Math.max(8, (g.beneficiaries / maxVal) * 100);

                return (
                  <div key={g.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{g.name}</span>
                    </div>
                    {/* Applicants bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${appPct}%` }} className="bg-slate-800 rounded-md transition-all duration-300" />
                      </div>
                      <span className="w-20 text-right text-xs font-extrabold text-slate-800">
                        {g.applicants.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {/* Beneficiaries bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${benPct}%` }} className="bg-teal-400 rounded-md transition-all duration-300" />
                      </div>
                      <span className="w-20 text-right text-xs font-extrabold text-teal-700">
                        {g.beneficiaries.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 2: Category-wise Applicants vs Beneficiaries (Scrollable) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                    Category-wise Applicants vs Beneficiaries
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    <MoveVertical size={11} /> {categoryData.length} Categories
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">F.Y. 2024-2025 (Scrollable)</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span> Applicants
                </span>
                <span className="flex items-center gap-1.5 text-teal-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-400"></span> Beneficiaries
                </span>
              </div>
            </div>

            {/* Scrollable Category List */}
            <div className="max-h-72 overflow-y-auto custom-scrollbar pr-2 space-y-4 mt-2">
              {categoryData.map((cat) => {
                const maxVal = 800000 * multiplier;
                const appPct = Math.max(8, (cat.applicants / maxVal) * 100);
                const benPct = Math.max(8, (cat.beneficiaries / maxVal) * 100);

                return (
                  <div key={cat.name} className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block truncate">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4.5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${appPct}%` }} className="bg-slate-800 rounded-md transition-all" />
                      </div>
                      <span className="w-18 text-right text-xs font-bold text-slate-800">
                        {cat.applicants.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4.5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${benPct}%` }} className="bg-teal-400 rounded-md transition-all" />
                      </div>
                      <span className="w-18 text-right text-xs font-bold text-teal-700">
                        {cat.beneficiaries.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 3: Stream-wise Applicants vs Beneficiaries (Scrollable) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                    Stream-wise Applicants vs Beneficiaries
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    <MoveVertical size={11} /> {streamData.length} Streams
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">F.Y. 2024-2025 (Scrollable)</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span> Applicants
                </span>
                <span className="flex items-center gap-1.5 text-teal-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-400"></span> Beneficiaries
                </span>
              </div>
            </div>

            {/* Scrollable Stream List */}
            <div className="max-h-72 overflow-y-auto custom-scrollbar pr-2 space-y-4 mt-2">
              {streamData.map((st) => {
                const maxVal = 850000 * multiplier;
                const appPct = Math.max(8, (st.applicants / maxVal) * 100);
                const benPct = Math.max(8, (st.beneficiaries / maxVal) * 100);

                return (
                  <div key={st.name} className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block">{st.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4.5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${appPct}%` }} className="bg-slate-800 rounded-md transition-all" />
                      </div>
                      <span className="w-18 text-right text-xs font-bold text-slate-800">
                        {st.applicants.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4.5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${benPct}%` }} className="bg-teal-400 rounded-md transition-all" />
                      </div>
                      <span className="w-18 text-right text-xs font-bold text-teal-700">
                        {st.beneficiaries.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 4: Admission Type-wise Applicants vs Beneficiaries */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                  Admission type wise Applicants vs Beneficiaries
                </h3>
                <p className="text-xs text-slate-400 font-semibold">F.Y. 2024-2025</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span> Applicants
                </span>
                <span className="flex items-center gap-1.5 text-teal-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-400"></span> Beneficiaries
                </span>
              </div>
            </div>

            <div className="space-y-5 mt-4">
              {admissionTypeData.map((adm) => {
                const maxVal = 1300000 * multiplier;
                const appPct = Math.max(8, (adm.applicants / maxVal) * 100);
                const benPct = Math.max(8, (adm.beneficiaries / maxVal) * 100);

                return (
                  <div key={adm.name} className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block">{adm.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${appPct}%` }} className="bg-slate-800 rounded-md transition-all" />
                      </div>
                      <span className="w-20 text-right text-xs font-extrabold text-slate-800">
                        {adm.applicants.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${benPct}%` }} className="bg-teal-400 rounded-md transition-all" />
                      </div>
                      <span className="w-20 text-right text-xs font-extrabold text-teal-700">
                        {adm.beneficiaries.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. DEPARTMENTAL & FINANCIAL SCHEME ANALYTICS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 5: Department-wise Applicants vs Beneficiaries (Scrollable) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                    Department-wise Applicants vs Beneficiaries
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    <MoveVertical size={11} /> {departmentData.length} Depts
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">F.Y. 2024-2025 (Scrollable)</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span> Applicants
                </span>
                <span className="flex items-center gap-1.5 text-teal-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-400"></span> Beneficiaries
                </span>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto custom-scrollbar pr-2 space-y-4 mt-2">
              {departmentData.map((dep) => {
                const maxVal = 1200000 * multiplier;
                const appPct = Math.max(8, (dep.applicants / maxVal) * 100);
                const benPct = Math.max(8, (dep.beneficiaries / maxVal) * 100);

                return (
                  <div key={dep.name} className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block truncate">{dep.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4.5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${appPct}%` }} className="bg-slate-800 rounded-md transition-all" />
                      </div>
                      <span className="w-20 text-right text-xs font-bold text-slate-800">
                        {dep.applicants.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4.5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${benPct}%` }} className="bg-teal-400 rounded-md transition-all" />
                      </div>
                      <span className="w-20 text-right text-xs font-bold text-teal-700">
                        {dep.beneficiaries.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 6: Scheme-wise Scholarship - Allotted vs Disbursed (₹ Cr) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                    Scheme-wise Scholarship - Allotted vs Disbursed (₹ Cr)
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    <MoveVertical size={11} /> {schemeData.length} Schemes
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">F.Y. 2024-2025 (Scrollable)</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span> Total Allotted (₹ Cr)
                </span>
                <span className="flex items-center gap-1.5 text-teal-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-400"></span> Total Disbursed (₹ Cr)
                </span>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto custom-scrollbar pr-2 space-y-4 mt-2">
              {schemeData.map((sc) => {
                const maxVal = 1600 * multiplier;
                const allotPct = Math.max(8, (sc.allotted / maxVal) * 100);
                const disbPct = Math.max(8, (sc.disbursed / maxVal) * 100);

                return (
                  <div key={sc.name} className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block truncate">{sc.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4.5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${allotPct}%` }} className="bg-slate-800 rounded-md transition-all" />
                      </div>
                      <span className="w-22 text-right text-xs font-bold text-slate-800">
                        ₹ {sc.allotted.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4.5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${disbPct}%` }} className="bg-teal-400 rounded-md transition-all" />
                      </div>
                      <span className="w-22 text-right text-xs font-bold text-teal-700">
                        ₹ {sc.disbursed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. OPERATIONAL & QUALIFICATION LEVEL BREAKDOWN */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 7: Application Status */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                    Application Status
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    <MoveVertical size={11} /> {applicationStatusData.length} Stages
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">F.Y. 2024-2025 Pipeline Status</p>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto custom-scrollbar pr-2 space-y-3.5 mt-2">
              {applicationStatusData.map((st) => {
                const maxVal = 1050000 * multiplier;
                const pct = Math.max(10, (st.count / maxVal) * 100);

                return (
                  <div key={st.status} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{st.status}</span>
                      <span className="text-slate-900 font-extrabold">{st.count.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="w-full h-5 bg-slate-100 rounded-md overflow-hidden flex">
                      <div
                        style={{ width: `${pct}%`, backgroundColor: st.color || "#1e3a8a" }}
                        className="rounded-md transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 8: Qualification Level-wise */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                  Qualification Level-wise Applicants vs Beneficiaries
                </h3>
                <p className="text-xs text-slate-400 font-semibold">F.Y. 2024-2025</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span> Applicants
                </span>
                <span className="flex items-center gap-1.5 text-teal-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-400"></span> Beneficiaries
                </span>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              {qualificationData.map((q) => {
                const maxVal = 1600000 * multiplier;
                const appPct = Math.max(8, (q.applicants / maxVal) * 100);
                const benPct = Math.max(8, (q.beneficiaries / maxVal) * 100);

                return (
                  <div key={q.name} className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block">{q.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${appPct}%` }} className="bg-slate-800 rounded-md transition-all" />
                      </div>
                      <span className="w-20 text-right text-xs font-extrabold text-slate-800">
                        {q.applicants.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden flex">
                        <div style={{ width: `${benPct}%` }} className="bg-teal-400 rounded-md transition-all" />
                      </div>
                      <span className="w-20 text-right text-xs font-extrabold text-teal-700">
                        {q.beneficiaries.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. YEAR-ON-YEAR TREND & DISTRICT DISTRIBUTION TABLE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Col: Year on Year Scholarship Disbursed (₹ Cr) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-brand-900">
                  Year on Year Disbursed
                </h3>
                <p className="text-xs text-slate-400 font-semibold">Total Funds Disbursed (₹ Cr)</p>
              </div>
              <TrendingUp size={20} className="text-teal-600" />
            </div>

            {/* Visual SVG Area & Line Chart */}
            <div className="h-52 relative flex flex-col justify-end pt-4 pb-6">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-2 top-4 bottom-8 w-[calc(100%-16px)] h-36 overflow-visible pointer-events-none">
                <defs>
                  <linearGradient id="disbursedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#disbursedGrad)"
                  points={`0,100 ${yoyDisbursedData.map((d, i) => `${(i / (yoyDisbursedData.length - 1)) * 100},${100 - ((d.amount - 3000) / 2500) * 100}`).join(" ")} 100,100`}
                />
                <polyline
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={yoyDisbursedData.map((d, i) => `${(i / (yoyDisbursedData.length - 1)) * 100},${100 - ((d.amount - 3000) / 2500) * 100}`).join(" ")}
                />
              </svg>

              <div className="relative z-10 grid grid-cols-4 h-full items-end">
                {yoyDisbursedData.map((d, i) => {
                  const y = 100 - ((d.amount - 3000) / 2500) * 100;
                  return (
                    <div key={d.year} className="flex flex-col items-center h-full justify-end relative">
                      <div
                        style={{ top: `${y}%`, transform: "translateY(-50%)" }}
                        className="absolute w-3 h-3 rounded-full bg-teal-600 border-2 border-white shadow-sm"
                      />
                      <span
                        style={{ top: `calc(${y}% - 22px)` }}
                        className="absolute text-[10px] font-black text-teal-900 bg-white/90 px-1 rounded shadow-2xs whitespace-nowrap"
                      >
                        ₹ {d.amount.toFixed(0)}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 mt-2">{d.year}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-[11px] font-semibold text-teal-800 bg-teal-50 p-2.5 rounded-xl text-center">
            +39.2% 4-Year Growth in Scholarship Outlay
          </p>
        </div>

        {/* Right 2 Cols: District-wise Breakdown Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                  District-wise Applicants vs Beneficiaries
                </h3>
                <p className="text-xs text-slate-400 font-semibold">Maharashtra Administrative Districts</p>
              </div>

              {/* District Search */}
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Search district..."
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              </div>
            </div>

            {/* Table */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold sticky top-0">
                  <tr>
                    <th className="p-3 pl-4">District</th>
                    <th className="p-3 text-right">Applicants</th>
                    <th className="p-3 text-right">Beneficiaries</th>
                    <th className="p-3 text-right">Disbursed (₹ Cr)</th>
                    <th className="p-3 text-right pr-4">Success %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {districtData.map((d) => (
                    <tr key={d.district} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 pl-4 font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 size={13} className="text-slate-400" />
                        {d.district}
                      </td>
                      <td className="p-2.5 text-right">{d.applicants.toLocaleString("en-IN")}</td>
                      <td className="p-2.5 text-right text-teal-700 font-bold">{d.beneficiaries.toLocaleString("en-IN")}</td>
                      <td className="p-2.5 text-right font-bold">₹ {d.disbursedCr.toFixed(1)}</td>
                      <td className="p-2.5 text-right pr-4">
                        <span className="bg-teal-50 text-teal-800 font-extrabold px-2 py-0.5 rounded-md text-[11px]">
                          {d.rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic text-center mt-3">
            *Showing top districts ordered by total scholarship applications
          </p>
        </div>

      </div>

    </div>
  );
}
