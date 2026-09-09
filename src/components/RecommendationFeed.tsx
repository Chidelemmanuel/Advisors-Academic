/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  BookOpen,
  Plus,
  Trash2,
  ArrowRight,
  GitBranch,
  Layers,
  GraduationCap,
  TrendingUp,
  BarChart3,
  HelpCircle,
  Eye,
  Check,
} from 'lucide-react';
import {
  Course,
  UndergraduateStudentProfile,
  CourseRecommendation,
  RequirementType,
  AcademicLevel,
  DifficultyRating,
} from '../types';
import { rankRecommendedCourses } from '../utils/courseMatchEngine';

interface RecommendationFeedProps {
  catalog: Course[];
  student: UndergraduateStudentProfile;
  semesterPlan: Course[];
  onAddToPlan: (course: Course) => void;
  onRemoveFromPlan: (courseId: string) => void;
  onInspectPrereqs: (course: Course) => void;
  onViewDetails: (course: Course) => void;
  onCompareCourse: (course: Course) => void;
  onOpenAdvisor: () => void;
}

export const RecommendationFeed: React.FC<RecommendationFeedProps> = ({
  catalog,
  student,
  semesterPlan,
  onAddToPlan,
  onRemoveFromPlan,
  onInspectPrereqs,
  onViewDetails,
  onCompareCourse,
  onOpenAdvisor,
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [prereqFilter, setPrereqFilter] = useState<'All' | 'Satisfied Only' | 'Blocked'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'unlocks' | 'workload' | 'credits'>('score');

  // Compute recommendations dynamically
  const recommendations = useMemo(() => {
    return rankRecommendedCourses(catalog, student, semesterPlan);
  }, [catalog, student, semesterPlan]);

  // Filtered and sorted recommendations
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((rec) => {
      const course = rec.course;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesCode = course.code.toLowerCase().includes(query);
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesTags = course.tags.some((t) => t.toLowerCase().includes(query));
        const matchesInstructor = course.instructor.name.toLowerCase().includes(query);
        if (!matchesCode && !matchesTitle && !matchesTags && !matchesInstructor) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && course.category !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'All' && course.level !== selectedLevel) {
        return false;
      }

      // Prerequisite filter
      if (prereqFilter === 'Satisfied Only' && !rec.prereqStatus.satisfied) {
        return false;
      }
      if (prereqFilter === 'Blocked' && rec.prereqStatus.satisfied) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && course.difficultyLabel !== selectedDifficulty) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'score') {
        // Keep satisfied prereqs on top, then score
        if (a.prereqStatus.satisfied !== b.prereqStatus.satisfied) {
          return a.prereqStatus.satisfied ? -1 : 1;
        }
        return b.matchScore - a.matchScore;
      }
      if (sortBy === 'unlocks') {
        return b.unlockedCoursesCount - a.unlockedCoursesCount;
      }
      if (sortBy === 'workload') {
        return a.course.workloadHours - b.course.workloadHours;
      }
      if (sortBy === 'credits') {
        return b.course.credits - a.course.credits;
      }
      return 0;
    });
  }, [recommendations, searchQuery, selectedCategory, selectedLevel, prereqFilter, selectedDifficulty, sortBy]);

  // Helper to check if a course is already in the semester schedule
  const isInPlan = (courseId: string) => semesterPlan.some((c) => c.id === courseId);

  // Recommendation count stats
  const totalEligible = recommendations.length;
  const totalSatisfied = recommendations.filter((r) => r.prereqStatus.satisfied).length;
  const coreUnfulfilledCount = recommendations.filter(
    (r) => r.course.category === 'Major Core' && r.prereqStatus.satisfied
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Academic Advisory Spotlight */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Factor Recommendation Algorithm</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Undergraduate Course Selection Advisory
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Tailored for <strong className="text-white font-semibold">{student.name}</strong> ({student.standing}, {student.level}) in{' '}
              <span className="text-indigo-300 font-medium">{student.selectedTrack}</span>. Prioritizes unfulfilled graduation core courses, prerequisite clearance, career alignment, and healthy workload pacing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-2.5 text-center min-w-[110px]">
              <span className="text-xs text-slate-300 block font-medium">Ready to Take</span>
              <span className="text-xl font-bold text-emerald-400">{totalSatisfied}</span>
              <span className="text-[10px] text-slate-400 block">Prereqs met</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-2.5 text-center min-w-[110px]">
              <span className="text-xs text-slate-300 block font-medium">Urgent Core</span>
              <span className="text-xl font-bold text-amber-400">{coreUnfulfilledCount}</span>
              <span className="text-[10px] text-slate-400 block">Required Core</span>
            </div>

            <button
              onClick={onOpenAdvisor}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="course-search-input"
              type="text"
              placeholder="Search course code (e.g. CS-320), title, instructor, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
            <select
              id="sort-by-select"
              aria-label="Sort courses by"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="score">Recommendation Score (Highest)</option>
              <option value="unlocks">Critical Path (Most Unlocks)</option>
              <option value="workload">Workload (Lowest Study Hours)</option>
              <option value="credits">Credit Units (Highest)</option>
            </select>
          </div>
        </div>

        {/* Filter Badges Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
            {['All', 'Major Core', 'Track Elective', 'Science & Math Core', 'General Breadth Elective'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {cat === 'General Breadth Elective' ? 'General Electives' : cat}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
            {['All', '100L', '200L', '300L', '400L'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Prerequisite status */}
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
            {(['All', 'Satisfied Only', 'Blocked'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setPrereqFilter(opt)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  prereqFilter === opt
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Reset Filters button if any active */}
          {(selectedCategory !== 'All' || selectedLevel !== 'All' || prereqFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLevel('All');
                setPrereqFilter('All');
                setSearchQuery('');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredRecommendations.length}</strong> recommended courses
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </span>
        <span>
          Semester Basket:{' '}
          <strong className="text-slate-900">
            {semesterPlan.reduce((acc, c) => acc + c.credits, 0)} / {student.maxTargetCreditsSemester} credits
          </strong>
        </span>
      </div>

      {/* Course Recommendation Cards List */}
      {filteredRecommendations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">No courses match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting your search query or reset the category and prerequisite filters to explore available courses.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedLevel('All');
              setPrereqFilter('All');
              setSelectedDifficulty('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Show All Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRecommendations.map((rec) => {
            const course = rec.course;
            const planned = isInPlan(course.id);
            const isPrereqBlocked = !rec.prereqStatus.satisfied;

            return (
              <div
                key={course.id}
                className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  planned
                    ? 'ring-2 ring-indigo-500 border-indigo-400 bg-indigo-50/20'
                    : isPrereqBlocked
                    ? 'border-slate-200 opacity-80'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Top Section */}
                <div className="p-5 space-y-3.5">
                  {/* Top Badges & Match Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {course.code}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {course.level}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {course.credits} Credits
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                          course.category === 'Major Core'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            : course.category === 'Track Elective'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                            : course.category === 'Science & Math Core'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                        }`}
                      >
                        {course.category}
                      </span>
                    </div>

                    {/* Circular / Pill Match Score Display */}
                    <div className="text-right shrink-0">
                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPrereqBlocked
                            ? 'bg-slate-100 text-slate-500 border border-slate-200'
                            : rec.matchScore >= 85
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : rec.matchScore >= 70
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{rec.matchScore}% Match</span>
                      </div>
                      <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                        {rec.priorityRank}
                      </span>
                    </div>
                  </div>

                  {/* Course Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Prerequisite Status Banner */}
                  <div
                    className={`text-xs p-2 rounded-lg flex items-center justify-between gap-2 border ${
                      isPrereqBlocked
                        ? 'bg-rose-50/80 border-rose-200 text-rose-800'
                        : course.prerequisites.length > 0
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {isPrereqBlocked ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span className="truncate">
                        {isPrereqBlocked
                          ? `Requires: ${rec.prereqStatus.missingPrereqs.join(', ')}`
                          : course.prerequisites.length > 0
                          ? `Prerequisites cleared: ${rec.prereqStatus.satisfiedPrereqs.join(', ')}`
                          : 'No prerequisites required'}
                      </span>
                    </div>

                    <button
                      onClick={() => onInspectPrereqs(course)}
                      className="shrink-0 text-[11px] font-semibold underline text-slate-700 hover:text-slate-950 flex items-center gap-0.5"
                    >
                      <GitBranch className="w-3 h-3" />
                      <span>Pathway Map</span>
                    </button>
                  </div>

                  {/* Workload, Difficulty, and Schedule Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Workload</span>
                      <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{course.workloadHours} hrs/wk</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Difficulty</span>
                      <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                        <BarChart3 className="w-3 h-3 text-slate-500" />
                        <span>{course.difficultyLabel}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Historical GPA</span>
                      <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>{course.gradeDistribution.averageGpa.toFixed(2)} / 4.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Reasons / Match Evidence */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Why Recommended:
                    </span>
                    <ul className="space-y-1">
                      {rec.reasons.slice(0, 2).map((reason, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(course)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Syllabus</span>
                    </button>

                    <button
                      onClick={() => onCompareCourse(course)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    >
                      Compare
                    </button>
                  </div>

                  {planned ? (
                    <button
                      onClick={() => onRemoveFromPlan(course.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onAddToPlan(course)}
                      disabled={isPrereqBlocked}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                        isPrereqBlocked
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Basket</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
