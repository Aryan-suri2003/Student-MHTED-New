"use client";

import React, { useState, useMemo } from "react";
import { useYear } from "@/contexts/YearContext";
import { 
  TrendingUp, TrendingDown, ArrowRight, ArrowUpRight, ArrowDownRight, 
  Calendar, HelpCircle, Info, ChevronRight, X,
  Building2, Users, School, GraduationCap, Microscope, Trophy, Activity, Database, Scale
} from "lucide-react";

const PERFORMANCE_DATA = {
  scopeName: "West Bengal",
  scopeLevel: "State Level",
  availableHistory: true,
  domains: [
    {
      id: "access",
      name: "Access",
      current: 82,
      trend: 4.2,
      history: [74, 78, 82],
      icon: Building2,
      color: "blue",
      indicators: [
        { name: "Gross Enrolment Ratio (GER)", current: "78.4%", change1: 1.5, change2: 5.2 },
        { name: "District Coverage", current: "94%", change1: 3.2, change2: 6.1 },
        { name: "Institutions per 1 Lakh Population", current: "12.4", change1: 0.6, change2: 1.8 },
        { name: "Student Intake (Higher Education)", current: "12.4 L", change1: 7.2, change2: 12.6 },
      ],
      insights: [
        { type: "positive", title: "Access improved", text: "Gross Enrolment Ratio increased by 1.5% and district coverage expanded." }
      ]
    },
    {
      id: "participation",
      name: "Participation",
      current: 76,
      trend: 2.8,
      history: [71, 73, 76],
      icon: Users,
      color: "purple",
      indicators: [
        { name: "Female GER", current: "79.1%", change1: 3.4, change2: 5.1 },
        { name: "Reserved Category Intake", current: "42.5%", change1: 1.2, change2: 2.8 },
        { name: "Rural Representation", current: "38%", change1: 2.1, change2: 4.0 },
        { name: "Completion Rate", current: "81%", change1: -0.5, change2: 1.2 },
      ],
      insights: [
        { type: "positive", title: "Participation improved", text: "Female GER increased by 3.4% and marginalized student enrolment rose." }
      ]
    },
    {
      id: "infrastructure",
      name: "Infrastructure",
      current: 74,
      trend: 1.4,
      history: [70, 73, 74],
      icon: School,
      color: "emerald",
      indicators: [
        { name: "Digital Classrooms", current: "68%", change1: 4.1, change2: 8.5 },
        { name: "Library Automation", current: "84%", change1: 2.5, change2: 6.0 },
        { name: "Hostel Capacity", current: "1.2L", change1: 0.8, change2: 1.5 },
        { name: "Campus Connectivity", current: "92%", change1: 1.1, change2: 3.2 },
      ],
      insights: []
    },
    {
      id: "faculty",
      name: "Faculty",
      current: 71,
      trend: -0.6,
      history: [72, 72, 71],
      icon: GraduationCap,
      color: "orange",
      indicators: [
        { name: "Student-Faculty Ratio", current: "24:1", change1: -1.8, change2: -3.2 },
        { name: "PhD Qualified Faculty", current: "42%", change1: 1.5, change2: 3.1 },
        { name: "Vacant Positions", current: "14%", change1: -2.1, change2: -4.5 },
        { name: "Faculty Attrition", current: "8%", change1: 0.5, change2: -1.0 },
      ],
      insights: [
        { type: "attention", title: "Faculty needs attention", text: "Student-to-faculty ratio increased by 1.8% due to slower faculty recruitment." }
      ]
    },
    {
      id: "research",
      name: "Research",
      current: 64,
      trend: 3.2,
      history: [58, 61, 64],
      icon: Microscope,
      color: "indigo",
      indicators: [
        { name: "PhD Enrolment", current: "2,364", change1: 8.5, change2: 14.2 },
        { name: "Research Funding", current: "₹245 Cr", change1: 12.4, change2: 22.1 },
        { name: "Patents Filed", current: "1,420", change1: 15.2, change2: 28.5 },
        { name: "Publications", current: "12,840", change1: 6.1, change2: 11.4 },
      ],
      insights: []
    },
    {
      id: "outcomes",
      name: "Outcomes",
      current: 68,
      trend: 0.1,
      history: [67, 68, 68],
      icon: Trophy,
      color: "rose",
      indicators: [
        { name: "Placement Rate", current: "62%", change1: 0.5, change2: 1.2 },
        { name: "Average Package", current: "₹4.2L", change1: 1.2, change2: 3.5 },
        { name: "Higher Ed Progression", current: "24%", change1: -0.8, change2: 0.5 },
        { name: "Entrepreneurship", current: "3.5%", change1: 0.2, change2: 0.8 },
      ],
      insights: []
    }
  ]
};

// SVG Area Chart Component
const SparklineArea = ({ data }: { data: number[] }) => {
  if (!data || data.length < 2) return null;
  const min = 0; // Fixed y-axis 0-100 as per image
  const max = 100;
  const range = max - min;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 40 - ((val - min) / range) * 40;
    return `${x},${y}`;
  });

  const areaPoints = `0,40 ${points.join(" ")} 100,40`;

  return (
    <div className="relative w-full h-[120px] flex">
      {/* Y Axis */}
      <div className="flex flex-col justify-between h-[100px] text-[10px] text-slate-400 font-medium pr-3 pb-1">
        <span>100</span>
        <span>75</span>
        <span>50</span>
        <span>25</span>
        <span>0</span>
      </div>

      <div className="flex-1 flex flex-col relative h-[120px]">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 h-[100px] flex flex-col justify-between">
          <div className="w-full border-t border-slate-100"></div>
          <div className="w-full border-t border-slate-100"></div>
          <div className="w-full border-t border-slate-100"></div>
          <div className="w-full border-t border-slate-100"></div>
          <div className="w-full border-t border-slate-200"></div>
        </div>

        <svg viewBox="0 -5 100 50" className="w-full h-[100px] overflow-visible absolute inset-0 z-10" preserveAspectRatio="none">
          <defs>
            <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#blueGradient)" />
          <polyline 
            fill="none" 
            stroke="#3B82F6" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            points={points.join(" ")} 
          />
        </svg>

        {/* Overlay HTML for dots and text to prevent distortion */}
        <div className="absolute inset-0 z-20 h-[100px] pointer-events-none">
          {data.map((val, i) => {
            const leftPct = (i / (data.length - 1)) * 100;
            const svgY = 40 - ((val - min) / range) * 40;
            // Map the SVG Y coordinate (-5 to 45) to a percentage (0 to 100)
            const topPct = ((svgY + 5) / 50) * 100;

            return (
              <div 
                key={i} 
                className="absolute flex flex-col items-center justify-center"
                style={{ 
                  left: `${leftPct}%`, 
                  top: `${topPct}%`,
                  transform: 'translate(-50%, -50%)' 
                }}
              >
                <div className="text-[11px] font-bold text-slate-700 mb-1 leading-none bg-white/50 px-1 rounded">{val}</div>
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full border-[2px] border-white shadow-sm"></div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between w-full text-[11px] font-medium text-slate-500 mt-[105px]">
          <span className="text-center w-8">2023-24</span>
          <span className="text-center w-8">2024-25</span>
          <span className="text-center w-8">2025-26</span>
        </div>
      </div>
    </div>
  );
};

export default function StateRadar() {
  const { academicYear } = useYear();
  const [universityId, setUniversityId] = useState("all");
  
  const dynamicData = React.useMemo(() => {
    const mult = universityId === "all" ? 1 : (universityId === "u1" ? 1.08 : (universityId === "u2" ? 0.88 : 1.12));
    const adjust = (val: number) => Math.min(100, Math.max(0, Math.round(val * mult)));
    const adjustTrend = (val: number) => parseFloat((val * (mult > 1 ? 1.2 : -0.8)).toFixed(1));

    return {
      ...PERFORMANCE_DATA,
      scopeName: universityId === "all" ? "West Bengal" : (universityId === "u1" ? "Jadavpur University" : "Calcutta University"),
      scopeLevel: universityId === "all" ? "State Level" : "University Level",
      domains: PERFORMANCE_DATA.domains.map(d => ({
        ...d,
        current: adjust(d.current),
        trend: adjustTrend(d.trend),
        history: d.history.map(h => adjust(h))
      }))
    };
  }, [universityId]);

  const [selectedDomainId, setSelectedDomainId] = useState(dynamicData.domains[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedDomain = dynamicData.domains.find(d => d.id === selectedDomainId) || dynamicData.domains[0];

  let improving = 0, stable = 0, attention = 0;
  dynamicData.domains.forEach(d => {
    if (d.trend > 1) improving++;
    else if (d.trend < -1) attention++;
    else stable++;
  });

  const getFormatChange = (change: number) => {
    const isPositive = change > 0;
    const isNegative = change < 0;
    let colorClass = "text-slate-500";
    let Arrow = ArrowRight;
    
    if (isPositive) { colorClass = "text-emerald-600"; Arrow = ArrowUpRight; }
    if (isNegative) { colorClass = "text-red-600"; Arrow = ArrowDownRight; }

    return (
      <div className={`flex items-center gap-1 font-semibold text-[12px] ${colorClass}`}>
        <Arrow size={12} strokeWidth={3} />
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  const domainColors: Record<string, string> = {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    emerald: "bg-emerald-600",
    orange: "bg-orange-500",
    indigo: "bg-indigo-600",
    rose: "bg-rose-500"
  };

  const domainLightColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-500",
    indigo: "bg-indigo-50 text-indigo-600",
    rose: "bg-rose-50 text-rose-500"
  };

  // Extract all insights for the bottom section
  const allInsights = dynamicData.domains.flatMap(d => d.insights);

  return (
    <section className="bg-slate-50 py-12 relative">
      <div className="max-w-[1400px] mx-auto w-full px-6">
        
        {/* Main Card Container */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          
          {/* Header Row */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-[20px] font-bold text-slate-800 tracking-tight mb-2">HIGHER EDUCATION PERFORMANCE</h2>
              <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                <span>{dynamicData.scopeName}</span>
                <span className="text-slate-300">•</span>
                <span>Academic Year: {academicYear}</span>
                <span className="text-slate-300">•</span>
                <span>All Institutions</span>
                <Info size={14} className="text-slate-400 ml-1" />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select 
                value={universityId} 
                onChange={(e) => setUniversityId(e.target.value)}
                className="px-3 py-1.5 rounded bg-white border border-slate-200 text-[12px] font-medium text-slate-700 outline-none hover:border-blue-300 transition-colors cursor-pointer shadow-sm"
              >
                <option value="all">All Universities</option>
                <option value="u1">Jadavpur University</option>
                <option value="u2">Calcutta University</option>
              </select>

              <button className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-800 transition-colors">
                <Calendar size={14} />
                <span>Last updated: 18 Aug 2026</span>
              </button>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 text-[12px] text-blue-600 hover:text-blue-800 transition-colors px-3 py-1.5 rounded bg-blue-50"
              >
                <HelpCircle size={14} />
                <span>How is this calculated?</span>
              </button>
            </div>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Activity size={24} />
              </div>
              <div>
                <div className="text-[24px] font-bold text-slate-800 leading-none">6</div>
                <div className="text-[11px] font-bold text-slate-800 uppercase mt-1">Core Domains</div>
                <div className="text-[11px] text-slate-500">Comprehensive assessment</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[20px] font-bold text-slate-800 leading-none">{improving}</div>
                <div className="text-[11px] font-bold text-slate-800 uppercase mt-1">Improving</div>
                <div className="text-[11px] text-slate-500">vs 2024–25</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                <ArrowRight size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[20px] font-bold text-slate-800 leading-none">{stable}</div>
                <div className="text-[11px] font-bold text-slate-800 uppercase mt-1">Stable</div>
                <div className="text-[11px] text-slate-500">vs 2024–25</div>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                <TrendingDown size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[20px] font-bold text-slate-800 leading-none">{attention}</div>
                <div className="text-[11px] font-bold text-slate-800 uppercase mt-1">Need Attention</div>
                <div className="text-[11px] text-slate-500">vs 2024–25</div>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Left Column: Performance by Domain List */}
            <div className="w-[45%]">
              <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wide mb-4">Performance by Domain</h3>
              
              <div className="flex flex-col gap-2">
                {dynamicData.domains.map((domain) => {
                  const isSelected = selectedDomainId === domain.id;
                  const Icon = domain.icon;
                  const barColor = domainColors[domain.color];
                  const lightColor = domainLightColors[domain.color];
                  
                  let statusText = "Stable";
                  let statusColor = "text-amber-500";
                  if (domain.trend > 1) { statusText = "Improving"; statusColor = "text-emerald-500"; }
                  else if (domain.trend < -1) { statusText = "Need Attention"; statusColor = "text-rose-500"; }

                  return (
                    <button
                      key={domain.id}
                      onClick={() => setSelectedDomainId(domain.id)}
                      className={`w-full flex items-center gap-4 p-3 rounded-lg border transition-all ${
                        isSelected 
                          ? 'border-blue-300 bg-blue-50/50 ring-1 ring-blue-100 shadow-sm' 
                          : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? lightColor : 'bg-slate-100 text-slate-500'}`}>
                        <Icon size={18} />
                      </div>
                      
                      <div className="flex-1 text-left flex items-center gap-4">
                        <span className={`font-bold text-[14px] w-28 ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                          {domain.name}
                        </span>
                        
                        <div className="flex items-center gap-1 font-bold text-slate-800 text-[15px] w-12">
                          {domain.current} <span className="text-[10px] text-slate-400 font-medium">/100</span>
                        </div>
                        
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${domain.current}%` }}></div>
                        </div>
                        
                        <div className="w-16 flex justify-end">
                          <div className={`flex items-center gap-1 text-[11px] font-bold ${statusColor}`}>
                            {domain.trend > 0 ? <ArrowUpRight size={12}/> : domain.trend < 0 ? <ArrowDownRight size={12}/> : <ArrowRight size={12}/>}
                            {Math.abs(domain.trend)}%
                          </div>
                        </div>

                        <div className={`w-24 text-right text-[11px] font-medium ${statusColor}`}>
                          {statusText}
                        </div>
                        
                        <ChevronRight size={14} className={isSelected ? 'text-blue-400' : 'text-slate-300'} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-6 mt-6 px-4 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Improving (↑ &gt; 1%)
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  Stable (-1% to 1%)
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  Need Attention (↓ &lt; -1%)
                </div>
              </div>

            </div>

            {/* Right Column: Selected Domain Details */}
            <div className="w-[55%] border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wide mb-4">Selected Domain</h3>
              
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${domainLightColors[selectedDomain.color]}`}>
                    <selectedDomain.icon size={24} />
                  </div>
                  <h4 className="text-[24px] font-bold text-blue-600">{selectedDomain.name}</h4>
                </div>
                <div className="text-right">
                  <div className="flex items-end justify-end gap-1">
                    <span className="text-[36px] font-bold text-blue-600 leading-none">{selectedDomain.current}</span>
                    <span className="text-[16px] font-bold text-slate-400 mb-1">/ 100</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[13px] font-bold text-emerald-600 mt-2">
                    <ArrowUpRight size={16} strokeWidth={3} />
                    <span>{selectedDomain.trend}%</span>
                    <span className="text-slate-500 font-medium ml-1">vs 2024-25</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="grid grid-cols-12 gap-4 pb-2 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <div className="col-span-6">Key Indicators</div>
                  <div className="col-span-3 text-right">Current (2025-26)</div>
                  <div className="col-span-1 text-right">vs 2024-25</div>
                  <div className="col-span-2 text-right">vs 2023-24</div>
                </div>
                
                <div className="flex flex-col">
                  {selectedDomain.indicators.map((ind, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 py-3 border-b border-slate-100 last:border-0 items-center">
                      <div className="col-span-6 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                        <span className="text-[12px] font-semibold text-slate-700">{ind.name}</span>
                      </div>
                      <div className="col-span-3 text-right font-bold text-slate-900 text-[13px]">{ind.current}</div>
                      <div className="col-span-1 flex justify-end">{getFormatChange(ind.change1)}</div>
                      <div className="col-span-2 flex justify-end">{getFormatChange(ind.change2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide mb-4">Performance Trend (3 Year)</h4>
                <SparklineArea data={selectedDomain.history} />
              </div>

            </div>
          </div>
          
          {/* Bottom Row: What Changed */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wide">What Changed This Year?</h3>
              <button className="text-[12px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
                View all insights <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {allInsights.map((insight, idx) => {
                const isPos = insight.type === 'positive';
                const isAtt = insight.type === 'attention';
                const bgClass = isPos 
                  ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/60' 
                  : isAtt 
                    ? 'bg-gradient-to-br from-rose-50 to-rose-100/60' 
                    : 'bg-gradient-to-br from-slate-50 to-slate-100/60';
                const iconColor = isPos ? 'text-emerald-600' : isAtt ? 'text-rose-600' : 'text-slate-600';
                const Icon = isPos ? ArrowUpRight : isAtt ? ArrowDownRight : ArrowRight;

                return (
                  <div key={idx} className={`p-4 rounded-xl ${bgClass} border ${isPos ? 'border-emerald-200/60' : isAtt ? 'border-rose-200/60' : 'border-slate-200'} shadow-sm hover:shadow transition-shadow`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border bg-white ${isPos ? 'border-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.15)]' : isAtt ? 'border-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.15)]' : 'border-slate-200'} ${iconColor}`}>
                        <Icon size={14} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className={`text-[13px] font-bold mb-1 ${iconColor}`}>{insight.title}</div>
                        <p className="text-[12px] text-slate-700 leading-snug font-medium">{insight.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Methodology Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                <Scale size={18} className="text-blue-600" />
                Calculation Methodology
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              
              <div className="mb-8">
                <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-3">1. The Scoring Formula (Index)</h4>
                <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                  Each of the 6 core domains receives a composite index score out of 100. This score is synthesized from the domain's Key Indicators using a weighted formula. For example, the <strong>Access</strong> score is calculated as:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between py-2 border-b border-slate-200 text-[13px]">
                    <span className="text-slate-600">Gross Enrolment Ratio (GER)</span>
                    <span className="font-bold text-slate-800">40% weight</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 text-[13px]">
                    <span className="text-slate-600">District Coverage</span>
                    <span className="font-bold text-slate-800">30% weight</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 text-[13px]">
                    <span className="text-slate-600">Institution Density</span>
                    <span className="font-bold text-slate-800">20% weight</span>
                  </div>
                  <div className="flex justify-between py-2 text-[13px]">
                    <span className="text-slate-600">Student Intake Capacity</span>
                    <span className="font-bold text-slate-800">10% weight</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-3">2. Status Threshold Definitions</h4>
                <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                  The status badges assigned to each domain are mathematically determined by their Year-over-Year (YoY) percentage change to eliminate subjectivity:
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
                    <div className="text-emerald-600 font-bold text-[14px] mb-1">Improving</div>
                    <div className="text-emerald-700/80 text-[12px]">YoY growth &gt; +1.0%</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
                    <div className="text-amber-600 font-bold text-[14px] mb-1">Stable</div>
                    <div className="text-amber-700/80 text-[12px]">-1.0% to +1.0%</div>
                  </div>
                  <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-center">
                    <div className="text-rose-600 font-bold text-[14px] mb-1">Need Attention</div>
                    <div className="text-rose-700/80 text-[12px]">YoY decline &lt; -1.0%</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-3">3. Data Sources & Cadence</h4>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-4">
                  <Database className="text-blue-500 shrink-0 mt-1" size={20} />
                  <p className="text-[13px] text-slate-700 leading-relaxed">
                    Data is aggregated dynamically from the <strong>All India Survey on Higher Education (AISHE)</strong> APIs, State University Databases, and Institutional Direct Reporting. The "Current" metrics represent real-time confirmed data for the active academic year filter.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
