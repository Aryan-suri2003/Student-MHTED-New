// src/data/districts.ts

export type DistrictData = {
  id: string;
  name: string;
  institutions: number;
  students: number;
  enrolment: number;
  admissions: number;
  research: number;
  growth: string;
  coords: [number, number]; // [longitude, latitude] for bubbles
};

export const districtsData: Record<string, DistrictData[]> = {
  "2025–26": [
    {
      id: "Kolkata",
      name: "Kolkata",
      institutions: 182,
      students: 240500,
      enrolment: 81,
      admissions: 45000,
      research: 4200,
      growth: "+8.4%",
      coords: [88.36, 22.57],
    },
    {
      id: "North 24 Parganas",
      name: "North 24 Parganas",
      institutions: 164,
      students: 210000,
      enrolment: 76,
      admissions: 38000,
      research: 2100,
      growth: "+11.8%",
      coords: [88.7, 22.8],
    },
    {
      id: "South 24 Parganas",
      name: "South 24 Parganas",
      institutions: 110,
      students: 145000,
      enrolment: 72,
      admissions: 28000,
      research: 1100,
      growth: "+9.2%",
      coords: [88.5, 22.0],
    },
    {
      id: "Howrah",
      name: "Howrah",
      institutions: 85,
      students: 95000,
      enrolment: 78,
      admissions: 15000,
      research: 1500,
      growth: "+5.5%",
      coords: [88.1, 22.55],
    },
    {
      id: "Darjeeling",
      name: "Darjeeling",
      institutions: 45,
      students: 55000,
      enrolment: 65,
      admissions: 9500,
      research: 800,
      growth: "+4.1%",
      coords: [88.25, 27.0],
    }
  ]
};
