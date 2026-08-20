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
    { id: "alipurduar", name: "Alipurduar", institutions: 25, students: 28000, enrolment: 58, admissions: 6500, research: 150, growth: "+2.1%", coords: [89.5, 26.5] },
    { id: "bankura", name: "Bankura", institutions: 60, students: 65000, enrolment: 62, admissions: 12000, research: 450, growth: "+3.4%", coords: [87.0, 23.2] },
    { id: "birbhum", name: "Birbhum", institutions: 72, students: 85000, enrolment: 68, admissions: 14000, research: 850, growth: "+4.5%", coords: [87.5, 23.9] },
    { id: "cooch_behar", name: "Cooch Behar", institutions: 35, students: 42000, enrolment: 60, admissions: 8500, research: 200, growth: "+2.8%", coords: [89.4, 26.3] },
    { id: "dakshin_dinajpur", name: "Dakshin Dinajpur", institutions: 22, students: 25000, enrolment: 55, admissions: 5000, research: 100, growth: "+1.9%", coords: [88.7, 25.3] },
    { id: "darjeeling", name: "Darjeeling", institutions: 45, students: 55000, enrolment: 65, admissions: 9500, research: 800, growth: "+4.1%", coords: [88.25, 27.0] },
    { id: "hooghly", name: "Hooghly", institutions: 95, students: 110000, enrolment: 71, admissions: 18000, research: 1200, growth: "+6.2%", coords: [88.2, 22.9] },
    { id: "howrah", name: "Howrah", institutions: 85, students: 95000, enrolment: 78, admissions: 15000, research: 1500, growth: "+5.5%", coords: [88.1, 22.55] },
    { id: "jalpaiguri", name: "Jalpaiguri", institutions: 40, students: 48000, enrolment: 61, admissions: 9000, research: 250, growth: "+3.1%", coords: [88.7, 26.5] },
    { id: "jhargram", name: "Jhargram", institutions: 18, students: 18000, enrolment: 52, admissions: 4000, research: 80, growth: "+1.5%", coords: [86.9, 22.4] },
    { id: "kalimpong", name: "Kalimpong", institutions: 12, students: 10000, enrolment: 50, admissions: 2000, research: 50, growth: "+1.2%", coords: [88.4, 27.0] },
    { id: "kolkata", name: "Kolkata", institutions: 182, students: 240500, enrolment: 81, admissions: 45000, research: 4200, growth: "+8.4%", coords: [88.36, 22.57] },
    { id: "malda", name: "Malda", institutions: 50, students: 60000, enrolment: 59, admissions: 11000, research: 350, growth: "+4.0%", coords: [88.1, 25.0] },
    { id: "murshidabad", name: "Murshidabad", institutions: 65, students: 75000, enrolment: 57, admissions: 13000, research: 400, growth: "+3.8%", coords: [88.2, 24.1] },
    { id: "nadia", name: "Nadia", institutions: 75, students: 90000, enrolment: 66, admissions: 16000, research: 900, growth: "+5.1%", coords: [88.5, 23.4] },
    { id: "north_24_parganas", name: "North 24 Parganas", institutions: 164, students: 210000, enrolment: 76, admissions: 38000, research: 2100, growth: "+11.8%", coords: [88.7, 22.8] },
    { id: "paschim_bardhaman", name: "Paschim Bardhaman", institutions: 80, students: 105000, enrolment: 70, admissions: 19000, research: 1600, growth: "+6.5%", coords: [87.0, 23.6] },
    { id: "paschim_medinipur", name: "Paschim Medinipur", institutions: 68, students: 82000, enrolment: 63, admissions: 14500, research: 700, growth: "+3.9%", coords: [87.3, 22.4] },
    { id: "purba_bardhaman", name: "Purba Bardhaman", institutions: 70, students: 88000, enrolment: 67, admissions: 15500, research: 750, growth: "+4.8%", coords: [87.9, 23.2] },
    { id: "purba_medinipur", name: "Purba Medinipur", institutions: 78, students: 95000, enrolment: 69, admissions: 17000, research: 850, growth: "+5.3%", coords: [87.8, 22.0] },
    { id: "purulia", name: "Purulia", institutions: 42, students: 45000, enrolment: 56, admissions: 8000, research: 150, growth: "+2.5%", coords: [86.3, 23.3] },
    { id: "south_24_parganas", name: "South 24 Parganas", institutions: 110, students: 145000, enrolment: 72, admissions: 28000, research: 1100, growth: "+9.2%", coords: [88.5, 22.0] },
    { id: "uttar_dinajpur", name: "Uttar Dinajpur", institutions: 28, students: 32000, enrolment: 54, admissions: 6000, research: 120, growth: "+2.2%", coords: [88.1, 26.1] }
  ]
};
