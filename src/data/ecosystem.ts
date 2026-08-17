// src/data/ecosystem.ts

export type NodeData = {
  id: string;
  name: string;
  category: number;
  value: number; // For node size
  route: string;
};

export type EdgeData = {
  source: string;
  target: string;
};

export const ecosystemData = {
  nodes: [
    { id: "HE", name: "Higher Education", category: 0, value: 100, route: "/" },
    { id: "UNI", name: "Universities", category: 1, value: 50, route: "/universities" },
    { id: "COL", name: "Colleges", category: 1, value: 60, route: "/colleges" },
    { id: "STU", name: "Students", category: 2, value: 80, route: "/students" },
    { id: "FAC", name: "Faculty", category: 2, value: 40, route: "/faculty" },
    { id: "RES", name: "Research", category: 3, value: 30, route: "/research" },
    { id: "SCH", name: "Scholarships", category: 4, value: 35, route: "/scholarships" },
    { id: "LIB", name: "Libraries", category: 5, value: 25, route: "/libraries" },
  ] as NodeData[],
  links: [
    { source: "HE", target: "UNI" },
    { source: "HE", target: "COL" },
    { source: "UNI", target: "STU" },
    { source: "COL", target: "STU" },
    { source: "UNI", target: "FAC" },
    { source: "COL", target: "FAC" },
    { source: "UNI", target: "RES" },
    { source: "HE", target: "SCH" },
    { source: "SCH", target: "STU" },
    { source: "HE", target: "LIB" },
    { source: "LIB", target: "STU" },
    { source: "LIB", target: "RES" },
  ] as EdgeData[]
};
