export interface DistrictData {
  id: string;
  name: string;
  bengaliName: string;
  division: 'Presidency' | 'Burdwan' | 'Medinipur' | 'Malda' | 'Jalpaiguri';
  lat: number;
  lng: number;
  totalLibraries: number;
  totalMembers: number;
  totalFundsCr: number;
  booksInLac: number;
  usageInLac: number;
  growthPct: number;
  studentEnrollment: number;
  collegesCount: number;
  scholarshipsCr: number;
  buildingType: {
    rented: number;
    owned: number;
    freeOfCharge: number;
  };
  grades: {
    A: number;
    B: number;
    C: number;
    D: number;
    noClass: number;
  };
  typeWise: {
    association: number;
    publicLibrary: number;
  };
  grantsLac: {
    installment1: number;
    installment2: number;
  };
}

export interface FinancialYearData {
  year: string;
  totalLibraries: number;
  totalMembers: number;
  totalFundsCr: number;
  totalColleges: number;
  totalStudents: number;
  totalUniversities: number;
  disclaimerDate: string;
  multiplier: number;
}

export interface UniversityData {
  id: string;
  name: string;
  bengaliName: string;
  location: string;
  districtId: string;
  establishedYear: number;
  type: 'State Public' | 'Technical' | 'Central / Autonomous' | 'Deemed' | 'Private';
  naacGrade: 'A++' | 'A+' | 'A' | 'B++' | 'B' | 'Eligible';
  affiliatedColleges: number;
  enrolledStudents: number;
  facultyCount: number;
  researchGrantCr: number;
  digitalLibraryAccessPct: number;
}

export interface DivisionPerformance {
  division: string;
  bengaliDivision: string;
  districtsCount: number;
  libraries: number;
  members: number;
  colleges: number;
  students: number;
  fundsCr: number;
  gerPct: number;
}

export interface StreamData {
  stream: string;
  bengaliStream: string;
  students: number;
  colleges: number;
  genderRatio: { male: number; female: number };
  growthRate: number;
  color: string;
}

export type ActiveTab = 'overview' | 'student' | 'university' | 'public-library';
export type Language = 'en' | 'bn';
export type GradeFilter = 'A' | 'B' | 'C' | 'D' | 'noClass' | null;
export type BuildingFilter = 'rented' | 'owned' | 'freeOfCharge' | null;
