import React from 'react';
import { Language, DistrictData } from '../types';

interface UniversityDashboardProps {
  language: Language;
  selectedYear: string;
  selectedDistrict: string;
  onSelectDistrict: (dId: string) => void;
  filteredDistricts: DistrictData[];
}

export const UniversityDashboard: React.FC<UniversityDashboardProps> = () => {
  return (
    <div id="university-blank-canvas" className="w-full min-h-[75vh] bg-white rounded-3xl border border-slate-100 shadow-2xs" />
  );
};
