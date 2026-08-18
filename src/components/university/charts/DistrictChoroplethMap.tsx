"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { getDistrictCampusData } from '@/data/university/mockData';
import { FilterState } from '@/types/university';
import { DeltaIndicator } from './DeltaIndicator';
import { X, MapPin, Building2, Info } from 'lucide-react';

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

export const DistrictChoroplethMap: React.FC<DistrictChoroplethMapProps> = ({ filters, onFilterChange }) => {
  const [data, setData] = useState<DistrictData[]>([]);
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);
  const [popupData, setPopupData] = useState<DistrictData | null>(null);
  
  // Ref for the popup position if we wanted to make it follow the mouse, 
  // but the prompt asked for it to be accessible on touch, so a fixed overlay card is better.

  useEffect(() => {
    // Fetch mock data
    getDistrictCampusData().then((res: any) => {
      setData(res);
    });

    // Fetch GeoJSON
    fetch('/data/wb_districts.geojson')
      .then(res => res.json())
      .then(res => {
        setGeoData(res);
      })
      .catch(err => console.error("Could not load map data", err));
  }, []);

  // Calculate Color Scale
  const maxUniversities = useMemo(() => {
    if (!data.length) return 1;
    return Math.max(...data.map(d => d.count));
  }, [data]);

  // Using the indigo theme matching the project
  const colorScale = scaleLinear<string>()
    .domain([1, maxUniversities])
    .range(['#e0e7ff', '#4338ca']);

  const getDistrictColor = (districtName: string) => {
    // Map geojson NAME_2 to our data
    const districtData = data.find(d => d.name.toLowerCase() === districtName.toLowerCase());
    if (!districtData || districtData.count === 0) {
      return '#f1f5f9'; // Neutral gray for zero or unknown
    }
    return colorScale(districtData.count);
  };

  const handleDistrictClick = (geo: any) => {
    const districtName = geo.properties.NAME_2;
    const districtData = data.find(d => d.name.toLowerCase() === districtName.toLowerCase());
    
    if (districtData) {
      setPopupData(districtData);
      onFilterChange('district', districtData.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, geo: any) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDistrictClick(geo);
    }
  };

  const closePopup = () => {
    setPopupData(null);
    onFilterChange('district', 'All');
  };

  // Ensure map is centered around West Bengal
  // Typical WB coords: Lon ~87.8, Lat ~24
  const mapCenter: [number, number] = [87.8, 24];

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
        
        {filters.district !== 'All' && (
          <button 
            onClick={closePopup}
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
            projectionConfig={{ scale: 5200, center: mapCenter }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup center={mapCenter} zoom={1} minZoom={0.5} maxZoom={4}>
              <Geographies geography={geoData}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const districtName = geo.properties.NAME_2;
                    const isSelected = filters.district === districtName;
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        tabIndex={0}
                        onClick={() => handleDistrictClick(geo)}
                        onKeyDown={(e: any) => handleKeyDown(e, geo)}
                        onMouseEnter={() => {
                          const dData = data.find(d => d.name.toLowerCase() === districtName.toLowerCase());
                          if (dData) setHoveredDistrict(dData);
                        }}
                        onMouseLeave={() => setHoveredDistrict(null)}
                        style={{
                          default: {
                            fill: getDistrictColor(districtName),
                            stroke: isSelected ? '#312e81' : '#ffffff',
                            strokeWidth: isSelected ? 2 : 0.5,
                            outline: 'none',
                            transition: 'all 250ms'
                          },
                          hover: {
                            fill: isSelected ? getDistrictColor(districtName) : '#818cf8',
                            stroke: '#312e81',
                            strokeWidth: 1.5,
                            outline: 'none',
                            cursor: 'pointer'
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

        {/* Hover Tooltip (Mouse only) */}
        {hoveredDistrict && !popupData && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg px-3 py-2 rounded-lg pointer-events-none">
            <div className="font-bold text-slate-800 text-sm">{hoveredDistrict.name}</div>
            <div className="text-xs text-slate-600">{hoveredDistrict.count} Universities</div>
          </div>
        )}
      </div>

      {/* Interactive Popup Overlay for Selected District */}
      {popupData && (
        <div className="absolute top-16 right-6 w-[280px] bg-white border border-slate-200 shadow-xl rounded-xl z-10 flex flex-col max-h-[80%] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{popupData.name}</h4>
            <button onClick={closePopup} className="text-slate-400 hover:text-slate-700 bg-white rounded p-1 shadow-sm border border-slate-200" aria-label="Close popup">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 bg-white border-b border-slate-100 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Total Universities</p>
              <div className="text-2xl font-bold text-slate-900 leading-none">
                {popupData.count}
              </div>
            </div>
            <DeltaIndicator 
              deltaPercent={popupData.previousCount ? ((popupData.count - popupData.previousCount) / popupData.previousCount) * 100 : 0} 
            />
          </div>

          <div className="overflow-y-auto p-0 m-0">
            {popupData.count === 0 ? (
              <div className="p-6 text-center flex flex-col items-center justify-center text-slate-500">
                <Info className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium">No universities</p>
                <p className="text-xs mt-1">There are no tracked universities located in this district.</p>
              </div>
            ) : popupData.universities.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <p className="text-sm font-medium">Data Gap</p>
                <p className="text-xs mt-1">Per-university data for this district is currently unavailable in the source system.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {popupData.universities.map((uni, idx) => (
                  <li key={idx} className="px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 leading-tight mb-1">{uni.name}</p>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {uni.type}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


