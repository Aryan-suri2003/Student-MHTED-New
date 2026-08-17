// src/data/overview.ts

export type MetricData = {
  value: string;
  label: string;
  change: string;
  isPositive: boolean;
  breakdown?: { label: string; percentage: number }[];
  route: string;
};

export type YearlyOverview = Record<string, {
  institutions: MetricData;
  students: MetricData;
  faculty: MetricData;
  enrolment: MetricData;
  research: MetricData;
  libraries: MetricData;
}>;

// Mock data structured by academic year
export const stateOverviewData: YearlyOverview = {
  "2025–26": {
    institutions: {
      value: "2,450",
      label: "Institutions",
      change: "+4.8%",
      isPositive: true,
      breakdown: [
        { label: "Universities", percentage: 4 },
        { label: "Colleges", percentage: 96 },
      ],
      route: "/universities",
    },
    students: {
      value: "12.4 Lakh",
      label: "Students",
      change: "+7.2%",
      isPositive: true,
      breakdown: [
        { label: "UG", percentage: 79 },
        { label: "PG", percentage: 17 },
        { label: "Other", percentage: 4 },
      ],
      route: "/students",
    },
    faculty: {
      value: "48.2K",
      label: "Faculty",
      change: "+2.1%",
      isPositive: true,
      route: "/faculty",
    },
    enrolment: {
      value: "84.5%",
      label: "Enrolment Rate",
      change: "+1.5%",
      isPositive: true,
      route: "/students",
    },
    research: {
      value: "15.2K",
      label: "Research Scholars",
      change: "+12.4%",
      isPositive: true,
      route: "/research",
    },
    libraries: {
      value: "3,120",
      label: "Public Libraries",
      change: "+1.2%",
      isPositive: true,
      route: "/libraries",
    },
  },
  "2024–25": {
    institutions: {
      value: "2,338",
      label: "Institutions",
      change: "+3.2%",
      isPositive: true,
      route: "/universities",
    },
    students: {
      value: "11.5 Lakh",
      label: "Students",
      change: "+5.1%",
      isPositive: true,
      route: "/students",
    },
    faculty: {
      value: "47.2K",
      label: "Faculty",
      change: "+1.8%",
      isPositive: true,
      route: "/faculty",
    },
    enrolment: {
      value: "83.0%",
      label: "Enrolment Rate",
      change: "+2.0%",
      isPositive: true,
      route: "/students",
    },
    research: {
      value: "13.5K",
      label: "Research Scholars",
      change: "+9.2%",
      isPositive: true,
      route: "/research",
    },
    libraries: {
      value: "3,083",
      label: "Public Libraries",
      change: "+0.5%",
      isPositive: true,
      route: "/libraries",
    },
  },
  // We can default to 2024-25 data for other years to save space, but in a real app this would have data for all years
};
