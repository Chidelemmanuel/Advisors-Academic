/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  HelpCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Course, UndergraduateStudentProfile } from '../types';

interface AiAcademicAdvisorProps {
  student: UndergraduateStudentProfile;
  semesterPlan: Course[];
  catalog: Course[];
  onAddToPlan: (course: Course) => void;
}

interface AdvisorResponse {
  source: string;
  advice: string;
  recommendedCodes: string[];
  riskWarnings: string[];
  pacingAssessment: string;
  suggestedAlternatives?: string[];
}

export const AiAcademicAdvisor: React.FC<AiAcademicAdvisorProps> = ({
  student,
  semesterPlan,
  catalog,
  onAddToPlan,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [advisoryResult, setAdvisoryResult] = useState<AdvisorResponse | null>({
    source: 'gemini_advisor',
    advice: `Hello ${student.name}! I have reviewed your current transcript and semester basket for the ${student.selectedTrack} track.

1. **Prerequisite Foundation**: Your completed coursework (including CS-101, CS-201, and MATH-130) provides solid footing. You are ready to tackle upper-division 300-level core requirements.
2. **Workload Balance**: You currently have ${semesterPlan.length} courses planned (${semesterPlan.reduce((acc, c) => acc + c.credits, 0)} credits). Ensure you don't combine more than two rigorous systems or theoretical courses simultaneously to safeguard your ${student.currentGpa.toFixed(2)} GPA.
3. **Strategic Recommendation**: To advance toward your goal as a ${student.careerGoal}, prioritize enrolling in CS-320 (Machine Learning) and CS-301 (Databases) this term before moving into 400-level capstone prerequisites.`,
    recommendedCodes: ['CS-320', 'CS-301'],
    riskWarnings:
      semesterPlan.filter((c) => c.difficultyScore >= 4.0).length >= 2
        ? ['You have 2 or more rigorous courses in your basket. Expect heavy homework and coding lab sprints.']
        : [],
    pacingAssessment: 'On Track: Standard 4-Year Graduation Pace',
    suggestedAlternatives: ['HCI-315', 'ENT-301'],
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const quickQuestions = [
    'Audit my current semester basket and verify workload feasibility',
    'Which electives best prepare me for Machine Learning & AI internships?',
    'What courses are required before I can take the 400-level Senior Capstone?',
    'Recommend high-GPA electives to balance out a heavy technical course',
  ];

  const handleAskAdvisor = async (questionText: string) => {
    if (!questionText.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const candidateCourses = catalog.filter(
        (c) => !student.completedCourses.some((comp) => comp.code === c.code)
      );

      const response = await fetch('/api/advising', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            name: student.name,
            major: student.major,
            standing: student.standing,
            level: student.level,
            gpa: student.currentGpa,
            track: student.selectedTrack,
            targetCredits: student.maxTargetCreditsSemester,
            maxWeeklyHours: student.preferredWeeklyHours,
            preferredModality: student.learningStyle,
          },
          completedCourses: student.completedCourses,
          semesterPlan: semesterPlan.map((c) => ({
            code: c.code,
            name: c.title,
            credits: c.credits,
            workloadHours: c.workloadHours,
            difficulty: c.difficultyScore,
          })),
          candidateCourses: candidateCourses.map((c) => ({
            code: c.code,
            name: c.title,
            credits: c.credits,
            prerequisites: c.prerequisites,
            track: c.careerTracks,
            workloadHours: c.workloadHours,
          })),
          userQuery: questionText,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setAdvisoryResult(data);
    } catch (err: any) {
      console.error('Advisor error:', err);
      setErrorMsg(err.message || 'Failed to reach AI advisor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini-Powered Academic Advising Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              AI Academic Advisor
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Synthesizes your official undergraduate transcript, current semester plan, degree audit requirements, and workload targets to provide intelligent, tailored course recommendations.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3 text-xs space-y-1">
            <div className="text-slate-300">
              Student: <strong className="text-white">{student.name}</strong>
            </div>
            <div className="text-slate-300">
              Standing: <strong className="text-indigo-300">{student.standing} ({student.level})</strong>
            </div>
            <div className="text-slate-300">
              Planned Load:{' '}
              <strong className="text-white">
                {semesterPlan.reduce((acc, c) => acc + c.credits, 0)} credits
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Questions Prompt Strip */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Suggested Academic Queries:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(q);
                handleAskAdvisor(q);
              }}
              disabled={loading}
              className="text-left text-xs p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-700 font-medium transition-all shadow-xs flex items-center justify-between group"
            >
              <span className="truncate mr-2">{q}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Input Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAdvisor(query);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="Ask anything (e.g. 'Can I take CS-305 and CS-320 together?', 'What elective will boost my GPA?')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            className="flex-1 text-sm border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Transcript...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Ask Advisor</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Advisory Output Card */}
      {advisoryResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Academic Advisory Evaluation
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              {advisoryResult.pacingAssessment || 'On Track'}
            </span>
          </div>

          {/* Advice Body Text */}
          <div className="prose prose-sm text-slate-700 max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line">
            {advisoryResult.advice}
          </div>

          {/* Risk Warnings Strip if any */}
          {advisoryResult.riskWarnings && advisoryResult.riskWarnings.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Advisor Workload & Risk Observations</span>
              </div>
              <ul className="text-xs space-y-1 pl-6 list-disc">
                {advisoryResult.riskWarnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Course Codes directly actionable */}
          {advisoryResult.recommendedCodes && advisoryResult.recommendedCodes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Directly Recommended Courses for this Semester:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {advisoryResult.recommendedCodes.map((code) => {
                  const course = catalog.find((c) => c.code === code);
                  if (!course) return null;
                  const inBasket = semesterPlan.some((c) => c.code === code);

                  return (
                    <div
                      key={code}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                            {course.code}
                          </span>
                          <span className="text-slate-500 font-medium">{course.credits} credits</span>
                        </div>
                        <p className="font-bold text-slate-800 truncate mt-1">{course.title}</p>
                        <p className="text-[11px] text-slate-500">{course.scheduleSlot}</p>
                      </div>

                      {inBasket ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
                          In Basket
                        </span>
                      ) : (
                        <button
                          onClick={() => onAddToPlan(course)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Suggested Alternatives if any */}
          {advisoryResult.suggestedAlternatives && advisoryResult.suggestedAlternatives.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Suggested Alternatives / GPA Balancing Electives:
              </span>
              <div className="flex flex-wrap gap-2">
                {advisoryResult.suggestedAlternatives.map((altCode) => {
                  const altCourse = catalog.find((c) => c.code === altCode);
                  if (!altCourse) return null;
                  const inBasket = semesterPlan.some((c) => c.code === altCode);

                  return (
                    <div
                      key={altCode}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2 text-xs"
                    >
                      <span className="font-mono font-bold text-slate-800">{altCourse.code}</span>
                      <span className="text-slate-600">{altCourse.title}</span>
                      {inBasket ? (
                        <span className="text-[10px] text-indigo-600 font-bold ml-1">Added</span>
                      ) : (
                        <button
                          onClick={() => onAddToPlan(altCourse)}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline ml-1"
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
      )}
    </div>
  );
};
