/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CalendarCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Info,
  Layers,
} from 'lucide-react';
import { Course, UndergraduateStudentProfile } from '../types';

interface SemesterScheduleBasketProps {
  student: UndergraduateStudentProfile;
  semesterPlan: Course[];
  onRemoveFromPlan: (courseId: string) => void;
  onClearPlan: () => void;
  onOpenAdvisor: () => void;
  onNavigateToCatalog: () => void;
}

export const SemesterScheduleBasket: React.FC<SemesterScheduleBasketProps> = ({
  student,
  semesterPlan,
  onRemoveFromPlan,
  onClearPlan,
  onOpenAdvisor,
  onNavigateToCatalog,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Calculated totals
  const totalCredits = semesterPlan.reduce((acc, c) => acc + c.credits, 0);
  const totalWorkloadHours = semesterPlan.reduce((acc, c) => acc + c.workloadHours, 0);
  const averageDifficulty =
    semesterPlan.length > 0
      ? (semesterPlan.reduce((acc, c) => acc + c.difficultyScore, 0) / semesterPlan.length).toFixed(1)
      : '0.0';

  // Audit checks
  const isOverload = totalCredits > student.maxTargetCreditsSemester;
  const isUnderload = totalCredits > 0 && totalCredits < 12;
  const heavyCoursesCount = semesterPlan.filter((c) => c.difficultyScore >= 4.0).length;
  const isHeavyWorkload = totalWorkloadHours > student.preferredWeeklyHours;

  const handleCopySlip = () => {
    const text = `Undergraduate Course Registration:
Student: ${student.name} (${student.studentId})
Major: ${student.major} | Level: ${student.level} | Track: ${student.selectedTrack}
Total Planned Credits: ${totalCredits}
Courses:
${semesterPlan.map((c) => `- ${c.code}: ${c.title} (${c.credits} cr) [${c.scheduleSlot}]`).join('\n')}
Estimated Weekly Study Workload: ${totalWorkloadHours} hrs/week`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSummary = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Semester Enrollment Schedule & Basket
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              {semesterPlan.length} Courses Selected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review your upcoming semester course load, prerequisite consistency, and weekly workload balance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {semesterPlan.length > 0 && (
            <>
              <button
                onClick={handleCopySlip}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copied ? 'Copied Slip' : 'Copy Course Slip'}</span>
              </button>

              <button
                onClick={handleDownloadSummary}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>{downloaded ? 'Generated PDF Slip' : 'Export Slip'}</span>
              </button>

              <button
                onClick={onClearPlan}
                className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Credit & Workload Barometers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Credit Cap Meter */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Enrolled Credit Units</span>
            <span className="font-bold text-slate-900">
              {totalCredits} / {student.maxTargetCreditsSemester} Max
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isOverload
                  ? 'bg-rose-500'
                  : totalCredits >= 15
                  ? 'bg-indigo-600'
                  : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, (totalCredits / student.maxTargetCreditsSemester) * 100)}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Min Full-time: 12 cr</span>
            <span className={isOverload ? 'text-rose-600 font-bold' : ''}>
              {isOverload
                ? `Exceeds cap by ${totalCredits - student.maxTargetCreditsSemester} credits`
                : `${student.maxTargetCreditsSemester - totalCredits} credits available`}
            </span>
          </div>
        </div>

        {/* Weekly Study Workload Barometer */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Estimated Study Workload</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {totalWorkloadHours} hrs / week
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isHeavyWorkload ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, (totalWorkloadHours / 35) * 100)}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Target: ~{student.preferredWeeklyHours} hrs/wk</span>
            <span className={isHeavyWorkload ? 'text-amber-600 font-semibold' : 'text-emerald-600 font-semibold'}>
              {isHeavyWorkload ? 'High Workload Pace' : 'Balanced Study Pace'}
            </span>
          </div>
        </div>

        {/* Academic Rigor Index */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Average Rigor & Difficulty</span>
            <span className="font-bold text-slate-900">{averageDifficulty} / 5.0</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
              {heavyCoursesCount} Heavy Core {heavyCoursesCount === 1 ? 'Course' : 'Courses'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
              {semesterPlan.filter((c) => c.gradeDistribution.averageGpa >= 3.4).length} GPA Boosters
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            {heavyCoursesCount >= 3 ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> High burnout risk with 3+ rigorous courses
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Healthy distribution of theory and projects
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Warnings & Advising Alerts Banner */}
      {(isOverload || isUnderload || heavyCoursesCount >= 3) && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Academic Load Review Notices</span>
          </div>
          <ul className="text-xs space-y-1 pl-6 list-disc">
            {isOverload && (
              <li>
                <strong>Credit Overload:</strong> You have planned {totalCredits} credits, exceeding your advisor's recommended cap of {student.maxTargetCreditsSemester}. An overload requires departmental approval.
              </li>
            )}
            {isUnderload && (
              <li>
                <strong>Underload:</strong> Enrolling in fewer than 12 credits may impact full-time undergraduate standing, residency, or scholarship qualification.
              </li>
            )}
            {heavyCoursesCount >= 3 && (
              <li>
                <strong>Multiple High-Intensity Courses:</strong> Stacking {heavyCoursesCount} rigorous courses in one semester elevates exam crunch risks. Consider swapping one for a project-based or general elective.
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Selected Courses Table / List */}
      {semesterPlan.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600 mb-3">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Your Semester Basket is Empty</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Select courses from your personalized recommendation feed to build an optimal, balanced semester schedule.
          </p>
          <button
            onClick={onNavigateToCatalog}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span>Browse Recommended Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enrolled Course Roster ({semesterPlan.length})
            </span>
            <button
              onClick={onOpenAdvisor}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Review Schedule with Gemini AI</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {semesterPlan.map((course, index) => (
              <div
                key={course.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {course.code}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      {course.credits} Credits
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        course.category === 'Major Core'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          : course.category === 'Track Elective'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {course.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      &bull; {course.level}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {course.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>
                      Schedule: <strong className="text-slate-700 font-medium">{course.scheduleSlot}</strong>
                    </span>
                    <span>
                      Room: <strong className="text-slate-700 font-medium">{course.location}</strong>
                    </span>
                    <span>
                      Instructor: <strong className="text-slate-700 font-medium">{course.instructor.name}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block font-medium">Study Load</span>
                    <span className="font-bold text-slate-800">{course.workloadHours} hrs/wk</span>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-400 block font-medium">Avg Grade</span>
                    <span className="font-bold text-emerald-700">
                      {course.gradeDistribution.averageGpa.toFixed(2)} GPA
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveFromPlan(course.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove course from basket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
            <span>
              Total Enrolled Credits: <strong className="text-slate-900 font-bold">{totalCredits} credits</strong> &bull; Total Study Commitment: <strong className="text-slate-900 font-bold">{totalWorkloadHours} hours/week</strong>
            </span>
            <button
              onClick={onOpenAdvisor}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Validate Load with AI Academic Advisor</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
