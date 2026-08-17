// src/data/insights.ts

export type InsightData = {
  id: string;
  category: "growth" | "opportunity" | "emerging";
  title: string;
  metric?: string;
  description: string;
  actionText: string;
  route: string;
};

export const insightsData: Record<string, InsightData[]> = {
  "2025–26": [
    {
      id: "i1",
      category: "growth",
      title: "Student participation ↑",
      metric: "+7.2%",
      description: "Higher-education enrolment has increased compared with the previous academic year, driven largely by new UG programs.",
      actionText: "Explore Students",
      route: "/students",
    },
    {
      id: "i2",
      category: "emerging",
      title: "Emerging District",
      metric: "North 24 Parganas",
      description: "Fastest growing district with 11.8% year-over-year growth in student admissions.",
      actionText: "View District",
      route: "/districts",
    },
    {
      id: "i3",
      category: "opportunity",
      title: "Opportunity Area",
      description: "Lower seat utilisation observed in select rural engineering colleges. Targeted scholarships could improve access.",
      actionText: "View Scholarships",
      route: "/scholarships",
    }
  ],
  "2024–25": [
    {
      id: "i1",
      category: "growth",
      title: "Institution growth ↑",
      metric: "+3.2%",
      description: "Steady increase in new affiliated colleges across the state.",
      actionText: "Explore Universities",
      route: "/universities",
    }
  ]
};
