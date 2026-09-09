/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Building2,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Download,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Award,
  Sparkles,
} from 'lucide-react';
import {
  SelectedInstitutionPlan,
  StudentScoreProfile,
  HigherInstitution,
  DegreeCourse,
} from '../types';
import { HIGHER_INSTITUTIONS, DEGREE_COURSES } from '../data/institutionsData';

interface MySelectionsRoadmapProps {
  selectedPlan: SelectedInstitutionPlan;
  studentProfile: StudentScoreProfile;
  onNavigateToWizard?: () => void;
  onNavigateToAdvisor?: () => void;
}

export const MySelectionsRoadmap: React.FC<MySelectionsRoadmapProps> = ({
  selectedPlan,
  studentProfile,
  onNavigateToWizard,
  onNavigateToAdvisor,
}) => {
  // Document checklist local state
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    utmeSlip: true,
    oLevelSlip: true,
    birthCert: true,
    lgaCert: false,
    medicalFitness: false,
    passportPhotos: true,
  });

  const toggleDoc = (key: string) => {
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasSelection = !!selectedPlan.selectedInstitution && !!selectedPlan.selectedCourse;

  // Fallback defaults if not chosen yet
  const displayInstitution = selectedPlan.selectedInstitution || HIGHER_INSTITUTIONS[0];
  const displayCourse = selectedPlan.selectedCourse || DEGREE_COURSES[0];
  const displayFaculty = selectedPlan.selectedFaculty;

  const scoreDiff = studentProfile.entranceExamScore - displayCourse.cutOffScore;

  // Admission milestones
  const admissionMilestones = [
    {
      id: 1,
      title: 'Entrance Examination / UTME Sitting',
      date: 'Completed',
      status: 'completed',
      detail: `Scored ${studentProfile.entranceExamScore} / 400 with verified credit combinations.`,
    },
    {
      id: 2,
      title: 'Target Institution & Course Alignment',
      date: selectedPlan.selectionDate || 'Active',
      status: hasSelection ? 'completed' : 'in_progress',
      detail: `${displayCourse.name} at ${displayInstitution.name} (${displayInstitution.shortName}).`,
    },
    {
      id: 3,
      title: 'Post-UTME Online Screening Registration',
      date: 'Upcoming (August - September)',
      status: 'in_progress',
      detail: `Upload bio-data and O-Level grades to ${displayInstitution.shortName} admissions portal.`,
    },
    {
      id: 4,
      title: 'Departmental Cut-Off Mark Clearance',
      date: 'Targeting Cut-off: ' + displayCourse.cutOffScore,
      status: scoreDiff >= 0 ? 'completed' : 'warning',
      detail:
        scoreDiff >= 0
          ? `Your score clears the cutoff with a +${scoreDiff} point safety margin.`
          : `Score is ${Math.abs(scoreDiff)} points below standard merit cutoff.`,
    },
    {
      id: 5,
      title: 'Merit Admission List Publication',
      date: 'October 2026',
      status: 'pending',
      detail: 'Official release of primary merit list on JAMB CAPS and school portal.',
    },
    {
      id: 6,
      title: 'Faculty Physical Clearance & Matriculation',
      date: 'November 2026',
      status: 'pending',
      detail: 'Original credential verification and fresh undergraduate matriculation ceremony.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Official Admissions Roadmap
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Academic Session 2026 / 2027
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              My Selected Institution, Faculty & Degree Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Track your complete admission cycle from entrance scores to departmental cut-off clearance, post-UTME screening, document verification, and faculty matriculation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Selection Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Selection Dossier Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-black text-xl shrink-0">
              {displayInstitution.shortName}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {displayCourse.code}
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {displayCourse.degreeAwarded} &bull; {displayCourse.durationYears} Years
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {displayCourse.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {displayInstitution.name} &bull; {displayFaculty?.name || 'Academic Faculty'}
              </p>
            </div>
          </div>

          {/* Admission Probability Meter */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block">Admission Probability:</span>
              <span
                className={`font-extrabold text-sm block ${
                  scoreDiff >= 15
                    ? 'text-emerald-700'
                    : scoreDiff >= 0
                    ? 'text-indigo-700'
                    : 'text-amber-700'
                }`}
              >
                {scoreDiff >= 15
                  ? 'Very High (Merit Quota)'
                  : scoreDiff >= 0
                  ? 'Strong / Competitive'
                  : 'Reach / Supplementary'}
              </span>
            </div>

            <div className="border-l border-slate-200 pl-4">
              <span className="text-slate-500 text-[11px] block">Score Margin:</span>
              <span className="font-bold text-slate-900 text-sm">
                {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} pts vs Cut-off
              </span>
            </div>
          </div>
        </div>

        {/* 4-Stat Metric Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">
              Entrance Exam Score
            </span>
            <span className="font-extrabold text-slate-900 text-sm">
              {studentProfile.entranceExamScore} / 400
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">
              Department Cut-Off
            </span>
            <span className="font-extrabold text-indigo-700 text-sm">
              {displayCourse.cutOffScore} / 400
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">
              Annual Quota
            </span>
            <span className="font-extrabold text-slate-900 text-sm">
              {displayCourse.annualQuota} Seats
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">
              Employability Rate
            </span>
            <span className="font-extrabold text-emerald-700 text-sm">
              {displayCourse.employabilityRate}% Placement
            </span>
          </div>
        </div>

        {/* Quick action strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Need to adjust institution or faculty?
          </span>
          <div className="flex items-center gap-2">
            {onNavigateToWizard && (
              <button
                onClick={onNavigateToWizard}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Edit in Step-by-Step Selector</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onNavigateToAdvisor && (
              <button
                onClick={onNavigateToAdvisor}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Advisor</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Milestones Timeline & Document Verification Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timeline Milestones */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Admission Lifecycle Milestones</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Session Progression</span>
          </div>

          <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {admissionMilestones.map((m) => {
              const isDone = m.status === 'completed';
              const isInProgress = m.status === 'in_progress';

              return (
                <div key={m.id} className="relative pl-9 space-y-1">
                  {/* Circle Indicator */}
                  <div
                    className={`absolute left-2.25 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : isInProgress
                        ? 'bg-indigo-600 border-indigo-600 text-white animate-pulse'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-3 h-3" />}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isInProgress
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{m.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Required Verification Documents Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Document Checklist</span>
            </h3>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              {Object.values(checkedDocs).filter(Boolean).length}/6 Ready
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Ensure you have these required documents prepared and scanned for the institutional post-UTME screening portal:
          </p>

          <div className="space-y-2.5 text-xs">
            {[
              { key: 'utmeSlip', label: 'Original UTME Result Slip with barcode' },
              { key: 'oLevelSlip', label: 'O-Level Statement of Results (WAEC/NECO/NABTEB)' },
              { key: 'birthCert', label: 'Birth Certificate or Statutory Declaration of Age' },
              { key: 'lgaCert', label: 'Local Government Area (LGA) Identification' },
              { key: 'passportPhotos', label: 'Recent Passport Photographs (White Background)' },
              { key: 'medicalFitness', label: 'Official Medical Fitness Certificate' },
            ].map((doc) => {
              const isChecked = checkedDocs[doc.key];

              return (
                <div
                  key={doc.key}
                  onClick={() => toggleDoc(doc.key)}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className={`font-semibold ${isChecked ? 'text-slate-900' : 'text-slate-600'}`}>
                    {doc.label}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <a
              href={displayInstitution.admissionPortalUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Visit {displayInstitution.shortName} Admission Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
