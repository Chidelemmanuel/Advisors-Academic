/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  MapPin,
  TrendingUp,
  Briefcase,
  Clock,
  RotateCcw,
  Check,
  ExternalLink,
  ShieldCheck,
  FileText,
  UserCheck,
  Send,
  HelpCircle,
} from 'lucide-react';
import {
  HigherInstitution,
  Faculty,
  DegreeCourse,
  StudentScoreProfile,
  SelectedInstitutionPlan,
} from '../types';
import {
  HIGHER_INSTITUTIONS,
  FACULTIES_DATA,
  DEGREE_COURSES,
  evaluateAdmissionSuitability,
} from '../data/institutionsData';

interface StepByStepSelectorProps {
  studentProfile: StudentScoreProfile;
  setStudentProfile: (profile: StudentScoreProfile) => void;
  selectedPlan: SelectedInstitutionPlan;
  setSelectedPlan: (plan: SelectedInstitutionPlan) => void;
  onNavigateToRoadmap?: () => void;
  onNavigateToAdvisor?: () => void;
}

export const StepByStepSelector: React.FC<StepByStepSelectorProps> = ({
  studentProfile,
  setStudentProfile,
  selectedPlan,
  setSelectedPlan,
  onNavigateToRoadmap,
  onNavigateToAdvisor,
}) => {
  // Current Active Wizard Step: 1 | 2 | 3 | 4 | 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Search and Filter states within steps
  const [institutionSearch, setInstitutionSearch] = useState('');
  const [institutionTypeFilter, setInstitutionTypeFilter] = useState<string>('All');
  const [courseSearch, setCourseSearch] = useState('');

  // AI Advisory generated state for Step 5
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);

  // Step 1: Handle student profile modifications
  const handleScoreChange = (score: number) => {
    setStudentProfile({
      ...studentProfile,
      entranceExamScore: Math.min(400, Math.max(0, score)),
    });
  };

  // Step 2: Handle Institution selection
  const handleSelectInstitution = (inst: HigherInstitution) => {
    setSelectedPlan({
      ...selectedPlan,
      selectedInstitution: inst,
      // reset faculty & course if they don't belong to this institution
      selectedFaculty: null,
      selectedCourse: null,
    });
    // Auto-advance to Step 3
    setCurrentStep(3);
  };

  // Step 3: Handle Faculty selection
  const handleSelectFaculty = (fac: Faculty) => {
    setSelectedPlan({
      ...selectedPlan,
      selectedFaculty: fac,
      selectedCourse: null,
    });
    // Auto-advance to Step 4
    setCurrentStep(4);
  };

  // Step 4: Handle Course selection
  const handleSelectCourse = (course: DegreeCourse) => {
    if (!selectedPlan.selectedInstitution) return;

    const evaluation = evaluateAdmissionSuitability(
      studentProfile,
      course,
      selectedPlan.selectedInstitution
    );

    setSelectedPlan({
      ...selectedPlan,
      selectedCourse: course,
      selectionDate: new Date().toLocaleDateString(),
      admissionLikelihood: evaluation.likelihood,
      cutOffDifference: evaluation.scoreDifference,
      subjectEligibilityMet: evaluation.subjectEligibilityMet,
      missingSubjects: evaluation.missingRequiredSubjects,
      aiAdvisoryNote: evaluation.recommendationExplanation,
    });

    // Advance to Step 5
    setCurrentStep(5);
  };

  // Run AI Advisory on Step 5
  const triggerAiAdvisory = async () => {
    if (!selectedPlan.selectedInstitution || !selectedPlan.selectedCourse) return;
    setAiAnalysisLoading(true);

    try {
      const response = await fetch('/api/institution-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile,
          selectedInstitution: selectedPlan.selectedInstitution,
          selectedFaculty: selectedPlan.selectedFaculty,
          selectedCourse: selectedPlan.selectedCourse,
          userQuery: `Evaluate my admission readiness for ${selectedPlan.selectedCourse.name} at ${selectedPlan.selectedInstitution.name} given my entrance exam score of ${studentProfile.entranceExamScore} and O-Level credits.`,
        }),
      });

      if (!response.ok) {
        throw new Error('Advisory request failed');
      }

      const data = await response.json();
      setAiAnalysisResult(data);
    } catch (err) {
      console.error(err);
      // Fallback heuristic if offline
      setAiAnalysisResult({
        source: 'heuristic_fallback',
        advice: `Your entrance exam score of ${studentProfile.entranceExamScore}/400 is evaluated against ${selectedPlan.selectedInstitution.name}'s cutoff of ${selectedPlan.selectedCourse.cutOffScore}. You possess solid academic credentials for ${selectedPlan.selectedCourse.name}. Ensure you complete the departmental post-UTME screening on time.`,
        recommendationRating:
          studentProfile.entranceExamScore >= selectedPlan.selectedCourse.cutOffScore
            ? 'Strong Match'
            : 'Competitive Challenge',
        keyActionSteps: [
          'Verify that all 5 O-Level credit passes are properly uploaded on the admission portal.',
          'Review past departmental post-UTME screening questions for technical subjects.',
          'Check the institution merit list release timetable.',
        ],
        careerOutlook:
          'High demand across industry with strong average starting salaries in this sector.',
      });
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  // Filtered institutions for Step 2
  const filteredInstitutions = HIGHER_INSTITUTIONS.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(institutionSearch.toLowerCase()) ||
      inst.shortName.toLowerCase().includes(institutionSearch.toLowerCase()) ||
      inst.location.city.toLowerCase().includes(institutionSearch.toLowerCase());
    const matchesType =
      institutionTypeFilter === 'All' || inst.type === institutionTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filtered faculties for Step 3 (belonging to selected institution)
  const availableFaculties = FACULTIES_DATA.filter(
    (fac) =>
      selectedPlan.selectedInstitution &&
      fac.institutionId === selectedPlan.selectedInstitution.id
  );

  // Filtered degree courses for Step 4 (belonging to selected faculty or institution)
  const availableCourses = DEGREE_COURSES.filter((course) => {
    if (!selectedPlan.selectedInstitution) return false;
    const matchesInst = course.institutionId === selectedPlan.selectedInstitution.id;
    const matchesFac = selectedPlan.selectedFaculty
      ? course.facultyId === selectedPlan.selectedFaculty.id
      : true;
    const matchesSearch =
      course.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.code.toLowerCase().includes(courseSearch.toLowerCase());
    return matchesInst && matchesFac && matchesSearch;
  });

  // Admission evaluation for current selection in step 5
  const evaluation =
    selectedPlan.selectedCourse && selectedPlan.selectedInstitution
      ? evaluateAdmissionSuitability(
          studentProfile,
          selectedPlan.selectedCourse,
          selectedPlan.selectedInstitution
        )
      : null;

  return (
    <div className="space-y-6">
      {/* Step 1: Student Score & Profile Setup */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span>Step 1: Your Academic Score & O-Level Verification Profile</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              CoursePath compares your entrance score (e.g. UTME / JAMB / SAT / College Entrance) against institutional cut-off quotas and subject prerequisites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Entrance Exam Score Slider & Input */}
            <div className="md:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">
                    Entrance Exam Score (0 – 400 Scale)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    E.g. National UTME / College Board / Entrance Screening
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={400}
                    value={studentProfile.entranceExamScore}
                    onChange={(e) => handleScoreChange(Number(e.target.value))}
                    className="w-20 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-indigo-700 text-center focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <span className="text-xs font-bold text-slate-400">/ 400</span>
                </div>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min={120}
                max={400}
                value={studentProfile.entranceExamScore}
                onChange={(e) => handleScoreChange(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />

              {/* Score Benchmark Labels */}
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>120 (Polytechnic Min)</span>
                <span>200 (Uni Baseline)</span>
                <span>250 (Competitive)</span>
                <span>280+ (Elite Core)</span>
                <span>320+ (Top 1% Merit)</span>
              </div>

              {/* Benchmarking Badge */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Current Standing Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    studentProfile.entranceExamScore >= 280
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : studentProfile.entranceExamScore >= 240
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {studentProfile.entranceExamScore >= 280
                    ? 'High Competitive Merit Tier'
                    : studentProfile.entranceExamScore >= 240
                    ? 'Strong University Admission Tier'
                    : 'Standard Eligibility Tier'}
                </span>
              </div>
            </div>

            {/* Student Basic Metadata */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
              <label className="font-bold text-slate-900 block">Student Aspirations</label>
              <div>
                <span className="text-slate-500 block mb-1">Full Name:</span>
                <input
                  type="text"
                  value={studentProfile.studentName}
                  onChange={(e) =>
                    setStudentProfile({ ...studentProfile, studentName: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-hidden"
                />
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Target Career:</span>
                <input
                  type="text"
                  value={studentProfile.targetCareer}
                  onChange={(e) =>
                    setStudentProfile({ ...studentProfile, targetCareer: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-hidden"
                />
              </div>

              <div>
                <span className="text-slate-500 block mb-1">High School GPA:</span>
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <input
                    type="number"
                    step="0.05"
                    min={1.0}
                    max={4.0}
                    value={studentProfile.gpa}
                    onChange={(e) =>
                      setStudentProfile({
                        ...studentProfile,
                        gpa: parseFloat(e.target.value) || 3.0,
                      })
                    }
                    className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-center"
                  />
                  <span className="text-slate-400">/ 4.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* O-Level / High School Subjects Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  High School / O-Level Subject Credit Clearance
                </span>
                <span className="text-[11px] text-slate-500">
                  Grades A1 - C6 count as credit passes mandatory for university matriculation
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {studentProfile.highSchoolSubjects.filter((s) => s.passed).length} Credits Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {studentProfile.highSchoolSubjects.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    item.passed
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-rose-50/50 border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold block truncate">{item.subject}</span>
                    <span className="text-[10px] text-slate-500">Grade: {item.grade}</span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...studentProfile.highSchoolSubjects];
                      updated[idx].passed = !updated[idx].passed;
                      setStudentProfile({
                        ...studentProfile,
                        highSchoolSubjects: updated,
                      });
                    }}
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 cursor-pointer ${
                      item.passed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-200 text-rose-700 hover:bg-rose-300'
                    }`}
                  >
                    {item.passed ? <Check className="w-3.5 h-3.5" /> : '×'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1 Footer Action */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Select Higher Institution</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Step 2: Choose Higher Institution */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Step 2: Choose Target Higher Institution</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select from top-ranked Federal Universities, State Universities, Private Universities, or Technology Institutes.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Search institution or city..."
                value={institutionSearch}
                onChange={(e) => setInstitutionSearch(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />

              <select
                aria-label="Filter Institution by Type"
                value={institutionTypeFilter}
                onChange={(e) => setInstitutionTypeFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="All">All Institution Types</option>
                <option value="Federal University">Federal University</option>
                <option value="State University">State University</option>
                <option value="Private University">Private University</option>
                <option value="Institute of Technology">Institute of Technology</option>
                <option value="Polytechnic / Tech College">Polytechnic / Tech College</option>
              </select>
            </div>
          </div>

          {/* Selected Institution Banner if any */}
          {selectedPlan.selectedInstitution && (
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-950 font-bold">
                  Currently Selected: {selectedPlan.selectedInstitution.name} (
                  {selectedPlan.selectedInstitution.shortName})
                </span>
              </div>
              <button
                onClick={() => setCurrentStep(3)}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
              >
                Proceed with this institution &rarr;
              </button>
            </div>
          )}

          {/* Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInstitutions.map((inst) => {
              const isSelected = selectedPlan.selectedInstitution?.id === inst.id;

              return (
                <div
                  key={inst.id}
                  onClick={() => handleSelectInstitution(inst)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative space-y-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-extrabold text-sm border border-indigo-100">
                        {inst.shortName}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {inst.name}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {inst.type} &bull; Est. {inst.establishedYear}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                      Rank #{inst.nationalRanking}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {inst.overview}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{inst.location.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{inst.acceptanceRate}% Acceptance</span>
                    </div>
                  </div>

                  {/* Tuition & Faculties strip */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px] flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Tuition: {inst.tuitionCategory}</span>
                    <span className="font-bold text-indigo-600">{inst.facultiesCount} Faculties</span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectInstitution(inst);
                    }}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Selected (Click Next)' : 'Select Institution'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Step 2 Footer Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Student Profile</span>
            </button>

            {selectedPlan.selectedInstitution && (
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next: Choose Faculty ({selectedPlan.selectedInstitution.shortName})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Step 3: Choose Faculty */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Step 3: Select Faculty within {selectedPlan.selectedInstitution?.name || 'Institution'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Explore specialized academic faculties, departmental specializations, and research laboratories.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Change Institution ({selectedPlan.selectedInstitution?.shortName})</span>
            </button>
          </div>

          {/* Faculties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {availableFaculties.map((fac) => {
              const isSelected = selectedPlan.selectedFaculty?.id === fac.id;

              return (
                <div
                  key={fac.id}
                  onClick={() => handleSelectFaculty(fac)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {fac.shortCode}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">
                        {fac.name}
                      </h4>
                    </div>

                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {fac.totalEnrollment.toLocaleString()} Students
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {fac.description}
                  </p>

                  {/* Departments Checklist */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Departments:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.departments.map((dept, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded border border-slate-200 text-[11px]"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Research & Industry Partners */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div>
                      <span className="font-bold text-slate-700 block">Labs & Centers:</span>
                      <span className="truncate block">{fac.laboratories[0]}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block">Industry Feeder:</span>
                      <span className="truncate block">{fac.industryPartners.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  {/* Select Faculty CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFaculty(fac);
                    }}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Faculty Selected' : 'Choose This Faculty'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {availableFaculties.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <p>No faculty data pre-filtered for this institution.</p>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold"
              >
                Browse All Degree Courses Instead &rarr;
              </button>
            </div>
          )}

          {/* Step 3 Footer Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Institutions</span>
            </button>

            {selectedPlan.selectedFaculty && (
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next: Choose Degree Program ({selectedPlan.selectedFaculty.shortCode})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. Step 4: Choose Degree Course */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Step 4: Select Degree Program & Review Cut-Off Requirements</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target institution: <strong className="text-slate-800">{selectedPlan.selectedInstitution?.name}</strong> &bull; Faculty: <strong className="text-slate-800">{selectedPlan.selectedFaculty?.name || 'All Faculties'}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Filter degree course by name or code..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Student Score Reminder Strip */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-950 font-semibold">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Your Current Entrance Score: <strong>{studentProfile.entranceExamScore} / 400</strong></span>
            </div>
            <span className="text-[11px] text-slate-500">
              Courses highlight whether your score clears the departmental cut-off mark.
            </span>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {availableCourses.map((course) => {
              const isSelected = selectedPlan.selectedCourse?.id === course.id;
              const scoreDiff = studentProfile.entranceExamScore - course.cutOffScore;
              const clearsCutOff = scoreDiff >= 0;

              return (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {course.code}
                        </span>
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {course.degreeAwarded} &bull; {course.durationYears} Years
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1.5">
                        {course.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {course.facultyName} &bull; {course.institutionName}
                      </p>
                    </div>

                    {/* Cut-off Mark Badge */}
                    <div className="text-right shrink-0">
                      <div
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                          clearsCutOff
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        Cut-Off: {course.cutOffScore}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                        {clearsCutOff ? `+${scoreDiff} pts over` : `${scoreDiff} pts below`}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  {/* Required High School Subjects */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Required Subject Combination:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {course.requiredSubjects.map((subj, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded border border-slate-200 text-[11px]"
                        >
                          {subj}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Employability & Starting Salary */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 text-slate-600">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{course.employabilityRate}% Employability</span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{course.averageStartingSalary}</span>
                    </div>
                  </div>

                  {/* Select Course CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCourse(course);
                    }}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Program Selected' : 'Choose This Degree Course'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Step 4 Footer Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Faculties</span>
            </button>

            {selectedPlan.selectedCourse && (
              <button
                onClick={() => setCurrentStep(5)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next: View Final Admission Feasibility & AI</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. Step 5: Admission Feasibility & Recommendation Analysis */}
      {currentStep === 5 && selectedPlan.selectedInstitution && selectedPlan.selectedCourse && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Step 5: Official Selection Verification
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Admission Eligibility & AI Selection Report
              </h3>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Wizard</span>
            </button>
          </div>

          {/* Comprehensive Selection Dossier */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Academic Match Dossier */}
            <div className="md:col-span-2 space-y-5">
              {/* Core Selection Summary Card */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                      Confirmed Target Degree
                    </span>
                    <h4 className="text-lg font-extrabold text-slate-900">
                      {selectedPlan.selectedCourse.name} ({selectedPlan.selectedCourse.code})
                    </h4>
                    <p className="text-xs text-slate-600">
                      {selectedPlan.selectedCourse.degreeAwarded} &bull; {selectedPlan.selectedCourse.durationYears} Years Duration
                    </p>
                  </div>

                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                      selectedPlan.admissionLikelihood === 'Very Strong Chance'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : selectedPlan.admissionLikelihood === 'Competitive / Moderate'
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {selectedPlan.admissionLikelihood}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-indigo-100 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Institution:</span>
                    <span className="font-bold text-slate-900">
                      {selectedPlan.selectedInstitution.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Faculty:</span>
                    <span className="font-bold text-slate-900">
                      {selectedPlan.selectedFaculty?.name || 'Academic Faculty'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Departmental Cut-Off:</span>
                    <span className="font-bold text-slate-900">
                      {selectedPlan.selectedCourse.cutOffScore} / 400
                    </span>
                  </div>
                </div>
              </div>

              {/* Admission Feasibility Explanation */}
              {evaluation && (
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Algorithmic Admissions Evaluation</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {evaluation.recommendationExplanation}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-500">
                    <span>
                      Score Margin:{' '}
                      <strong
                        className={
                          evaluation.scoreDifference >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }
                      >
                        {evaluation.scoreDifference >= 0 ? `+${evaluation.scoreDifference}` : evaluation.scoreDifference} Points
                      </strong>
                    </span>
                    <span>
                      Subject Clearance:{' '}
                      <strong className={evaluation.subjectEligibilityMet ? 'text-emerald-600' : 'text-rose-600'}>
                        {evaluation.subjectEligibilityMet ? '100% Passed' : 'Missing Requisites'}
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Gemini AI Institution Advisory Trigger */}
              <div className="p-5 rounded-2xl border border-indigo-200 bg-linear-to-r from-indigo-50/50 via-white to-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Ask Gemini AI Admissions Counselor
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Get personalized strategic advice for this specific school and degree combination
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={triggerAiAdvisory}
                    disabled={aiAnalysisLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {aiAnalysisLoading ? (
                      <span>Analyzing...</span>
                    ) : (
                      <>
                        <span>Generate AI Advice</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* AI Advice Output Display */}
                {aiAnalysisResult && (
                  <div className="p-4 rounded-xl bg-white border border-indigo-100 text-xs space-y-3 mt-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>AI Advisory Guidance</span>
                      </span>
                      <span className="font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {aiAnalysisResult.recommendationRating || 'Recommended'}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {aiAnalysisResult.advice}
                    </p>

                    {aiAnalysisResult.keyActionSteps && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <span className="font-bold text-slate-900 block text-[11px]">
                          Key Action Steps:
                        </span>
                        {aiAnalysisResult.keyActionSteps.map((step: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-slate-600 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Logistics & Action Milestones */}
            <div className="space-y-4">
              {/* Institution Quick Factsheet */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <span className="font-bold text-slate-900 block">Institution Factsheet</span>
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Ranking:</span>
                    <strong className="text-slate-900">
                      #{selectedPlan.selectedInstitution.nationalRanking} in Nigeria
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Accreditation:</span>
                    <strong className="text-emerald-700">Fully Accredited (NUC)</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tuition Estimate:</span>
                    <strong className="text-slate-900">
                      {selectedPlan.selectedInstitution.annualTuitionEstimate.split('/')[0]}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Starting Salary:</span>
                    <strong className="text-indigo-700">
                      {selectedPlan.selectedCourse.averageStartingSalary.split('(')[0]}
                    </strong>
                  </div>
                </div>

                <a
                  href={selectedPlan.selectedInstitution.admissionPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-2 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open Official Admission Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>

              {/* Navigation Actions to Roadmap or Catalog */}
              <div className="space-y-2">
                {onNavigateToRoadmap && (
                  <button
                    onClick={onNavigateToRoadmap}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View in My Selections Roadmap</span>
                  </button>
                )}

                {onNavigateToAdvisor && (
                  <button
                    onClick={onNavigateToAdvisor}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Open AI Advisor Workspace</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
