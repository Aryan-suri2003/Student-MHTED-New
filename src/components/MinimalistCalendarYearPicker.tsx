import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronDown, Check, X, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface MinimalistCalendarYearPickerProps {
  selectedYear: string;
  onSelectYear: (year: string) => void;
  language: Language;
  className?: string;
}

interface YearOption {
  year: string;
  shortLabel: string;
  bengali: string;
  status: 'current' | 'audited' | 'archive';
  badge: string;
  badgeColor: string;
  period: string;
}

export const MinimalistCalendarYearPicker: React.FC<MinimalistCalendarYearPickerProps> = ({
  selectedYear,
  onSelectYear,
  language,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const yearOptions: YearOption[] = [
    {
      year: '2025-2026',
      shortLabel: '2025–26 (2026 Current)',
      bengali: '২০২৫–২৬ (চলতি ২০২৬)',
      status: 'current',
      badge: '2026 Live',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      period: 'Apr 2025 – Mar 2026',
    },
    {
      year: '2024-2025',
      shortLabel: '2024–25',
      bengali: '২০২৪–২৫',
      status: 'audited',
      badge: 'Audited',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      period: 'Apr 2024 – Mar 2025',
    },
    {
      year: '2023-2024',
      shortLabel: '2023–24',
      bengali: '২০২৩–২৪',
      status: 'archive',
      badge: 'Archive',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      period: 'Apr 2023 – Mar 2024',
    },
    {
      year: '2022-2023',
      shortLabel: '2022–23',
      bengali: '২০২২–২৩',
      status: 'archive',
      badge: 'Archive',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      period: 'Apr 2022 – Mar 2023',
    },
    {
      year: '2021-2022',
      shortLabel: '2021–22',
      bengali: '২০২১–২২',
      status: 'archive',
      badge: 'Baseline',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      period: 'Apr 2021 – Mar 2022',
    },
  ];

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedMeta = yearOptions.find((y) => y.year === selectedYear) || yearOptions[0];

  return (
    <div className={`relative ${className}`} ref={dropdownRef} id="financial-year-picker">
      {/* Definitive Modern Trigger Button matching exact shape & height of other controls */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-11 w-full flex items-center justify-between bg-gradient-to-b from-slate-50 to-slate-100/90 hover:to-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer group text-left ${
          isOpen ? 'ring-2 ring-blue-500/20 border-blue-500 bg-white' : 'hover:border-blue-400'
        }`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="flex items-center min-w-0 pr-1">
          <div className="w-6 h-6 rounded-lg bg-blue-100/90 text-blue-700 flex items-center justify-center mr-2 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Calendar className="w-3.5 h-3.5" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">
              {language === 'bn' ? 'অর্থবর্ষ' : 'Financial Year'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-black text-slate-900 truncate">
                {selectedMeta.year}
              </span>
              {selectedMeta.status === 'current' ? (
                <span className="flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  2026
                </span>
              ) : (
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${selectedMeta.badgeColor}`}>
                  {selectedMeta.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto text-slate-400 group-hover:text-slate-600 shrink-0"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Minimalist, Clean & Uncluttered Calendar Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 mt-1 w-[310px] sm:w-[330px] bg-white/98 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.12)] p-3 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">
                  {language === 'bn' ? 'অর্থবর্ষ নির্বাচন' : 'Fiscal Calendar Year'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-5 h-5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Year Selection List */}
            <div className="mt-2 space-y-1">
              {yearOptions.map((opt) => {
                const isSelected = selectedYear === opt.year;
                return (
                  <button
                    key={opt.year}
                    type="button"
                    onClick={() => {
                      onSelectYear(opt.year);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer text-left border ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-400/90 text-blue-950 font-bold shadow-2xs'
                        : 'bg-transparent hover:bg-slate-50 border-transparent text-slate-700 hover:border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs">{opt.year}</span>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border ${opt.badgeColor}`}
                          >
                            {opt.badge}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block font-normal">
                          {opt.period}
                        </span>
                      </div>
                    </div>

                    {opt.status === 'current' && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80">
                        Current
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Minimalist Fiscal Quarter Tracker */}
            <div className="mt-2.5 pt-2.5 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1.5">
                <span className="flex items-center gap-1 text-slate-700 font-bold uppercase tracking-wider text-[9px]">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  Fiscal Quarters
                </span>
                <span className="font-mono text-emerald-700 font-bold text-[10px]">
                  Aug 2026 (Q2 Active)
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="p-1 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-700 block">Q1</span>
                  <span className="text-[8px] text-slate-400 block">Apr–Jun</span>
                </div>
                <div className="p-1 rounded-lg bg-emerald-50 border border-emerald-300 ring-1 ring-emerald-400/40">
                  <span className="text-[10px] font-black text-emerald-800 block">Q2 ●</span>
                  <span className="text-[8px] text-emerald-700 font-bold block">Jul–Sep</span>
                </div>
                <div className="p-1 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-700 block">Q3</span>
                  <span className="text-[8px] text-slate-400 block">Oct–Dec</span>
                </div>
                <div className="p-1 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-700 block">Q4</span>
                  <span className="text-[8px] text-slate-400 block">Jan–Mar</span>
                </div>
              </div>
            </div>

            {/* Minimalist Footer */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">
                Selected: <strong className="text-slate-900">{selectedYear}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  onSelectYear('2025-2026');
                  setIsOpen(false);
                }}
                className="text-blue-700 font-bold hover:underline cursor-pointer"
              >
                Set to 2026 Live
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
