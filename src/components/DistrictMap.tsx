import React, { useEffect, useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import L from 'leaflet';
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Filter,
} from 'lucide-react';
import { DistrictData, Language, GradeFilter } from '../types';

interface DistrictMapProps {
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  onOpenDistrictModal: (district: DistrictData) => void;
  selectedGrade: GradeFilter;
  selectedDivision: string;
  language: Language;
  filteredDistricts: DistrictData[];
  westBengalDistricts: DistrictData[];
}

export const DistrictMap: React.FC<DistrictMapProps> = ({
  selectedDistrict,
  onSelectDistrict,
  onOpenDistrictModal,
  selectedGrade,
  selectedDivision,
  language,
  filteredDistricts,
  westBengalDistricts,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);
  const resizeFrameRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  const [mapStyle, setMapStyle] = useState<'azure' | 'satellite' | 'terrain'>('azure');

  const districtDataMap = useMemo(() => {
    const map = new Map<string, DistrictData>();
    westBengalDistricts.forEach((d) => map.set(d.id, d));
    return map;
  }, [westBengalDistricts]);

  const activeDistrictObj = districtDataMap.get(selectedDistrict);

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

    const resetMapView = () => {
      if (!map || !map.getContainer() || !document.body.contains(map.getContainer())) return;

      map.invalidateSize();
      map.setView(defaultCenter, defaultZoom);
    };

    resizeFrameRef.current = requestAnimationFrame(() => {
      resetMapView();
    });

    resizeTimeoutRef.current = window.setTimeout(() => {
      resetMapView();
    }, 150);

    return () => {
      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapStyle]);

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

      let gradeLibrariesCount = district.totalLibraries;
      if (selectedGrade) {
        gradeLibrariesCount =
          selectedGrade === 'noClass'
            ? district.grades?.noClass || 0
            : district.grades?.[selectedGrade] || 0;
      }

      const hasLibrariesInGrade = gradeLibrariesCount > 0;
      const isDimmed = !isMatchingDivision || !isMatchingFilter || (selectedGrade !== null && !hasLibrariesInGrade);

      const maxVal = selectedGrade ? 100 : 220;
      const baseRadius = 5 + Math.min(12, (gradeLibrariesCount / maxVal) * 10);
      const radius = isSelected ? baseRadius + 3.5 : Math.max(4, baseRadius);

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

      const tooltipHtml = `
        <div style="font-family: system-ui, sans-serif; font-size: 11px; padding: 4px 6px; min-width: 140px; color: #0f172a;">
          <div style="font-weight: 800; font-size: 12px; color: #003366; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 4px;">
            ${district.name} (${district.bengaliName})
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
        className: 'custom-map-tooltip',
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
  }, [selectedDistrict, selectedDivision, selectedGrade, filteredDistricts, westBengalDistricts, onSelectDistrict]);

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

  return (
    <div className="lg:col-span-6 flex flex-col justify-between">
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                {language === 'bn' ? 'জেলাভিত্তিক পাবলিক লাইব্রেরি' : 'District-wise Public Libraries'}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                <Sparkles className="w-2.5 h-2.5" />
                Synced
              </span>
            </div>
          </div>
          {selectedGrade && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-950 font-bold hidden sm:inline-flex items-center gap-1 shrink-0 border border-blue-200">
              <Filter className="w-3 h-3 text-blue-700" />
              Grade {selectedGrade === 'noClass' ? 'No Class' : selectedGrade}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-100/90 rounded-xl p-0.5 border border-slate-200/80 text-[11px] shadow-2xs">
            <button
              onClick={() => setMapStyle('azure')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                mapStyle === 'azure' ? 'bg-white text-blue-950 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                mapStyle === 'satellite' ? 'bg-white text-blue-950 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
          </div>

          <div className="flex items-center bg-slate-100/90 rounded-xl p-0.5 border border-slate-200/80">
            <button
              onClick={() => handleZoom(1)}
              title="Zoom In"
              className="p-1 hover:bg-white rounded-lg text-slate-600 hover:text-blue-900 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-1)}
              title="Zoom Out"
              className="p-1 hover:bg-white rounded-lg text-slate-600 hover:text-blue-900 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              title="Reset View"
              className="p-1 hover:bg-white rounded-lg text-slate-600 hover:text-blue-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[280px] sm:h-[310px] bg-[#dbeafe] rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        <AnimatePresence>
          {activeDistrictObj && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-3 right-3 z-10 max-w-[220px] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-xl text-[11px]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="font-bold text-slate-900">{activeDistrictObj.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold">
                  {activeDistrictObj.division}
                </span>
              </div>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Libraries:</span>
                  <strong className="text-slate-950 font-mono">{activeDistrictObj.totalLibraries}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Books:</span>
                  <strong className="text-[#003366] font-mono">{activeDistrictObj.booksInLac.toFixed(1)} Lac</strong>
                </div>
                <div className="flex justify-between">
                  <span>Usage:</span>
                  <strong className="text-emerald-700 font-mono">{activeDistrictObj.usageInLac.toFixed(1)} Lac</strong>
                </div>
              </div>
              <button
                onClick={() => onOpenDistrictModal(activeDistrictObj)}
                className="mt-2.5 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <span>Full Profile</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
