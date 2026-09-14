/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Course, UndergraduateStudentProfile } from '../types';
import { RecommendationFeed } from './RecommendationFeed';
import { SemesterScheduleBasket } from './SemesterScheduleBasket';
import { CourseComparisonView } from './CourseComparisonView';

interface CourseRegistrationViewProps {
  catalog: Course[];
  student: UndergraduateStudentProfile;
  semesterPlan: Course[];
  onAddToPlan: (course: Course) => void;
  onRemoveFromPlan: (courseId: string) => void;
  onClearPlan: () => void;
  onInspectPrereqs: (course: Course) => void;
  onViewDetails: (course: Course) => void;
  onCompareCourse: (course: Course) => void;
  onOpenAdvisor: () => void;
  compareCourseA: Course;
  compareCourseB: Course;
}

export const CourseRegistrationView: React.FC<CourseRegistrationViewProps> = ({
  catalog,
  student,
  semesterPlan,
  onAddToPlan,
  onRemoveFromPlan,
  onClearPlan,
  onInspectPrereqs,
  onViewDetails,
  onCompareCourse,
  onOpenAdvisor,
  compareCourseA,
  compareCourseB,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'basket' | 'compare'>('catalog');

  const totalRegisteredCredits = semesterPlan.reduce((acc, c) => acc + c.credits, 0);
  const isOverload = totalRegisteredCredits > student.maxTargetCreditsSemester;

  return (
    <div className="space-y-6">
      {/* 1. Header & Registration Status Capsule */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
              Course Enrollment
            </span>
            <span className="text-xs text-slate-500 font-medium">2025/2026 Academic Year</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Semester Course Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Select, add, and drop core and elective course units for your degree pathway. All selections are validated against prerequisites and departmental ceilings.
          </p>
        </div>

        {/* Units Indicator */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Units
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-xl font-black ${isOverload ? 'text-rose-600' : 'text-slate-900'}`}>
                {totalRegisteredCredits}
              </span>
              <span className="text-xs text-slate-500">/ {student.maxTargetCreditsSemester} Max</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <button
            onClick={() => setActiveSubTab('basket')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'basket'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Basket ({semesterPlan.length})
          </button>
        </div>
      </div>

      {/* 2. Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'catalog'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Catalog & Recommendations</span>
        </button>

        <button
          onClick={() => setActiveSubTab('basket')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'basket'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Registered Course Basket ({semesterPlan.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('compare')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'compare'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Compare Elective Options</span>
        </button>
      </div>

      {/* 3. Sub-views */}
      {activeSubTab === 'catalog' && (
        <RecommendationFeed
          catalog={catalog}
          student={student}
          semesterPlan={semesterPlan}
          onAddToPlan={onAddToPlan}
          onRemoveFromPlan={onRemoveFromPlan}
          onInspectPrereqs={onInspectPrereqs}
          onViewDetails={onViewDetails}
          onCompareCourse={(c) => {
            onCompareCourse(c);
            setActiveSubTab('compare');
          }}
          onOpenAdvisor={onOpenAdvisor}
        />
      )}

      {activeSubTab === 'basket' && (
        <SemesterScheduleBasket
          student={student}
          semesterPlan={semesterPlan}
          onRemoveFromPlan={onRemoveFromPlan}
          onClearPlan={onClearPlan}
          onOpenAdvisor={onOpenAdvisor}
          onNavigateToCatalog={() => setActiveSubTab('catalog')}
        />
      )}

      {activeSubTab === 'compare' && (
        <CourseComparisonView
          catalog={catalog}
          student={student}
          semesterPlan={semesterPlan}
          onAddToPlan={onAddToPlan}
          onRemoveFromPlan={onRemoveFromPlan}
          initialCourseA={compareCourseA}
          initialCourseB={compareCourseB}
        />
      )}
    </div>
  );
};
