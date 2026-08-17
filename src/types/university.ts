export type ActiveTab = 'affiliation' | 'campus' | 'research';
export type NavCategory = 'institutions';

export interface ResearchTheme {
  id: string;
  name: string;
  conferencePapers: number;
  researchGrants: number;
  publishedPapers: number;
  grantRatioPercent: number;
  subThemes?: {
    name: string;
    conferencePapers: number;
    researchGrants: number;
    publishedPapers: number;
    leadUniversity?: string;
  }[];
}

export interface UniversityOutput {
  code: string;
  fullName: string;
  conferencePapers: number;
  researchGrants: number;
  publishedPapers: number;
  naacGrade: string;
  type: 'Public' | 'Private' | 'Deemed' | 'Board';
  district: string;
}

export interface GranteeFunding {
  name: string;
  amount: number;
  amountFormatted: string;
  projectCount: number;
  category: 'Central Govt' | 'State Govt' | 'International' | 'Autonomous';
}

export interface YoYDataPoint {
  year: number;
  value: number;
  highlight?: boolean;
}

export interface InfrastructureMetric {
  id: string;
  title: string;
  count: number | string;
  iconName: string;
  colorTheme: 'magenta' | 'blue' | 'coral' | 'gold' | 'green' | 'red' | 'teal';
  subLabel?: string;
  changeYoY?: string;
}

export interface FilterState {
  universityCode: string;
  year: string;
  theme: string;
  subTheme: string;
  universityType: string;
  university: string;
  district: string;
  collegeType: string;
  collegeName: string;
  searchQuery: string;
}

export interface CollegeDetail {
  id: string;
  name: string;
  code: string;
  university: string;
  district: string;
  type: string;
  naacGrade: string;
  nirfRank?: number;
  femaleHostels: number;
  maleHostels: number;
  playgrounds: number;
  mousCount: number;
}

export interface MetricData {
  metric: string;
  value: number;
  previousYearValue?: number | null;
  deltaPercent?: number | null;
  label?: string;
}

export interface GroupedMetricData {
  metric: string;
  total: number;
  parts: MetricData[];
}
