/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Course,
  CompletedCourse,
  UndergraduateStudentProfile,
  CourseRecommendation,
  PrerequisiteCheckResult,
  DegreeAuditSummary,
  DegreeAuditCategory,
  RequirementType,
} from '../types';

/**
 * Checks if a student has fulfilled all prerequisites for a given course.
 */
export function checkPrerequisites(
  course: Course,
  completedCourses: CompletedCourse[]
): PrerequisiteCheckResult {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return {
      satisfied: true,
      satisfiedPrereqs: [],
      missingPrereqs: [],
      gradesSatisfied: true,
      details: 'No prerequisites required. Open for enrollment.',
    };
  }

  const completedCodes = new Set(completedCourses.map((c) => c.code));
  const satisfiedPrereqs: string[] = [];
  const missingPrereqs: string[] = [];

  for (const prereqCode of course.prerequisites) {
    if (completedCodes.has(prereqCode)) {
      satisfiedPrereqs.push(prereqCode);
    } else {
      missingPrereqs.push(prereqCode);
    }
  }

  const satisfied = missingPrereqs.length === 0;

  let details = '';
  if (satisfied) {
    details = `All ${satisfiedPrereqs.length} prerequisite(s) cleared (${satisfiedPrereqs.join(', ')}).`;
  } else {
    details = `Missing ${missingPrereqs.length} prerequisite(s): ${missingPrereqs.join(', ')}. Complete prior to enrollment.`;
  }

  return {
    satisfied,
    satisfiedPrereqs,
    missingPrereqs,
    gradesSatisfied: true,
    details,
  };
}

/**
 * Evaluates a single course against the undergraduate student profile and current semester plan.
 */
export function evaluateCourseRecommendation(
  course: Course,
  profile: UndergraduateStudentProfile,
  semesterPlan: Course[]
): CourseRecommendation {
  const completedCodes = new Set(profile.completedCourses.map((c) => c.code));
  const isAlreadyCompleted = completedCodes.has(course.code);
  const isAlreadyInPlan = semesterPlan.some((c) => c.code === course.code);

  const prereqStatus = checkPrerequisites(course, profile.completedCourses);
  const reasons: string[] = [];
  const warnings: string[] = [];

  let score = 0;

  // 1. Prerequisite fulfillment (30 points maximum)
  if (prereqStatus.satisfied) {
    score += 30;
    if (course.prerequisites.length > 0) {
      reasons.push(`Prerequisites satisfied (${prereqStatus.satisfiedPrereqs.join(', ')}).`);
    } else {
      reasons.push('Open foundation course (no prerequisites required).');
    }
  } else {
    warnings.push(`Prerequisite blocked: Requires ${prereqStatus.missingPrereqs.join(', ')}.`);
  }

  // 2. Degree Requirement Priority (25 points maximum)
  if (course.category === 'Major Core') {
    score += 25;
    reasons.push('Mandatory Departmental Core: Required for degree conferral.');
  } else if (course.category === 'Track Elective') {
    score += 20;
    reasons.push(`Track Elective: Contributes to ${profile.selectedTrack} concentration.`);
  } else if (course.category === 'Science & Math Core') {
    score += 18;
    reasons.push('Foundational STEM requirement.');
  } else {
    score += 12;
    reasons.push('General Education / Breadth Elective.');
  }

  // 3. Career Track Alignment (20 points maximum)
  const isTrackAligned = course.careerTracks.includes(profile.selectedTrack);
  let trackAffinityScore = 0;
  if (isTrackAligned) {
    score += 20;
    trackAffinityScore = 95;
    reasons.push(`Direct alignment with your career goal (${profile.careerGoal}).`);
  } else {
    trackAffinityScore = 40;
  }

  // 4. Academic Standing & Level Match (10 points maximum)
  const levelOrder: Record<string, number> = { '100L': 1, '200L': 2, '300L': 3, '400L': 4 };
  const studentLevelNum = levelOrder[profile.level] || 3;
  const courseLevelNum = levelOrder[course.level] || 3;

  if (courseLevelNum === studentLevelNum) {
    score += 10;
    reasons.push(`Appropriate level match (${course.level}) for your ${profile.standing} standing.`);
  } else if (courseLevelNum === studentLevelNum - 1) {
    score += 8; // Taking a catch-up or foundational elective
  } else if (courseLevelNum === studentLevelNum + 1 && prereqStatus.satisfied) {
    score += 6; // Accelerated advanced course
    reasons.push('Advanced enrollment: Accelerates progression to 400-level topics.');
  }

  // 5. Critical Path & Unlocked Courses Multiplier (10 points maximum)
  const unlockedCount = course.unlocks.length;
  if (unlockedCount >= 2) {
    score += Math.min(10, unlockedCount * 2.5);
    reasons.push(`Critical Pathway: Unlocks ${unlockedCount} subsequent courses (${course.unlocks.join(', ')}).`);
  }

  // 6. GPA Impact & Workload Compatibility (5 points maximum)
  let gpaImpactPotential: 'GPA Booster' | 'Moderate Rigor' | 'Heavy Demand' = 'Moderate Rigor';
  if (course.gradeDistribution.averageGpa >= 3.4) {
    gpaImpactPotential = 'GPA Booster';
    score += 5;
    reasons.push(`Favorable historical grading: Class average GPA of ${course.gradeDistribution.averageGpa.toFixed(2)}.`);
  } else if (course.difficultyScore >= 4.0 || course.workloadHours >= 12) {
    gpaImpactPotential = 'Heavy Demand';
    warnings.push(`Rigorous workload: Estimated ${course.workloadHours} hrs/week study outside lectures.`);
  }

  // Learning style check
  if (
    profile.learningStyle === 'Project & Practical' &&
    course.assessment.projects >= 30
  ) {
    score += 5;
    reasons.push(`Hands-on assessment: ${course.assessment.projects}% project weighting aligns with your preferred practical style.`);
  }

  // Current basket check
  const totalPlannedCredits = semesterPlan.reduce((acc, c) => acc + c.credits, 0);
  if (totalPlannedCredits + course.credits > profile.maxTargetCreditsSemester) {
    warnings.push(`Adding this course (${course.credits} credits) will exceed your ${profile.maxTargetCreditsSemester} semester credit limit.`);
  }

  // Clamp final score between 10 and 99%
  const normalizedScore = Math.min(99, Math.max(10, Math.round(score)));

  // Priority Rank Classification
  let priorityRank: CourseRecommendation['priorityRank'] = 'Recommended Elective';
  if (!prereqStatus.satisfied) {
    priorityRank = 'Prerequisite Blocked';
  } else if (course.category === 'Major Core' && courseLevelNum <= studentLevelNum) {
    priorityRank = 'Essential Core';
  } else if (normalizedScore >= 78) {
    priorityRank = 'High Match';
  } else {
    priorityRank = 'Recommended Elective';
  }

  return {
    course,
    matchScore: prereqStatus.satisfied ? normalizedScore : Math.min(normalizedScore, 42),
    priorityRank,
    prereqStatus,
    reasons,
    warnings,
    unlockedCoursesCount: unlockedCount,
    trackAffinityScore,
    gpaImpactPotential,
  };
}

/**
 * Ranks all eligible undergraduate courses for a student.
 */
export function rankRecommendedCourses(
  catalog: Course[],
  profile: UndergraduateStudentProfile,
  semesterPlan: Course[]
): CourseRecommendation[] {
  const completedCodes = new Set(profile.completedCourses.map((c) => c.code));

  // Filter out courses the student has already completed
  const eligibleCourses = catalog.filter((c) => !completedCodes.has(c.code));

  const evaluated = eligibleCourses.map((course) =>
    evaluateCourseRecommendation(course, profile, semesterPlan)
  );

  // Sort: First by prerequisite satisfaction, then by match score descending
  return evaluated.sort((a, b) => {
    // Satisfied prereqs come before blocked
    if (a.prereqStatus.satisfied && !b.prereqStatus.satisfied) return -1;
    if (!a.prereqStatus.satisfied && b.prereqStatus.satisfied) return 1;
    // Then sort by matchScore
    return b.matchScore - a.matchScore;
  });
}

/**
 * Calculates student's degree audit breakdown across core, elective, and math categories.
 */
export function computeDegreeAudit(
  profile: UndergraduateStudentProfile,
  semesterPlan: Course[]
): DegreeAuditSummary {
  const requirementsConfig: Record<RequirementType, { required: number }> = {
    'Major Core': { required: 48 },
    'Track Elective': { required: 24 },
    'Science & Math Core': { required: 16 },
    'General Breadth Elective': { required: 12 },
  };

  const completedByCategory: Record<RequirementType, { credits: number; codes: string[] }> = {
    'Major Core': { credits: 0, codes: [] },
    'Track Elective': { credits: 0, codes: [] },
    'Science & Math Core': { credits: 0, codes: [] },
    'General Breadth Elective': { credits: 0, codes: [] },
  };

  // Tally completed courses
  for (const c of profile.completedCourses) {
    if (completedByCategory[c.category]) {
      completedByCategory[c.category].credits += c.credits;
      completedByCategory[c.category].codes.push(c.code);
    }
  }

  const categories: DegreeAuditCategory[] = (
    Object.keys(requirementsConfig) as RequirementType[]
  ).map((category) => {
    const earned = completedByCategory[category].credits;
    const required = requirementsConfig[category].required;
    return {
      category,
      creditsCompleted: earned,
      creditsRequired: required,
      coursesTaken: completedByCategory[category].codes,
      missingCoursesCount: Math.max(0, Math.ceil((required - earned) / 3)),
      isComplete: earned >= required,
    };
  });

  const totalCreditsEarned = categories.reduce((acc, cat) => acc + cat.creditsCompleted, 0);
  const totalCreditsRequired = profile.totalDegreeCreditsRequired || 120;
  const overallProgressPercent = Math.min(
    100,
    Math.round((totalCreditsEarned / totalCreditsRequired) * 100)
  );

  return {
    totalCreditsEarned,
    totalCreditsRequired,
    overallProgressPercent,
    categories,
  };
}
