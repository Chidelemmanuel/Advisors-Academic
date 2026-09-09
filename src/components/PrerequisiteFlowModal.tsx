/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Course, UndergraduateStudentProfile } from '../types';

interface PrerequisiteFlowModalProps {
  course: Course | null;
  onClose: () => void;
  student: UndergraduateStudentProfile;
  catalog: Course[];
  onSelectCourse: (c: Course) => void;
}

export const PrerequisiteFlowModal: React.FC<PrerequisiteFlowModalProps> = ({
  course,
  onClose,
  student,
  catalog,
  onSelectCourse,
}) => {
  if (!course) return null;

  const completedCodes = new Set(student.completedCourses.map((c) => c.code));

  // Direct upstream prerequisites
  const upstreamCourses = catalog.filter((c) => course.prerequisites.includes(c.code));

  // Direct downstream unlocked courses
  const downstreamCourses = catalog.filter((c) => course.unlocks.includes(c.code));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Curriculum Pathway & Dependency Map
              </h3>
              <p className="text-xs text-slate-500">
                Visualizing prerequisites and future course unlocks for <strong className="text-slate-800">{course.code}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Section 1: Upstream Prerequisites Required */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Step 1: Required Prerequisites Prior to Enrollment
              </span>
              <span className="text-[11px] text-slate-400">
                {course.prerequisites.length === 0
                  ? 'No prerequisites'
                  : `${course.prerequisites.length} course(s) required`}
              </span>
            </div>

            {course.prerequisites.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>This is an open foundational course. You can enroll without prior prerequisites.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {course.prerequisites.map((prereqCode) => {
                  const prereqCourse = catalog.find((c) => c.code === prereqCode);
                  const isPassed = completedCodes.has(prereqCode);
                  const studentGrade = student.completedCourses.find((c) => c.code === prereqCode)?.grade;

                  return (
                    <div
                      key={prereqCode}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                        isPassed
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50/70 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold">{prereqCode}</span>
                          {isPassed && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white rounded">
                              Grade {studentGrade || 'A'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 truncate max-w-[180px] mt-0.5">
                          {prereqCourse?.title || prereqCode}
                        </p>
                      </div>

                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                          Missing
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Connection Visual Arrow */}
          <div className="flex justify-center text-slate-300">
            <ArrowDown className="w-5 h-5 text-indigo-400 animate-bounce" />
          </div>

          {/* Section 2: Current Target Course */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border-2 border-indigo-400/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Target Recommended Course</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-200/80 text-indigo-800">
                {course.level} &bull; {course.credits} Credits
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-slate-900">{course.code}: {course.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{course.description}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between text-xs text-indigo-950">
              <span>Weekly Workload: <strong>{course.workloadHours} hrs</strong></span>
              <span>Category: <strong>{course.category}</strong></span>
              <span>Instructor: <strong>{course.instructor.name}</strong></span>
            </div>
          </div>

          {/* Connection Visual Arrow */}
          <div className="flex justify-center text-slate-300">
            <ArrowDown className="w-5 h-5 text-indigo-400" />
          </div>

          {/* Section 3: Future Unlocked Courses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Step 3: Advanced Senior Courses Unlocked Upon Passing
              </span>
              <span className="text-[11px] text-slate-400">
                {course.unlocks.length === 0
                  ? 'Terminal Course'
                  : `${course.unlocks.length} downstream course(s)`}
              </span>
            </div>

            {course.unlocks.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                This course is a terminal elective or capstone. It does not gate subsequent prerequisites.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {course.unlocks.map((unlockCode) => {
                  const unlockCourse = catalog.find((c) => c.code === unlockCode);

                  return (
                    <div
                      key={unlockCode}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors text-xs flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900">{unlockCode}</span>
                          <span className="text-[10px] text-slate-500">
                            {unlockCourse?.level || 'Advanced'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate mt-0.5">
                          {unlockCourse?.title || unlockCode}
                        </p>
                      </div>

                      {unlockCourse && (
                        <button
                          onClick={() => {
                            onSelectCourse(unlockCourse);
                          }}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 shrink-0"
                        >
                          View
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
