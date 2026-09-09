/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  BookOpen,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Course, UndergraduateStudentProfile } from '../types';
import { evaluateCourseRecommendation } from '../utils/courseMatchEngine';

interface CourseComparisonViewProps {
  catalog: Course[];
  student: UndergraduateStudentProfile;
  semesterPlan: Course[];
  onAddToPlan: (course: Course) => void;
  onRemoveFromPlan: (courseId: string) => void;
  initialCourseA?: Course;
  initialCourseB?: Course;
}

export const CourseComparisonView: React.FC<CourseComparisonViewProps> = ({
  catalog,
  student,
  semesterPlan,
  onAddToPlan,
  onRemoveFromPlan,
  initialCourseA,
  initialCourseB,
}) => {
  const [courseAId, setCourseAId] = useState<string>(
    initialCourseA?.id || catalog[3]?.id || catalog[0]?.id
  );
  const [courseBId, setCourseBId] = useState<string>(
    initialCourseB?.id || catalog[7]?.id || catalog[1]?.id
  );

  const courseA = catalog.find((c) => c.id === courseAId) || catalog[0];
  const courseB = catalog.find((c) => c.id === courseBId) || catalog[1];

  const recA = evaluateCourseRecommendation(courseA, student, semesterPlan);
  const recB = evaluateCourseRecommendation(courseB, student, semesterPlan);

  const isInPlanA = semesterPlan.some((c) => c.id === courseA.id);
  const isInPlanB = semesterPlan.some((c) => c.id === courseB.id);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Side-by-Side Elective Course Comparison
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Directly evaluate two courses on workload commitments, grading policy, assessment distribution, and strategic alignment with your career track.
        </p>

        {/* Dropdowns to select which courses to compare */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Select Primary Option (Course A):
            </label>
            <select
              aria-label="Select Course A"
              value={courseAId}
              onChange={(e) => setCourseAId(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            >
              {catalog.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.title} ({c.credits} cr &bull; {c.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Select Alternative Option (Course B):
            </label>
            <select
              aria-label="Select Course B"
              value={courseBId}
              onChange={(e) => setCourseBId(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            >
              {catalog.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.title} ({c.credits} cr &bull; {c.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course A Column */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {courseA.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{courseA.title}</h3>
                <p className="text-xs text-slate-500">{courseA.department} &bull; {courseA.level}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  {recA.matchScore}% Match
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">{recA.priorityRank}</span>
              </div>
            </div>

            {/* Assessment Breakdown Chart */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Assessment Structure:
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Homework</span>
                  <span className="font-bold text-slate-800">{courseA.assessment.assignments}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Midterm</span>
                  <span className="font-bold text-slate-800">{courseA.assessment.midterm}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Projects</span>
                  <span className="font-bold text-indigo-700">{courseA.assessment.projects}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Final Exam</span>
                  <span className="font-bold text-slate-800">{courseA.assessment.finalExam}%</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Workload / Week</span>
                <span className="font-bold text-slate-800 text-sm">{courseA.workloadHours} hrs</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Historical Class GPA</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {courseA.gradeDistribution.averageGpa.toFixed(2)} / 4.0
                </span>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="text-xs space-y-1">
              <span className="font-semibold text-slate-700">Prerequisites:</span>
              <p className="text-slate-600">
                {courseA.prerequisites.length > 0 ? courseA.prerequisites.join(', ') : 'None required'}
              </p>
              <div
                className={`text-[11px] font-medium p-1.5 rounded flex items-center gap-1 ${
                  recA.prereqStatus.satisfied
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-rose-50 text-rose-800'
                }`}
              >
                {recA.prereqStatus.satisfied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Prerequisites satisfied</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Missing: {recA.prereqStatus.missingPrereqs.join(', ')}</span>
                  </>
                )}
              </div>
            </div>

            {/* Downstream Unlocks */}
            <div className="text-xs">
              <span className="font-semibold text-slate-700">Subsequent Courses Unlocked:</span>
              <p className="text-slate-600 mt-0.5">
                {courseA.unlocks.length > 0 ? courseA.unlocks.join(', ') : 'Terminal course (Capstone or elective)'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            {isInPlanA ? (
              <button
                onClick={() => onRemoveFromPlan(courseA.id)}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove from Basket</span>
              </button>
            ) : (
              <button
                onClick={() => onAddToPlan(courseA)}
                disabled={!recA.prereqStatus.satisfied}
                className={`w-full py-2 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 ${
                  recA.prereqStatus.satisfied
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-xs'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Option A to Basket</span>
              </button>
            )}
          </div>
        </div>

        {/* Course B Column */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {courseB.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{courseB.title}</h3>
                <p className="text-xs text-slate-500">{courseB.department} &bull; {courseB.level}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  {recB.matchScore}% Match
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">{recB.priorityRank}</span>
              </div>
            </div>

            {/* Assessment Breakdown Chart */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Assessment Structure:
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Homework</span>
                  <span className="font-bold text-slate-800">{courseB.assessment.assignments}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Midterm</span>
                  <span className="font-bold text-slate-800">{courseB.assessment.midterm}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Projects</span>
                  <span className="font-bold text-indigo-700">{courseB.assessment.projects}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Final Exam</span>
                  <span className="font-bold text-slate-800">{courseB.assessment.finalExam}%</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Workload / Week</span>
                <span className="font-bold text-slate-800 text-sm">{courseB.workloadHours} hrs</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Historical Class GPA</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {courseB.gradeDistribution.averageGpa.toFixed(2)} / 4.0
                </span>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="text-xs space-y-1">
              <span className="font-semibold text-slate-700">Prerequisites:</span>
              <p className="text-slate-600">
                {courseB.prerequisites.length > 0 ? courseB.prerequisites.join(', ') : 'None required'}
              </p>
              <div
                className={`text-[11px] font-medium p-1.5 rounded flex items-center gap-1 ${
                  recB.prereqStatus.satisfied
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-rose-50 text-rose-800'
                }`}
              >
                {recB.prereqStatus.satisfied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Prerequisites satisfied</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Missing: {recB.prereqStatus.missingPrereqs.join(', ')}</span>
                  </>
                )}
              </div>
            </div>

            {/* Downstream Unlocks */}
            <div className="text-xs">
              <span className="font-semibold text-slate-700">Subsequent Courses Unlocked:</span>
              <p className="text-slate-600 mt-0.5">
                {courseB.unlocks.length > 0 ? courseB.unlocks.join(', ') : 'Terminal course (Capstone or elective)'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            {isInPlanB ? (
              <button
                onClick={() => onRemoveFromPlan(courseB.id)}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove from Basket</span>
              </button>
            ) : (
              <button
                onClick={() => onAddToPlan(courseB)}
                disabled={!recB.prereqStatus.satisfied}
                className={`w-full py-2 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 ${
                  recB.prereqStatus.satisfied
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-xs'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Option B to Basket</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
