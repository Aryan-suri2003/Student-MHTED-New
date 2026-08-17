"use client";

import React, { createContext, useContext, useState } from "react";

type YearContextType = {
  academicYear: string;
  setAcademicYear: (year: string) => void;
};

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider = ({ children }: { children: React.ReactNode }) => {
  const [academicYear, setAcademicYear] = useState("2025–26");

  return (
    <YearContext.Provider value={{ academicYear, setAcademicYear }}>
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
