import React from 'react';
import { ActiveTab, Language } from '../types';
import { BookOpen, GraduationCap, School, Layers, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
}) => {
  const tabs = [
    { id: 'overview' as ActiveTab, label: language === 'bn' ? 'সারসংক্ষেপ' : 'Overview', icon: Layers },
    { id: 'student' as ActiveTab, label: language === 'bn' ? 'শিক্ষার্থী' : 'Student', icon: GraduationCap },
    { id: 'university' as ActiveTab, label: language === 'bn' ? 'বিশ্ববিদ্যালয়' : 'University', icon: School },
    { id: 'public-library' as ActiveTab, label: language === 'bn' ? 'পাবলিক লাইব্রেরি' : 'Public Library', icon: BookOpen },
  ];

  return (
    <header className="w-full shadow-lg bg-[#003366] text-white border-b-2 border-sky-500/40 relative z-30">
      {/* Main Brand & Navigation Banner */}
      <div className="w-full px-4 py-2.5 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* State Emblem & Department Title */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto justify-start shrink-0">
          <div className="relative shrink-0">
            {/* Biswa Bangla Inspired State Crest with Modern Glow */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 via-blue-600 to-blue-900 p-0.5 shadow-md flex items-center justify-center ring-1 ring-sky-300/30">
              <div className="w-full h-full rounded-[10px] bg-[#001f3f] flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-9 h-9" fill="currentColor">
                  {/* Biswa Bangla stylized globe & alphabet insignia */}
                  <circle cx="50" cy="50" r="44" fill="#001830" stroke="#38bdf8" strokeWidth="2.5"/>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="3,3"/>
                  <ellipse cx="50" cy="50" rx="34" ry="15" fill="none" stroke="#38bdf8" strokeWidth="1.5"/>
                  <path d="M50 16 C32 26, 32 74, 50 84 C68 74, 68 26, 50 16 Z" fill="none" stroke="#38bdf8" strokeWidth="1.5"/>
                  <path d="M42 35 L58 35 L62 50 L48 68 L38 52 Z" fill="#38bdf8" opacity="0.95"/>
                  <circle cx="50" cy="48" r="6.5" fill="#ffffff"/>
                  <circle cx="50" cy="48" r="3" fill="#003366"/>
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

        {/* Navigation Tabs and Language Switcher (Aligned Segmented Control) */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 sm:gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Segmented Modern Navigation Pills */}
          <nav className="flex items-center bg-[#002244]/85 p-1 rounded-xl border border-blue-800/80 shadow-inner gap-1 overflow-x-auto max-w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
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

          {/* Language Switcher Segmented Control */}
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
};

