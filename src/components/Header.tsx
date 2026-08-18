import React from 'react';
import { ActiveTab, Language } from '../types';
import {
  BookOpen,
  GraduationCap,
  School,
  Layers,
  Globe,
  ChevronRight,
  Landmark,
} from 'lucide-react';

type LegacyTab = 'admission' | 'examination' | 'scholarship' | 'fra' | 'cap';
type HeaderTab = ActiveTab | LegacyTab;

interface HeaderProps {
  activeTab: HeaderTab;
  setActiveTab?: (tab: HeaderTab) => void;
  language?: Language;
  setLanguage?: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language = 'en',
  setLanguage,
}) => {
  const modernTabs = [
    { id: 'overview' as ActiveTab, label: language === 'bn' ? 'সারসংক্ষেপ' : 'Overview', icon: Layers },
    { id: 'student' as ActiveTab, label: language === 'bn' ? 'শিক্ষার্থী' : 'Student', icon: GraduationCap },
    { id: 'university' as ActiveTab, label: language === 'bn' ? 'বিশ্ববিদ্যালয়' : 'University', icon: School },
    { id: 'public-library' as ActiveTab, label: language === 'bn' ? 'পাবলিক লাইব্রেরি' : 'Public Library', icon: BookOpen },
  ];

  const legacyTitleMap: Record<LegacyTab, { title: string; subtitle: string; tag: string }> = {
    admission: {
      title: 'Student Overview',
      subtitle: 'Statewide consolidated overview of student enrollments, category shares, and institutional intakes.',
      tag: 'Module 01 • Admissions',
    },
    examination: {
      title: 'Examination & Results',
      subtitle: 'University-wide examination conduct, medium of appearance, pass/fail ratios, and backlog distribution.',
      tag: 'Module 02 • Academics',
    },
    scholarship: {
      title: 'Scholarship & DBT Disbursals',
      subtitle: 'Comprehensive monitoring of government welfare schemes, direct benefit transfers, and district disbursal progress.',
      tag: 'Module 03 • Welfare & DBT',
    },
    fra: {
      title: 'Fee Regulating Authority (FRA)',
      subtitle: 'Regulatory oversight of institutional fee structures, proposals, and fee approval decisions.',
      tag: 'Module 04 • Regulations',
    },
    cap: {
      title: 'Centralized Admission Process (CAP)',
      subtitle: 'Real-time tracking of CET seat allotments, choice code confirmations, and institutional intake fill rates.',
      tag: 'Module 05 • Centralized Admissions',
    },
  };

  const hasModernProps = typeof setActiveTab === 'function' && typeof setLanguage === 'function';

  if (hasModernProps) {
    return (
      <header className="w-full shadow-lg bg-[#003366] text-white border-b-2 border-sky-500/40 relative z-30">
        <div className="w-full px-4 py-2.5 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3.5 w-full lg:w-auto justify-start shrink-0">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 via-blue-600 to-blue-900 p-0.5 shadow-md flex items-center justify-center ring-1 ring-sky-300/30">
                <div className="w-full h-full rounded-[10px] bg-[#001f3f] flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-9 h-9" fill="currentColor">
                    <circle cx="50" cy="50" r="44" fill="#001830" stroke="#38bdf8" strokeWidth="2.5" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="3,3" />
                    <ellipse cx="50" cy="50" rx="34" ry="15" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                    <path d="M50 16 C32 26, 32 74, 50 84 C68 74, 68 26, 50 16 Z" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                    <path d="M42 35 L58 35 L62 50 L48 68 L38 52 Z" fill="#38bdf8" opacity="0.95" />
                    <circle cx="50" cy="48" r="6.5" fill="#ffffff" />
                    <circle cx="50" cy="48" r="3" fill="#003366" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug">
                {language === 'bn' ? 'উচ্চশিক্ষা ও গণশিক্ষা প্রসার দপ্তর' : 'Department of Higher Education'}
              </h1>
              <p className="text-xs text-blue-200/90 font-medium flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span>{language === 'bn' ? 'পশ্চিমবঙ্গ সরকার' : 'Government of West Bengal'}</span>
                <span className="text-sky-400/60 font-light">•</span>
                <span className="text-sky-300 font-normal">
                  {language === 'bn' ? 'গ্রন্থাগার ও গণশিক্ষা পরিষেবা' : 'Mass Education Extension & Public Libraries'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 sm:gap-3 w-full lg:w-auto justify-between lg:justify-end">
            <nav className="flex items-center bg-[#002244]/85 p-1 rounded-xl border border-blue-800/80 shadow-inner gap-1 overflow-x-auto max-w-full">
              {modernTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as HeaderTab)}
                    className={`relative px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
                      isActive
                        ? 'bg-white text-[#002b55] shadow-sm font-bold scale-[1.02]'
                        : 'text-blue-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#003366]' : 'text-sky-300'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center bg-[#002244]/85 p-1 rounded-xl border border-blue-800/80 shadow-inner gap-0.5 shrink-0">
              <div className="pl-1.5 pr-1 text-sky-300 flex items-center">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  language === 'en'
                    ? 'bg-sky-400 text-[#002244] font-bold shadow-xs'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  language === 'bn'
                    ? 'bg-sky-400 text-[#002244] font-bold shadow-xs'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const legacyTitle = legacyTitleMap[activeTab as LegacyTab] ?? {
    title: 'Student Overview',
    subtitle: 'Statewide consolidated overview of student enrollments, category shares, and institutional intakes.',
    tag: 'Module 01 • Admissions',
  };

  return (
    <header className="mb-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] mb-1.5">
            <Landmark size={13} className="text-[#2563EB]" />
            <span>Govt. of West Bengal</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span>Higher Education Department</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-[#2563EB] font-extrabold">{legacyTitle.title}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#172033] tracking-tight">{legacyTitle.title}</h1>
          <p className="text-[#667085] text-xs md:text-sm mt-1 max-w-3xl font-medium">{legacyTitle.subtitle}</p>
        </div>

        <div className="self-start md:self-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#EAF2FF] border border-[#4F7FEF]/25 text-[#2563EB] shadow-2xs">
            {legacyTitle.tag}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;

