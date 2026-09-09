/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Building2,
  BookOpen,
  UserCheck,
  CheckCircle2,
  HelpCircle,
  Clock,
  RotateCcw,
  Briefcase,
  TrendingUp,
  AlertCircle,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  HigherInstitution,
  Faculty,
  DegreeCourse,
  StudentScoreProfile,
  SelectedInstitutionPlan,
} from '../types';
import { HIGHER_INSTITUTIONS, FACULTIES_DATA, DEGREE_COURSES } from '../data/institutionsData';

interface AiInstitutionAdvisorProps {
  studentProfile: StudentScoreProfile;
  selectedPlan: SelectedInstitutionPlan;
  onApplyAdvisoryPlan?: (inst: HigherInstitution, course: DegreeCourse) => void;
}

export const AiInstitutionAdvisor: React.FC<AiInstitutionAdvisorProps> = ({
  studentProfile,
  selectedPlan,
  onApplyAdvisoryPlan,
}) => {
  const [selectedInstId, setSelectedInstId] = useState<string>(
    selectedPlan.selectedInstitution?.id || HIGHER_INSTITUTIONS[0].id
  );
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    selectedPlan.selectedCourse?.id || DEGREE_COURSES[0].id
  );
  const [userQuery, setUserQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [advisoryResult, setAdvisoryResult] = useState<any | null>({
    advice: `Welcome to the Gemini Admissions Advisor. Based on your entrance score of ${studentProfile.entranceExamScore}/400 and target career in ${studentProfile.targetCareer}:
1. **Academic Readiness**: Your high school subject background shows verified credit passes in STEM fundamentals.
2. **Institutional Alignment**: You can benchmark your scores against top federal and private institutions in Nigeria.
3. **Screening Preparation**: Prepare your post-UTME screening materials and verify your O-Level sittings before portal registration closes.`,
    recommendationRating:
      studentProfile.entranceExamScore >= 270 ? 'Strong Match' : 'Highly Recommended',
    keyActionSteps: [
      'Select your target institution and course above to run a live simulation.',
      'Check O-Level subject prerequisites for your chosen faculty.',
      'Compare annual tuition estimates and campus facilities.',
    ],
    careerOutlook:
      'High market demand with accelerated tech, health, and engineering employment opportunities.',
    source: 'system_ready',
  });

  const activeInstitution =
    HIGHER_INSTITUTIONS.find((i) => i.id === selectedInstId) || HIGHER_INSTITUTIONS[0];
  const activeCourse =
    DEGREE_COURSES.find((c) => c.id === selectedCourseId) || DEGREE_COURSES[0];
  const activeFaculty =
    FACULTIES_DATA.find((f) => f.id === activeCourse.facultyId) || null;

  // Curated prompts
  const samplePrompts = [
    `Evaluate my admission chances with my score of ${studentProfile.entranceExamScore}/400 for ${activeCourse.name} at ${activeInstitution.name}.`,
    `What are the graduate job prospects and average starting salaries for ${activeCourse.name}?`,
    `Compare studying ${activeCourse.name} at a Federal University vs a Private University.`,
    `What O-Level subject combinations and departmental screening tips do you recommend?`,
  ];

  const handleAskGemini = async (queryText?: string) => {
    const query = queryText || userQuery;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/institution-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile,
          selectedInstitution: activeInstitution,
          selectedFaculty: activeFaculty,
          selectedCourse: activeCourse,
          userQuery: query,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      setAdvisoryResult(data);
      if (!queryText) setUserQuery('');
    } catch (err: any) {
      console.warn('Advising fetch error, using fallback:', err);
      // Fallback
      setAdvisoryResult({
        advice: `Based on your entrance exam score (${studentProfile.entranceExamScore}/400) and interest in ${studentProfile.primaryInterest}:
1. **Institution Alignment**: ${activeInstitution.name} is accredited and ranked #${activeInstitution.nationalRanking} nationally.
2. **Faculty & Program Fit**: ${activeCourse.name} carries a departmental cutoff of ${activeCourse.cutOffScore}. Your score margin is ${studentProfile.entranceExamScore - activeCourse.cutOffScore >= 0 ? '+' : ''}${studentProfile.entranceExamScore - activeCourse.cutOffScore} points.
3. **Action Items**: Ensure your high school credits in ${activeCourse.requiredSubjects.slice(0, 4).join(', ')} are submitted during post-UTME screening.`,
        recommendationRating:
          studentProfile.entranceExamScore >= activeCourse.cutOffScore
            ? 'Strong Match'
            : 'Competitive Challenge',
        keyActionSteps: [
          'Verify your high school credit passes on the admission portal.',
          'Review past departmental post-UTME past questions.',
          'Monitor the institution merit list release schedule.',
        ],
        careerOutlook:
          'Strong demand with high graduate placement across technology, corporate, and healthcare ecosystems.',
        source: 'heuristic_engine',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Admissions & Career Counselor</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Powered by Gemini AI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Interactive Higher Institution & Degree Advisory
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Ask deep questions about cut-off feasibility, post-UTME screening strategy, career trajectories, and institutional reputation tailored to your score profile.
            </p>
          </div>

          {/* Current Score Badge */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 block text-[11px]">Evaluating for:</span>
            <span className="font-bold text-slate-900 block">{studentProfile.studentName}</span>
            <span className="font-extrabold text-indigo-700">
              Score: {studentProfile.entranceExamScore} / 400
            </span>
          </div>
        </div>

        {/* Target Selectors Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-slate-100 mt-5">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Institution to Inquire About:
            </label>
            <select
              aria-label="Select Institution for AI Inquiry"
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {HIGHER_INSTITUTIONS.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.shortName} - Rank #{inst.nationalRanking})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Degree Program / Course:
            </label>
            <select
              aria-label="Select Degree Program for AI Inquiry"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {DEGREE_COURSES.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code} &bull; Cut-Off: {course.cutOffScore})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Advisory Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Consultation & Interactive Output */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Prompt Chips */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">
              Popular Counseling Questions (Click to Ask):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskGemini(prompt)}
                  disabled={loading}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50/60 hover:border-indigo-300 text-left text-xs text-slate-700 font-medium transition-all cursor-pointer flex items-start gap-2 shadow-2xs disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Query Input Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Ask any question about ${activeInstitution.shortName}, ${activeCourse.name}, or admission tips...`}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskGemini()}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleAskGemini()}
                disabled={loading || !userQuery.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <span>Thinking...</span>
                ) : (
                  <>
                    <span>Ask AI</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Advisory Response Card */}
          {advisoryResult && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Admissions Advisory Evaluation
                    </h3>
                    <p className="text-xs text-slate-500">
                      Target: {activeCourse.name} &bull; {activeInstitution.name}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    advisoryResult.recommendationRating?.includes('Strong')
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : advisoryResult.recommendationRating?.includes('Competitive')
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-indigo-50 text-indigo-800 border-indigo-300'
                  }`}
                >
                  {advisoryResult.recommendationRating || 'Recommended'}
                </span>
              </div>

              {/* Main Guidance Text */}
              <div className="space-y-2 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {advisoryResult.advice}
              </div>

              {/* Key Action Steps */}
              {advisoryResult.keyActionSteps && advisoryResult.keyActionSteps.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Recommended Strategic Action Steps</span>
                  </span>
                  <div className="space-y-2">
                    {advisoryResult.keyActionSteps.map((step: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-slate-600 text-xs">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Outlook */}
              {advisoryResult.careerOutlook && (
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>Industry & Career Outlook</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {advisoryResult.careerOutlook}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Instant Cut-Off & Compatibility Barometer */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Target Program Benchmark</span>
            </h4>

            {/* Score Margin Barometer */}
            <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Your Entrance Score:</span>
                <strong className="text-indigo-700 font-bold">
                  {studentProfile.entranceExamScore} / 400
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Departmental Cut-Off:</span>
                <strong className="text-slate-900 font-bold">
                  {activeCourse.cutOffScore} / 400
                </strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-600">Score Margin:</span>
                <strong
                  className={`font-extrabold ${
                    studentProfile.entranceExamScore >= activeCourse.cutOffScore
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {studentProfile.entranceExamScore - activeCourse.cutOffScore >= 0 ? '+' : ''}
                  {studentProfile.entranceExamScore - activeCourse.cutOffScore} pts
                </strong>
              </div>
            </div>

            {/* Program Quick Specs */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Degree Awarded:</span>
                <strong className="text-slate-900">{activeCourse.degreeAwarded}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Duration:</span>
                <strong className="text-slate-900">{activeCourse.durationYears} Years</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Employability Rate:</span>
                <strong className="text-emerald-700 font-bold">
                  {activeCourse.employabilityRate}%
                </strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Starting Salary:</span>
                <strong className="text-slate-900">
                  {activeCourse.averageStartingSalary.split('(')[0]}
                </strong>
              </div>
            </div>

            {/* Adopt this course as selection */}
            {onApplyAdvisoryPlan && (
              <button
                onClick={() => onApplyAdvisoryPlan(activeInstitution, activeCourse)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Adopt as Active Plan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
