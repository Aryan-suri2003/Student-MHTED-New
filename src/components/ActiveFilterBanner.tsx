"use client";

import React from "react";
import { Filter, X } from "lucide-react";
import { GlobalFilterState } from "./Filters";

export const WB_UNIVERSITY_NAMES: Record<string, string> = {
  "CU": "University of Calcutta (CU)",
  "JU": "Jadavpur University (JU)",
  "MAKAUT": "MAKAUT / WBUT",
  "BU": "University of Burdwan (BU)",
  "WBSU": "West Bengal State University (WBSU)",
  "KU": "University of Kalyani (KU)",
  "VU": "Vidyasagar University (VU)",
  "NBU": "North Bengal University (NBU)",
  "UGB": "University of Gour Banga (UGB)",
  "KNU": "Kazi Nazrul University (KNU)",
  "SKBU": "Sidho-Kanho-Birsha University (SKBU)",
  "BKU": "Bankura University (BKU)",
  "CBPBU": "Cooch Behar Panchanan Barma University (CBPBU)",
  "Presidency": "Presidency University",
  "Visva-Bharati": "Visva-Bharati Central University",
  "Aliah": "Aliah University",
  "RBU": "Rabindra Bharati University (RBU)",
};

interface ActiveFilterBannerProps {
  filters: GlobalFilterState;
  onFilterChange: (filters: GlobalFilterState) => void;
}

export default function ActiveFilterBanner({ filters, onFilterChange }: ActiveFilterBannerProps) {
  const isUniActive = filters.university && filters.university !== "All";
  const isDistrictActive = filters.district && filters.district !== "All";
  const isTypeActive = filters.universityType && filters.universityType !== "All";
  const isCollegeActive = filters.college && filters.college !== "All";

  if (!isUniActive && !isDistrictActive && !isTypeActive && !isCollegeActive) {
    return null;
  }

  const handleClearAll = () => {
    onFilterChange({
      academicYear: filters.academicYear,
      university: "All",
      district: "All",
      universityType: "All",
      college: "All",
    });
  };

  return (
    <div className="bg-blue-50/90 border border-blue-200 rounded-2xl px-5 py-3 shadow-xs flex items-center justify-between flex-wrap gap-3 animate-fadeIn">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="flex items-center gap-1.5 text-blue-700 font-extrabold text-xs uppercase tracking-wider">
          <Filter size={15} className="stroke-[2.5]" />
          Active Filters:
        </span>

        {/* University Badge */}
        {isUniActive && (
          <span className="text-xs font-bold text-blue-950 bg-blue-100/90 border border-blue-300 px-3 py-1 rounded-full flex items-center gap-2 shadow-2xs">
            <span className="text-blue-600 font-semibold">University:</span>
            <span className="font-extrabold">{WB_UNIVERSITY_NAMES[filters.university] || filters.university}</span>
            <button
              onClick={() => onFilterChange({ ...filters, university: "All" })}
              className="text-blue-400 hover:text-blue-900 hover:bg-blue-200/60 rounded-full p-0.5 transition-colors cursor-pointer"
              title="Remove University Filter"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </span>
        )}

        {/* District Badge */}
        {isDistrictActive && (
          <span className="text-xs font-bold text-blue-950 bg-blue-100/90 border border-blue-300 px-3 py-1 rounded-full flex items-center gap-2 shadow-2xs">
            <span className="text-blue-600 font-semibold">District:</span>
            <span className="font-extrabold">{filters.district}</span>
            <button
              onClick={() => onFilterChange({ ...filters, district: "All" })}
              className="text-blue-400 hover:text-blue-900 hover:bg-blue-200/60 rounded-full p-0.5 transition-colors cursor-pointer"
              title="Remove District Filter"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </span>
        )}

        {/* Institution Type Badge */}
        {isTypeActive && (
          <span className="text-xs font-bold text-blue-950 bg-blue-100/90 border border-blue-300 px-3 py-1 rounded-full flex items-center gap-2 shadow-2xs">
            <span className="text-blue-600 font-semibold">Type:</span>
            <span className="font-extrabold">{filters.universityType}</span>
            <button
              onClick={() => onFilterChange({ ...filters, universityType: "All" })}
              className="text-blue-400 hover:text-blue-900 hover:bg-blue-200/60 rounded-full p-0.5 transition-colors cursor-pointer"
              title="Remove Type Filter"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </span>
        )}

        {/* College Badge */}
        {isCollegeActive && (
          <span className="text-xs font-bold text-blue-950 bg-blue-100/90 border border-blue-300 px-3 py-1 rounded-full flex items-center gap-2 shadow-2xs">
            <span className="text-blue-600 font-semibold">College:</span>
            <span className="font-extrabold">{filters.college}</span>
            <button
              onClick={() => onFilterChange({ ...filters, college: "All" })}
              className="text-blue-400 hover:text-blue-900 hover:bg-blue-200/60 rounded-full p-0.5 transition-colors cursor-pointer"
              title="Remove College Filter"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </span>
        )}
      </div>

      {/* Clear All Button */}
      <button
        onClick={handleClearAll}
        className="ml-auto text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
      >
        <X size={13} strokeWidth={2.5} /> Clear All
      </button>
    </div>
  );
}
