import React from 'react';
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
import { FilterState, GroupedMetricData, MetricData } from '../../types';
import { DASHBOARD_METRICS } from '../../data/mockData';
import { DeltaIndicator } from '../charts/DeltaIndicator';

interface CampusViewProps {
  filters: FilterState;
  onOpenDrilldown: (title: string, data: any, type: string) => void;
}

export const CampusView: React.FC<CampusViewProps> = ({
  filters,
  onOpenDrilldown
}) => {
  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner: University Classification Breakdown */}
      <div className="p-4 flex-col">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Total Universities */}
          <div className="px-2 py-1 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
              36
            </p>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-tight">
              Total<br />Universities
            </p>
          </div>

          {/* State Public Universities */}
          <div className="px-2 py-1 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold text-indigo-600 tracking-tight mb-1">
              21
            </p>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-tight">
              State Public<br />Universities
            </p>
          </div>

          {/* State Private Universities */}
          <div className="px-2 py-1 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold text-indigo-600 tracking-tight mb-1">
              9
            </p>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-tight">
              State Private<br />Universities
            </p>
          </div>

          {/* Deemed to be Universities */}
          <div className="px-2 py-1 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold text-slate-700 tracking-tight mb-1">
              4
            </p>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-tight">
              Deemed to be<br />Universities
            </p>
          </div>

          {/* State Board */}
          <div className="px-2 py-1 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold text-slate-700 tracking-tight mb-1">
              1
            </p>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-tight">
              State<br />Board
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-right text-[10px] text-slate-400 font-medium tracking-wide">
        DATA REFRESHED: 14-AUG-2026
      </div>

      {/* CAMPUS INFRASTRUCTURE & DIRECTORY SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-2 items-start">
        
        {/* Left Side: Infrastructure */}
        <div className="xl:col-span-7 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
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
        <div className="xl:col-span-5 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
             <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <Landmark className="w-4 h-4 text-indigo-600" />
               University Directory
             </h3>
             <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Top Institutions</span>
          </div>
          
          <div className="flex flex-col gap-2 overflow-y-auto pr-2 pb-4 h-[480px]">
            {[
              { name: 'Jadavpur University', location: 'Kolkata', type: 'State Public' },
              { name: 'Calcutta University', location: 'Kolkata', type: 'State Public' },
              { name: 'Visva-Bharati', location: 'Santiniketan', type: 'Central' },
              { name: 'Adamas University', location: 'Barasat', type: 'State Private' },
              { name: 'St. Xavier\'s University', location: 'Kolkata', type: 'State Private' },
              { name: 'Burdwan University', location: 'Bardhaman', type: 'State Public' },
              { name: 'Ramakrishna Mission', location: 'Howrah', type: 'Deemed to be' },
              { name: 'West Bengal State Board', location: 'Kolkata', type: 'State Board' }
            ].map((uni, idx) => {
              
              const getTypeColor = (type: string) => {
                switch (type) {
                  case 'State Public': return 'bg-blue-50 text-blue-700 border-blue-100';
                  case 'State Private': return 'bg-purple-50 text-purple-700 border-purple-100';
                  case 'Central': return 'bg-amber-50 text-amber-700 border-amber-100';
                  case 'Deemed to be': return 'bg-teal-50 text-teal-700 border-teal-100';
                  case 'State Board': return 'bg-rose-50 text-rose-700 border-rose-100';
                  default: return 'bg-slate-50 text-slate-700 border-slate-100';
                }
              };

              return (
                <div key={idx} className="flex flex-col p-3 hover:bg-slate-50 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-bold text-slate-800 tracking-tight leading-tight mb-1">{uni.name}</p>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {uni.location}
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${getTypeColor(uni.type)}`}>
                      {uni.type}
                    </div>
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
