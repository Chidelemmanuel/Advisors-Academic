/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  GitCompare,
  Sliders,
  UserCheck,
  Award,
  AlertTriangle,
  ArrowLeft,
  Building2,
  Layers,
  FileText,
  Compass,
} from 'lucide-react';
import {
  UndergraduateStudentProfile,
  Course,
  StudentScoreProfile,
  SelectedInstitutionPlan,
} from '../types';
import { DEFAULT_STUDENTS } from '../data/undergraduateCatalog';
import { SAMPLE_STUDENT_PROFILES } from '../data/institutionsData';

export type MainPortalTab =
  | 'selector'
  | 'institutions'
  | 'courses'
  | 'ai-advisor'
  | 'roadmap'
  | 'planner';

export type PlannerSubTab =
  | 'recommendations'
  | 'basket'
  | 'audit'
  | 'academic-advisor'
  | 'compare';

interface NavigationHeaderProps {
  activeMainTab: MainPortalTab;
  setActiveMainTab: (tab: MainPortalTab) => void;
  plannerSubTab: PlannerSubTab;
  setPlannerSubTab: (subTab: PlannerSubTab) => void;
  student: UndergraduateStudentProfile;
  setStudent: (student: UndergraduateStudentProfile) => void;
  studentScoreProfile: StudentScoreProfile;
  setStudentScoreProfile: (profile: StudentScoreProfile) => void;
  selectedPlan: SelectedInstitutionPlan;
  semesterPlan: Course[];
  onOpenProfileModal: () => void;
  onBackToLanding?: () => void;
}

export const PortalHeader: React.FC<NavigationHeaderProps> = ({
  activeMainTab,
  setActiveMainTab,
  plannerSubTab,
  setPlannerSubTab,
  student,
  setStudent,
  studentScoreProfile,
  setStudentScoreProfile,
  selectedPlan,
  semesterPlan,
  onOpenProfileModal,
  onBackToLanding,
}) => {
  const totalPlannedCredits = semesterPlan.reduce((acc, c) => acc + c.credits, 0);
  const isOverload = totalPlannedCredits > student.maxTargetCreditsSemester;

  const isAdmissionSection =
    activeMainTab === 'selector' ||
    activeMainTab === 'institutions' ||
    activeMainTab === 'courses' ||
    activeMainTab === 'ai-advisor' ||
    activeMainTab === 'roadmap';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer mr-1"
                title="Return to Website Landing Page"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Landing Page</span>
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs relative shrink-0">
              <GraduationCap className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
                    advisors.
                  </span>
                  <span className="text-sm font-extrabold text-blue-600 tracking-tight leading-tight">
                    academic
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200/80">
                  Advisory Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                {isAdmissionSection
                  ? selectedPlan.selectedInstitution
                    ? `Selected: ${selectedPlan.selectedInstitution.shortName} • ${selectedPlan.selectedCourse?.name || 'Program Selection'}`
                    : 'Admissions & Institutional Placement Engine'
                  : `${student.university} • ${student.major}`}
              </p>
            </div>
          </div>

          {/* Student Status Profile Indicators */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
            {isAdmissionSection ? (
              <>
                {/* Score Profile Switcher */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-500 font-medium hidden sm:inline">Applicant:</span>
                  <select
                    id="score-profile-select"
                    aria-label="Select Applicant Score Profile"
                    className="bg-transparent text-slate-800 font-bold focus:outline-hidden cursor-pointer"
                    value={studentScoreProfile.studentName}
                    onChange={(e) => {
                      const found = SAMPLE_STUDENT_PROFILES.find(
                        (p) => p.studentName === e.target.value
                      );
                      if (found) setStudentScoreProfile(found);
                    }}
                  >
                    {SAMPLE_STUDENT_PROFILES.map((p, idx) => (
                      <option key={idx} value={p.studentName}>
                        {p.studentName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Score Badge */}
                <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg px-2.5 py-1 font-bold">
                  <span>Score: {studentScoreProfile.entranceExamScore} / 400</span>
                </div>

                {/* GPA Badge */}
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-2.5 py-1 font-semibold">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GPA: {studentScoreProfile.gpa.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <>
                {/* Undergrad Persona Switcher */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-500 font-medium hidden sm:inline">Student:</span>
                  <select
                    id="persona-select"
                    aria-label="Select undergraduate student persona"
                    className="bg-transparent text-slate-800 font-semibold focus:outline-hidden cursor-pointer"
                    value={student.id}
                    onChange={(e) => {
                      const found = DEFAULT_STUDENTS.find((s) => s.id === e.target.value);
                      if (found) setStudent(found);
                    }}
                  >
                    {DEFAULT_STUDENTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.standing})
                      </option>
                    ))}
                  </select>
                </div>

                {/* GPA Badge */}
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-2.5 py-1 font-semibold">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GPA: {student.currentGpa.toFixed(2)}</span>
                </div>

                {/* Semester Basket Pill */}
                <button
                  id="basket-quick-pill"
                  onClick={() => {
                    setActiveMainTab('planner');
                    setPlannerSubTab('basket');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                    isOverload
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>
                    {totalPlannedCredits} / {student.maxTargetCreditsSemester} Credits
                  </span>
                  {isOverload && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                </button>

                {/* Edit Profile */}
                <button
                  id="edit-profile-btn"
                  onClick={onOpenProfileModal}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Level 1 Navigation: The Core Topics */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-semibold">
          {/* 1. Step-by-Step Selector */}
          <button
            id="nav-step-selector"
            onClick={() => setActiveMainTab('selector')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'selector'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Step-by-Step Selector</span>
          </button>

          {/* 2. Higher Institutions Directory */}
          <button
            id="nav-institutions"
            onClick={() => setActiveMainTab('institutions')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'institutions'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Higher Institutions</span>
          </button>

          {/* 3. Degree Courses & Cut-Offs */}
          <button
            id="nav-courses"
            onClick={() => setActiveMainTab('courses')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'courses'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Degree Programs & Cut-Offs</span>
          </button>

          {/* 4. AI Admissions Counselor */}
          <button
            id="nav-ai-advisor"
            onClick={() => setActiveMainTab('ai-advisor')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'ai-advisor'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Admissions Advisor</span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-800 px-1 py-0.2 rounded">
              Gemini
            </span>
          </button>

          {/* 5. My Selections Roadmap */}
          <button
            id="nav-roadmap"
            onClick={() => setActiveMainTab('roadmap')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'roadmap'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Selections Roadmap</span>
            {selectedPlan.selectedCourse && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* 6. Undergraduate Semester Planner & Audit */}
          <button
            id="nav-planner"
            onClick={() => setActiveMainTab('planner')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'planner'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Semester Planner & Audit</span>
          </button>
        </nav>

        {/* Level 2 Subnavigation: Only displayed when activeMainTab === 'planner' */}
        {activeMainTab === 'planner' && (
          <div className="flex items-center space-x-2 py-2 border-t border-slate-100 text-xs overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Curriculum Tools:
            </span>
            <button
              onClick={() => setPlannerSubTab('recommendations')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                plannerSubTab === 'recommendations'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Course Feed
            </button>
            <button
              onClick={() => setPlannerSubTab('basket')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                plannerSubTab === 'basket'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Schedule Basket ({semesterPlan.length})</span>
            </button>
            <button
              onClick={() => setPlannerSubTab('audit')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                plannerSubTab === 'audit'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Degree Audit
            </button>
            <button
              onClick={() => setPlannerSubTab('academic-advisor')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                plannerSubTab === 'academic-advisor'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Academic Workload AI</span>
            </button>
            <button
              onClick={() => setPlannerSubTab('compare')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                plannerSubTab === 'compare'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Compare Electives
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
