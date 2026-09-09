/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Building2,
  TrendingUp,
  Briefcase,
  Clock,
  Award,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  X,
  GraduationCap,
} from 'lucide-react';
import { DegreeCourse, HigherInstitution } from '../types';
import { DEGREE_COURSES, HIGHER_INSTITUTIONS } from '../data/institutionsData';

interface DegreeCoursesCatalogViewProps {
  onSelectCourseForPlan?: (course: DegreeCourse) => void;
}

export const DegreeCoursesCatalogView: React.FC<DegreeCoursesCatalogViewProps> = ({
  onSelectCourseForPlan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState('All');
  const [selectedCompetitiveFilter, setSelectedCompetitiveFilter] = useState('All');
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<DegreeCourse | null>(null);

  const filteredCourses = DEGREE_COURSES.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.careerProspects.some((cp) => cp.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFaculty =
      selectedFacultyFilter === 'All' ||
      course.facultyName.toLowerCase().includes(selectedFacultyFilter.toLowerCase());

    const matchesCompetitive =
      selectedCompetitiveFilter === 'All' ||
      course.competitiveLevel === selectedCompetitiveFilter;

    return matchesSearch && matchesFaculty && matchesCompetitive;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Degree Courses & Cut-Off Directory
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {filteredCourses.length} Degree Programs Indexed
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Degree Programs, Prerequisites & Cut-Off Marks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Check cut-off scores, mandatory high school subject combinations, UTME subject requirements, program duration, and graduate employability across institutions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Accredited B.Sc, B.Eng & MBBS Degrees</span>
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course title, career, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Faculty / Area Filter */}
          <div>
            <select
              aria-label="Filter by Faculty Area"
              value={selectedFacultyFilter}
              onChange={(e) => setSelectedFacultyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Disciplines / Faculties</option>
              <option value="Science">Sciences & Computing</option>
              <option value="Engineering">Engineering & Tech</option>
              <option value="Clinical">Medicine & Clinical Health</option>
              <option value="Management">Management & Business</option>
            </select>
          </div>

          {/* Competitiveness Filter */}
          <div>
            <select
              aria-label="Filter by Admission Competitiveness"
              value={selectedCompetitiveFilter}
              onChange={(e) => setSelectedCompetitiveFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Competitiveness Tiers</option>
              <option value="Very High">Very High (Top Tier Cut-Offs 275+)</option>
              <option value="High">High (Cut-Offs 250 - 274)</option>
              <option value="Moderate">Moderate (Cut-Offs 230 - 249)</option>
              <option value="Accessible">Accessible</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Degree Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredCourses.map((course) => {
          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header with Course Title & Code */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {course.code}
                      </span>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {course.degreeAwarded} &bull; {course.durationYears} Years
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {course.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {course.institutionName} &bull; {course.facultyName}
                    </p>
                  </div>

                  {/* Cut-off score badge */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 block">
                      Cut-Off: {course.cutOffScore}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Quota: {course.annualQuota} Seats
                    </span>
                  </div>
                </div>

                {/* Course Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {course.description}
                </p>

                {/* Requirements Strip */}
                <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block text-[11px]">
                      Required O-Level Subjects:
                    </span>
                    <span className="text-slate-600 text-[11px]">
                      {course.requiredSubjects.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block text-[11px]">
                      UTME Subject Combo:
                    </span>
                    <span className="text-indigo-900 font-medium text-[11px]">
                      {course.utmeSubjectCombo.join(' + ')}
                    </span>
                  </div>
                </div>

                {/* Employability & Career highlights */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{course.employabilityRate}% Employed</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{course.averageStartingSalary.split('(')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCourseDetail(course)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>Syllabus & Career Paths</span>
                </button>

                {onSelectCourseForPlan && (
                  <button
                    onClick={() => onSelectCourseForPlan(course)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Select for Matcher</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Detail Course Modal */}
      {selectedCourseDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {selectedCourseDetail.code}
                  </span>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {selectedCourseDetail.degreeAwarded}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedCourseDetail.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedCourseDetail.institutionName} &bull; {selectedCourseDetail.facultyName}
                </p>
              </div>

              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 block text-sm">Program Curriculum Overview</span>
              <p className="text-slate-600 leading-relaxed">
                {selectedCourseDetail.description}
              </p>
            </div>

            {/* Core Syllabus Topics */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 block text-sm">Core Academic Topics</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCourseDetail.keyTopics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="text-slate-700 font-medium">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Prospects */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 block text-sm">Career Prospects & Industry Positions</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCourseDetail.careerProspects.map((cp, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-indigo-50 text-indigo-900 font-semibold rounded-lg border border-indigo-200"
                  >
                    {cp}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed Admissions Requirements Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Official Admission Prerequisites</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                <strong>O-Level Requirement:</strong> {selectedCourseDetail.oLevelRequirement}
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                <strong>UTME Subject Combo:</strong> {selectedCourseDetail.utmeSubjectCombo.join(', ')}
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200">
                <span>Accreditation: <strong>{selectedCourseDetail.accreditationBody}</strong></span>
                <span>Annual Seat Quota: <strong>{selectedCourseDetail.annualQuota} Seats</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {onSelectCourseForPlan && (
                <button
                  onClick={() => {
                    onSelectCourseForPlan(selectedCourseDetail);
                    setSelectedCourseDetail(null);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Select Course for Evaluation</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
