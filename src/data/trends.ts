// src/data/trends.ts

export type TrendData = {
  year: string;
  Students: number;
  Institutions: number;
  Faculty: number;
  Enrolment: number;
};

export const trendsData: TrendData[] = [
  { year: "2019–20", Students: 9.8, Institutions: 2100, Faculty: 41.5, Enrolment: 78.5 },
  { year: "2020–21", Students: 10.1, Institutions: 2150, Faculty: 42.1, Enrolment: 79.0 },
  { year: "2021–22", Students: 10.5, Institutions: 2200, Faculty: 43.8, Enrolment: 79.8 },
  { year: "2022–23", Students: 10.8, Institutions: 2250, Faculty: 45.0, Enrolment: 81.2 },
  { year: "2023–24", Students: 11.2, Institutions: 2280, Faculty: 46.5, Enrolment: 82.5 },
  { year: "2024–25", Students: 11.5, Institutions: 2338, Faculty: 47.2, Enrolment: 83.0 },
  { year: "2025–26", Students: 12.4, Institutions: 2450, Faculty: 48.2, Enrolment: 84.5 },
];
