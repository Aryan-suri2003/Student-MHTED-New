"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Building,
  Landmark,
  Lightbulb,
  BookOpen,
  FlaskConical,
  Briefcase,
  Dumbbell,
  MapPin,
  X,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { FilterState, GroupedMetricData, MetricData } from '@/types/university';
import { DASHBOARD_METRICS } from '@/data/university/mockData';

interface University {
  name: string;
  location: string;
  established: number;
  nirf?: string;
  type?: string;
}

const STATE_PUBLIC: University[] = [
  { name: 'Jadavpur University', location: 'Kolkata', established: 1955, nirf: '#4', type: 'State Public' },
  { name: 'University of Calcutta', location: 'Kolkata', established: 1857, nirf: '#12', type: 'State Public' },
  { name: 'University of Burdwan', location: 'Bardhaman', established: 1960, nirf: '#86', type: 'State Public' },
  { name: 'Kalyani University', location: 'Kalyani', established: 1960, nirf: '#101', type: 'State Public' },
  { name: 'Vidyasagar University', location: 'Midnapore', established: 1981, nirf: '#120', type: 'State Public' },
  { name: 'Presidency University', location: 'Kolkata', established: 2010, nirf: '#151', type: 'State Public' },
  { name: 'Bankura University', location: 'Bankura', established: 2014, type: 'State Public' },
  { name: 'Diamond Harbour Women\'s University', location: 'S. 24 Parganas', established: 2012, type: 'State Public' },
  { name: 'West Bengal State University', location: 'N. 24 Parganas', established: 2008, type: 'State Public' },
  { name: 'Cooch Behar Panchanan Barma University', location: 'Cooch Behar', established: 2015, type: 'State Public' },
  { name: 'Kazi Nazrul University', location: 'Asansol', established: 2012, type: 'State Public' },
  { name: 'Sidho-Kanho-Birsha University', location: 'Purulia', established: 2010, type: 'State Public' },
  { name: 'Gour Banga University', location: 'Malda', established: 2008, type: 'State Public' },
  { name: 'North Bengal University', location: 'Siliguri', established: 1962, type: 'State Public' },
  { name: 'Rabindra Bharati University', location: 'Kolkata', established: 1962, type: 'State Public' },
  { name: 'Rani Rashmoni Green University', location: 'Haringhata', established: 2021, type: 'State Public' },
  { name: 'The Sanskrit College and University', location: 'Kolkata', established: 1824, type: 'State Public' },
  { name: 'Raiganj University', location: 'Raiganj', established: 2015, type: 'State Public' },
  { name: 'Darjeeling Hills University', location: 'Darjeeling', established: 2018, type: 'State Public' },
  { name: 'Aliah University', location: 'Kolkata', established: 2008, type: 'State Public' },
  { name: 'MAKAUT', location: 'Haringhata', established: 2001, type: 'State Public' },
];

const STATE_PRIVATE: University[] = [
  { name: 'Adamas University', location: 'Kolkata', established: 2014, type: 'State Private' },
  { name: 'Amity University Kolkata', location: 'Kolkata', established: 2014, type: 'State Private' },
  { name: 'Brainware University', location: 'Kolkata', established: 2017, type: 'State Private' },
  { name: 'JIS University', location: 'Kolkata', established: 2014, type: 'State Private' },
  { name: 'Sister Nivedita University', location: 'Kolkata', established: 2017, type: 'State Private' },
  { name: 'Techno India University', location: 'Kolkata', established: 2012, type: 'State Private' },
  { name: 'The Neotia University', location: 'Diamond Harbour', established: 2015, type: 'State Private' },
  { name: 'Seacom Skills University', location: 'Birbhum', established: 2017, type: 'State Private' },
  { name: 'UEM Kolkata', location: 'Kolkata', established: 2014, type: 'State Private' },
];

const DEEMED: University[] = [
  { name: 'Indian Statistical Institute', location: 'Kolkata', established: 1931, nirf: '#8', type: 'Deemed' },
  { name: 'Ramakrishna Mission Vivekananda ERI', location: 'Belur', established: 2005, type: 'Deemed' },
  { name: 'St. Xavier\'s University Kolkata', location: 'Kolkata', established: 2017, type: 'Deemed' },
  { name: 'Sri Sri University Kolkata', location: 'Kolkata', established: 2021, type: 'Deemed' },
];

const CENTRAL: University[] = [
  { name: 'Visva-Bharati University', location: 'Santiniketan', established: 1921, nirf: '#97', type: 'Central' },
];

const STATE_BOARD: University[] = [
  { name: 'West Bengal Board of Secondary Education (WBBSE)', location: 'Kolkata', established: 1951, type: 'State Board' },
];

const UNIVERSITY_DATA: Record<string, { color: string; bg: string; border: string; icon: React.FC<any>; universities: University[] }> = {
  all: {
    color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: Landmark,
    universities: [...STATE_PUBLIC, ...STATE_PRIVATE, ...DEEMED, ...CENTRAL, ...STATE_BOARD],
  },
  statePublic: {
    color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Building,
    universities: STATE_PUBLIC,
  },
  statePrivate: {
    color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: Building,
    universities: STATE_PRIVATE,
  },
  deemed: {
    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: BookOpen,
    universities: DEEMED,
  },
  stateBoard: {
    color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: User,
    universities: STATE_BOARD,
  },
};

type CategoryKey = keyof typeof UNIVERSITY_DATA;

interface CampusViewProps {
  filters: FilterState;
  onOpenDrilldown: (title: string, data: any, type: string) => void;
}

export const CampusView: React.FC<CampusViewProps> = ({
  filters,
  onOpenDrilldown
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  const handleCardClick = (key: CategoryKey) => {
    setSelectedCategory(prev => (prev === key ? null : key));
  };

  const selected = selectedCategory ? UNIVERSITY_DATA[selectedCategory] : null;

  const cards: { key: CategoryKey; count: number; label: string; sublabel: string }[] = [
    { key: 'all',          count: 36, label: 'Total',        sublabel: 'Universities' },
    { key: 'statePublic',  count: 21, label: 'State Public', sublabel: 'Universities' },
    { key: 'statePrivate', count: 9,  label: 'State Private',sublabel: 'Universities' },
    { key: 'deemed',       count: 4,  label: 'Deemed to be', sublabel: 'Universities' },
    { key: 'stateBoard',   count: 1,  label: 'State',        sublabel: 'Board' },
  ];

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner: University Classification Breakdown */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {cards.map(({ key, count, label, sublabel }) => {
          const cat = UNIVERSITY_DATA[key];
          const Icon = cat.icon;
          const isActive = selectedCategory === key;
          return (
            <motion.div
              key={key}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => handleCardClick(key)}
              className={`relative overflow-hidden px-4 py-5 flex flex-col items-center justify-center text-center rounded-2xl border shadow-sm cursor-pointer group transition-all
                ${isActive
                  ? `${cat.bg} ${cat.border} shadow-md`
                  : 'bg-white border-slate-200/90 hover:shadow-md'
                }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors
                ${isActive ? 'bg-white/60' : `${cat.bg} border ${cat.border}`}`}>
                <Icon className={`w-6 h-6 ${cat.color}`} />
              </div>
              <p className={`text-3xl font-black tracking-tight mb-1 relative z-10 ${cat.color}`}>
                {count}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight relative z-10">
                {label}<br />{sublabel}
              </p>
              {isActive && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
                  <div className={`w-1.5 h-1.5 rounded-full ${cat.color.replace('text-', 'bg-')}`} />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Expandable University List Panel */}
      <AnimatePresence>
        {selected && selectedCategory && (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className={`rounded-2xl border ${selected.border} bg-white shadow-sm`}>
              {/* Panel header */}
              <div className={`flex items-center justify-between px-5 py-3 border-b ${selected.border} ${selected.bg}/40`}>
                <div className="flex items-center gap-2">
                  <selected.icon className={`w-4 h-4 ${selected.color}`} />
                  <h3 className={`text-sm font-bold ${selected.color}`}>
                    {cards.find(c => c.key === selectedCategory)?.label} {cards.find(c => c.key === selectedCategory)?.sublabel}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selected.bg} ${selected.color} border ${selected.border}`}>
                    {selected.universities.length} institutions
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`${selected.bg} sticky top-0 z-10`}>
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-10">#</th>
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Institution</th>
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Location</th>
                      {selectedCategory === 'all' && (
                        <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Type</th>
                      )}
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Est.</th>
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">NIRF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.universities.map((uni, idx) => (
                      <motion.tr
                        key={uni.name}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`border-t border-slate-100 hover:${selected.bg}/60 transition-colors`}
                      >
                        <td className="px-4 py-2.5 text-[12px] font-bold text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-2.5">
                          <span className="text-[13px] font-semibold text-slate-800">{uni.name}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-1 text-[12px] text-slate-500">
                            <MapPin className="w-3 h-3 flex-shrink-0" />{uni.location}
                          </span>
                        </td>
                        {selectedCategory === 'all' && (
                          <td className="px-4 py-2.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selected.bg} ${selected.color} border ${selected.border}`}>
                              {uni.type}
                            </span>
                          </td>
                        )}
                        <td className="px-4 py-2.5 text-[12px] text-slate-500 text-center">{uni.established}</td>
                        <td className="px-4 py-2.5 text-center">
                          {uni.nirf ? (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selected.bg} ${selected.color}`}>
                              {uni.nirf}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[11px]">—</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CAMPUS INFRASTRUCTURE & DIRECTORY SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-2 items-start">

        {/* Left Side: Infrastructure */}
        <div className="xl:col-span-7 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" />
            Campus Infrastructure
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 items-stretch">
            {/* Card 3: Colleges and Centers */}
            <div className="p-3 flex flex-col justify-between hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center">
                  <Building className="w-3 h-3 text-indigo-600" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-tight">
                  Colleges<br />& Centers
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.collegesCenters as MetricData).value}</p>
            </div>

            {/* Card 4: Sub-Centers */}
            <div className="p-3 flex flex-col justify-between hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
                  <Landmark className="w-3 h-3 text-amber-600" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-tight">
                  Sub-Centers
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.subCenters as MetricData).value}</p>
            </div>

            {/* Card 5: Incubation Centers */}
            <div className="p-3 flex flex-col justify-between hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                  <Lightbulb className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-tight">
                  Incubation<br />Centers
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.incubationCenters as MetricData).value}</p>
            </div>

            {/* Card 6: Playgrounds */}
            <div className="p-3 flex flex-col justify-between hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-rose-50 flex items-center justify-center">
                  <Dumbbell className="w-3 h-3 text-rose-600" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-tight">
                  Playgrounds
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.playgrounds as MetricData).value}</p>
            </div>

            {/* Card 7: Libraries */}
            <div className="p-3 flex flex-col justify-between hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-cyan-50 flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-cyan-600" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-tight">
                  Central<br />Libraries
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.centralLibraries as MetricData).value}</p>
            </div>

            {/* Card 8: Research Centers */}
            <div className="p-3 flex flex-col justify-between hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-violet-50 flex items-center justify-center">
                  <FlaskConical className="w-3 h-3 text-violet-600" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-tight">
                  Research<br />Centers
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.researchCenters as MetricData).value}</p>
            </div>

            {/* Card 9: Placement Cells */}
            <div className="p-3 flex flex-col justify-between hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-teal-50 flex items-center justify-center">
                  <Briefcase className="w-3 h-3 text-teal-600" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-tight">
                  Placement<br />Cells
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.placementCells as MetricData).value}</p>
            </div>
          </div>
        </div>

        {/* Right Side: University Directory List */}
        <div className="xl:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Universities Directory
            </h3>
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto pr-2 pb-4 h-[450px]">
            {[
              { rank: '#4',   name: 'Jadavpur University',     type: 'State Public' },
              { rank: '#12',  name: 'Calcutta University',     type: 'State Public' },
              { rank: '#86',  name: 'Burdwan University',      type: 'State Public' },
              { rank: '#97',  name: 'Visva-Bharati',           type: 'Central' },
              { rank: '#101', name: 'Kalyani University',      type: 'State Public' },
              { rank: '#120', name: 'Vidyasagar University',   type: 'State Public' },
              { rank: '#151', name: 'Presidency University',   type: 'State Public' },
              { rank: '#180', name: 'Bankura University',      type: 'State Public' }
            ].map((uni, idx) => (
              <div key={idx} className="flex items-center gap-4 py-3">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#f0f4fc] text-[#4f46e5] font-bold text-[13px] rounded-xl border border-indigo-100/30">
                  {uni.rank}
                </div>
                <div className="flex flex-col">
                  <p className="text-[14px] font-bold text-[#0f172a] leading-tight mb-0.5">{uni.name}</p>
                  <p className="text-[12px] font-medium text-[#64748b]">{uni.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
