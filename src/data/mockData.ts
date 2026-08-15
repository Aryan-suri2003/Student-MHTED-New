import {
  ResearchTheme,
  UniversityOutput,
  GranteeFunding,
  YoYDataPoint,
  CollegeDetail
} from '../types';

export const RESEARCH_THEMES: ResearchTheme[] = [
  {
    id: 'theme-1',
    name: 'Materials Science and Engineering',
    conferencePapers: 12,
    researchGrants: 19,
    publishedPapers: 288,
    grantRatioPercent: 62,
    subThemes: [
      { name: 'Nanomaterials & Polymer Composites', conferencePapers: 5, researchGrants: 8, publishedPapers: 112, leadUniversity: 'Jadavpur University' },
      { name: 'Advanced Metallurgy & Alloys', conferencePapers: 3, researchGrants: 6, publishedPapers: 84, leadUniversity: 'Calcutta University' },
      { name: 'Biomaterials for Tissue Engineering', conferencePapers: 4, researchGrants: 5, publishedPapers: 92, leadUniversity: 'Kalyani University' }
    ]
  },
  {
    id: 'theme-2',
    name: 'Applications of AI and Machine Learning',
    conferencePapers: 166,
    researchGrants: 16,
    publishedPapers: 234,
    grantRatioPercent: 52,
    subThemes: [
      { name: 'Computer Vision & Medical Imaging', conferencePapers: 68, researchGrants: 6, publishedPapers: 98, leadUniversity: 'MAKAUT' },
      { name: 'Natural Language Processing for Indic Scripts', conferencePapers: 42, researchGrants: 4, publishedPapers: 56, leadUniversity: 'Jadavpur University' },
      { name: 'Edge AI & IoT Embedded Systems', conferencePapers: 34, researchGrants: 4, publishedPapers: 48, leadUniversity: 'Bengal Engineering & Science' },
      { name: 'Autonomous Robotics & Drones', conferencePapers: 22, researchGrants: 2, publishedPapers: 32, leadUniversity: 'Presidency University' }
    ]
  },
  {
    id: 'theme-3',
    name: 'Renewable Energy and Storage',
    conferencePapers: 12,
    researchGrants: 12,
    publishedPapers: 119,
    grantRatioPercent: 39,
    subThemes: [
      { name: 'Perovskite Solar Cells & Photovoltaics', conferencePapers: 4, researchGrants: 5, publishedPapers: 45, leadUniversity: 'Calcutta University' },
      { name: 'Solid-State & Sodium-Ion Batteries', conferencePapers: 5, researchGrants: 4, publishedPapers: 42, leadUniversity: 'Jadavpur University' },
      { name: 'Green Hydrogen & Fuel Cells', conferencePapers: 3, researchGrants: 3, publishedPapers: 32, leadUniversity: 'MAKAUT' }
    ]
  },
  {
    id: 'theme-4',
    name: 'Humanities and Social Sciences',
    conferencePapers: 93,
    researchGrants: 31,
    publishedPapers: 113,
    grantRatioPercent: 100,
    subThemes: [
      { name: 'Socio-Economic Policy & Rural Development', conferencePapers: 38, researchGrants: 14, publishedPapers: 48, leadUniversity: 'Visva-Bharati' },
      { name: 'Linguistic Heritage & Cultural Archives', conferencePapers: 28, researchGrants: 9, publishedPapers: 36, leadUniversity: 'Rabindra Bharati University' },
      { name: 'Digital Humanities & Urban Sociology', conferencePapers: 27, researchGrants: 8, publishedPapers: 29, leadUniversity: 'Presidency University' }
    ]
  },
  {
    id: 'theme-5',
    name: 'Healthcare',
    conferencePapers: 19,
    researchGrants: 2,
    publishedPapers: 35,
    grantRatioPercent: 7,
    subThemes: [
      { name: 'Epidemiology & Vector-borne Disease Diagnostics', conferencePapers: 11, researchGrants: 1, publishedPapers: 21, leadUniversity: 'WBUHS' },
      { name: 'Pharmacological Drug Discovery', conferencePapers: 8, researchGrants: 1, publishedPapers: 14, leadUniversity: 'Calcutta University' }
    ]
  },
  {
    id: 'theme-6',
    name: 'Quantum Technology',
    conferencePapers: 1,
    researchGrants: 0,
    publishedPapers: 6,
    grantRatioPercent: 0,
    subThemes: [
      { name: 'Quantum Cryptography & Key Distribution', conferencePapers: 1, researchGrants: 0, publishedPapers: 4, leadUniversity: 'S.N. Bose National Centre / JU' },
      { name: 'Quantum Simulation & Metrology', conferencePapers: 0, researchGrants: 0, publishedPapers: 2, leadUniversity: 'Calcutta University' }
    ]
  }
];

export const UNIVERSITY_OUTPUT_DATA: UniversityOutput[] = [
  { code: 'COEP', fullName: 'COEP Technological University', conferencePapers: 34, researchGrants: 11, publishedPapers: 92, naacGrade: 'A++', type: 'Public', district: 'Kolkata' },
  { code: 'MU', fullName: 'Calcutta University', conferencePapers: 68, researchGrants: 19, publishedPapers: 174, naacGrade: 'A++', type: 'Public', district: 'Kolkata' },
  { code: 'HBSU', fullName: 'Homi Bhabha State University', conferencePapers: 22, researchGrants: 8, publishedPapers: 58, naacGrade: 'A+', type: 'Public', district: 'Howrah' },
  { code: 'SPPU', fullName: 'Savitribai Phule Pune University / State Affiliated', conferencePapers: 78, researchGrants: 17, publishedPapers: 182, naacGrade: 'A++', type: 'Public', district: 'North 24 Parganas' },
  { code: 'BATU', fullName: 'Dr. Babasaheb Ambedkar Tech University', conferencePapers: 29, researchGrants: 7, publishedPapers: 76, naacGrade: 'A', type: 'Public', district: 'Nadia' },
  { code: 'KBCNMU', fullName: 'Kavayitri Bahinabai Chaudhari NMU', conferencePapers: 24, researchGrants: 6, publishedPapers: 64, naacGrade: 'A+', type: 'Public', district: 'Murshidabad' },
  { code: 'PAHSUS', fullName: 'Punya Ahilyadevi Holkar Solapur University', conferencePapers: 18, researchGrants: 4, publishedPapers: 49, naacGrade: 'B++', type: 'Public', district: 'Burdwan' },
  { code: 'SRTMNU', fullName: 'Swami Ramanand Teerth Marathwada University', conferencePapers: 16, researchGrants: 5, publishedPapers: 52, naacGrade: 'B++', type: 'Public', district: 'Hooghly' },
  { code: 'SNDT', fullName: 'SNDT Women\'s University Wing', conferencePapers: 14, researchGrants: 3, publishedPapers: 48, naacGrade: 'A', type: 'Public', district: 'Kolkata' }
];

export const RESEARCH_GRANTS_YOY: YoYDataPoint[] = [
  { year: 2018, value: 8 },
  { year: 2019, value: 29, highlight: true },
  { year: 2020, value: 10 },
  { year: 2021, value: 14 },
  { year: 2022, value: 9 },
  { year: 2023, value: 10 }
];

export const RESEARCH_PAPERS_YOY: YoYDataPoint[] = [
  { year: 2018, value: 104 },
  { year: 2019, value: 121 },
  { year: 2020, value: 78 },
  { year: 2021, value: 99 },
  { year: 2022, value: 101 },
  { year: 2023, value: 178, highlight: true },
  { year: 2024, value: 114 }
];

export const GRANTEE_FUNDING_DATA: GranteeFunding[] = [
  { name: 'MHRD, GOI, New Delhi', amount: 32730714, amountFormatted: '3,27,30,714', projectCount: 28, category: 'Central Govt' },
  { name: 'UGC', amount: 13153170, amountFormatted: '1,31,53,170', projectCount: 16, category: 'Central Govt' },
  { name: 'SERB', amount: 11998000, amountFormatted: '1,19,98,000', projectCount: 14, category: 'Central Govt' },
  { name: 'DST', amount: 11658000, amountFormatted: '1,16,58,000', projectCount: 12, category: 'Central Govt' },
  { name: 'CEFIPRA', amount: 9508552, amountFormatted: '95,08,552', projectCount: 5, category: 'International' },
  { name: 'ICSSR', amount: 4857761, amountFormatted: '48,57,761', projectCount: 8, category: 'Central Govt' },
  { name: 'DST-CURIE', amount: 4392000, amountFormatted: '43,92,000', projectCount: 4, category: 'Central Govt' },
  { name: 'RGSTC', amount: 3855000, amountFormatted: '38,55,000', projectCount: 3, category: 'State Govt' },
  { name: 'University Grants Commission', amount: 2318853, amountFormatted: '23,18,853', projectCount: 2, category: 'Central Govt' },
  { name: 'Swedish Research Council', amount: 1800000, amountFormatted: '18,00,000', projectCount: 1, category: 'International' }
];

export const NAAC_CAMPUS_DISTRIBUTION = [
  { grade: 'A++', count: 15, universities: ['Calcutta University', 'Jadavpur University', 'MAKAUT', 'Presidency University', 'Kalyani University'] },
  { grade: 'A+', count: 5, universities: ['Burdwan University', 'Vidyasagar University', 'North Bengal University'] },
  { grade: 'A', count: 3, universities: ['Gour Banga University', 'Kazi Nazrul University', 'Cooch Behar Panchanan Barma University'] },
  { grade: 'B++', count: 3, universities: ['Raiganj University', 'Bankura University', 'Sidho Kanho Birsha University'] }
];

export const NAAC_COLLEGE_DISTRIBUTION = [
  { grade: 'A++', count: 210 },
  { grade: 'A+', count: 580 },
  { grade: 'A', count: 1420 },
  { grade: 'B++', count: 1490 },
  { grade: 'B+', count: 2150 },
  { grade: 'B', count: 2840 },
  { grade: 'C++', count: 65 },
  { grade: 'C+', count: 45 }
];

export const DISTRICTS_LIST = [
  'All Districts',
  'Kolkata',
  'Howrah',
  'North 24 Parganas',
  'South 24 Parganas',
  'Hooghly',
  'Paschim Bardhaman',
  'Purba Bardhaman',
  'Nadia',
  'Murshidabad',
  'Darjeeling',
  'Jalpaiguri',
  'Malda'
];

export const UNIVERSITY_LIST = [
  'All Universities',
  'Calcutta University (CU)',
  'Jadavpur University (JU)',
  'Presidency University (PU)',
  'Maulana Abul Kalam Azad University of Tech (MAKAUT)',
  'University of Kalyani (KU)',
  'University of Burdwan (BU)',
  'Vidyasagar University (VU)',
  'University of North Bengal (NBU)',
  'Rabindra Bharati University (RBU)',
  'West Bengal State University (WBSU)',
  'West Bengal University of Health Sciences (WBUHS)'
];

export const COLLEGE_TYPES = [
  'All Types',
  'Government Degree College',
  'Government Aided College',
  'Private Autonomous College',
  'Government Polytechnic Institute',
  'Private Polytechnic Institute',
  'Constituent College'
];

export const SAMPLE_COLLEGES: CollegeDetail[] = [
  { id: 'c-1', name: 'St. Xavier\'s College (Autonomous)', code: 'SXCA-KOL', university: 'Calcutta University', district: 'Kolkata', type: 'Government Aided College', naacGrade: 'A++', nirfRank: 5, femaleHostels: 3, maleHostels: 2, playgrounds: 2, mousCount: 48 },
  { id: 'c-2', name: 'Presidency College Campus Wing', code: 'PCW-KOL', university: 'Presidency University', district: 'Kolkata', type: 'Constituent College', naacGrade: 'A++', nirfRank: 12, femaleHostels: 2, maleHostels: 2, playgrounds: 1, mousCount: 35 },
  { id: 'c-3', name: 'Bethune College', code: 'BC-KOL', university: 'Calcutta University', district: 'Kolkata', type: 'Government Degree College', naacGrade: 'A+', nirfRank: 74, femaleHostels: 2, maleHostels: 0, playgrounds: 1, mousCount: 18 },
  { id: 'c-4', name: 'Scottish Church College', code: 'SCC-KOL', university: 'Calcutta University', district: 'Kolkata', type: 'Government Aided College', naacGrade: 'A', nirfRank: 98, femaleHostels: 1, maleHostels: 1, playgrounds: 1, mousCount: 22 },
  { id: 'c-5', name: 'Asutosh College', code: 'AC-KOL', university: 'Calcutta University', district: 'South 24 Parganas', type: 'Government Aided College', naacGrade: 'A', nirfRank: 110, femaleHostels: 1, maleHostels: 1, playgrounds: 1, mousCount: 15 },
  { id: 'c-6', name: 'Central Calcutta Polytechnic', code: 'CCP-01', university: 'State Board', district: 'Kolkata', type: 'Government Polytechnic Institute', naacGrade: 'B++', nirfRank: undefined, femaleHostels: 1, maleHostels: 1, playgrounds: 1, mousCount: 12 },
  { id: 'c-7', name: 'North Calcutta Polytechnic', code: 'NCP-02', university: 'State Board', district: 'North 24 Parganas', type: 'Government Polytechnic Institute', naacGrade: 'B+', nirfRank: undefined, femaleHostels: 1, maleHostels: 2, playgrounds: 1, mousCount: 9 },
  { id: 'c-8', name: 'Barasat Government College', code: 'BGC-N24', university: 'West Bengal State University', district: 'North 24 Parganas', type: 'Government Degree College', naacGrade: 'A', nirfRank: 142, femaleHostels: 2, maleHostels: 1, playgrounds: 2, mousCount: 14 }
];

import { GroupedMetricData, MetricData } from '../types';

export const DASHBOARD_METRICS: Record<string, GroupedMetricData | MetricData> = {
  totalUniversities: {
    metric: 'universityType',
    total: 36,
    parts: [
      { metric: 'statePublic', label: 'State Public', value: 21, previousYearValue: 20, deltaPercent: 5.0 },
      { metric: 'statePrivate', label: 'State Private', value: 9, previousYearValue: 8, deltaPercent: 12.5 },
      { metric: 'deemed', label: 'Deemed to be', value: 4, previousYearValue: 4, deltaPercent: 0 },
      { metric: 'stateBoard', label: 'State Board', value: 1, previousYearValue: 1, deltaPercent: 0 }
    ]
  },
  collegesPolytechnics: {
    metric: 'collegesType',
    total: 8064,
    parts: [
      { metric: 'colleges', label: 'Colleges', value: 7377, previousYearValue: 7200, deltaPercent: 2.5 },
      { metric: 'polytechnics', label: 'Polytechnics', value: 687, previousYearValue: 650, deltaPercent: 5.7 }
    ]
  },
  hostelsCampus: {
    metric: 'hostels',
    total: 1858,
    parts: [
      { metric: 'femaleHostels', label: 'Female Hostels', value: 984, previousYearValue: 940, deltaPercent: 4.7 },
      { metric: 'maleHostels', label: 'Male Hostels', value: 874, previousYearValue: 860, deltaPercent: 1.6 }
    ]
  },
  hostelsAffiliation: {
    metric: 'hostels',
    total: 9444,
    parts: [
      { label: 'Female Hostels', value: 5650, deltaPercent: 4.6 },
      { label: 'Male Hostels', value: 3794, deltaPercent: 1.2 }
    ]
  },
  mousCampus: {
    metric: 'mous',
    total: 1140,
    parts: [
      { metric: 'industry', label: 'Industry Partnerships', value: 765, previousYearValue: 700, deltaPercent: 9.3 },
      { metric: 'international', label: 'International University MoUs', value: 124, previousYearValue: 110, deltaPercent: 12.7 },
      { metric: 'domestic', label: 'Domestic University MoUs', value: 251, previousYearValue: 240, deltaPercent: 4.6 }
    ]
  },
  mousAffiliation: {
    metric: 'mous',
    total: 48991,
    parts: [
      { metric: 'industry', label: 'MoUs with Industries', value: 27321, previousYearValue: 25000, deltaPercent: 9.3 },
      { metric: 'international', label: 'International University MoUs', value: 1132, previousYearValue: 1000, deltaPercent: 13.2 },
      { metric: 'domestic', label: 'Domestic University MoUs', value: 20538, previousYearValue: 19500, deltaPercent: 5.3 }
    ]
  },
  nirfRanking: {
    metric: 'nirfRanking',
    value: 155,
    previousYearValue: 140,
    deltaPercent: 10.7
  },
  journalPapers: {
    metric: 'journalPapers',
    value: 795,
    previousYearValue: 700,
    deltaPercent: 13.6
  },
  conferencePapers: {
    metric: 'conferencePapers',
    value: 303,
    previousYearValue: 320,
    deltaPercent: -5.3
  },
  researchGrants: {
    metric: 'researchGrants',
    value: 80,
    previousYearValue: 80,
    deltaPercent: 0
  },
  // Miscellaneous Standalone Metrics for DeltaIndicator
  collegesCenters: { metric: 'collegesCenters', value: 577, previousYearValue: 560, deltaPercent: 3.0 },
  subCenters: { metric: 'subCenters', value: 7, previousYearValue: 7, deltaPercent: 0 },
  incubationCenters: { metric: 'incubationCenters', value: 22, previousYearValue: 18, deltaPercent: 22.2 },
  playgrounds: { metric: 'playgrounds', value: 27, previousYearValue: 27, deltaPercent: 0 },
  centralLibraries: { metric: 'centralLibraries', value: 333, previousYearValue: 320, deltaPercent: 4.1 },
  researchCenters: { metric: 'researchCenters', value: 27, previousYearValue: 25, deltaPercent: 8.0 },
  placementCells: { metric: 'placementCells', value: 27, previousYearValue: 24, deltaPercent: 12.5 },
  meetingRooms: { metric: 'meetingRooms', value: 432, previousYearValue: null, deltaPercent: null }, // Simulating missing previous year
  playgroundsAffiliation: { metric: 'playgroundsAffiliation', value: 2758, previousYearValue: 2700, deltaPercent: 2.1 },
  centralLibrariesAffiliation: { metric: 'centralLibrariesAffiliation', value: 351, previousYearValue: 345, deltaPercent: 1.7 },
  placementCellsAffiliation: { metric: 'placementCellsAffiliation', value: 3871, previousYearValue: 3700, deltaPercent: 4.6 },
};

// District Map Data (Mock API)
export const getDistrictCampusData = async () => {
  // Simulating 19 districts based on 2011 boundaries
  const districts = [
    { districtId: 'Bankura', name: 'Bankura', count: 12, previousCount: 11, universities: [{ name: 'Bankura University', type: 'State Public' }, { name: 'Bankura Sammilani', type: 'State Board' }] },
    { districtId: 'Barddhaman', name: 'Barddhaman', count: 18, previousCount: 15, universities: [{ name: 'Burdwan University', type: 'State Public' }, { name: 'Kazi Nazrul University', type: 'State Public' }] },
    { districtId: 'Birbhum', name: 'Birbhum', count: 8, previousCount: 8, universities: [{ name: 'Visva-Bharati', type: 'State Public' }] },
    { districtId: 'Dakshin Dinajpur', name: 'Dakshin Dinajpur', count: 0, previousCount: 0, universities: [] },
    { districtId: 'Darjiling', name: 'Darjiling', count: 5, previousCount: 4, universities: [{ name: 'North Bengal University', type: 'State Public' }] },
    { districtId: 'East Midnapore', name: 'East Midnapore', count: 7, previousCount: 7, universities: [{ name: 'Vidyasagar University', type: 'State Public' }] },
    { districtId: 'Haora', name: 'Haora', count: 10, previousCount: 9, universities: [{ name: 'IIEST Shibpur', type: 'Deemed' }] },
    { districtId: 'Hugli', name: 'Hugli', count: 6, previousCount: 5, universities: [{ name: 'Hooghly Mohsin College', type: 'State Board' }] },
    { districtId: 'Jalpaiguri', name: 'Jalpaiguri', count: 4, previousCount: 4, universities: [{ name: 'Jalpaiguri Govt Engineering', type: 'State Board' }] },
    { districtId: 'Kochbihar', name: 'Kochbihar', count: 3, previousCount: 2, universities: [{ name: 'Cooch Behar Panchanan Barma', type: 'State Public' }] },
    { districtId: 'Kolkata', name: 'Kolkata', count: 45, previousCount: 42, universities: [{ name: 'University of Calcutta', type: 'State Public' }, { name: 'Jadavpur University', type: 'State Public' }, { name: 'Presidency University', type: 'State Public' }, { name: 'Adamas University', type: 'State Private' }] },
    { districtId: 'Maldah', name: 'Maldah', count: 5, previousCount: 5, universities: [{ name: 'University of Gour Banga', type: 'State Public' }] },
    { districtId: 'Murshidabad', name: 'Murshidabad', count: 4, previousCount: 3, universities: [{ name: 'Murshidabad University', type: 'State Public' }] },
    { districtId: 'Nadia', name: 'Nadia', count: 11, previousCount: 10, universities: [{ name: 'Kalyani University', type: 'State Public' }, { name: 'BCKV', type: 'State Public' }] },
    { districtId: 'North 24 Parganas', name: 'North 24 Parganas', count: 22, previousCount: 20, universities: [{ name: 'West Bengal State University', type: 'State Public' }, { name: 'Brainware University', type: 'State Private' }] },
    { districtId: 'Puruliya', name: 'Puruliya', count: 3, previousCount: 3, universities: [{ name: 'Sidho Kanho Birsha University', type: 'State Public' }] },
    { districtId: 'South 24 Parganas', name: 'South 24 Parganas', count: 14, previousCount: 13, universities: [{ name: 'Diamond Harbour Women\'s', type: 'State Public' }, { name: 'Neotia University', type: 'State Private' }] },
    { districtId: 'Uttar Dinajpur', name: 'Uttar Dinajpur', count: 2, previousCount: 2, universities: [{ name: 'Raiganj University', type: 'State Public' }] },
    { districtId: 'West Midnapore', name: 'West Midnapore', count: 9, previousCount: 8, universities: [{ name: 'IIT Kharagpur', type: 'Deemed' }] }
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(districts);
    }, 500);
  });
};
