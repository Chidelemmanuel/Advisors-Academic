/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AcademicStanding = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
export type AcademicLevel = '100L' | '200L' | '300L' | '400L';

export type RequirementType =
  | 'Major Core'
  | 'Track Elective'
  | 'Science & Math Core'
  | 'General Breadth Elective';

export type CareerTrack =
  | 'Artificial Intelligence & ML'
  | 'Cloud & Distributed Systems'
  | 'Cybersecurity & Networks'
  | 'Data Science & Analytics'
  | 'Full-Stack Software Engineering';

export type DifficultyRating = 'Introductory' | 'Moderate' | 'Challenging' | 'Rigorous';

export interface CourseInstructor {
  name: string;
  title: string;
  rating: number; // e.g. 4.8 / 5
  officeHours: string;
}

export interface AssessmentStructure {
  assignments: number; // percentage
  midterm: number;
  projects: number;
  finalExam: number;
}

export interface GradeDistribution {
  aPercent: number;
  bPercent: number;
  cPercent: number;
  dfPercent: number;
  averageGpa: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  level: AcademicLevel;
  credits: number; // e.g. 3 or 4 credits
  category: RequirementType;
  workloadHours: number; // weekly study hours outside class
  difficultyScore: number; // 1.0 to 5.0
  difficultyLabel: DifficultyRating;
  instructor: CourseInstructor;
  description: string;
  prerequisites: string[]; // e.g. ['CS-101', 'MATH-120']
  corequisites?: string[];
  unlocks: string[]; // course codes that require this course
  careerTracks: CareerTrack[];
  syllabus: string[];
  assessment: AssessmentStructure;
  gradeDistribution: GradeDistribution;
  scheduleSlot: string; // e.g. 'Tue/Thu 10:00 - 11:30 AM'
  location: string;
  tags: string[];
  studentReviewsCount: number;
  averageStudentRating: number; // 1 to 5
}

export interface CompletedCourse {
  code: string;
  title: string;
  credits: number;
  grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'P';
  gradePoints: number; // 4.0 scale
  termTaken: string; // e.g. "Fall 2024", "Spring 2025"
  category: RequirementType;
}

export interface UndergraduateStudentProfile {
  id: string;
  name: string;
  studentId: string;
  avatarUrl?: string;
  gender?: 'Male' | 'Female' | string;
  university: string;
  major: string;
  standing: AcademicStanding;
  level: AcademicLevel;
  currentGpa: number;
  totalDegreeCreditsRequired: number; // e.g. 120
  completedCredits: number;
  selectedTrack: CareerTrack;
  maxTargetCreditsSemester: number; // e.g. 18
  preferredWeeklyHours: number; // e.g. 24
  learningStyle: 'Project & Practical' | 'Theoretical & Proofs' | 'Balanced Exams & Projects';
  careerGoal: string;
  academicAdviserName: string;
  completedCourses: CompletedCourse[];
}

export interface PrerequisiteCheckResult {
  satisfied: boolean;
  satisfiedPrereqs: string[];
  missingPrereqs: string[];
  gradesSatisfied: boolean;
  details: string;
}

export interface CourseRecommendation {
  course: Course;
  matchScore: number; // 0 - 100%
  priorityRank: 'Essential Core' | 'High Match' | 'Recommended Elective' | 'Prerequisite Blocked';
  prereqStatus: PrerequisiteCheckResult;
  reasons: string[];
  warnings: string[];
  unlockedCoursesCount: number;
  trackAffinityScore: number; // 0 - 100
  gpaImpactPotential: 'GPA Booster' | 'Moderate Rigor' | 'Heavy Demand';
}

export interface DegreeAuditCategory {
  category: RequirementType;
  creditsCompleted: number;
  creditsRequired: number;
  coursesTaken: string[];
  missingCoursesCount: number;
  isComplete: boolean;
}

export interface DegreeAuditSummary {
  totalCreditsEarned: number;
  totalCreditsRequired: number;
  overallProgressPercent: number;
  categories: DegreeAuditCategory[];
}

// -------------------------------------------------------------
// HIGHER INSTITUTION, FACULTY, AND DEGREE COURSE SELECTION TYPES
// -------------------------------------------------------------

export type InstitutionType =
  | 'Federal University'
  | 'State University'
  | 'Private University'
  | 'Polytechnic / Tech College'
  | 'Institute of Technology';

export interface HigherInstitution {
  id: string;
  name: string;
  shortName: string;
  type: InstitutionType;
  logoUrl?: string;
  establishedYear: number;
  location: {
    city: string;
    stateCountry: string;
    campusSize: string;
  };
  nationalRanking: number;
  accreditationStatus: string;
  acceptanceRate: number; // percentage
  annualTuitionEstimate: string;
  tuitionCategory: 'Low / Subsidized' | 'Moderate' | 'Private / Premium';
  totalStudents: number;
  studentFacultyRatio: string;
  facultiesCount: number;
  degreeProgramsCount: number;
  overview: string;
  facilities: string[];
  popularCourses: string[];
  admissionPortalUrl: string;
  contactEmail: string;
  rating: number;
}

export interface Faculty {
  id: string;
  institutionId: string;
  institutionName: string;
  name: string;
  shortCode: string;
  iconName: string;
  deanName: string;
  deanTitle: string;
  description: string;
  departments: string[];
  researchStrengths: string[];
  laboratories: string[];
  totalEnrollment: number;
  industryPartners: string[];
}

export interface DegreeCourse {
  id: string;
  institutionId: string;
  institutionName: string;
  facultyId: string;
  facultyName: string;
  code: string;
  name: string;
  degreeAwarded: string;
  durationYears: number;
  cutOffScore: number; // Entrance score out of 400
  minimumGpa: number;
  requiredSubjects: string[];
  utmeSubjectCombo: string[];
  oLevelRequirement: string;
  description: string;
  keyTopics: string[];
  careerProspects: string[];
  averageStartingSalary: string;
  employabilityRate: number;
  accreditationBody: string;
  annualQuota: number;
  competitiveLevel: 'Very High' | 'High' | 'Moderate' | 'Accessible';
}

export interface HighSchoolSubjectGrade {
  subject: string;
  grade: 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';
  passed: boolean; // C6 or better counts as credit pass
}

export interface StudentScoreProfile {
  studentName: string;
  entranceExamScore: number; // e.g. 278 / 400
  gpa: number;
  highSchoolSubjects: HighSchoolSubjectGrade[];
  primaryInterest: string;
  targetCareer: string;
  preferredStateOrCity?: string;
  maxBudgetPerYear?: string;
  preferredInstitutionType?: InstitutionType | 'All Types';
}

export interface SelectedInstitutionPlan {
  selectedInstitution: HigherInstitution | null;
  selectedFaculty: Faculty | null;
  selectedCourse: DegreeCourse | null;
  selectionDate: string;
  admissionLikelihood: 'Very Strong Chance' | 'Competitive / Moderate' | 'Below Cut-Off / Reach' | 'Ineligible - Subjects Missing';
  cutOffDifference: number;
  subjectEligibilityMet: boolean;
  missingSubjects: string[];
  aiAdvisoryNote?: string;
}
