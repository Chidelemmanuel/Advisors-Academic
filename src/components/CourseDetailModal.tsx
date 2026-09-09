/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  BookOpen,
  User,
  Clock,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Course, UndergraduateStudentProfile } from '../types';
import { evaluateCourseRecommendation } from '../utils/courseMatchEngine';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  student: UndergraduateStudentProfile;
  semesterPlan: Course[];
  onAddToPlan: (course: Course) => void;
  onRemoveFromPlan: (courseId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  student,
  semesterPlan,
  onAddToPlan,
  onRemoveFromPlan,
}) => {
  if (!course) return null;

  const isInPlan = semesterPlan.some((c) => c.id === course.id);
  const rec = evaluateCourseRecommendation(course, student, semesterPlan);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {course.code}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {course.credits} Credit Units
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                {course.level}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-medium border border-sky-200/60">
                {course.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {course.title}
            </h3>
            <p className="text-xs text-slate-500">
              Department of {course.department}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Overview & Match Rationale */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">Course Overview</span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {rec.matchScore}% Match Score
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">{course.description}</p>
          </div>

          {/* Quick Schedule & Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Lecture Schedule</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 mt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{course.scheduleSlot}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Location / Hall</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{course.location}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Weekly Study Workload</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 mt-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{course.workloadHours} hrs / week</span>
              </div>
            </div>
          </div>

          {/* Instructor Profile */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                {course.instructor.name.charAt(course.instructor.name.indexOf(' ') + 1) || 'P'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{course.instructor.name}</h4>
                <p className="text-slate-500">{course.instructor.title} &bull; Office Hours: {course.instructor.officeHours}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-bold text-amber-600 text-sm">★ {course.instructor.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 block">Instructor Rating</span>
            </div>
          </div>

          {/* Syllabus Outline */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
              Syllabus Outline & Module Topics:
            </span>
            <div className="space-y-1.5">
              {course.syllabus.map((topic, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2"
                >
                  <span className="font-mono text-slate-400 shrink-0 font-semibold">
                    0{index + 1}.
                  </span>
                  <span className="text-slate-700 font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grading Policy & Historical Distribution */}
          <div className="space-y-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
              Grading Assessment Structure:
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Assignments</span>
                <span className="font-bold text-slate-800 text-sm">{course.assessment.assignments}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Midterm</span>
                <span className="font-bold text-slate-800 text-sm">{course.assessment.midterm}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Projects</span>
                <span className="font-bold text-indigo-600 text-sm">{course.assessment.projects}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Final Exam</span>
                <span className="font-bold text-slate-800 text-sm">{course.assessment.finalExam}%</span>
              </div>
            </div>

            {/* Historical Grade Bar */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Historical Grade Distribution (Class Avg: {course.gradeDistribution.averageGpa.toFixed(2)} GPA)</span>
                <span className="text-slate-500">{course.studentReviewsCount} verified student evaluations</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200">
                <div style={{ width: `${course.gradeDistribution.aPercent}%` }} className="bg-emerald-500" title={`A Grade: ${course.gradeDistribution.aPercent}%`} />
                <div style={{ width: `${course.gradeDistribution.bPercent}%` }} className="bg-sky-500" title={`B Grade: ${course.gradeDistribution.bPercent}%`} />
                <div style={{ width: `${course.gradeDistribution.cPercent}%` }} className="bg-amber-400" title={`C Grade: ${course.gradeDistribution.cPercent}%`} />
                <div style={{ width: `${course.gradeDistribution.dfPercent}%` }} className="bg-rose-400" title={`D/F Grade: ${course.gradeDistribution.dfPercent}%`} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                <span>A: {course.gradeDistribution.aPercent}%</span>
                <span>B: {course.gradeDistribution.bPercent}%</span>
                <span>C: {course.gradeDistribution.cPercent}%</span>
                <span>D/F: {course.gradeDistribution.dfPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>

          {isInPlan ? (
            <button
              onClick={() => {
                onRemoveFromPlan(course.id);
                onClose();
              }}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove from Basket</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onAddToPlan(course);
                onClose();
              }}
              disabled={!rec.prereqStatus.satisfied}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                rec.prereqStatus.satisfied
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{rec.prereqStatus.satisfied ? 'Add to Semester Basket' : 'Prerequisites Missing'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
