"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { getDistrictCampusData } from '@/data/university/mockData';
import { westBengalDistricts } from '@/data/mockData';
import { FilterState } from '@/types/university';
import { X, MapPin } from 'lucide-react';

interface UniversityInfo {
  name: string;
  type: string;
}

interface DistrictData {
  districtId: string;
  name: string;
  count: number;
  previousCount: number;
  universities: UniversityInfo[];
}

interface DistrictChoroplethMapProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

// ── District Name Normalizer & Matcher ───────────────────────────────────────

function normalizeDistrictKey(raw: string): string {
  if (!raw) return '';
  const s = raw.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (s.includes('kolkata') || s.includes('calcutta')) return 'kolkata';
  if (s.includes('north24') || s.includes('24parganasnorth')) return 'north 24 parganas';
  if (s.includes('south24') || s.includes('24parganassouth')) return 'south 24 parganas';
  if (s.includes('howrah') || s.includes('haora')) return 'haora';
  if (s.includes('hooghly') || s.includes('hugli')) return 'hugli';
  if (s.includes('bankura')) return 'bankura';
  if (s.includes('birbhum')) return 'birbhum';
  if (s.includes('purulia') || s.includes('puruliya')) return 'puruliya';
  if (s.includes('bardhaman') || s.includes('barddhaman') || s.includes('burdwan')) return 'barddhaman';
  if (s.includes('nadia')) return 'nadia';
  if (s.includes('murshidabad')) return 'murshidabad';
  if (s.includes('malda')) return 'maldah';
  if (s.includes('uttardinajpur') || s.includes('northdinajpur')) return 'uttar dinajpur';
  if (s.includes('dakshindinajpur') || s.includes('southdinajpur')) return 'dakshin dinajpur';
  if (s.includes('darjeeling') || s.includes('darjiling') || s.includes('kalimpong')) return 'darjiling';
  if (s.includes('jalpaiguri') || s.includes('alipurduar')) return 'jalpaiguri';
  if (s.includes('cooch') || s.includes('kochbihar')) return 'kochbihar';
  if (s.includes('eastmidnapore') || s.includes('purbamedinipur') || s.includes('purbamidnapore')) return 'east midnapore';
  if (s.includes('westmidnapore') || s.includes('paschimmedinipur') || s.includes('paschimmidnapore') || s.includes('jhargram')) return 'west midnapore';

  return s;
}

function matchDistricts(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return normalizeDistrictKey(a) === normalizeDistrictKey(b);
}

function getDisplayName(districtInput: string): string {
  const wb = westBengalDistricts.find(d => matchDistricts(d.id, districtInput) || matchDistricts(d.name, districtInput));
  if (wb) return wb.name;
  return districtInput;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Flatten all coordinate rings in any GeoJSON geometry into a flat [lon, lat][] array */
function flatCoords(geometry: any): [number, number][] {
  const pts: [number, number][] = [];
  const walk = (arr: any) => {
    if (!Array.isArray(arr)) return;
    if (typeof arr[0] === 'number' && typeof arr[1] === 'number') {
      pts.push([arr[0], arr[1]]);
    } else {
      arr.forEach(walk);
    }
  };
  if (geometry?.coordinates) walk(geometry.coordinates);
  return pts;
}

/** Compute the centroid [lon, lat] of a GeoJSON feature */
function featureCentroid(feature: any): [number, number] {
  const coords = flatCoords(feature.geometry);
  if (!coords.length) return [87.8, 24];
  const lon = coords.reduce((s, c) => s + c[0], 0) / coords.length;
  const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
  return [lon, lat];
}

// ── Component ────────────────────────────────────────────────────────────────

const WB_CENTER: [number, number] = [87.8, 24];
const WB_ZOOM = 1;
const DISTRICT_ZOOM = 3.8;

export const DistrictChoroplethMap: React.FC<DistrictChoroplethMapProps> = ({ filters, onFilterChange }) => {
  const [data, setData] = useState<DistrictData[]>([]);
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);
  const [selectedData, setSelectedData] = useState<DistrictData | null>(null);

  // Programmatic zoom/pan state
  const [mapCenter, setMapCenter] = useState<[number, number]>(WB_CENTER);
  const [mapZoom, setMapZoom]     = useState<number>(WB_ZOOM);

  // ── Data loading ────────────────────────────────────────────────────────
  useEffect(() => {
    getDistrictCampusData().then((res: any) => setData(res));
    fetch('/data/wb_districts.geojson')
      .then(r => r.json())
      .then(r => setGeoData(r))
      .catch(err => console.error('Could not load map data', err));
  }, []);

  // ── Sync Focus & Details from dropdown ──────────────────────────────────
  useEffect(() => {
    if (!filters.district || filters.district === 'All' || filters.district === 'All Districts') {
      setSelectedData(null);
      setMapCenter(WB_CENTER);
      setMapZoom(WB_ZOOM);
      return;
    }

    const found = data.find(d => matchDistricts(d.name, filters.district));
    const displayName = getDisplayName(filters.district);

    if (found) {
      setSelectedData({ ...found, name: displayName });
    } else {
      setSelectedData({
        districtId: filters.district,
        name: displayName,
        count: 0,
        previousCount: 0,
        universities: []
      });
    }

    if (geoData) {
      const feature = geoData.features?.find(
        (f: any) => matchDistricts(f.properties?.NAME_2, filters.district)
      );
      if (feature) {
        setMapCenter(featureCentroid(feature));
        setMapZoom(DISTRICT_ZOOM);
      }
    }
  }, [filters.district, data, geoData]);

  // ── Colour scale ────────────────────────────────────────────────────────
  const maxUniversities = useMemo(() => {
    if (!data.length) return 1;
    return Math.max(...data.map(d => d.count));
  }, [data]);

  const colorScale = scaleLinear<string>()
    .domain([1, maxUniversities])
    .range(['#e0e7ff', '#4338ca']);

  const getDistrictColor = (districtName: string) => {
    const d = data.find(d => matchDistricts(d.name, districtName));
    if (!d || d.count === 0) return '#f1f5f9';
    return colorScale(d.count);
  };

  // Map click handler
  const handleDistrictClick = (geo: any) => {
    const geoName = geo.properties.NAME_2;
    const wb = westBengalDistricts.find(d => matchDistricts(d.id, geoName) || matchDistricts(d.name, geoName));
    onFilterChange('district', wb ? wb.id : geoName);
  };

  const handleKeyDown = (e: React.KeyboardEvent, geo: any) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleDistrictClick(geo); }
  };

  const closeSelection = () => {
    setSelectedData(null);
    onFilterChange('district', 'All');
    setMapCenter(WB_CENTER);
    setMapZoom(WB_ZOOM);
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-5 relative flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-sm">

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            University Distribution by District
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Choropleth map based on 2011 census boundaries (19 districts).
          </p>
        </div>

        {filters.district && filters.district !== 'All' && filters.district !== 'All Districts' && (
          <button
            onClick={closeSelection}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear Selection
          </button>
        )}
      </div>

      <div className="flex-1 min-h-[250px] bg-[#f8fafc] rounded-lg overflow-hidden relative border border-slate-100">
        {geoData ? (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 5200, center: WB_CENTER }}
            style={{ width: '100%', height: '100%' }}
          >
            {/*
              ZoomableGroup is used only for programmatic focus.
              filterZoomEvent blocks all mouse-wheel zoom.
              onMoveEnd is not wired so user cannot pan manually.
            */}
            <ZoomableGroup
              center={mapCenter}
              zoom={mapZoom}
              filterZoomEvent={() => false}
            >
              <Geographies geography={geoData}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const districtName = geo.properties.NAME_2;
                    const isSelected = matchDistricts(filters.district, districtName);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        tabIndex={0}
                        onClick={() => handleDistrictClick(geo)}
                        onKeyDown={(e: any) => handleKeyDown(e, geo)}
                        onMouseEnter={() => {
                          const d = data.find(d => matchDistricts(d.name, districtName));
                          setHoveredDistrict({
                            districtId: districtName,
                            name: getDisplayName(districtName),
                            count: d ? d.count : 0,
                            previousCount: d ? d.previousCount : 0,
                            universities: d ? d.universities : []
                          });
                        }}
                        onMouseLeave={() => setHoveredDistrict(null)}
                        style={{
                          default: {
                            fill: isSelected ? '#fbbf24' : getDistrictColor(districtName),
                            stroke: isSelected ? '#d97706' : '#ffffff',
                            strokeWidth: isSelected ? 2.5 : 0.5,
                            outline: 'none',
                            transition: 'fill 300ms, stroke 300ms',
                            filter: isSelected ? 'drop-shadow(0 0 5px rgba(251,191,36,0.7))' : 'none',
                          },
                          hover: {
                            fill: isSelected ? '#fbbf24' : '#818cf8',
                            stroke: isSelected ? '#d97706' : '#312e81',
                            strokeWidth: isSelected ? 2.5 : 1.5,
                            outline: 'none',
                            cursor: 'pointer',
                          },
                          pressed: {
                            fill: '#3730a3',
                            outline: 'none',
                          }
                        }}
                        className="focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            Loading Map Data...
          </div>
        )}

        {/* Hover Tooltip */}
        {hoveredDistrict && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg px-3 py-2 rounded-lg pointer-events-none z-10">
            <div className="font-bold text-slate-800 text-sm">{hoveredDistrict.name}</div>
            <div className="text-xs text-slate-600">{hoveredDistrict.count} Universities</div>
          </div>
        )}

        {/* Selected district badge — name + count only */}
        {selectedData && (
          <div className="absolute top-3 right-3 bg-amber-50 border border-amber-300 shadow-md px-4 py-3 rounded-xl pointer-events-none flex flex-col items-center gap-0.5 min-w-[120px] text-center z-10">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">{selectedData.name}</span>
            <span className="text-3xl font-black text-amber-600 leading-none">{selectedData.count}</span>
            <span className="text-[10px] text-amber-600 font-medium">Universities</span>
          </div>
        )}

        {/* Reset-to-overview button while zoomed in */}
        {mapZoom > WB_ZOOM && (
          <button
            onClick={closeSelection}
            className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-slate-200 shadow text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors z-10"
          >
            <MapPin className="w-3 h-3" /> Reset view
          </button>
        )}
      </div>
    </div>
  );
};
