import React from "react";
import HeroMap from "@/components/overview/HeroMap";
import KpiRail from "@/components/overview/KpiRail";
import UnderstandingNumbers from "@/components/overview/UnderstandingNumbers";
import AdmissionsBreakdown from "@/components/overview/AdmissionsBreakdown";
import InteractiveMap from "@/components/overview/InteractiveMap";
import GrowthJourney from "@/components/overview/GrowthJourney";
import StateRadar from "@/components/overview/StateRadar";
import StateSignals from "@/components/overview/StateSignals";
import EcosystemFlow from "@/components/overview/EcosystemFlow";
import Footer from "@/components/layout/Footer";

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans">
      <HeroMap />
      <KpiRail />
      <UnderstandingNumbers />
      <AdmissionsBreakdown />
      <InteractiveMap />
      <GrowthJourney />
      <StateRadar />
      <StateSignals />
      <EcosystemFlow />
      <Footer />
    </div>
  );
}
