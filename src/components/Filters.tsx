"use client";

import React from "react";
import {
  Calendar,
  Landmark,
  Building2,
  GraduationCap,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
  Filter,
} from "lucide-react";

export interface GlobalFilterState {
  academicYear: string;
  university: string;
  universityType: string;
  college: string;
}

interface FiltersProps {
  filters?: GlobalFilterState;
  onFilterChange: (filters: GlobalFilterState) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const currentFilters: GlobalFilterState = filters || {
    academicYear: "2025-26",
    university: "All",
    universityType: "All",
    college: "All",
  };

  const isCustomized =
    currentFilters.academicYear !== "2025-26" ||
    currentFilters.university !== "All" ||
    currentFilters.universityType !== "All" ||
    currentFilters.college !== "All";

  const activeCount = [
    currentFilters.academicYear !== "2025-26",
    currentFilters.university !== "All",
    currentFilters.universityType !== "All",
    currentFilters.college !== "All",
  ].filter(Boolean).length;

  const handleChange = (field: keyof GlobalFilterState, value: string) => {
    onFilterChange({
      ...currentFilters,
      [field]: value,
    });
  };

  const handleReset = () => {
    onFilterChange({
      academicYear: "2025-26",
      university: "All",
      universityType: "All",
      college: "All",
    });
  };

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-blue-200/80 shadow-md p-5 md:p-6 mb-6">
      
      {/* Top Title & Status Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-600/30">
            <Filter size={20} className="stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-black text-slate-900 tracking-tight">
                STATEWIDE ADMISSIONS & ACADEMIC FILTERS
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 border border-emerald-300 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Filter Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Select parameters to dynamically cross-filter data across 17 State Universities & 3,240+ Institutes
            </p>
          </div>
        </div>

        {/* Reset Button / Counter */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          {isCustomized ? (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <RotateCcw size={13} className="text-amber-700" />
              Reset Filters ({activeCount})
            </button>
          ) : (
            <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
              17 Universities • 3,240+ Colleges
            </span>
          )}
        </div>
      </div>

      {/* 4 Clear, High-Visibility Filter Input Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Academic Year */}
        <div className="bg-slate-50/90 hover:bg-blue-50/50 border-2 border-slate-200 hover:border-blue-300 rounded-2xl p-3 transition-all duration-200 shadow-2xs group">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold">
                <Calendar size={13} />
              </div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                Academic Year
              </label>
            </div>
            {currentFilters.academicYear !== "2025-26" && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </div>
          <div className="relative">
            <select
              value={currentFilters.academicYear}
              onChange={(e) => handleChange("academicYear", e.target.value)}
              className="w-full bg-white text-slate-900 font-extrabold py-2 pl-3 pr-8 rounded-xl border border-slate-300 hover:border-blue-500 cursor-pointer appearance-none transition-all text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            >
              <option value="2025-26">2025-26 (Current Academic)</option>
              <option value="2024-25">2024-25 (Previous Year)</option>
              <option value="2023-24">2023-24 (Archive Year)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500 group-hover:text-blue-600">
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        {/* 2. University Filter */}
        <div className="bg-slate-50/90 hover:bg-blue-50/50 border-2 border-slate-200 hover:border-blue-300 rounded-2xl p-3 transition-all duration-200 shadow-2xs group">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 font-bold">
                <Landmark size={13} />
              </div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                University
              </label>
            </div>
            {currentFilters.university !== "All" && (
              <span className="w-2 h-2 rounded-full bg-teal-600" />
            )}
          </div>
          <div className="relative">
            <select
              value={currentFilters.university}
              onChange={(e) => handleChange("university", e.target.value)}
              className="w-full bg-white text-slate-900 font-extrabold py-2 pl-3 pr-8 rounded-xl border border-slate-300 hover:border-teal-500 cursor-pointer appearance-none transition-all text-xs truncate focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
            >
              <option value="All">All Universities (Statewide)</option>
              <option value="SPPU">SPPU - Savitribai Phule Pune Univ</option>
              <option value="MU">MU - University of Mumbai</option>
              <option value="DBATU">DBATU - Dr. BATU Lonere</option>
              <option value="SUK">SUK - Shivaji University Kolhapur</option>
              <option value="SGBAU">SGBAU - Sant Gadge Baba Amravati Univ</option>
              <option value="PAHSU">PAHSU - Solapur University</option>
              <option value="KBCNMU">KBCNMU - North Maharashtra Univ</option>
              <option value="SRTMUN">SRTMUN - SRTM University Nanded</option>
              <option value="HSNC">HSNC - HSNC University Mumbai</option>
              <option value="BAMU">BAMU - Dr. BAMU Chh. Sambhajinagar</option>
              <option value="COEP">COEP - COEP Technological Univ</option>
              <option value="KBPU">KBPU - Karmaveer Bhaurao Patil Univ</option>
              <option value="HBSU">HBSU - Dr. Homi Bhabha State Univ</option>
              <option value="SNDT">SNDT - SNDT Women's University</option>
              <option value="GUG">GUG - Gondwana University Gadchiroli</option>
              <option value="LIT">LIT - Laxminarayan Tech University</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500 group-hover:text-teal-600">
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        {/* 3. University Type */}
        <div className="bg-slate-50/90 hover:bg-blue-50/50 border-2 border-slate-200 hover:border-blue-300 rounded-2xl p-3 transition-all duration-200 shadow-2xs group">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center flex-shrink-0 font-bold">
                <Building2 size={13} />
              </div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                University Type
              </label>
            </div>
            {currentFilters.universityType !== "All" && (
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </div>
          <div className="relative">
            <select
              value={currentFilters.universityType}
              onChange={(e) => handleChange("universityType", e.target.value)}
              className="w-full bg-white text-slate-900 font-extrabold py-2 pl-3 pr-8 rounded-xl border border-slate-300 hover:border-indigo-500 cursor-pointer appearance-none transition-all text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            >
              <option value="All">All Institution Types</option>
              <option value="State Government">State Government University</option>
              <option value="Deemed">Deemed University</option>
              <option value="Private">Private / Autonomous</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500 group-hover:text-indigo-600">
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        {/* 4. College Filter */}
        <div className="bg-slate-50/90 hover:bg-blue-50/50 border-2 border-slate-200 hover:border-blue-300 rounded-2xl p-3 transition-all duration-200 shadow-2xs group">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center flex-shrink-0 font-bold">
                <GraduationCap size={13} />
              </div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                College / Institute
              </label>
            </div>
            {currentFilters.college !== "All" && (
              <span className="w-2 h-2 rounded-full bg-sky-600" />
            )}
          </div>
          <div className="relative">
            <select
              value={currentFilters.college}
              onChange={(e) => handleChange("college", e.target.value)}
              className="w-full bg-white text-slate-900 font-extrabold py-2 pl-3 pr-8 rounded-xl border border-slate-300 hover:border-sky-500 cursor-pointer appearance-none transition-all text-xs truncate focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
            >
              <option value="All">All Colleges (3,240+ Institutes)</option>
              <option value="VIT Pune">VIT Pune - Vishwakarma Institute</option>
              <option value="COEP Pune">COEP Technological Univ Pune</option>
              <option value="VJTI Mumbai">VJTI Mumbai</option>
              <option value="TCET Mumbai">TCET Thakur College Mumbai</option>
              <option value="ICT Mumbai">ICT Mumbai</option>
              <option value="YCCE Nagpur">YCCE Hingna Road Nagpur</option>
              <option value="TGPCET Nagpur">TGPCET Gaikwad-Patil Nagpur</option>
              <option value="MIT Pune">MIT AOE Alandi Pune</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500 group-hover:text-sky-600">
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

