// src/data/modules.ts

import { Users, Library, BookOpen, GraduationCap, Microscope, Award } from "lucide-react";

export type ModuleData = {
  id: string;
  name: string;
  metric: string;
  route: string;
  iconName: string;
};

export const modulesData: ModuleData[] = [
  { id: "stu", name: "Students", metric: "12.4L Enrolled", route: "/students", iconName: "Users" },
  { id: "uni", name: "Universities", metric: "42 State Universities", route: "/universities", iconName: "Library" },
  { id: "col", name: "Colleges", metric: "2,408 Institutions", route: "/colleges", iconName: "GraduationCap" },
  { id: "lib", name: "Public Libraries", metric: "3,120 Active", route: "/libraries", iconName: "BookOpen" },
  { id: "res", name: "Research", metric: "15.2k Scholars", route: "/research", iconName: "Microscope" },
  { id: "sch", name: "Scholarships", metric: "4.8L Beneficiaries", route: "/scholarships", iconName: "Award" },
];
