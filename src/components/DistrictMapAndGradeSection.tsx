import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import L from 'leaflet';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import {
  MapPin,
  PieChart as PieChartIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Info,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { westBengalDistricts } from '../data/mockData';
import { DistrictData, Language, GradeFilter } from '../types';
import { DistrictMap } from './DistrictMap';

interface DistrictMapAndGradeSectionProps {
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  onOpenDistrictModal: (district: DistrictData) => void;
  selectedGrade: GradeFilter;
  onSelectGrade: (grade: GradeFilter) => void;
  selectedDivision: string;
  language: Language;
  filteredDistricts: DistrictData[];
}

export const DistrictMapAndGradeSection: React.FC<DistrictMapAndGradeSectionProps> = ({
  selectedDistrict,
  onSelectDistrict,
  onOpenDistrictModal,
  selectedGrade,
  onSelectGrade,
  selectedDivision,
  language,
  filteredDistricts,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);

  const [mapStyle, setMapStyle] = useState<'azure' | 'satellite' | 'terrain'>('azure');
  const [hoveredGradeKey, setHoveredGradeKey] = useState<string | null>(null);

  // Map district data dictionary
  const districtDataMap = useMemo(() => {
    const map = new Map<string, DistrictData>();
    westBengalDistricts.forEach((d) => map.set(d.id, d));
    return map;
  }, []);

  // 1. Initialize Leaflet Map focused on West Bengal
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultCenter: [number, number] = [23.6, 87.8];
    const defaultZoom = 6.6;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false,
      attributionControl: false,
      minZoom: 5.5,
      maxZoom: 13,
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (mapStyle === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapStyle === 'terrain') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const markersGroup = L.featureGroup().addTo(map);
    mapInstanceRef.current = map;
    markersGroupRef.current = markersGroup;

    requestAnimationFrame(() => {
      map.invalidateSize();
      map.setView([23.6, 87.8], defaultZoom);
    });

    setTimeout(() => {
      map.invalidateSize();
      map.setView([23.6, 87.8], defaultZoom);
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapStyle]);

  // 2. Render West Bengal District Bubble Markers with dynamic Grade Filtering
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    westBengalDistricts.forEach((district) => {
      const isSelected = selectedDistrict === district.id;
      const isMatchingDivision =
        selectedDivision === 'all' || district.division.toLowerCase() === selectedDivision.toLowerCase();
      const isMatchingFilter = filteredDistricts.some((fd) => fd.id === district.id);

      // Grade-specific count
      let gradeLibrariesCount = district.totalLibraries;
      if (selectedGrade) {
        gradeLibrariesCount = selectedGrade === 'noClass' ? (district.grades?.noClass || 0) : (district.grades?.[selectedGrade] || 0);
      }

      const hasLibrariesInGrade = gradeLibrariesCount > 0;
      const isDimmed = !isMatchingDivision || !isMatchingFilter || (selectedGrade !== null && !hasLibrariesInGrade);

      // Dynamic radius calculation based on grade or total
      const maxVal = selectedGrade ? 100 : 220;
      const baseRadius = 5 + Math.min(12, (gradeLibrariesCount / maxVal) * 10);
      const radius = isSelected ? baseRadius + 3.5 : Math.max(4, baseRadius);

      // Grade-specific color accents
      let gradeColor = '#0284c7';
      if (selectedGrade === 'D') gradeColor = '#2563eb';
      else if (selectedGrade === 'C') gradeColor = '#0d9488';
      else if (selectedGrade === 'B') gradeColor = '#6366f1';
      else if (selectedGrade === 'A') gradeColor = '#d97706';
      else if (selectedGrade === 'noClass') gradeColor = '#64748b';

      const fillColor = isSelected ? '#f59e0b' : gradeColor;
      const fillOpacity = isDimmed ? 0.15 : isSelected ? 0.98 : 0.85;
      const strokeColor = isDimmed ? '#94a3b8' : '#ffffff';
      const weight = isSelected ? 3 : isDimmed ? 1 : 1.5;

      const circleMarker = L.circleMarker([district.lat, district.lng], {
        radius,
        fillColor,
        color: strokeColor,
        weight,
        opacity: isDimmed ? 0.3 : 1,
        fillOpacity,
        pane: 'markerPane',
      });

      const gradeLabel = selectedGrade
        ? `Grade ${selectedGrade === 'noClass' ? 'No Class' : selectedGrade}`
        : 'All Grades';

      // Tooltip
      const tooltipHtml = `
        <div style="font-family: system-ui, sans-serif; font-size: 11px; padding: 4px 6px; min-width: 140px; color: #0f172a;">
          <div style="font-weight: 800; font-size: 12px; color: #003366; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 4px;">
            ${district.name}
          </div>
          ${
            selectedGrade
              ? `<div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span style="color: #64748b;">${gradeLabel}:</span>
                  <strong style="color: ${gradeColor};">${gradeLibrariesCount} libs</strong>
                </div>`
              : ''
          }
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span style="color: #64748b;">Total Libraries:</span>
            <strong style="color: #0284c7;">${district.totalLibraries}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span style="color: #64748b;">Book Stock:</span>
            <strong>${district.booksInLac.toFixed(1)} Lac</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Members:</span>
            <strong>${district.totalMembers.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      `;

      circleMarker.bindTooltip(tooltipHtml, {
        direction: 'top',
        offset: [0, -radius],
        className: 'custom-powerbi-tooltip',
        opacity: 0.98,
      });

      circleMarker.on('mouseover', () => {
        if (!isSelected) {
          circleMarker.setStyle({
            radius: radius + 2.5,
            fillColor: '#38bdf8',
            fillOpacity: 1,
            weight: 2.5,
          });
        }
      });

      circleMarker.on('mouseout', () => {
        if (!isSelected) {
          circleMarker.setStyle({
            radius,
            fillColor,
            fillOpacity,
            weight,
          });
        }
      });

      circleMarker.on('click', () => {
        onSelectDistrict(isSelected ? 'all' : district.id);
      });

      markersGroup.addLayer(circleMarker);
    });
  }, [selectedDistrict, selectedDivision, selectedGrade, filteredDistricts, onSelectDistrict]);

  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      const curZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(curZoom + delta);
    }
  };

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([23.6, 87.8], 6.6);
    }
  };

  const totalLibs = useMemo(() => {
    return filteredDistricts.reduce((acc, d) => acc + d.totalLibraries, 0) || 1;
  }, [filteredDistricts]);

  const gradeDonutData = useMemo(() => {
    const sumA = filteredDistricts.reduce((acc, d) => acc + (d.grades?.A || 0), 0);
    const sumB = filteredDistricts.reduce((acc, d) => acc + (d.grades?.B || 0), 0);
    const sumC = filteredDistricts.reduce((acc, d) => acc + (d.grades?.C || 0), 0);
    const sumD = filteredDistricts.reduce((acc, d) => acc + (d.grades?.D || 0), 0);
    const sumNoClass = filteredDistricts.reduce((acc, d) => acc + (d.grades?.noClass || 0), 0);
    const totalGrades = sumA + sumB + sumC + sumD + sumNoClass || 1;

    return [
      {
        name: 'D',
        fullName: 'Grade D (Rural / Primary)',
        gradeKey: 'D' as const,
        value: Math.round((sumD / totalGrades) * 100),
        count: sumD,
        color: '#2563eb', // Royal Blue
        gradId: 'gradGradeD',
        gradientStart: '#60a5fa',
        gradientMiddle: '#2563eb',
        gradientEnd: '#1e40af',
      },
      {
        name: 'C',
        fullName: 'Grade C (Rural Central)',
        gradeKey: 'C' as const,
        value: Math.round((sumC / totalGrades) * 100),
        count: sumC,
        color: '#0d9488', // Deep Teal
        gradId: 'gradGradeC',
        gradientStart: '#2dd4bf',
        gradientMiddle: '#0d9488',
        gradientEnd: '#115e59',
      },
      {
        name: 'B',
        fullName: 'Grade B (Town / Sub-Div)',
        gradeKey: 'B' as const,
        value: Math.round((sumB / totalGrades) * 100),
        count: sumB,
        color: '#6366f1', // Rich Indigo
        gradId: 'gradGradeB',
        gradientStart: '#a5b4fc',
        gradientMiddle: '#6366f1',
        gradientEnd: '#3730a3',
      },
      {
        name: 'A',
        fullName: 'Grade A (District Central)',
        gradeKey: 'A' as const,
        value: Math.max(1, Math.round((sumA / totalGrades) * 100)),
        count: sumA,
        color: '#d97706', // Warm Amber Gold
        gradId: 'gradGradeA',
        gradientStart: '#fde047',
        gradientMiddle: '#f59e0b',
        gradientEnd: '#b45309',
      },
      {
        name: 'Library With No Class',
        fullName: 'Library With No Class',
        gradeKey: 'noClass' as const,
        value: Math.max(1, Math.round((sumNoClass / totalGrades) * 100)),
        count: sumNoClass,
        color: '#64748b', // Cool Slate
        gradId: 'gradGradeNoClass',
        gradientStart: '#94a3b8',
        gradientMiddle: '#64748b',
        gradientEnd: '#334155',
      },
    ];
  }, [filteredDistricts]);

  const activeDistrictObj = selectedDistrict !== 'all' ? districtDataMap.get(selectedDistrict) : null;

  const activeGradeItem = useMemo(() => {
    const key = hoveredGradeKey || selectedGrade;
    if (!key) return null;
    return gradeDonutData.find((g) => g.gradeKey === key) || null;
  }, [hoveredGradeKey, selectedGrade, gradeDonutData]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-2">
      <DistrictMap
        selectedDistrict={selectedDistrict}
        onSelectDistrict={onSelectDistrict}
        onOpenDistrictModal={onOpenDistrictModal}
        selectedGrade={selectedGrade}
        selectedDivision={selectedDivision}
        language={language}
        filteredDistricts={filteredDistricts}
        westBengalDistricts={westBengalDistricts}
      />

      {/* Right Panel: Grade-wise Public Libraries Donut (Open Layout) */}
      <div
        id="grade-wise-card"
        className="lg:col-span-6 flex flex-col justify-between"
      >
        {/* Open Header */}
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0">
              <PieChartIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                  {language === 'bn' ? 'গ্রেডভিত্তিক পাবলিক লাইব্রেরি' : 'Grade Classification Breakdown'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  <Sparkles className="w-2.5 h-2.5" />
                  Interactive Filter
                </span>
              </div>
            </div>
          </div>
          {selectedGrade && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950 font-bold border border-blue-200">
                Grade {selectedGrade === 'noClass' ? 'No Class' : selectedGrade}
              </span>
              <button
                onClick={() => onSelectGrade(null)}
                className="text-[10px] text-slate-500 hover:text-slate-900 underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Donut Chart Body with SVG Gradients */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="w-full h-[180px] sm:h-[195px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {gradeDonutData.map((item) => (
                    <linearGradient key={item.gradId} id={item.gradId} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={item.gradientStart} />
                      <stop offset="50%" stopColor={item.gradientMiddle || item.gradientStart} />
                      <stop offset="100%" stopColor={item.gradientEnd} />
                    </linearGradient>
                  ))}
                  <filter id="gradePieGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.12" />
                  </filter>
                </defs>
                <Pie
                  data={gradeDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3.5}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={1300}
                  animationEasing="ease-out"
                  cursor="pointer"
                  style={{ filter: 'url(#gradePieGlow)' }}
                  onMouseEnter={(entry: any) => {
                    const key = entry?.payload?.gradeKey || entry?.gradeKey;
                    setHoveredGradeKey(key);
                  }}
                  onMouseLeave={() => {
                    setHoveredGradeKey(null);
                  }}
                  onClick={(entry: any) => {
                    const key = entry?.payload?.gradeKey || entry?.gradeKey;
                    if (selectedGrade === key) {
                      onSelectGrade(null);
                    } else {
                      onSelectGrade(key);
                    }
                  }}
                >
                  {gradeDonutData.map((entry, index) => {
                    const isSelected = selectedGrade === entry.gradeKey;
                    const isHovered = hoveredGradeKey === entry.gradeKey;
                    const isDimmed = selectedGrade !== null && !isSelected;

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isDimmed ? '#cbd5e1' : `url(#${entry.gradId})`}
                        stroke={isSelected ? '#0f172a' : isHovered ? '#475569' : '#ffffff'}
                        strokeWidth={isSelected ? 3.5 : isHovered ? 2 : 1.5}
                        opacity={isDimmed ? 0.3 : 1}
                        className="transition-all duration-200"
                      />
                    );
                  })}
                </Pie>
                <RechartsTooltip
                  formatter={(val: any, _name: any, item: any) => [
                    `${val}% (${item?.payload?.count?.toLocaleString('en-IN') || 0} libraries)`,
                    item?.payload?.fullName || '',
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 8px 24px -4px rgb(0 0 0 / 0.15)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Summary Indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {activeGradeItem ? (
                <div className="text-center animate-in fade-in zoom-in-95 duration-150">
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white inline-block mb-0.5 shadow-2xs"
                    style={{ backgroundColor: activeGradeItem.color }}
                  >
                    Grade {activeGradeItem.name}
                  </span>
                  <div className="text-xl font-black text-slate-900 leading-tight font-mono">
                    {activeGradeItem.value}%
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {activeGradeItem.count.toLocaleString('en-IN')} libs
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                    Total
                  </span>
                  <div className="text-lg font-black text-slate-900 leading-tight font-mono">
                    {totalLibs.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Public Libs
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Interactive Grade Legend */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            {gradeDonutData.map((item) => {
              const isSelected = selectedGrade === item.gradeKey;
              const isHovered = hoveredGradeKey === item.gradeKey;
              const isDimmed = selectedGrade !== null && !isSelected;

              return (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredGradeKey(item.gradeKey)}
                  onMouseLeave={() => setHoveredGradeKey(null)}
                  onClick={() => {
                    if (selectedGrade === item.gradeKey) {
                      onSelectGrade(null);
                    } else {
                      onSelectGrade(item.gradeKey);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all duration-150 cursor-pointer border text-[11px] ${
                    isSelected
                      ? 'bg-slate-950 border-slate-950 font-bold text-white shadow-xs'
                      : isHovered
                      ? 'bg-slate-100 border-slate-300 text-slate-900'
                      : isDimmed
                      ? 'bg-slate-50/50 border-slate-200/60 text-slate-400 opacity-60'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{
                      background: `linear-gradient(135deg, ${item.gradientStart}, ${item.gradientEnd})`,
                    }}
                  />
                  <span className="font-semibold">{item.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'text-slate-600 bg-slate-200/60'
                    }`}
                  >
                    {item.value}%
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Cross-Filtering Guidance Pill */}
          <div className="mt-2.5 bg-blue-50/80 p-2.5 rounded-xl border border-blue-100 text-[11px] text-blue-950 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">
                {selectedGrade
                  ? `Active Cross-Filter: Grade ${selectedGrade === 'noClass' ? 'No Class' : selectedGrade}. Map & Types updated.`
                  : 'Click any grade badge or slice to cross-filter Map, Types & Grant disbursal.'}
              </span>
            </div>
            {selectedGrade && (
              <button
                onClick={() => onSelectGrade(null)}
                className="font-bold underline text-blue-800 hover:text-blue-950 cursor-pointer ml-2 shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
