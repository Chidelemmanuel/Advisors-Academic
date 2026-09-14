/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Compass,
  MapPin,
  Layers,
  User,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { UndergraduateStudentProfile, Course, SelectedInstitutionPlan } from '../types';

interface StudentDashboardViewProps {
  student: UndergraduateStudentProfile;
  semesterPlan: Course[];
  selectedPlan: SelectedInstitutionPlan;
  onNavigateToTab: (tab: 'dashboard' | 'registration' | 'results' | 'selector' | 'roadmap' | 'audit' | 'ai-advisor') => void;
  onOpenProfileModal: () => void;
  onViewCourseDetails: (course: Course) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  student,
  semesterPlan,
  selectedPlan,
  onNavigateToTab,
  onOpenProfileModal,
  onViewCourseDetails,
}) => {
  // Registered semester units
  const totalPlannedUnits = semesterPlan.reduce((acc, c) => acc + c.credits, 0);
  const isOverload = totalPlannedUnits > student.maxTargetCreditsSemester;

  // Degree classification
  const gpa = student.currentGpa;
  let standingRemark = 'First Class Honours';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (gpa < 3.5 && gpa >= 3.0) {
    standingRemark = 'Second Class Upper (2:1)';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (gpa < 3.0) {
    standingRemark = 'Good Academic Standing';
    badgeColor = 'bg-slate-50 text-slate-700 border-slate-200';
  }

  // Recent completed courses (last 3)
  const recentCompleted = student.completedCourses.slice(-3).reverse();

  return (
    <div className="space-y-6">
      {/* 1. Top Welcome Banner */}
      <div className="bg-linear-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-100 border border-blue-400/30">
                Student Portal • 2025/2026 Session
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white">
                {student.level} • {student.standing}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {student.name}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Matriculation ID: <span className="font-mono font-bold text-white">{student.studentId}</span> • Major: <span className="font-semibold text-white">{student.major}</span>
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('registration')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Register Courses</span>
            </button>
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Academic Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Academic Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative GPA */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Cumulative GPA (CGPA)</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{student.currentGpa.toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
            </div>
            <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border mt-1.5 ${badgeColor}`}>
              {standingRemark}
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('results')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>View Result Slip</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Semester Registered Units */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Registered This Term</span>
            <BookOpen className="w-4 h-4 text-orange-500" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{totalPlannedUnits}</span>
              <span className="text-xs text-slate-500">/ {student.maxTargetCreditsSemester} Max Units</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {semesterPlan.length} courses actively scheduled
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('registration')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>Manage Course Basket</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Degree Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Degree Completion</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{student.completedCredits}</span>
              <span className="text-xs text-slate-500">/ {student.totalDegreeCreditsRequired} Units</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${Math.round((student.completedCredits / student.totalDegreeCreditsRequired) * 100)}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('audit')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>Check Degree Audit</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clearance & Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Registration Clearance</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="my-2">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-lg">
              <CheckCircle2 className="w-5 h-5" />
              <span>Cleared & Enrolled</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Fees & Departmental clearance verified
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('roadmap')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>View Clearance Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Registered Courses & Recent Results (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Semester Registered Courses Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Current Semester Course Registration</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official courses selected for this academic term ({totalPlannedUnits} Units registered)
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('registration')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 cursor-pointer"
              >
                <span>Add / Drop Courses</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {semesterPlan.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">No courses registered for this semester yet.</p>
                <button
                  onClick={() => onNavigateToTab('registration')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Browse Course Catalog
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {semesterPlan.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {c.code}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {c.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span>{c.instructor.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{c.scheduleSlot}</span>
                        </span>
                        <span>•</span>
                        <span className="hidden sm:inline">{c.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md">
                        {c.credits} Units
                      </span>
                      <button
                        onClick={() => onViewCourseDetails(c)}
                        className="text-xs text-slate-500 hover:text-blue-600 p-1 rounded-md hover:bg-slate-100 cursor-pointer"
                        title="View Course Syllabus & Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Examination Results Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Recent Semester Examination Results</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Previous term grades and performance breakdown
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('results')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 cursor-pointer"
              >
                <span>Full Transcript & Slip</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Course Code</th>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3 text-center">Units</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3 text-center">Pts</th>
                    <th className="py-2.5 px-3">Term</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {recentCompleted.map((rc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{rc.code}</td>
                      <td className="py-2.5 px-3 truncate max-w-xs">{rc.title}</td>
                      <td className="py-2.5 px-3 text-center font-semibold">{rc.credits}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block font-black text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {rc.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">{rc.gradePoints.toFixed(1)}</td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">{rc.termTaken}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Shortcuts, Academic Calendar & Notices */}
        <div className="space-y-6">
          {/* Quick Portal Navigation Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateToTab('registration')}
                className="p-3 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/30 text-left transition-all group cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-orange-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Course Reg</div>
                <div className="text-[10px] text-slate-500">Add / drop units</div>
              </button>

              <button
                onClick={() => onNavigateToTab('results')}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 text-left transition-all group cursor-pointer"
              >
                <Award className="w-4 h-4 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Results</div>
                <div className="text-[10px] text-slate-500">View statement</div>
              </button>

              <button
                onClick={() => onNavigateToTab('audit')}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all group cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Degree Audit</div>
                <div className="text-[10px] text-slate-500">Graduation tracking</div>
              </button>

              <button
                onClick={() => onNavigateToTab('ai-advisor')}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 text-left transition-all group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900">AI Counselor</div>
                <div className="text-[10px] text-slate-500">Academic advisory</div>
              </button>
            </div>
          </div>

          {/* Academic Calendar & Dates */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Academic Deadlines</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Course Registration Add/Drop Deadline</span>
                  <span className="text-[11px] text-slate-500">Friday, Oct 24 • Late registration penalties apply after</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Mid-Semester Continuous Assessment</span>
                  <span className="text-[11px] text-slate-500">Nov 10 - Nov 17 • Departmental halls</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Semester Examination Clearance</span>
                  <span className="text-[11px] text-slate-500">Dec 01 • Ensure all course units verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Noticeboard */}
          <div className="bg-blue-50/60 rounded-2xl border border-blue-200 p-5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-blue-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Registrar's Notice</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              All returning undergraduate students must confirm their biometric verification and update their departmental files before examination docket issuance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
