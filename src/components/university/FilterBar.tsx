"use client";
import React, { useMemo } from 'react';
import { Search, FileSpreadsheet, Printer, MapPin, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab, FilterState } from '@/types/university';
import { MinimalistCalendarYearPicker } from '@/components/MinimalistCalendarYearPicker';
import { ModernDropdown, DropdownOption } from '@/components/ModernDropdown';
import { westBengalDistricts } from '@/data/mockData';

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
}) => {

  const districtOptions: DropdownOption[] = useMemo(() => {
    const allOpt: DropdownOption = { value: 'All', label: 'All Districts', badgeColor: 'bg-blue-100 text-blue-900 border border-blue-200' };
    const distOpts: DropdownOption[] = westBengalDistricts.map(d => ({
      value: d.id, label: d.name, sublabel: d.division, badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
    }));
    return [allOpt, ...distOpts];
  }, []);

  const universityTypeOptions: DropdownOption[] = [
    { value: 'All', label: 'All Types & Streams' },
    { value: 'State Public', label: 'State Public Universities' },
    { value: 'State Private', label: 'State Private Universities' },
    { value: 'Central', label: 'Central Universities' },
    { value: 'Deemed to be', label: 'Deemed to be Universities' },
    { value: 'State Board', label: 'State Board' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sticky top-0 z-30 transition-all">
      <div className="w-full px-4 lg:px-8 py-3 space-y-2.5">
        
        {/* Main Filters Controls Row */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 w-full">
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Academic Year */}
            <MinimalistCalendarYearPicker
              selectedYear={filters.year === 'All' ? '2025-2026' : filters.year}
              onSelectYear={(y) => onFilterChange('year', y)}
              language="en"
              className="w-full sm:w-44 lg:w-48 xl:w-52 shrink-0"
            />

            {/* University Type */}
            <ModernDropdown
              id="type-dropdown"
              label="Institution Type"
              value={filters.universityType}
              onChange={(val) => onFilterChange('universityType', val)}
              options={universityTypeOptions}
              icon={<Building2 className="w-3.5 h-3.5" />}
              iconBgClass="bg-sky-100/90 text-sky-700"
              className="w-full sm:w-44 lg:w-48 xl:w-52 shrink-0"
              minWidth="w-64"
            />

            {/* District Dropdown */}
            <ModernDropdown
              id="district-dropdown"
              label="District"
              value={filters.district}
              onChange={(val) => onFilterChange('district', val)}
              options={districtOptions}
              icon={<MapPin className="w-3.5 h-3.5" />}
              iconBgClass="bg-indigo-100/90 text-indigo-700"
              enableSearch={true}
              searchPlaceholder="Search district..."
              className="w-full sm:w-48 lg:w-52 xl:w-56 shrink-0"
              minWidth="w-72"
            />

            {/* Quick Search */}
            <div className="h-11 w-full sm:w-44 lg:w-48 xl:w-52 shrink-0 relative flex items-center justify-between bg-gradient-to-b from-slate-50 to-slate-100/90 hover:to-slate-100 focus-within:bg-white px-3 py-1.5 rounded-xl border border-slate-200/90 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 shadow-xs transition-all group">
              <div className="flex items-center min-w-0 flex-1 pr-1">
                <div className="w-6 h-6 rounded-lg bg-slate-200/80 text-slate-600 group-focus-within:bg-blue-100 group-focus-within:text-blue-700 flex items-center justify-center mr-2 shrink-0 transition-colors">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">
                    Quick Search
                  </span>
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => onFilterChange('searchQuery', e.target.value)}
                    placeholder="Search..."
                    className="text-xs font-semibold text-slate-900 bg-transparent outline-hidden w-full placeholder:text-slate-400 mt-0.5"
                  />
                </div>
              </div>
              {filters.searchQuery && (
                <button
                  onClick={() => onFilterChange('searchQuery', '')}
                  className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] shrink-0 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 flex-wrap xl:ml-auto">
            <div className="flex items-center gap-1.5">
              <motion.button
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-b from-white to-slate-50 hover:to-slate-100 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-bold shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Export CSV</span>
              </motion.button>
              <motion.button
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-b from-white to-slate-50 hover:to-slate-100 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-bold shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Print</span>
              </motion.button>
            </div>
            
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs shrink-0 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Updated: <strong className="text-slate-800">14-Aug-2026</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Main Switcher Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 mt-1 pt-1">
          <div className="flex items-center gap-4 p-1.5 overflow-hidden">
            <button
              onClick={() => onSelectTab('affiliation')}
              className={`py-1.5 text-[12px] font-semibold transition-all cursor-pointer ${activeTab === 'affiliation' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Affiliation - College
            </button>
            <button
              onClick={() => onSelectTab('campus')}
              className={`py-1.5 text-[12px] font-semibold transition-all cursor-pointer ${activeTab === 'campus' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              University Campus
            </button>
            <button
              onClick={() => onSelectTab('research')}
              className={`py-1.5 text-[12px] font-semibold transition-all cursor-pointer ${activeTab === 'research' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Research
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
