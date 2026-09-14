/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  FileText,
  Printer,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Download,
  Search,
  ChevronDown,
  Building2,
  User,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { UndergraduateStudentProfile, CompletedCourse, Course } from '../types';

interface StudentResultsViewProps {
  student: UndergraduateStudentProfile;
  semesterPlan?: Course[];
}

export const StudentResultsView: React.FC<StudentResultsViewProps> = ({
  student,
  semesterPlan = [],
}) => {
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);

  // Extract all unique terms from student's completed courses
  const allTerms = Array.from(
    new Set(student.completedCourses.map((c) => c.termTaken))
  );

  // Filter courses by selected term and search
  const filteredCourses = student.completedCourses.filter((course) => {
    const matchesTerm = selectedTerm === 'all' || course.termTaken === selectedTerm;
    const matchesSearch =
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTerm && matchesSearch;
  });

  // Calculate statistics
  const totalUnitsRegistered = student.completedCourses.reduce(
    (acc, c) => acc + c.credits,
    0
  );
  const totalUnitsEarned = student.completedCourses
    .filter((c) => c.grade !== 'P' ? c.gradePoints > 0 : true)
    .reduce((acc, c) => acc + c.credits, 0);

  const totalGradePoints = student.completedCourses.reduce(
    (acc, c) => acc + c.gradePoints * c.credits,
    0
  );

  const computedCgpa =
    totalUnitsRegistered > 0
      ? (totalGradePoints / totalUnitsRegistered).toFixed(2)
      : student.currentGpa.toFixed(2);

  // Term specific stats if a specific term is selected
  const termCourses =
    selectedTerm === 'all'
      ? student.completedCourses
      : student.completedCourses.filter((c) => c.termTaken === selectedTerm);

  const termUnits = termCourses.reduce((acc, c) => acc + c.credits, 0);
  const termPoints = termCourses.reduce((acc, c) => acc + c.gradePoints * c.credits, 0);
  const termGpa = termUnits > 0 ? (termPoints / termUnits).toFixed(2) : '0.00';

  // Determine Nigerian/UK/US Class of Degree
  const getDegreeClassification = (gpaNum: number) => {
    if (gpaNum >= 3.5) return { label: 'First Class Honours', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (gpaNum >= 3.0) return { label: 'Second Class Upper (2:1)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (gpaNum >= 2.4) return { label: 'Second Class Lower (2:2)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (gpaNum >= 2.0) return { label: 'Third Class Honours', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Pass', color: 'text-slate-700 bg-slate-50 border-slate-200' };
  };

  const degreeClass = getDegreeClassification(parseFloat(computedCgpa));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              Academic Record & Results
            </span>
            <span className="text-xs text-slate-500 font-medium">Session 2025/2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Examination Results & Transcript
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Official semester-by-semester grades, credit units earned, quality points, and verified degree classification.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setShowSlipModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Official Result Slip</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative GPA */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
            <span>Cumulative GPA (CGPA)</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{computedCgpa}</span>
            <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
          </div>
          <div className="mt-2">
            <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border ${degreeClass.color}`}>
              {degreeClass.label}
            </span>
          </div>
        </div>

        {/* Total Credits Registered */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
            <span>Total Registered Units (TCUR)</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalUnitsRegistered}</span>
            <span className="text-xs text-slate-500">Units</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Across {student.completedCourses.length} accredited courses
          </p>
        </div>

        {/* Total Credits Earned */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
            <span>Total Units Earned (TCUE)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{totalUnitsEarned}</span>
            <span className="text-xs text-slate-500">/ {student.totalDegreeCreditsRequired} Required</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((totalUnitsEarned / student.totalDegreeCreditsRequired) * 100))}%` }}
            />
          </div>
        </div>

        {/* Academic Standing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
            <span>Academic Standing</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900">
            Good Standing
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Eligible for semester registration and examination clearance
          </p>
        </div>
      </div>

      {/* Filter and Course Grade Records */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Filter by Term:</span>
            <select
              aria-label="Filter results by semester term"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Semesters ({student.completedCourses.length} Courses)</option>
              {allTerms.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search course code or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-800 rounded-xl pl-8 pr-3 py-1.5 w-full sm:w-64 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Course Code</th>
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Units</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Grade Points</th>
                <th className="py-3 px-4 text-center">Quality Points</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4 text-right">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No results found matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course, idx) => {
                  const qualityPoints = (course.gradePoints * course.credits).toFixed(1);
                  const isA = course.grade.startsWith('A');
                  const isB = course.grade.startsWith('B');

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {course.code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {course.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                          {course.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {course.credits}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-lg text-xs font-black ${
                            isA
                              ? 'bg-emerald-100 text-emerald-800'
                              : isB
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {course.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-700">
                        {course.gradePoints.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900">
                        {qualityPoints}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {course.termTaken}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-emerald-600 font-bold text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Passed</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Table Footer with Summary */}
            <tfoot className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
              <tr>
                <td colSpan={3} className="py-3 px-4 text-right uppercase text-[11px] text-slate-500">
                  {selectedTerm === 'all' ? 'Cumulative Total:' : `Semester (${selectedTerm}) Total:`}
                </td>
                <td className="py-3 px-4 text-center text-blue-700">
                  {filteredCourses.reduce((acc, c) => acc + c.credits, 0)} Units
                </td>
                <td colSpan={2} className="py-3 px-4 text-right uppercase text-[11px] text-slate-500">
                  {selectedTerm === 'all' ? 'CGPA:' : 'Semester GPA:'}
                </td>
                <td className="py-3 px-4 text-center text-blue-700 text-sm">
                  {selectedTerm === 'all' ? computedCgpa : termGpa}
                </td>
                <td colSpan={2} className="py-3 px-4 text-right text-emerald-600">
                  Clear Academic Standing
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Official Result Slip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 animate-in fade-in zoom-in-95">
            {/* Print Header */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <GraduationCap className="w-7 h-7 text-blue-600" />
                <span className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  {student.university}
                </span>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Office of the University Registrar • Directorate of Academic Affairs
              </div>
              <div className="text-sm font-extrabold text-blue-700 mt-2">
                OFFICIAL STATEMENT OF ACADEMIC RESULTS
              </div>
            </div>

            {/* Student Bio Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Student Name:</span>
                <span className="font-bold text-slate-900">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Matric / Student ID:</span>
                <span className="font-bold text-slate-900">{student.studentId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Program of Study:</span>
                <span className="font-bold text-slate-900">{student.major}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Current Level:</span>
                <span className="font-bold text-slate-900">{student.level} ({student.standing})</span>
              </div>
            </div>

            {/* Grades Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Title</th>
                    <th className="p-2.5 text-center">Units</th>
                    <th className="p-2.5 text-center">Grade</th>
                    <th className="p-2.5 text-center">Pts</th>
                    <th className="p-2.5">Term</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.completedCourses.map((c, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-bold text-slate-800">{c.code}</td>
                      <td className="p-2 text-slate-700">{c.title}</td>
                      <td className="p-2 text-center font-semibold">{c.credits}</td>
                      <td className="p-2 text-center font-bold text-slate-900">{c.grade}</td>
                      <td className="p-2 text-center font-semibold">{c.gradePoints.toFixed(1)}</td>
                      <td className="p-2 text-slate-500 text-[11px]">{c.termTaken}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Block */}
            <div className="grid grid-cols-3 gap-3 bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-center text-xs">
              <div>
                <span className="text-slate-500 block">Total Units Registered:</span>
                <span className="text-base font-bold text-slate-900">{totalUnitsRegistered}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Units Earned:</span>
                <span className="text-base font-bold text-emerald-700">{totalUnitsEarned}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cumulative GPA (CGPA):</span>
                <span className="text-base font-black text-blue-700">{computedCgpa} / 4.00</span>
              </div>
            </div>

            {/* Verification Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs text-slate-500">
              <div className="space-y-6">
                <div className="h-6 border-b border-dashed border-slate-300 w-48" />
                <span>Head of Department Signature & Date</span>
              </div>
              <div className="space-y-6 text-right">
                <div className="h-6 border-b border-dashed border-slate-300 w-48 ml-auto" />
                <span>Registrar Official Verification Seal</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Statement of Result</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
