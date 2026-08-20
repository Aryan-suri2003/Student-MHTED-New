"use client";

import React, { createContext, useContext, useState } from "react";

type YearContextType = {
  academicYear: string;
  setAcademicYear: (year: string) => void;
  instType: string;
  setInstType: (type: string) => void;
  university: string;
  setUniversity: (univ: string) => void;
  college: string;
  setCollege: (col: string) => void;
  resetFilters: () => void;
  getOverviewScale: () => number;
};

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider = ({ children }: { children: React.ReactNode }) => {
  const [academicYear, setAcademicYear] = useState("2025–26");
  const [instType, setInstType] = useState("All");
  const [university, setUniversity] = useState("All");
  const [college, setCollege] = useState("All");

  const resetFilters = () => {
    setAcademicYear("2025–26");
    setInstType("All");
    setUniversity("All");
    setCollege("All");
  };

  const getOverviewScale = () => {
    let scale = 1.0;
    if (academicYear !== "2025–26") scale *= 0.9;
    if (instType !== "All") scale *= 0.4;
    if (university !== "All") scale *= 0.1;
    if (college !== "All") scale *= 0.02; // A single college is tiny
    return scale;
  };

  return (
    <YearContext.Provider value={{ 
      academicYear, setAcademicYear,
      instType, setInstType,
      university, setUniversity,
      college, setCollege,
      resetFilters,
      getOverviewScale
    }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = () => {
  const context = useContext(YearContext);
  if (context === undefined) {
    throw new Error("useYear must be used within a YearProvider");
  }
  return context;
};
