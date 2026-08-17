import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Search,
  Printer,
  Filter,
  X,
  Layers,
  Building2,
  Award,
  MapPin,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';
import { westBengalDistricts } from '../data/mockData';
import { Language, GradeFilter, BuildingFilter } from '../types';
import { ModernDropdown, DropdownOption } from './ModernDropdown';
import { MinimalistCalendarYearPicker } from './MinimalistCalendarYearPicker';

interface FilterBarProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedDivision: string;
  setSelectedDivision: (division: string) => void;
  selectedGrade: GradeFilter;
  setSelectedGrade: (grade: GradeFilter) => void;
  selectedBuilding: BuildingFilter;
  setSelectedBuilding: (b: BuildingFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onReset: () => void;
  disclaimerDate: string;
  language: Language;
  onExportCsv: () => void;
  matchingCount?: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedYear,
  setSelectedYear,
  selectedDistrict,
  setSelectedDistrict,
  selectedDivision,
  setSelectedDivision,
  selectedGrade,
  setSelectedGrade,
  selectedBuilding,
  setSelectedBuilding,
  searchQuery,
  setSearchQuery,
  onReset,
  disclaimerDate,
  language,
  onExportCsv,
  matchingCount,
}) => {
  const divisions = [
    { id: 'all', name: 'All Divisions', bengali: 'সকল বিভাগ', sub: 'Entire State of West Bengal', count: 23, color: 'bg-blue-100 text-blue-900' },
    { id: 'Presidency', name: 'Presidency Division', bengali: 'প্রেসিডেন্সি বিভাগ', sub: 'Kolkata, 24 Pgs (N/S), Nadia, Howrah', count: 5, color: 'bg-sky-100 text-sky-900' },
    { id: 'Burdwan', name: 'Burdwan Division', bengali: 'বর্ধমান বিভাগ', sub: 'Purba & Paschim Bardhaman, Birbhum, Hooghly', count: 4, color: 'bg-indigo-100 text-indigo-900' },
    { id: 'Medinipur', name: 'Medinipur Division', bengali: 'মেদিনীপুর বিভাগ', sub: 'Medinipur (E/W), Jhargram, Bankura, Purulia', count: 5, color: 'bg-teal-100 text-teal-900' },
    { id: 'Malda', name: 'Malda Division', bengali: 'মালদা বিভাগ', sub: 'Malda, Murshidabad, Dinajpur (N/S)', count: 4, color: 'bg-amber-100 text-amber-950' },
    { id: 'Jalpaiguri', name: 'Jalpaiguri Division', bengali: 'জলপাইগুড়ি বিভাগ', sub: 'Jalpaiguri, Darjeeling, Kalimpong, Alipurduar, Cooch Behar', count: 5, color: 'bg-emerald-100 text-emerald-900' },
  ];

  // Modern Division Options
  const divisionOptions: DropdownOption[] = divisions.map((div) => ({
    value: div.id,
    label: language === 'bn' ? div.bengali : div.name,
    sublabel: div.sub,
    badge: `${div.count} Dist`,
    badgeColor: div.color,
  }));

  // District options filtered by selected division
  const filteredDistrictOptions = useMemo(() => {
    return westBengalDistricts.filter((d) => {
      if (selectedDivision !== 'all' && d.division !== selectedDivision) return false;
      return true;
    });
  }, [selectedDivision]);

  // Modern District Options
  const districtOptions: DropdownOption[] = useMemo(() => {
    const allOpt: DropdownOption = {
      value: 'all',
      label: language === 'bn' ? 'সকল জেলা (23)' : 'All Districts (23)',
      sublabel: selectedDivision === 'all' ? 'All 23 Districts across West Bengal' : `All districts in ${selectedDivision} Division`,
      badge: `${filteredDistrictOptions.reduce((acc, d) => acc + d.totalLibraries, 0)} Libs`,
      badgeColor: 'bg-blue-100 text-blue-900 border border-blue-200',
    };

    const distOpts: DropdownOption[] = filteredDistrictOptions.map((d) => ({
      value: d.id,
      label: language === 'bn' ? d.bengaliName : d.name,
      sublabel: language === 'bn' ? `${d.name} • ${d.division}` : `${d.bengaliName} • ${d.division} Div`,
      badge: `${d.totalLibraries} Libs`,
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
    }));

    return [allOpt, ...distOpts];
  }, [filteredDistrictOptions, language, selectedDivision]);

  const hasActiveFilters =
    selectedDistrict !== 'all' ||
    selectedDivision !== 'all' ||
    selectedGrade !== null ||
    selectedBuilding !== null ||
    searchQuery.trim().length > 0 ||
    (selectedYear !== '2025-2026' && selectedYear !== '2024-2025');

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sticky top-0 z-30 transition-all">
      <div className="max-w-7xl 2xl:max-w-[1680px] w-full mx-auto px-3 sm:px-6 py-3 space-y-2.5">
        {/* Main Filters Controls Row */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 w-full">
          {/* Grouped Modern Selectors with Animated Dropdowns & Minimalist Calendar */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-2.5 shrink-0">
            {/* 1. Minimalist Modern Calendar Financial Year Picker (Supporting 2026 Current Year) */}
            <MinimalistCalendarYearPicker
              selectedYear={selectedYear}
              onSelectYear={(y) => setSelectedYear(y)}
              language={language}
              className="w-full sm:w-44 lg:w-48 xl:w-52 shrink-0"
            />

            {/* 2. Modern Administrative Division Dropdown */}
            <ModernDropdown
              id="division-dropdown"
              label={language === 'bn' ? 'প্রশাসনিক বিভাগ' : 'Division'}
              value={selectedDivision}
              onChange={(divId) => {
                setSelectedDivision(divId);
                if (divId !== 'all' && selectedDistrict !== 'all') {
                  const currDist = westBengalDistricts.find((d) => d.id === selectedDistrict);
                  if (currDist && currDist.division !== divId) {
                    setSelectedDistrict('all');
                  }
                }
              }}
              options={divisionOptions}
              icon={<Layers className="w-3.5 h-3.5" />}
              iconBgClass="bg-sky-100/90 text-sky-700"
              activeBorderColorClass="hover:border-sky-400 focus-within:border-sky-500"
              className="w-full sm:w-44 lg:w-48 xl:w-52 shrink-0"
              minWidth="w-72"
            />

            {/* 3. Modern District Dropdown with Search */}
            <ModernDropdown
              id="district-dropdown"
              label={language === 'bn' ? 'জেলা' : 'District'}
              value={selectedDistrict}
              onChange={(distId) => setSelectedDistrict(distId)}
              options={districtOptions}
              icon={<MapPin className="w-3.5 h-3.5" />}
              iconBgClass="bg-indigo-100/90 text-indigo-700"
              activeBorderColorClass="hover:border-indigo-400 focus-within:border-indigo-500"
              enableSearch={true}
              searchPlaceholder={language === 'bn' ? 'জেলা বা বিভাগ খুঁজুন...' : 'Search district or division...'}
              className="w-full sm:w-48 lg:w-52 xl:w-56 shrink-0"
              minWidth="w-72 sm:w-80"
            />

            {/* 4. Modern Smart Search Input - placed beside District on desktop/fullscreen */}
            <div className="h-11 w-full sm:w-44 lg:w-48 xl:w-52 shrink-0 relative flex items-center justify-between bg-gradient-to-b from-slate-50 to-slate-100/90 hover:to-slate-100 focus-within:bg-white px-3 py-1.5 rounded-xl border border-slate-200/90 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 shadow-xs transition-all group">
              <div className="flex items-center min-w-0 flex-1 pr-1">
                <div className="w-6 h-6 rounded-lg bg-slate-200/80 text-slate-600 group-focus-within:bg-blue-100 group-focus-within:text-blue-700 flex items-center justify-center mr-2 shrink-0 transition-colors">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">
                    {language === 'bn' ? 'অনুসন্ধান' : 'Quick Search'}
                  </span>
                  <input
                    type="text"
                    id="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'bn' ? 'জেলা খুঁজুন...' : 'Type district...'}
                    className="text-xs font-semibold text-slate-900 bg-transparent outline-hidden w-full placeholder:text-slate-400 mt-0.5"
                  />
                </div>
              </div>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] shrink-0 cursor-pointer transition-colors"
                  title="Clear search"
                >
                  ✕
                </button>
              ) : (
                <span className="hidden sm:inline-block text-[9px] font-bold text-slate-400 bg-slate-200/70 px-1 py-0.2 rounded border border-slate-300/60 shrink-0 pointer-events-none font-mono">
                  /
                </span>
              )}
            </div>

            {/* Reset Filters Button */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  id="reset-all-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onReset}
                  title="Reset all filters to default"
                  className="h-11 shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-xs cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action Tools: Shifted to right with space */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 flex-wrap xl:ml-auto">
            {/* Districts Count Indicator Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50/90 border border-blue-200/90 rounded-xl text-[11px] font-bold text-blue-950 shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              <span className="font-mono">
                {selectedDivision === 'all'
                  ? '23 of 23 districts'
                  : `${matchingCount ?? 23} of 23 districts (${selectedDivision})`}
              </span>
            </motion.div>

            <div className="flex items-center gap-1.5">
              <motion.button
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onExportCsv}
                title="Download Filtered Data as CSV"
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-b from-white to-slate-50 hover:to-slate-100 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-bold shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Export CSV</span>
              </motion.button>
              <motion.button
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.print()}
                title="Print Dashboard Report"
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-b from-white to-slate-50 hover:to-slate-100 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-bold shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Print</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Updated: <strong className="text-slate-800">{disclaimerDate}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Active Inter-connection Filter Chips Bar with Motion Entrance */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-1.5 pt-1 text-xs overflow-hidden"
            >
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-blue-600" />
                Active Filters:
              </span>

              {selectedYear !== '2025-2026' && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 font-bold text-[11px] shadow-2xs"
                >
                  <Calendar className="w-3 h-3 text-blue-600" />
                  Year: {selectedYear}
                  <button
                    onClick={() => setSelectedYear('2025-2026')}
                    className="hover:text-red-600 cursor-pointer p-0.5 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}

              {selectedDivision !== 'all' && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50 text-sky-900 border border-sky-200 font-bold text-[11px] shadow-2xs"
                >
                  <Layers className="w-3 h-3 text-sky-600" />
                  Division: {selectedDivision}
                  <button
                    onClick={() => setSelectedDivision('all')}
                    className="hover:text-red-600 cursor-pointer p-0.5 rounded-full hover:bg-sky-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}

              {selectedDistrict !== 'all' && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-[11px] shadow-2xs"
                >
                  <MapPin className="w-3 h-3 text-indigo-600" />
                  District: {westBengalDistricts.find((d) => d.id === selectedDistrict)?.name}
                  <button
                    onClick={() => setSelectedDistrict('all')}
                    className="hover:text-red-600 cursor-pointer p-0.5 rounded-full hover:bg-indigo-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}

              {selectedGrade && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-950 border border-amber-200 font-bold text-[11px] shadow-2xs"
                >
                  <Award className="w-3 h-3 text-amber-600" />
                  Grade: {selectedGrade === 'noClass' ? 'No Class' : `Grade ${selectedGrade}`}
                  <button
                    onClick={() => setSelectedGrade(null)}
                    className="hover:text-red-600 cursor-pointer p-0.5 rounded-full hover:bg-amber-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}

              {selectedBuilding && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-[11px] shadow-2xs"
                >
                  <Building2 className="w-3 h-3 text-emerald-600" />
                  Building: {selectedBuilding === 'rented' ? 'Rented' : selectedBuilding === 'owned' ? 'Owned' : 'Free'}
                  <button
                    onClick={() => setSelectedBuilding(null)}
                    className="hover:text-red-600 cursor-pointer p-0.5 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}

              {searchQuery && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 font-bold text-[11px] shadow-2xs"
                >
                  <Search className="w-3 h-3 text-purple-600" />
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-red-600 cursor-pointer p-0.5 rounded-full hover:bg-purple-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
