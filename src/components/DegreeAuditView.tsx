/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  GraduationCap,
  GitBranch,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Plus,
  Check,
} from 'lucide-react';
import { Course, UndergraduateStudentProfile } from '../types';
import { computeDegreeAudit } from '../utils/courseMatchEngine';

interface DegreeAuditViewProps {
  catalog: Course[];
  student: UndergraduateStudentProfile;
  semesterPlan: Course[];
  onAddToPlan: (course: Course) => void;
  onInspectPrereqs: (course: Course) => void;
}

export const DegreeAuditView: React.FC<DegreeAuditViewProps> = ({
  catalog,
  student,
  semesterPlan,
  onAddToPlan,
  onInspectPrereqs,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'pathway'>('audit');

  const audit = computeDegreeAudit(student, semesterPlan);
  const completedCodes = new Set(student.completedCourses.map((c) => c.code));
  const plannedCodes = new Set(semesterPlan.map((c) => c.code));

  // Planned credits to factor into potential future progress
  const plannedCredits = semesterPlan.reduce((acc, c) => acc + c.credits, 0);
  const potentialCreditsTotal = audit.totalCreditsEarned + plannedCredits;
  const potentialProgressPercent = Math.min(
    100,
    Math.round((potentialCreditsTotal / audit.totalCreditsRequired) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Undergraduate Degree Audit & Graduation Tracker
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Program: <strong className="text-slate-700">{student.major}</strong> &bull; Standing:{' '}
              <strong className="text-slate-700">{student.standing} ({student.level})</strong> &bull; Cumulative GPA:{' '}
              <strong className="text-emerald-700">{student.currentGpa.toFixed(2)}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('audit')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Degree Audit Checklist
            </button>
            <button
              onClick={() => setActiveSubTab('pathway')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === 'pathway' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Prerequisite Flow Map
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Overall Degree Progress</span>
            <span className="font-bold text-slate-900">
              {audit.totalCreditsEarned} of {audit.totalCreditsRequired} Credits Completed ({audit.overallProgressPercent}%)
              {plannedCredits > 0 && (
                <span className="text-indigo-600 font-medium ml-1">
                  (+{plannedCredits} cr in current semester plan = {potentialProgressPercent}%)
                </span>
              )}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
            {/* Completed credits */}
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${audit.overallProgressPercent}%` }}
              title={`Completed: ${audit.totalCreditsEarned} credits`}
            />
            {/* Currently planned semester credits */}
            <div
              className="bg-indigo-400 h-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100 - audit.overallProgressPercent,
                  (plannedCredits / audit.totalCreditsRequired) * 100
                )}%`,
              }}
              title={`In Current Plan: ${plannedCredits} credits`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Completed ({audit.totalCreditsEarned} cr)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" /> In Current Basket ({plannedCredits} cr)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" /> Remaining ({Math.max(0, audit.totalCreditsRequired - potentialCreditsTotal)} cr)
              </span>
            </div>
            <span>Normal Pacing: 4-Year Graduation Track</span>
          </div>
        </div>
      </div>

      {activeSubTab === 'audit' ? (
        /* Category Breakdown Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audit.categories.map((cat) => {
            const percent = Math.min(100, Math.round((cat.creditsCompleted / cat.creditsRequired) * 100));

            // Available catalog courses in this category that student has not taken
            const missingEligibleCourses = catalog.filter(
              (c) => c.category === cat.category && !completedCodes.has(c.code)
            );

            return (
              <div
                key={cat.category}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{cat.category}</h3>
                      <p className="text-xs text-slate-500">
                        {cat.creditsCompleted} / {cat.creditsRequired} credits fulfilled
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 ${
                          cat.isComplete
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {cat.isComplete ? <CheckCircle2 className="w-3 h-3" /> : null}
                        {percent}% Done
                      </span>
                    </div>
                  </div>

                  {/* Category Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        cat.isComplete ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Completed Courses Chips */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Completed Courses:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.coursesTaken.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No courses completed yet</span>
                      ) : (
                        cat.coursesTaken.map((code) => {
                          const courseObj = student.completedCourses.find((c) => c.code === code);
                          return (
                            <span
                              key={code}
                              className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1"
                              title={`${courseObj?.title || code} - Grade: ${courseObj?.grade || 'A'}`}
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>{code}</span>
                              <span className="font-bold text-[10px] bg-white px-1 rounded text-emerald-700">
                                {courseObj?.grade || 'A'}
                              </span>
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Missing Requirements Guidance */}
                  {!cat.isComplete && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Recommended Courses to Fulfill Remaining {cat.creditsRequired - cat.creditsCompleted} Credits:
                      </span>
                      <div className="space-y-1.5">
                        {missingEligibleCourses.slice(0, 3).map((c) => {
                          const inPlan = plannedCodes.has(c.code);
                          return (
                            <div
                              key={c.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs transition-colors"
                            >
                              <div className="truncate mr-2">
                                <span className="font-mono font-bold text-slate-900 mr-1.5">{c.code}</span>
                                <span className="text-slate-700 truncate">{c.title}</span>
                                <span className="text-slate-400 ml-1">({c.credits} cr)</span>
                              </div>

                              {inPlan ? (
                                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 shrink-0">
                                  In Basket
                                </span>
                              ) : (
                                <button
                                  onClick={() => onAddToPlan(c)}
                                  className="text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-0.5 rounded shrink-0 transition-colors"
                                >
                                  + Add
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
                  <span>Category Target: {cat.creditsRequired} Credits</span>
                  <span>{cat.isComplete ? 'Requirement Satisfied' : `${cat.missingCoursesCount} more course(s) needed`}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Prerequisite Dependency Flow Map */
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Curriculum Prerequisite Progression Pathway
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Follow how 100-level foundational courses unlock 200-level core structures, leading to 300-level junior concentrations and culminating in the 400-level senior capstone.
            </p>
          </div>

          {/* Flow Tiers: 100L -> 200L -> 300L -> 400L */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* 100L Column */}
            <div className="space-y-3">
              <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 text-center border border-slate-200">
                100-Level Foundations
              </div>
              <div className="space-y-2.5">
                {catalog
                  .filter((c) => c.level === '100L')
                  .map((course) => {
                    const isDone = completedCodes.has(course.code);
                    const isPlan = plannedCodes.has(course.code);

                    return (
                      <div
                        key={course.id}
                        onClick={() => onInspectPrereqs(course)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-sm ${
                          isDone
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                            : isPlan
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-950'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold">{course.code}</span>
                          {isDone ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white rounded">
                              Passed
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">{course.credits} cr</span>
                          )}
                        </div>
                        <p className="font-medium line-clamp-1">{course.title}</p>
                        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                          <span>Unlocks {course.unlocks.length} courses</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* 200L Column */}
            <div className="space-y-3">
              <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 text-center border border-slate-200">
                200-Level Core
              </div>
              <div className="space-y-2.5">
                {catalog
                  .filter((c) => c.level === '200L')
                  .map((course) => {
                    const isDone = completedCodes.has(course.code);
                    const isPlan = plannedCodes.has(course.code);

                    return (
                      <div
                        key={course.id}
                        onClick={() => onInspectPrereqs(course)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-sm ${
                          isDone
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                            : isPlan
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-950'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold">{course.code}</span>
                          {isDone ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white rounded">
                              Passed
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">{course.credits} cr</span>
                          )}
                        </div>
                        <p className="font-medium line-clamp-1">{course.title}</p>
                        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                          <span>Req: {course.prerequisites.join(', ')}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* 300L Column */}
            <div className="space-y-3">
              <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 text-center border border-slate-200">
                300-Level Concentrations
              </div>
              <div className="space-y-2.5">
                {catalog
                  .filter((c) => c.level === '300L')
                  .map((course) => {
                    const isDone = completedCodes.has(course.code);
                    const isPlan = plannedCodes.has(course.code);

                    return (
                      <div
                        key={course.id}
                        onClick={() => onInspectPrereqs(course)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-sm ${
                          isDone
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                            : isPlan
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-950'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold">{course.code}</span>
                          {isDone ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white rounded">
                              Passed
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">{course.credits} cr</span>
                          )}
                        </div>
                        <p className="font-medium line-clamp-1">{course.title}</p>
                        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                          <span>Unlocks: {course.unlocks.length > 0 ? course.unlocks.join(', ') : 'None'}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* 400L Column */}
            <div className="space-y-3">
              <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 text-center border border-slate-200">
                400-Level Capstone
              </div>
              <div className="space-y-2.5">
                {catalog
                  .filter((c) => c.level === '400L')
                  .map((course) => {
                    const isDone = completedCodes.has(course.code);
                    const isPlan = plannedCodes.has(course.code);

                    return (
                      <div
                        key={course.id}
                        onClick={() => onInspectPrereqs(course)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-sm ${
                          isDone
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                            : isPlan
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-950'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold">{course.code}</span>
                          {isDone ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white rounded">
                              Passed
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">{course.credits} cr</span>
                          )}
                        </div>
                        <p className="font-medium line-clamp-1">{course.title}</p>
                        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                          <span>Req: {course.prerequisites.join(', ')}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3 border border-slate-200">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Completed & Passed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-500 inline-block" /> In Current Semester Plan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-white border border-slate-300 inline-block" /> Future Available Elective
              </span>
            </div>
            <span className="text-slate-500">Click any course node to view its direct upstream/downstream connections</span>
          </div>
        </div>
      )}
    </div>
  );
};
