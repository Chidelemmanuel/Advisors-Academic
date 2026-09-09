/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UNDERGRADUATE_COURSES,
  DEFAULT_STUDENTS,
} from './data/undergraduateCatalog';
import {
  DEFAULT_STUDENT_SCORE_PROFILE,
  HIGHER_INSTITUTIONS,
  FACULTIES_DATA,
  DEGREE_COURSES,
  evaluateAdmissionSuitability,
} from './data/institutionsData';
import {
  Course,
  UndergraduateStudentProfile,
  StudentScoreProfile,
  SelectedInstitutionPlan,
  HigherInstitution,
  DegreeCourse,
} from './types';
import { PortalHeader, MainPortalTab, PlannerSubTab } from './components/PortalHeader';
import { StepByStepSelector } from './components/StepByStepSelector';
import { InstitutionsDirectoryView } from './components/InstitutionsDirectoryView';
import { DegreeCoursesCatalogView } from './components/DegreeCoursesCatalogView';
import { AiInstitutionAdvisor } from './components/AiInstitutionAdvisor';
import { MySelectionsRoadmap } from './components/MySelectionsRoadmap';
import { RecommendationFeed } from './components/RecommendationFeed';
import { SemesterScheduleBasket } from './components/SemesterScheduleBasket';
import { DegreeAuditView } from './components/DegreeAuditView';
import { AiAcademicAdvisor } from './components/AiAcademicAdvisor';
import { CourseComparisonView } from './components/CourseComparisonView';
import { PrerequisiteFlowModal } from './components/PrerequisiteFlowModal';
import { CourseDetailModal } from './components/CourseDetailModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { LandingPage } from './components/LandingPage';

export default function App() {
  // Application View Mode: 'landing' (showcase homepage) or 'portal' (dedicated workspace)
  const [viewMode, setViewMode] = useState<'landing' | 'portal'>('landing');

  // Active Main Navigation Tab in Portal:
  // 'selector' | 'institutions' | 'courses' | 'ai-advisor' | 'roadmap' | 'planner'
  const [activeMainTab, setActiveMainTab] = useState<MainPortalTab>('selector');

  // Sub-tabs for the Undergraduate Curriculum Planner & Degree Audit
  const [plannerSubTab, setPlannerSubTab] = useState<PlannerSubTab>('recommendations');

  // Applicant Entrance Exam & High School Score Profile
  const [studentScoreProfile, setStudentScoreProfile] = useState<StudentScoreProfile>(
    DEFAULT_STUDENT_SCORE_PROFILE
  );

  // Confirmed / In-Progress Higher Institution, Faculty & Degree Course Selection
  const initialEval = evaluateAdmissionSuitability(
    DEFAULT_STUDENT_SCORE_PROFILE,
    DEGREE_COURSES[0],
    HIGHER_INSTITUTIONS[0]
  );
  const [selectedPlan, setSelectedPlan] = useState<SelectedInstitutionPlan>({
    selectedInstitution: HIGHER_INSTITUTIONS[0],
    selectedFaculty: FACULTIES_DATA[0],
    selectedCourse: DEGREE_COURSES[0],
    selectionDate: new Date().toLocaleDateString(),
    admissionLikelihood: initialEval.likelihood,
    cutOffDifference: initialEval.scoreDifference,
    subjectEligibilityMet: initialEval.subjectEligibilityMet,
    missingSubjects: initialEval.missingRequiredSubjects,
    aiAdvisoryNote: initialEval.recommendationExplanation,
  });

  // Active Undergraduate Student Profile (for Semester Curriculum planning)
  const [student, setStudent] = useState<UndergraduateStudentProfile>(DEFAULT_STUDENTS[0]);

  // Current Semester Schedule Basket
  const [semesterPlan, setSemesterPlan] = useState<Course[]>([
    UNDERGRADUATE_COURSES[6], // CS-301 Database Systems (3 credits)
    UNDERGRADUATE_COURSES[9], // CS-320 Machine Learning (4 credits)
    UNDERGRADUATE_COURSES[11], // CS-350 Web Architectures (3 credits)
  ]);

  // Modals state
  const [inspectingCourse, setInspectingCourse] = useState<Course | null>(null);
  const [detailsCourse, setDetailsCourse] = useState<Course | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [compareCourseA, setCompareCourseA] = useState<Course | undefined>(undefined);
  const [compareCourseB, setCompareCourseB] = useState<Course | undefined>(undefined);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick select an institution from directory
  const handleSelectInstitutionFromDirectory = (inst: HigherInstitution) => {
    const matchingCourses = DEGREE_COURSES.filter((c) => c.institutionId === inst.id);
    const targetCourse = matchingCourses[0] || DEGREE_COURSES[0];
    const targetFaculty = FACULTIES_DATA.find((f) => f.id === targetCourse.facultyId) || null;

    const evaluation = evaluateAdmissionSuitability(studentScoreProfile, targetCourse, inst);

    setSelectedPlan({
      selectedInstitution: inst,
      selectedFaculty: targetFaculty,
      selectedCourse: targetCourse,
      selectionDate: new Date().toLocaleDateString(),
      admissionLikelihood: evaluation.likelihood,
      cutOffDifference: evaluation.scoreDifference,
      subjectEligibilityMet: evaluation.subjectEligibilityMet,
      missingSubjects: evaluation.missingRequiredSubjects,
      aiAdvisoryNote: evaluation.recommendationExplanation,
    });

    showToast(`Selected ${inst.name} (${inst.shortName}). Switched to Step-by-Step Selector.`);
    setActiveMainTab('selector');
  };

  // Quick select a degree course from catalog
  const handleSelectCourseFromCatalog = (course: DegreeCourse) => {
    const matchingInst =
      HIGHER_INSTITUTIONS.find((i) => i.id === course.institutionId) || HIGHER_INSTITUTIONS[0];
    const matchingFaculty = FACULTIES_DATA.find((f) => f.id === course.facultyId) || null;

    const evaluation = evaluateAdmissionSuitability(
      studentScoreProfile,
      course,
      matchingInst
    );

    setSelectedPlan({
      selectedInstitution: matchingInst,
      selectedFaculty: matchingFaculty,
      selectedCourse: course,
      selectionDate: new Date().toLocaleDateString(),
      admissionLikelihood: evaluation.likelihood,
      cutOffDifference: evaluation.scoreDifference,
      subjectEligibilityMet: evaluation.subjectEligibilityMet,
      missingSubjects: evaluation.missingRequiredSubjects,
      aiAdvisoryNote: evaluation.recommendationExplanation,
    });

    showToast(`Selected ${course.name} (${course.code}). Evaluation updated.`);
    setActiveMainTab('roadmap');
  };

  // Add course to semester plan
  const handleAddToPlan = (course: Course) => {
    if (semesterPlan.some((c) => c.id === course.id)) {
      showToast(`${course.code} is already in your semester basket.`);
      return;
    }

    const currentCredits = semesterPlan.reduce((acc, c) => acc + c.credits, 0);
    if (currentCredits + course.credits > student.maxTargetCreditsSemester + 3) {
      showToast(`Warning: Adding ${course.code} significantly exceeds your semester credit limit.`);
    } else {
      showToast(`Added ${course.code} (${course.credits} cr) to your semester basket.`);
    }

    setSemesterPlan((prev) => [...prev, course]);
  };

  // Remove course from semester plan
  const handleRemoveFromPlan = (courseId: string) => {
    const course = semesterPlan.find((c) => c.id === courseId);
    setSemesterPlan((prev) => prev.filter((c) => c.id !== courseId));
    if (course) {
      showToast(`Removed ${course.code} from your semester basket.`);
    }
  };

  // Clear semester plan
  const handleClearPlan = () => {
    setSemesterPlan([]);
    showToast('Cleared all courses from your semester basket.');
  };

  // Trigger comparison
  const handleCompareCourse = (course: Course) => {
    setCompareCourseA(course);
    const alternate =
      UNDERGRADUATE_COURSES.find(
        (c) => c.id !== course.id && (c.level === course.level || c.category === course.category)
      ) || UNDERGRADUATE_COURSES[0];
    setCompareCourseB(alternate);
    setActiveMainTab('planner');
    setPlannerSubTab('compare');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {viewMode === 'landing' ? (
        <LandingPage
          catalog={UNDERGRADUATE_COURSES}
          student={student}
          setStudent={(updated) => {
            setStudent(updated);
            showToast(`Switched student persona to ${updated.name}.`);
          }}
          semesterPlan={semesterPlan}
          onAddToPlan={handleAddToPlan}
          onRemoveFromPlan={handleRemoveFromPlan}
          onInspectPrereqs={(c) => setInspectingCourse(c)}
          onViewDetails={(c) => setDetailsCourse(c)}
          onCompareCourse={handleCompareCourse}
          onLaunchPortal={() => setViewMode('portal')}
          onNavigateToTopic={(tab) => {
            setActiveMainTab(tab);
            setViewMode('portal');
          }}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />
      ) : (
        <>
          {/* Header & Global Status with full Topics Navigation */}
          <PortalHeader
            activeMainTab={activeMainTab}
            setActiveMainTab={setActiveMainTab}
            plannerSubTab={plannerSubTab}
            setPlannerSubTab={setPlannerSubTab}
            student={student}
            setStudent={(updated) => {
              setStudent(updated);
              showToast(`Switched student persona to ${updated.name}.`);
            }}
            studentScoreProfile={studentScoreProfile}
            setStudentScoreProfile={(updated) => {
              setStudentScoreProfile(updated);
              showToast(`Updated applicant score profile for ${updated.studentName}.`);
            }}
            selectedPlan={selectedPlan}
            semesterPlan={semesterPlan}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onBackToLanding={() => setViewMode('landing')}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* TOPIC 1: Step-by-Step Guided Selector */}
            {activeMainTab === 'selector' && (
              <StepByStepSelector
                studentProfile={studentScoreProfile}
                setStudentProfile={setStudentScoreProfile}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                onNavigateToRoadmap={() => setActiveMainTab('roadmap')}
                onNavigateToAdvisor={() => setActiveMainTab('ai-advisor')}
              />
            )}

            {/* TOPIC 2: Higher Institutions Directory */}
            {activeMainTab === 'institutions' && (
              <InstitutionsDirectoryView
                onSelectInstitutionForPlan={handleSelectInstitutionFromDirectory}
              />
            )}

            {/* TOPIC 3: Degree Courses & Cut-Off Catalog */}
            {activeMainTab === 'courses' && (
              <DegreeCoursesCatalogView
                onSelectCourseForPlan={handleSelectCourseFromCatalog}
              />
            )}

            {/* TOPIC 4: Gemini AI Admissions Counselor */}
            {activeMainTab === 'ai-advisor' && (
              <AiInstitutionAdvisor
                studentProfile={studentScoreProfile}
                selectedPlan={selectedPlan}
                onApplyAdvisoryPlan={(inst, course) => {
                  handleSelectCourseFromCatalog(course);
                }}
              />
            )}

            {/* TOPIC 5: My Selections & Admissions Roadmap */}
            {activeMainTab === 'roadmap' && (
              <MySelectionsRoadmap
                selectedPlan={selectedPlan}
                studentProfile={studentScoreProfile}
                onNavigateToWizard={() => setActiveMainTab('selector')}
                onNavigateToAdvisor={() => setActiveMainTab('ai-advisor')}
              />
            )}

            {/* TOPIC 6: Undergraduate Semester Planner & Degree Audit */}
            {activeMainTab === 'planner' && (
              <div className="space-y-6">
                {plannerSubTab === 'recommendations' && (
                  <RecommendationFeed
                    catalog={UNDERGRADUATE_COURSES}
                    student={student}
                    semesterPlan={semesterPlan}
                    onAddToPlan={handleAddToPlan}
                    onRemoveFromPlan={handleRemoveFromPlan}
                    onInspectPrereqs={(c) => setInspectingCourse(c)}
                    onViewDetails={(c) => setDetailsCourse(c)}
                    onCompareCourse={handleCompareCourse}
                    onOpenAdvisor={() => setPlannerSubTab('academic-advisor')}
                  />
                )}

                {plannerSubTab === 'basket' && (
                  <SemesterScheduleBasket
                    student={student}
                    semesterPlan={semesterPlan}
                    onRemoveFromPlan={handleRemoveFromPlan}
                    onClearPlan={handleClearPlan}
                    onOpenAdvisor={() => setPlannerSubTab('academic-advisor')}
                    onNavigateToCatalog={() => setPlannerSubTab('recommendations')}
                  />
                )}

                {plannerSubTab === 'audit' && (
                  <DegreeAuditView
                    catalog={UNDERGRADUATE_COURSES}
                    student={student}
                    semesterPlan={semesterPlan}
                    onAddToPlan={handleAddToPlan}
                    onInspectPrereqs={(c) => setInspectingCourse(c)}
                  />
                )}

                {plannerSubTab === 'academic-advisor' && (
                  <AiAcademicAdvisor
                    student={student}
                    semesterPlan={semesterPlan}
                    catalog={UNDERGRADUATE_COURSES}
                    onAddToPlan={handleAddToPlan}
                  />
                )}

                {plannerSubTab === 'compare' && (
                  <CourseComparisonView
                    catalog={UNDERGRADUATE_COURSES}
                    student={student}
                    semesterPlan={semesterPlan}
                    onAddToPlan={handleAddToPlan}
                    onRemoveFromPlan={handleRemoveFromPlan}
                    initialCourseA={compareCourseA}
                    initialCourseB={compareCourseB}
                  />
                )}
              </div>
            )}
          </main>
        </>
      )}

      {/* Modals */}
      <PrerequisiteFlowModal
        course={inspectingCourse}
        onClose={() => setInspectingCourse(null)}
        student={student}
        catalog={UNDERGRADUATE_COURSES}
        onSelectCourse={(c) => setInspectingCourse(c)}
      />

      <CourseDetailModal
        course={detailsCourse}
        onClose={() => setDetailsCourse(null)}
        student={student}
        semesterPlan={semesterPlan}
        onAddToPlan={handleAddToPlan}
        onRemoveFromPlan={handleRemoveFromPlan}
      />

      <StudentProfileModal
        student={student}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={(updated) => {
          setStudent(updated);
          showToast('Updated student academic profile.');
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 Advisors Academic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
