"use client";
import React from 'react';
import { RotateCcw, ChevronDown, ListFilter } from 'lucide-react';
import { ActiveTab, FilterState } from '@/types/university';
import { DISTRICTS_LIST, UNIVERSITY_LIST, COLLEGE_TYPES, RESEARCH_THEMES, UNIVERSITY_OUTPUT_DATA } from '@/data/university/mockData';

interface FilterBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeTab,
  onSelectTab,
  filters,
  onFilterChange,
  onResetFilters
}) => {
  return (
    <div className="bg-white px-4 lg:px-8 py-4 z-30 relative">



      {/* Main Switcher Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* View Switcher Pills */}
        <div className="flex items-center gap-4 p-1.5 overflow-hidden border-b border-slate-200">
          <button
            id="tab-btn-affiliation"
            onClick={() => onSelectTab('affiliation')}
            className={`py-1.5 text-[12px] font-semibold transition-all cursor-pointer ${activeTab === 'affiliation'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Affiliation - College
          </button>
          <button
            id="tab-btn-campus"
            onClick={() => onSelectTab('campus')}
            className={`py-1.5 text-[12px] font-semibold transition-all cursor-pointer ${activeTab === 'campus'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            University Campus
          </button>
          <button
            id="tab-btn-research"
            onClick={() => onSelectTab('research')}
            className={`py-1.5 text-[12px] font-semibold transition-all cursor-pointer ${activeTab === 'research'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Research
          </button>
        </div>

        {/* Right side dropdowns for Campus view & Reset All Button */}
        <div className="flex items-center gap-2.5">
          <button
            id="filter-reset-all-btn"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 hover:bg-slate-50 text-[12px] font-medium text-slate-500 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};


