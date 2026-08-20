import React from 'react';
import { Language, DistrictData } from '../types';

interface StudentDashboardProps {
  language: Language;
  selectedYear: string;
  selectedDistrict: string;
  onSelectDistrict: (dId: string) => void;
  filteredDistricts: DistrictData[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = () => {
  return (
    <div id="student-blank-canvas" className="w-full min-h-[75vh] bg-white rounded-3xl border border-slate-100 shadow-2xs" />
  );
};
