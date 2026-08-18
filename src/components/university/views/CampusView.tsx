"use client";
import React from 'react';
import { motion } from 'motion/react';
import {
  User,
  Building,
  Landmark,
  Lightbulb,
  BookOpen,
  FlaskConical,
  Briefcase,
  Dumbbell,
  MapPin
} from 'lucide-react';
import { FilterState, GroupedMetricData, MetricData } from '@/types/university';
import { DASHBOARD_METRICS } from '@/data/university/mockData';
import { DeltaIndicator } from '../charts/DeltaIndicator';

interface CampusViewProps {
  filters: FilterState;
  onOpenDrilldown: (title: string, data: any, type: string) => void;
}

export const CampusView: React.FC<CampusViewProps> = ({
  filters,
  onOpenDrilldown
}) => {
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

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner: University Classification Breakdown */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {/* Total Universities */}
        <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }} className="relative overflow-hidden px-4 py-5 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm cursor-pointer group transition-all hover:shadow-md hover:border-indigo-200">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Landmark className="w-20 h-20 text-indigo-900" />
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-2 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
            <Landmark className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight mb-1 relative z-10">
            36
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight relative z-10">
            Total<br />Universities
          </p>
        </motion.div>

        {/* State Public Universities */}
        <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }} className="relative overflow-hidden px-4 py-5 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm cursor-pointer group transition-all hover:shadow-md hover:border-blue-200">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Building className="w-20 h-20 text-blue-900" />
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
            <Building className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-blue-600 tracking-tight mb-1 relative z-10">
            21
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight relative z-10">
            State Public<br />Universities
          </p>
        </motion.div>

        {/* State Private Universities */}
        <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }} className="relative overflow-hidden px-4 py-5 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm cursor-pointer group transition-all hover:shadow-md hover:border-purple-200">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Building className="w-20 h-20 text-purple-900" />
          </div>
          <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center mb-2 group-hover:bg-purple-100 transition-colors">
            <Building className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-black text-purple-600 tracking-tight mb-1 relative z-10">
            9
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight relative z-10">
            State Private<br />Universities
          </p>
        </motion.div>

        {/* Deemed to be Universities */}
        <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }} className="relative overflow-hidden px-4 py-5 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm cursor-pointer group transition-all hover:shadow-md hover:border-emerald-200">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BookOpen className="w-20 h-20 text-emerald-900" />
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2 group-hover:bg-emerald-100 transition-colors">
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600 tracking-tight mb-1 relative z-10">
            4
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight relative z-10">
            Deemed to be<br />Universities
          </p>
        </motion.div>

        {/* State Board */}
        <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }} className="relative overflow-hidden px-4 py-5 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm cursor-pointer group transition-all hover:shadow-md hover:border-amber-200">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <User className="w-20 h-20 text-amber-900" />
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mb-2 group-hover:bg-amber-100 transition-colors">
            <User className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-600 tracking-tight mb-1 relative z-10">
            1
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight relative z-10">
            State<br />Board
          </p>
        </motion.div>
      </motion.div>



      {/* CAMPUS INFRASTRUCTURE & DIRECTORY SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-2 items-start">

        {/* Left Side: Infrastructure */}
        <div className="xl:col-span-7 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" />
            Campus Infrastructure
          </h3>
          <div className="grid grid-cols-2 gap-3 flex-1 items-stretch">
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
              <div className="flex justify-between items-end">
                <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.collegesCenters as MetricData).value}</p>
                <DeltaIndicator deltaPercent={(DASHBOARD_METRICS.collegesCenters as MetricData).deltaPercent} />
              </div>
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
              <div className="flex justify-between items-end">
                <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.subCenters as MetricData).value}</p>
                <DeltaIndicator deltaPercent={(DASHBOARD_METRICS.subCenters as MetricData).deltaPercent} />
              </div>
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
              <div className="flex justify-between items-end">
                <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.incubationCenters as MetricData).value}</p>
                <DeltaIndicator deltaPercent={(DASHBOARD_METRICS.incubationCenters as MetricData).deltaPercent} />
              </div>
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
              <div className="flex justify-between items-end">
                <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.playgrounds as MetricData).value}</p>
                <DeltaIndicator deltaPercent={(DASHBOARD_METRICS.playgrounds as MetricData).deltaPercent} />
              </div>
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
              <div className="flex justify-between items-end">
                <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.centralLibraries as MetricData).value}</p>
                <DeltaIndicator deltaPercent={(DASHBOARD_METRICS.centralLibraries as MetricData).deltaPercent} />
              </div>
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
              <div className="flex justify-between items-end">
                <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.researchCenters as MetricData).value}</p>
                <DeltaIndicator deltaPercent={(DASHBOARD_METRICS.researchCenters as MetricData).deltaPercent} />
              </div>
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
              <div className="flex justify-between items-end">
                <p className="text-xl font-bold text-slate-900">{(DASHBOARD_METRICS.placementCells as MetricData).value}</p>
                <DeltaIndicator deltaPercent={(DASHBOARD_METRICS.placementCells as MetricData).deltaPercent} />
              </div>
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
              { rank: '#4', name: 'Jadavpur University', type: 'State Public' },
              { rank: '#12', name: 'Calcutta University', type: 'State Public' },
              { rank: '#86', name: 'Burdwan University', type: 'State Public' },
              { rank: '#97', name: 'Visva-Bharati', type: 'Central' },
              { rank: '#101', name: 'Kalyani University', type: 'State Public' },
              { rank: '#120', name: 'Vidyasagar University', type: 'State Public' },
              { rank: '#151', name: 'Presidency University', type: 'State Public' },
              { rank: '#180', name: 'Bankura University', type: 'State Public' }
            ].map((uni, idx) => {
              return (
                <div key={idx} className="flex items-center gap-4 py-3">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#f0f4fc] text-[#4f46e5] font-bold text-[13px] rounded-xl border border-indigo-100/30">
                    {uni.rank}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[14px] font-bold text-[#0f172a] leading-tight mb-0.5">{uni.name}</p>
                    <p className="text-[12px] font-medium text-[#64748b]">
                      {uni.type}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


