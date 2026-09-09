/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  HigherInstitution,
  Faculty,
  DegreeCourse,
  StudentScoreProfile,
  SelectedInstitutionPlan,
} from '../types';

export const DEFAULT_STUDENT_SCORE_PROFILE: StudentScoreProfile = {
  studentName: 'Chidi Okonkwo',
  entranceExamScore: 284, // out of 400
  gpa: 3.82,
  highSchoolSubjects: [
    { subject: 'English Language', grade: 'B2', passed: true },
    { subject: 'Mathematics', grade: 'A1', passed: true },
    { subject: 'Physics', grade: 'A1', passed: true },
    { subject: 'Chemistry', grade: 'B2', passed: true },
    { subject: 'Biology', grade: 'B3', passed: true },
    { subject: 'Further Mathematics', grade: 'B3', passed: true },
    { subject: 'Economics', grade: 'C4', passed: true },
    { subject: 'Civic Education', grade: 'A1', passed: true },
  ],
  primaryInterest: 'Artificial Intelligence & Software Systems',
  targetCareer: 'Cloud Solutions Architect & AI Systems Engineer',
  preferredStateOrCity: 'Lagos / Abuja / Nsukka',
  maxBudgetPerYear: '₦400,000 - ₦850,000',
  preferredInstitutionType: 'All Types',
};

export const SAMPLE_STUDENT_PROFILES: StudentScoreProfile[] = [
  DEFAULT_STUDENT_SCORE_PROFILE,
  {
    studentName: 'Amina Yusuf',
    entranceExamScore: 312,
    gpa: 3.95,
    highSchoolSubjects: [
      { subject: 'English Language', grade: 'A1', passed: true },
      { subject: 'Mathematics', grade: 'A1', passed: true },
      { subject: 'Physics', grade: 'A1', passed: true },
      { subject: 'Chemistry', grade: 'A1', passed: true },
      { subject: 'Biology', grade: 'A1', passed: true },
      { subject: 'Further Mathematics', grade: 'B2', passed: true },
    ],
    primaryInterest: 'Medicine, Surgery & Biomedical Tech',
    targetCareer: 'Neurosurgeon & Medical Researcher',
    preferredStateOrCity: 'Ibadan / Lagos',
    maxBudgetPerYear: 'Subsidized Federal Rates',
    preferredInstitutionType: 'Federal University',
  },
  {
    studentName: 'Babatunde Adeleke',
    entranceExamScore: 246,
    gpa: 3.45,
    highSchoolSubjects: [
      { subject: 'English Language', grade: 'B3', passed: true },
      { subject: 'Mathematics', grade: 'B2', passed: true },
      { subject: 'Physics', grade: 'C4', passed: true },
      { subject: 'Chemistry', grade: 'C5', passed: true },
      { subject: 'Technical Drawing', grade: 'A1', passed: true },
      { subject: 'Economics', grade: 'B2', passed: true },
    ],
    primaryInterest: 'Mechanical Engineering & Mechatronics',
    targetCareer: 'Automotive & Robotics Engineer',
    preferredStateOrCity: 'Ogun / Lagos',
    maxBudgetPerYear: '₦1,200,000 - ₦2,000,000',
    preferredInstitutionType: 'Private University',
  },
];

export const HIGHER_INSTITUTIONS: HigherInstitution[] = [
  {
    id: 'inst-unizik',
    name: 'Nnamdi Azikiwe University',
    shortName: 'UNIZIK',
    type: 'Federal University',
    establishedYear: 1991,
    location: {
      city: 'Awka',
      stateCountry: 'Anambra State, Nigeria',
      campusSize: '1,500 Acres',
    },
    nationalRanking: 7,
    accreditationStatus: 'Fully Accredited by NUC, COREN & MDCN',
    acceptanceRate: 18,
    annualTuitionEstimate: '₦90,000 - ₦180,000 / year (Federal Subsidized)',
    tuitionCategory: 'Low / Subsidized',
    totalStudents: 45000,
    studentFacultyRatio: '19:1',
    facultiesCount: 14,
    degreeProgramsCount: 78,
    overview:
      'Nnamdi Azikiwe University (UNIZIK) is named after the first President of Nigeria, Dr. Nnamdi Azikiwe. Located in the historic Anambra state capital Awka, UNIZIK is renowned for its distinguished faculties of Physical Sciences, Engineering, College of Health Sciences in Nnewi, and vibrant entrepreneurship development.',
    facilities: [
      'Digital Incubation & Computing Laboratory',
      'Nnamdi Azikiwe University Teaching Hospital (NAUTH Nnewi)',
      'Festus Aghagbo Nwako Central Library',
      'Chike Okoli Centre for Entrepreneurial Studies',
      'Advanced Engineering Mechanical & ECE Workshop',
    ],
    popularCourses: [
      'Computer Science',
      'Electronic & Computer Engineering',
      'Medicine & Surgery (MBBS)',
      'Nursing Science',
      'Accountancy',
    ],
    admissionPortalUrl: 'https://unizik.edu.ng/admissions',
    contactEmail: 'info@unizik.edu.ng',
    rating: 4.75,
  },
  {
    id: 'inst-coou',
    name: 'Chukwuemeka Odumegwu Ojukwu University',
    shortName: 'COOU',
    type: 'State University',
    establishedYear: 2000,
    location: {
      city: 'Uli & Igbariam',
      stateCountry: 'Anambra State, Nigeria',
      campusSize: '1,100 Acres',
    },
    nationalRanking: 12,
    accreditationStatus: 'Fully Accredited by NUC & COREN',
    acceptanceRate: 24,
    annualTuitionEstimate: '₦135,000 - ₦240,000 / year',
    tuitionCategory: 'Moderate',
    totalStudents: 32000,
    studentFacultyRatio: '21:1',
    facultiesCount: 10,
    degreeProgramsCount: 62,
    overview:
      'Chukwuemeka Odumegwu Ojukwu University (formerly ANSU) is Anambra State’s flagship multi-campus university. With campuses in Uli (Engineering & Physical Sciences), Igbariam (Social & Management Sciences), and Awka (College of Health Sciences at COOUTH Amaku), COOU offers rigorous academic and professional degrees.',
    facilities: [
      'COOU Teaching Hospital Complex (COOUTH Amaku, Awka)',
      'Uli Campus Engineering & Robotics Innovation Hub',
      'Central E-Library & Learning Commons',
      'Agricultural Demonstration & Research Farm',
      'Moot Court & Law Practice Amphitheatre',
    ],
    popularCourses: [
      'Computer Science',
      'Electrical & Electronics Engineering',
      'Mechanical Engineering',
      'Medicine & Surgery (MBBS)',
      'Business Administration',
    ],
    admissionPortalUrl: 'https://coou.edu.ng/admissions',
    contactEmail: 'admissions@coou.edu.ng',
    rating: 4.6,
  },
  {
    id: 'inst-unn',
    name: 'University of Nigeria, Nsukka',
    shortName: 'UNN',
    type: 'Federal University',
    establishedYear: 1960,
    location: {
      city: 'Nsukka & Enugu',
      stateCountry: 'Enugu State, Nigeria',
      campusSize: '2,600 Acres',
    },
    nationalRanking: 2,
    accreditationStatus: 'Fully Accredited by NUC, COREN, MDCN & WHO',
    acceptanceRate: 12,
    annualTuitionEstimate: '₦110,000 - ₦220,000 / year (Federal Subsidized)',
    tuitionCategory: 'Low / Subsidized',
    totalStudents: 50000,
    studentFacultyRatio: '16:1',
    facultiesCount: 15,
    degreeProgramsCount: 102,
    overview:
      'The University of Nigeria, Nsukka (UNN) was founded by Dr. Nnamdi Azikiwe in 1960 as Nigeria’s first indigenous federal university. With its main campus at Nsukka and the College of Medicine and Business at UNEC / Ituku-Ozalla, UNN is celebrated for the motto "To Restore the Dignity of Man" and exceptional research citations.',
    facilities: [
      'Nnamdi Azikiwe Central Research Library',
      'Roar Nigeria Hub (Flagship Tech Incubator)',
      'University of Nigeria Teaching Hospital (UNTH Ituku-Ozalla)',
      'Faculty of Engineering Advanced Research Labs',
      'National Centre for Energy Research and Development',
    ],
    popularCourses: [
      'Law (LL.B)',
      'Medicine & Surgery (MBBS)',
      'Computer Science',
      'Electronic Engineering',
      'Pharmacy (Pharm.D)',
      'Accountancy',
    ],
    admissionPortalUrl: 'https://unn.edu.ng/admissions',
    contactEmail: 'admissions@unn.edu.ng',
    rating: 4.9,
  },
  {
    id: 'inst-unilag',
    name: 'University of Lagos',
    shortName: 'UNILAG',
    type: 'Federal University',
    establishedYear: 1962,
    location: {
      city: 'Akoka, Yaba, Lagos',
      stateCountry: 'Lagos State, Nigeria',
      campusSize: '802 Acres (Lagoon-front)',
    },
    nationalRanking: 1,
    accreditationStatus: 'Fully Accredited by NUC & COREN',
    acceptanceRate: 14,
    annualTuitionEstimate: '₦120,000 - ₦240,000 / year (Federal Subsidized)',
    tuitionCategory: 'Low / Subsidized',
    totalStudents: 57000,
    studentFacultyRatio: '18:1',
    facultiesCount: 12,
    degreeProgramsCount: 88,
    overview:
      'The University of Lagos (UNILAG) is a world-class federal research university situated on the scenic shores of the Lagos Lagoon. Nationally recognized for pioneering research in computing, biomedical sciences, business, and maritime engineering, UNILAG is the premier choice for tech innovators and industry leaders.',
    facilities: [
      'Innovation & Robotics Technology Hub',
      'Central High-Performance Research Lab',
      'Medical Center & Teaching Hospital (LUTH)',
      '24/7 Digital e-Library with IEEE access',
      'Lagoon-front Sports Complex & Olympic Pool',
    ],
    popularCourses: [
      'Computer Science',
      'Medicine & Surgery',
      'Mechanical Engineering',
      'Systems Engineering',
      'Accounting',
    ],
    admissionPortalUrl: 'https://admissions.unilag.edu.ng',
    contactEmail: 'admissions@unilag.edu.ng',
    rating: 4.8,
  },
  {
    id: 'inst-ui',
    name: 'University of Ibadan',
    shortName: 'UI',
    type: 'Federal University',
    establishedYear: 1948,
    location: {
      city: 'Ibadan',
      stateCountry: 'Oyo State, Nigeria',
      campusSize: '2,550 Acres',
    },
    nationalRanking: 2,
    accreditationStatus: 'Fully Accredited by NUC, WHO, & COREN',
    acceptanceRate: 11,
    annualTuitionEstimate: '₦130,000 - ₦260,000 / year (Federal Subsidized)',
    tuitionCategory: 'Low / Subsidized',
    totalStudents: 42000,
    studentFacultyRatio: '15:1',
    facultiesCount: 16,
    degreeProgramsCount: 112,
    overview:
      'As Nigeria’s premier university, the University of Ibadan possesses an unmatched academic heritage, world-class faculty citations, and the prestigious College of Medicine. Known for intense academic rigor, UI produces top-tier scientists, jurists, and software architects globally.',
    facilities: [
      'Kenneth Dike Central Research Library',
      'College of Medicine & UCH Tertiary Center',
      'Advanced Molecular Biology & Genomic Lab',
      'Zoological & Botanical Research Gardens',
      'Solar-powered STEM lecture theaters',
    ],
    popularCourses: [
      'Medicine & Surgery',
      'Computer Science',
      'Electrical & Electronics Engineering',
      'Law',
      'Pharmacy',
    ],
    admissionPortalUrl: 'https://ui.edu.ng/admissions',
    contactEmail: 'academic@ui.edu.ng',
    rating: 4.9,
  },
  {
    id: 'inst-covenant',
    name: 'Covenant University',
    shortName: 'CU',
    type: 'Private University',
    establishedYear: 2002,
    location: {
      city: 'Ota',
      stateCountry: 'Ogun State, Nigeria',
      campusSize: '1,200 Acres (Canaanland)',
    },
    nationalRanking: 3,
    accreditationStatus: 'NUC, Times Higher Education Ranked #1 in West Africa',
    acceptanceRate: 22,
    annualTuitionEstimate: '₦1,150,000 - ₦1,850,000 / year',
    tuitionCategory: 'Private / Premium',
    totalStudents: 15000,
    studentFacultyRatio: '12:1',
    facultiesCount: 4,
    degreeProgramsCount: 36,
    overview:
      'Covenant University is a leading private Christian institution consistently ranked among the top African universities by Times Higher Education. Renowned for zero academic calendar disruptions, mandatory entrepreneurship training, cutting-edge computing laboratories, and high graduate employability.',
    facilities: [
      'Centre for Systems and Information Services (CSIS)',
      'Smart AI & Cloud Computing Sandbox',
      'Covenant University Research Center',
      'Ultra-modern air-conditioned smart halls',
      'High-speed fiber optic Wi-Fi across campus',
    ],
    popularCourses: [
      'Computer Science',
      'Software Engineering',
      'Information & Comm. Technology',
      'Mechanical Engineering',
      'Economics',
    ],
    admissionPortalUrl: 'https://admportal.covenantuniversity.edu.ng',
    contactEmail: 'admissions@covenantuniversity.edu.ng',
    rating: 4.85,
  },
  {
    id: 'inst-futa',
    name: 'Federal University of Technology, Akure',
    shortName: 'FUTA',
    type: 'Institute of Technology',
    establishedYear: 1981,
    location: {
      city: 'Akure',
      stateCountry: 'Ondo State, Nigeria',
      campusSize: '1,400 Acres',
    },
    nationalRanking: 4,
    accreditationStatus: 'Fully Accredited by NUC & COREN Technology Council',
    acceptanceRate: 19,
    annualTuitionEstimate: '₦95,000 - ₦190,000 / year (Federal Subsidized)',
    tuitionCategory: 'Low / Subsidized',
    totalStudents: 28000,
    studentFacultyRatio: '20:1',
    facultiesCount: 8,
    degreeProgramsCount: 52,
    overview:
      'FUTA is Nigeria’s flagship technological university with the motto "Technology for Self Reliance". Famous for hands-on engineering, software engineering hackathons, cybersecurity centers, and aerospace tech.',
    facilities: [
      'Centre for Space Research and Applications',
      'Software Innovation and Incubation Lab',
      'Engineering Heavy Machinery Workshop',
      'Meteorological Observation Station',
      'FabLab Digital Prototyping Workshop',
    ],
    popularCourses: [
      'Computer Engineering',
      'Software Engineering',
      'Cybersecurity Science',
      'Civil Engineering',
      'Meteorology',
    ],
    admissionPortalUrl: 'https://futa.edu.ng/admissions',
    contactEmail: 'registrar@futa.edu.ng',
    rating: 4.7,
  },
  {
    id: 'inst-lasu',
    name: 'Lagos State University',
    shortName: 'LASU',
    type: 'State University',
    establishedYear: 1983,
    location: {
      city: 'Ojo, Lagos',
      stateCountry: 'Lagos State, Nigeria',
      campusSize: '650 Acres',
    },
    nationalRanking: 5,
    accreditationStatus: 'NUC Accredited, Global Times Higher Education Ranked',
    acceptanceRate: 26,
    annualTuitionEstimate: '₦150,000 - ₦320,000 / year',
    tuitionCategory: 'Moderate',
    totalStudents: 35000,
    studentFacultyRatio: '22:1',
    facultiesCount: 11,
    degreeProgramsCount: 70,
    overview:
      'Lagos State University is a high-performing state-funded research institution situated in the commercial capital. Celebrated for its world-class Faculty of Science, College of Medicine, and rapid digital transformation of student learning portals.',
    facilities: [
      'LASU World Bank Africa Centre of Excellence for STEM',
      'Digital Learning & Multimedia Studio',
      'College of Medicine Clinical Labs (LASUTH)',
      'Moot Court and Law Practice Chambers',
      'Entrepreneurship Development Centre',
    ],
    popularCourses: [
      'Computer Science',
      'Business Administration',
      'Mass Communication',
      'Law',
      'Microbiology',
    ],
    admissionPortalUrl: 'https://admissions.lasu.edu.ng',
    contactEmail: 'support@lasu.edu.ng',
    rating: 4.6,
  },
  {
    id: 'inst-yabatech',
    name: 'Yaba College of Technology',
    shortName: 'YABATECH',
    type: 'Polytechnic / Tech College',
    establishedYear: 1947,
    location: {
      city: 'Yaba, Lagos',
      stateCountry: 'Lagos State, Nigeria',
      campusSize: '150 Acres',
    },
    nationalRanking: 6,
    accreditationStatus: 'NBTE Certified, Premier Polytechnic in West Africa',
    acceptanceRate: 31,
    annualTuitionEstimate: '₦75,000 - ₦150,000 / year (Subsidized)',
    tuitionCategory: 'Low / Subsidized',
    totalStudents: 22000,
    studentFacultyRatio: '19:1',
    facultiesCount: 8,
    degreeProgramsCount: 45,
    overview:
      'Yaba College of Technology is Nigeria’s premier polytechnic and a national leader in practical, hands-on technological training. Renowned for its direct feeder pipeline to Nigeria’s Silicon Valley (Yaba Tech Cluster).',
    facilities: [
      'Yaba IT Innovation Incubation Hub',
      'Mechanical and Fabrication Center',
      'Modern Architectural Design Studios',
      'Food Technology Quality Testing Plant',
      'Electrical Power Grid Simulators',
    ],
    popularCourses: [
      'Computer Engineering (ND/HND/B.Tech)',
      'Electrical Electronics',
      'Architecture',
      'Science Laboratory Technology',
      'Accountancy',
    ],
    admissionPortalUrl: 'https://yabatech.edu.ng/admissions',
    contactEmail: 'admissions@yabatech.edu.ng',
    rating: 4.65,
  },
];

export const FACULTIES_DATA: Faculty[] = [
  // UNILAG FACULTIES
  {
    id: 'fac-unilag-science',
    institutionId: 'inst-unilag',
    institutionName: 'University of Lagos',
    name: 'Faculty of Science',
    shortCode: 'FOS',
    iconName: 'Cpu',
    deanName: 'Prof. Elijah Babatunde',
    deanTitle: 'Dean & Chair of Applied Computational Sciences',
    description:
      'Home to world-class departments in Computer Science, Mathematics, Physics, and Chemistry with active industry pipelines to leading fintechs and multinational tech companies.',
    departments: [
      'Computer Sciences',
      'Mathematics & Statistics',
      'Physics',
      'Chemistry',
      'Geosciences',
    ],
    researchStrengths: [
      'Machine Learning & African NLP',
      'Applied Cryptography',
      'Computational Fluid Dynamics',
      'Renewable Energy Materials',
    ],
    laboratories: [
      'Artificial Intelligence Research Lab',
      'Cybersecurity & Network Testing Lab',
      'Advanced Spectrophotometry Lab',
    ],
    totalEnrollment: 6500,
    industryPartners: ['Google Africa', 'Microsoft ADC', 'Interswitch', 'Paystack'],
  },
  {
    id: 'fac-unilag-eng',
    institutionId: 'inst-unilag',
    institutionName: 'University of Lagos',
    name: 'Faculty of Engineering',
    shortCode: 'FOE',
    iconName: 'Cog',
    deanName: 'Prof. Folashade Ogundipe',
    deanTitle: 'Dean & Professor of Systems Engineering',
    description:
      'Accredited by COREN, this faculty produces the nation’s top mechanical, electrical, chemical, and civil engineers with rigorous hands-on prototyping and systems engineering.',
    departments: [
      'Systems Engineering',
      'Mechanical Engineering',
      'Electrical & Electronics Engineering',
      'Civil & Environmental Engineering',
      'Chemical & Petroleum Engineering',
    ],
    researchStrengths: [
      'Smart Grid Infrastructure',
      'Autonomous Vehicle Subsystems',
      'Structural Coastal Engineering',
    ],
    laboratories: [
      'Robotics & Automation Workshop',
      'Materials Testing Heavy Lab',
      'High-Voltage Systems Studio',
    ],
    totalEnrollment: 7200,
    industryPartners: ['Chevron', 'Shell', 'Siemens', 'Dangote Group'],
  },
  {
    id: 'fac-unilag-med',
    institutionId: 'inst-unilag',
    institutionName: 'University of Lagos',
    name: 'College of Medicine (Faculty of Clinical Sciences)',
    shortCode: 'CMUL',
    iconName: 'HeartPulse',
    deanName: 'Prof. David Olusanya',
    deanTitle: 'Provost, College of Medicine',
    description:
      'Affiliated with Lagos University Teaching Hospital (LUTH), training the nation’s foremost medical doctors, surgeons, dental practitioners, and biomedical researchers.',
    departments: [
      'Medicine & Surgery',
      'Dentistry',
      'Physiotherapy',
      'Medical Laboratory Science',
      'Nursing Science',
    ],
    researchStrengths: [
      'Tropical Infectious Diseases',
      'Cardiothoracic Surgery Techniques',
      'Epidemiology & Genomic Tracking',
    ],
    laboratories: [
      'LUTH Clinical Diagnostic Lab',
      'Molecular Genetics Sequencing Core',
      'Surgical Simulation Center',
    ],
    totalEnrollment: 4800,
    industryPartners: ['WHO', 'CDC', 'Pfizer', 'Lagos State Ministry of Health'],
  },
  {
    id: 'fac-unilag-mgmt',
    institutionId: 'inst-unilag',
    institutionName: 'University of Lagos',
    name: 'Faculty of Management Sciences',
    shortCode: 'FMS',
    iconName: 'Briefcase',
    deanName: 'Prof. Victoria Adeleke',
    deanTitle: 'Dean of Management & Financial Studies',
    description:
      'Premier hub for corporate finance, investment banking, actuarial science, and strategic business consulting, positioned next to the Lagos financial district.',
    departments: [
      'Accounting',
      'Banking & Finance',
      'Actuarial Science & Insurance',
      'Business Administration',
    ],
    researchStrengths: [
      'Fintech Disruption in Emerging Markets',
      'Corporate Governance & Auditing',
      'SME Microfinance Modeling',
    ],
    laboratories: ['Bloomberg Financial Market Trading Floor', 'Enterprise Incubation Hub'],
    totalEnrollment: 8100,
    industryPartners: ['PwC', 'KPMG', 'Ernst & Young', 'Zenith Bank', 'Access Bank'],
  },

  // UI FACULTIES
  {
    id: 'fac-ui-tech',
    institutionId: 'inst-ui',
    institutionName: 'University of Ibadan',
    name: 'Faculty of Technology',
    shortCode: 'TECH-UI',
    iconName: 'Zap',
    deanName: 'Prof. Samuel Adekunle',
    deanTitle: 'Dean, Faculty of Technology',
    description:
      'Pioneering theoretical and applied engineering research, robotics, and industrial technology in an intensive, research-driven academic environment.',
    departments: [
      'Computer Science',
      'Electrical and Electronics Engineering',
      'Industrial and Production Engineering',
      'Mechanical Engineering',
      'Agricultural & Environmental Engineering',
    ],
    researchStrengths: [
      'Embedded IoT for Agriculture',
      'Grid Optimization',
      'Algorithmic Complexity',
    ],
    laboratories: ['Industrial Prototyping Workshop', 'Advanced Computing Center'],
    totalEnrollment: 5500,
    industryPartners: ['MTN Nigeria', 'Nigerian Communications Commission (NCC)', 'Huawei'],
  },

  // COVENANT UNIVERSITY FACULTIES
  {
    id: 'fac-cu-cst',
    institutionId: 'inst-covenant',
    institutionName: 'Covenant University',
    name: 'College of Science and Technology (CST)',
    shortCode: 'CST-CU',
    iconName: 'Globe',
    deanName: 'Prof. Timothy Olugbemi',
    deanTitle: 'Dean, College of Science and Technology',
    description:
      'Leading Africa in tech publications, high-speed coding bootcamps, and direct venture-backed student startups.',
    departments: [
      'Computer and Information Sciences',
      'Biochemistry and Molecular Biology',
      'Building Technology',
      'Physics & Electronics',
    ],
    researchStrengths: [
      'Cloud Architecture & DevOps',
      'Genomics & Bioinformatics',
      'Smart Green Architecture',
    ],
    laboratories: ['Covenant Cloud Innovation Center', 'Bioinformatics Supercomputing Cluster'],
    totalEnrollment: 4200,
    industryPartners: ['Amazon Web Services (AWS)', 'Google', 'IBM', 'Andela'],
  },
];

export const DEGREE_COURSES: DegreeCourse[] = [
  // UNILAG Degree Courses
  {
    id: 'course-unilag-cs',
    institutionId: 'inst-unilag',
    institutionName: 'University of Lagos',
    facultyId: 'fac-unilag-science',
    facultyName: 'Faculty of Science',
    code: 'CSC-100',
    name: 'Computer Science',
    degreeAwarded: 'B.Sc. (Hons)',
    durationYears: 4,
    cutOffScore: 280, // UTME cut-off out of 400
    minimumGpa: 3.5,
    requiredSubjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology / Further Maths'],
    utmeSubjectCombo: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirement:
      'Five (5) SSC credit passes in English Language, Mathematics, Physics, Chemistry and one other Science subject in not more than 1 sitting.',
    description:
      'The B.Sc. in Computer Science at UNILAG combines rigorous theoretical computer science with applied software engineering, machine learning algorithms, database design, and cloud architecture.',
    keyTopics: [
      'Data Structures & Algorithms',
      'Artificial Intelligence & Deep Learning',
      'Operating Systems & Kernel Design',
      'Full-Stack Distributed Web Systems',
      'Cybersecurity & Cryptography',
    ],
    careerProspects: [
      'Software Engineer / Full-Stack Developer',
      'AI & Machine Learning Specialist',
      'Cloud Solutions Architect',
      'Systems Software Engineer',
      'Quantitative Tech Analyst',
    ],
    averageStartingSalary: '₦4,800,000 - ₦9,500,000 / yr ($65k+ for international remote)',
    employabilityRate: 98,
    accreditationBody: 'NUC Accredited & Computer Professionals Registration Council (CPN)',
    annualQuota: 140,
    competitiveLevel: 'Very High',
  },
  {
    id: 'course-unilag-systems-eng',
    institutionId: 'inst-unilag',
    institutionName: 'University of Lagos',
    facultyId: 'fac-unilag-eng',
    facultyName: 'Faculty of Engineering',
    code: 'SEG-100',
    name: 'Systems Engineering',
    degreeAwarded: 'B.Sc. (Eng)',
    durationYears: 5,
    cutOffScore: 272,
    minimumGpa: 3.4,
    requiredSubjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Further Maths'],
    utmeSubjectCombo: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirement:
      'Five (5) SSC credit passes including English Language, Mathematics, Further Mathematics, Physics and Chemistry.',
    description:
      'An elite engineering discipline combining hardware automation, robotics, feedback control theory, embedded systems, and mathematical optimization.',
    keyTopics: [
      'Robotics & Automated Control',
      'Mathematical Optimization & Modeling',
      'Digital Signal Processing',
      'Microcontroller Programming',
      'Industrial Systems Design',
    ],
    careerProspects: [
      'Robotics Engineer',
      'Embedded Firmware Architect',
      'Industrial Automation Lead',
      'Controls Systems Engineer',
    ],
    averageStartingSalary: '₦4,500,000 - ₦8,000,000 / yr',
    employabilityRate: 96,
    accreditationBody: 'COREN & NUC Accredited',
    annualQuota: 90,
    competitiveLevel: 'Very High',
  },
  {
    id: 'course-unilag-med',
    institutionId: 'inst-unilag',
    institutionName: 'University of Lagos',
    facultyId: 'fac-unilag-med',
    facultyName: 'College of Medicine (Faculty of Clinical Sciences)',
    code: 'MED-100',
    name: 'Medicine & Surgery (MBBS)',
    degreeAwarded: 'MBBS (Doctor of Medicine)',
    durationYears: 6,
    cutOffScore: 310,
    minimumGpa: 3.8,
    requiredSubjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology'],
    utmeSubjectCombo: ['English Language', 'Biology', 'Chemistry', 'Physics'],
    oLevelRequirement:
      'Five (5) SSC credit passes in English Language, Mathematics, Physics, Chemistry, and Biology at ONE sitting only.',
    description:
      'Recognized by the World Health Organization (WHO) and General Medical Council (GMC), providing clinical rotations at LUTH, surgical simulation, pathology, and public health.',
    keyTopics: [
      'Human Anatomy & Dissection',
      'Medical Physiology & Biochemistry',
      'Pharmacology & Therapeutics',
      'Clinical Medicine & General Surgery',
      'Obstetrics, Gynecology & Pediatrics',
    ],
    careerProspects: [
      'Medical Doctor / Surgeon',
      'Clinical Specialist / Resident',
      'Public Health Epidemiologist',
      'Biomedical Research Scientist',
    ],
    averageStartingSalary: '₦3,600,000 - ₦6,000,000 / yr (Housemanship)',
    employabilityRate: 100,
    accreditationBody: 'Medical and Dental Council of Nigeria (MDCN) & NUC',
    annualQuota: 150,
    competitiveLevel: 'Very High',
  },
  {
    id: 'course-unilag-mech',
    institutionId: 'inst-unilag',
    institutionName: 'University of Lagos',
    facultyId: 'fac-unilag-eng',
    facultyName: 'Faculty of Engineering',
    code: 'MEG-100',
    name: 'Mechanical Engineering',
    degreeAwarded: 'B.Sc. (Eng)',
    durationYears: 5,
    cutOffScore: 265,
    minimumGpa: 3.3,
    requiredSubjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Technical Drawing'],
    utmeSubjectCombo: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirement:
      'Five (5) SSC credit passes including English Language, Mathematics, Physics, Chemistry and Technical Drawing or Biology.',
    description:
      'Thermodynamics, fluid mechanics, CAD design, machine tooling, automotive systems, and structural mechanics for modern industrial manufacturing.',
    keyTopics: [
      'Applied Thermodynamics & Heat Transfer',
      'Fluid Mechanics & Turbomachinery',
      'Computer-Aided Design & Finite Element Analysis',
      'Manufacturing Processes & Metallurgy',
    ],
    careerProspects: [
      'Mechanical Design Engineer',
      'HVAC & Energy Systems Engineer',
      'Automotive Systems Engineer',
      'Plant Maintenance Director',
    ],
    averageStartingSalary: '₦3,800,000 - ₦7,200,000 / yr',
    employabilityRate: 94,
    accreditationBody: 'COREN & NUC Accredited',
    annualQuota: 120,
    competitiveLevel: 'High',
  },
  {
    id: 'course-unilag-accounting',
    institutionId: 'inst-unilag',
    institutionName: 'University of Lagos',
    facultyId: 'fac-unilag-mgmt',
    facultyName: 'Faculty of Management Sciences',
    code: 'ACC-100',
    name: 'Accounting & Forensic Auditing',
    degreeAwarded: 'B.Sc. (Hons)',
    durationYears: 4,
    cutOffScore: 260,
    minimumGpa: 3.2,
    requiredSubjects: ['English Language', 'Mathematics', 'Economics', 'Accounting / Commerce', 'Government'],
    utmeSubjectCombo: ['English Language', 'Mathematics', 'Economics', 'Accounting / Government'],
    oLevelRequirement:
      'Five (5) SSC credit passes in English Language, Mathematics, Economics, and any two other commercial or social science subjects.',
    description:
      'Direct pathway to ICAN and ACCA professional certifications. Focuses on corporate financial analysis, tax advisory, algorithmic financial accounting, and forensic investigation.',
    keyTopics: [
      'Financial Accounting & Reporting',
      'Corporate Tax Planning & Law',
      'Forensic Auditing & Fraud Investigation',
      'Management Information Systems',
    ],
    careerProspects: [
      'Chartered Accountant',
      'Forensic Auditor',
      'Investment Banker / Equity Analyst',
      'Chief Financial Officer (CFO)',
    ],
    averageStartingSalary: '₦3,500,000 - ₦7,000,000 / yr',
    employabilityRate: 95,
    accreditationBody: 'ICAN Accredited & NUC Approved',
    annualQuota: 180,
    competitiveLevel: 'High',
  },

  // Covenant University Degree Courses
  {
    id: 'course-cu-se',
    institutionId: 'inst-covenant',
    institutionName: 'Covenant University',
    facultyId: 'fac-cu-cst',
    facultyName: 'College of Science and Technology (CST)',
    code: 'SWE-101',
    name: 'Software Engineering',
    degreeAwarded: 'B.Sc. (Hons)',
    durationYears: 4,
    cutOffScore: 240,
    minimumGpa: 3.0,
    requiredSubjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Economics / Biology'],
    utmeSubjectCombo: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirement:
      'Five (5) credit passes in English, Mathematics, Physics, Chemistry and one other Science/Social Science subject.',
    description:
      'A practical, intensive program centered on building scalable cloud systems, microservices architectures, mobile apps, and enterprise DevOps workflows with mandatory industry internships.',
    keyTopics: [
      'Agile Software Architecture & Design Patterns',
      'Cloud Computing (AWS / GCP / Azure)',
      'DevOps & Continuous Deployment CI/CD',
      'Mobile App Architecture (React Native / Flutter)',
      'Product Management & Startup Engineering',
    ],
    careerProspects: [
      'Senior Software Engineer',
      'DevOps / SRE Architect',
      'Mobile Application Developer',
      'Tech Founder & CTO',
    ],
    averageStartingSalary: '₦5,500,000 - ₦12,000,000 / yr',
    employabilityRate: 99,
    accreditationBody: 'NUC & CPN Accredited',
    annualQuota: 120,
    competitiveLevel: 'Moderate',
  },
  {
    id: 'course-cu-ai',
    institutionId: 'inst-covenant',
    institutionName: 'Covenant University',
    facultyId: 'fac-cu-cst',
    facultyName: 'College of Science and Technology (CST)',
    code: 'AIR-101',
    name: 'Artificial Intelligence & Robotics',
    degreeAwarded: 'B.Sc. (Hons)',
    durationYears: 4,
    cutOffScore: 250,
    minimumGpa: 3.2,
    requiredSubjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Further Maths'],
    utmeSubjectCombo: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirement:
      'Five (5) credit passes in English Language, Mathematics, Physics, Chemistry and one other subject.',
    description:
      'Covers neural networks, reinforcement learning, autonomous robot navigation, speech synthesis, and generative AI systems with dedicated GPU laboratory clusters.',
    keyTopics: [
      'Deep Learning & Large Language Models',
      'Computer Vision & Object Detection',
      'Reinforcement Learning & Game Theory',
      'Robotic Kinematics & ROS Framework',
    ],
    careerProspects: [
      'AI Research Scientist',
      'Computer Vision Specialist',
      'Machine Learning Engineer',
      'Data Scientist',
    ],
    averageStartingSalary: '₦6,000,000 - ₦14,000,000 / yr',
    employabilityRate: 97,
    accreditationBody: 'NUC & Times Higher Education Ranked',
    annualQuota: 80,
    competitiveLevel: 'High',
  },

  // UI Degree Course
  {
    id: 'course-ui-eee',
    institutionId: 'inst-ui',
    institutionName: 'University of Ibadan',
    facultyId: 'fac-ui-tech',
    facultyName: 'Faculty of Technology',
    code: 'EEE-100',
    name: 'Electrical & Electronics Engineering',
    degreeAwarded: 'B.Sc. (Tech)',
    durationYears: 5,
    cutOffScore: 285,
    minimumGpa: 3.5,
    requiredSubjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Further Maths'],
    utmeSubjectCombo: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirement:
      'Five (5) credit passes including English Language, Mathematics, Physics and Chemistry at ONE sitting.',
    description:
      'Rigorous foundational training in circuit theory, telecommunications, renewable energy grids, semiconductor physics, and digital signal processing.',
    keyTopics: [
      'Electromagnetic Fields & Waveguides',
      'Telecommunications & 5G Wireless Networks',
      'Renewable Energy & Power Grid Stations',
      'Semiconductor Electronics & VLSI',
    ],
    careerProspects: [
      'Telecommunications Specialist',
      'Power Grid Systems Engineer',
      'Hardware & ASIC Designer',
      'Electronics Research Engineer',
    ],
    averageStartingSalary: '₦4,200,000 - ₦8,500,000 / yr',
    employabilityRate: 96,
    accreditationBody: 'COREN & NUC Accredited',
    annualQuota: 100,
    competitiveLevel: 'Very High',
  },
];

/**
 * Utility function to evaluate student admission feasibility
 */
export function evaluateAdmissionSuitability(
  student: StudentScoreProfile,
  course: DegreeCourse,
  institution: HigherInstitution
): {
  likelihood: 'Very Strong Chance' | 'Competitive / Moderate' | 'Below Cut-Off / Reach' | 'Ineligible - Subjects Missing';
  scoreDifference: number;
  subjectEligibilityMet: boolean;
  missingRequiredSubjects: string[];
  recommendationExplanation: string;
} {
  const scoreDiff = student.entranceExamScore - course.cutOffScore;

  // Check required high school subjects
  const passedSubjectNames = student.highSchoolSubjects
    .filter((s) => s.passed)
    .map((s) => s.subject.toLowerCase());

  const missingSubjects: string[] = [];

  for (const req of course.requiredSubjects) {
    const isPresent = passedSubjectNames.some(
      (subj) =>
        subj.includes(req.toLowerCase()) ||
        req.toLowerCase().includes(subj) ||
        (req.includes('Biology') && subj.includes('further maths'))
    );
    if (!isPresent) {
      missingSubjects.push(req);
    }
  }

  const subjectMet = missingSubjects.length === 0;

  let likelihood: 'Very Strong Chance' | 'Competitive / Moderate' | 'Below Cut-Off / Reach' | 'Ineligible - Subjects Missing';

  if (!subjectMet) {
    likelihood = 'Ineligible - Subjects Missing';
  } else if (scoreDiff >= 20) {
    likelihood = 'Very Strong Chance';
  } else if (scoreDiff >= 0) {
    likelihood = 'Competitive / Moderate';
  } else {
    likelihood = 'Below Cut-Off / Reach';
  }

  let explanation = '';
  if (likelihood === 'Very Strong Chance') {
    explanation = `Your entrance exam score of ${student.entranceExamScore} exceeds the ${course.cutOffScore} cut-off for ${course.name} at ${institution.name} by +${scoreDiff} points. All required subjects are verified with credit passes. You have a high probability of merit admission.`;
  } else if (likelihood === 'Competitive / Moderate') {
    explanation = `Your score of ${student.entranceExamScore} meets or closely clears the ${course.cutOffScore} cut-off for ${course.name}. Admission is competitive and subject to departmental screening and catchment quotas.`;
  } else if (likelihood === 'Below Cut-Off / Reach') {
    explanation = `Your entrance score of ${student.entranceExamScore} is ${Math.abs(scoreDiff)} points below the recommended ${course.cutOffScore} cut-off. Consider supplementary admission lists or closely related faculties with lower cut-offs.`;
  } else {
    explanation = `Missing credit passes in: ${missingSubjects.join(', ')}. Departmental guidelines require credit passes in these subjects before registration.`;
  }

  return {
    likelihood,
    scoreDifference: scoreDiff,
    subjectEligibilityMet: subjectMet,
    missingRequiredSubjects: missingSubjects,
    recommendationExplanation: explanation,
  };
}
