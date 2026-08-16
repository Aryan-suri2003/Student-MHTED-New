import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, IndianRupee, TrendingUp, Building2, Award, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';

interface KpiSectionProps {
  totalLibraries: number;
  totalMembers: number;
  totalFundsCr: number;
  isFiltered: boolean;
  filteredDistrictName?: string;
  language: Language;
}

export const KpiSection: React.FC<KpiSectionProps> = ({
  totalLibraries,
  totalMembers,
  totalFundsCr,
  isFiltered,
  filteredDistrictName,
  language,
}) => {
  const formatIndianNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="w-full space-y-3">
      {isFiltered && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/90 rounded-2xl text-xs text-blue-950 flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shadow-2xs" />
            <span className="font-semibold text-slate-800">
              Filtered Scope: <span className="font-black text-[#003366] underline">{filteredDistrictName}</span>
            </span>
          </div>
          <span className="text-[11px] text-blue-800 font-bold bg-white/80 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs">
            Synchronized Across All Visuals
          </span>
        </motion.div>
      )}

      {/* 3 Modernized Executive KPI Cards with Gradient Accents, Hover Lift & Click Motion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {/* KPI 1: Total Public Libraries */}
        <motion.div
          id="kpi-total-libraries"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="relative flex flex-col p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(2,132,199,0.12)] hover:border-sky-300 transition-all duration-200 overflow-hidden group cursor-pointer"
        >
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500" />

          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100 text-[#003366] border border-blue-200/80 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 font-mono shadow-2xs">
              Live Network
            </span>
          </div>

          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono group-hover:text-blue-900 transition-colors">
              {formatIndianNumber(totalLibraries)}
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-600 mt-1 block truncate">
              {language === 'bn' ? 'মোট সরকারি ও সরকার-পোষিত গ্রন্থাগার' : 'Total Public Libraries'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Active across all 23 West Bengal districts</span>
          </div>
        </motion.div>

        {/* KPI 2: Total Members */}
        <motion.div
          id="kpi-total-members"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="relative flex flex-col p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.12)] hover:border-emerald-300 transition-all duration-200 overflow-hidden group cursor-pointer"
        >
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-500" />

          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-50 to-teal-100 text-sky-800 border border-sky-200/80 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 font-mono flex items-center gap-0.5 shadow-2xs">
              <ArrowUpRight className="w-3 h-3" /> +4.2% YoY
            </span>
          </div>

          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono group-hover:text-emerald-950 transition-colors">
              {formatIndianNumber(totalMembers)}
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-600 mt-1 block truncate">
              {language === 'bn' ? 'মোট নিবন্ধিত পাঠক / সদস্য' : 'Total Registered Members'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Highest membership surge in Purba Bardhaman & Nadia</span>
          </div>
        </motion.div>

        {/* KPI 3: Total Fund Disbursed */}
        <motion.div
          id="kpi-total-funds"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="relative flex flex-col p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(5,150,105,0.12)] hover:border-teal-300 transition-all duration-200 overflow-hidden group cursor-pointer"
        >
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600" />

          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-800 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
              <IndianRupee className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 font-mono shadow-2xs">
              100% Disbursed
            </span>
          </div>

          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono group-hover:text-emerald-900 transition-colors">
              ₹ {totalFundsCr.toFixed(2)} Cr
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-600 mt-1 block truncate">
              {language === 'bn' ? 'মোট বরাদ্দকৃত অনুদান' : 'Total Fund Disbursed'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Installments 1 & 2 verified via IFMS portal</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
