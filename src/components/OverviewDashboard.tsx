"use client";

import React from 'react';
import { Language, DistrictData } from '../types';
import { YearProvider } from '@/contexts/YearContext';
import HeroMap from '@/components/overview/HeroMap';
import KpiRail from '@/components/overview/KpiRail';
import UnderstandingNumbers from '@/components/overview/UnderstandingNumbers';
import AdmissionsBreakdown from '@/components/overview/AdmissionsBreakdown';
import InteractiveMap from '@/components/overview/InteractiveMap';
import GrowthJourney from '@/components/overview/GrowthJourney';
import StateRadar from '@/components/overview/StateRadar';
import StateSignals from '@/components/overview/StateSignals';
import EcosystemFlow from '@/components/overview/EcosystemFlow';
import SnapshotTicker from '@/components/overview/SnapshotTicker';
import ExplorePortal from '@/components/overview/ExplorePortal';

interface OverviewDashboardProps {
  language?: Language;
  selectedYear?: string;
  selectedDistrict?: string;
  onSelectDistrict?: (dId: string) => void;
  filteredDistricts?: DistrictData[];
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = () => {
  return (
    <YearProvider>
      <div className="w-full bg-[#F7F9FC] text-[#172033] flex flex-col font-sans rounded-3xl overflow-hidden border border-slate-200/80 shadow-soft">
        <HeroMap />
        <KpiRail />
        <UnderstandingNumbers />
        <AdmissionsBreakdown />
        <InteractiveMap />
        <GrowthJourney />
        <StateRadar />
        <StateSignals />
        <EcosystemFlow />
        <SnapshotTicker />
        <ExplorePortal />
      </div>
    </YearProvider>
  );
};
