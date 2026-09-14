/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  GitCompare,
  Sliders,
  UserCheck,
  Award,
  AlertTriangle,
  ArrowLeft,
  Layers,
  FileText,
  Compass,
  MoreVertical,
  LogOut,
  Menu,
  LayoutDashboard,
} from 'lucide-react';
import {
  UndergraduateStudentProfile,
  Course,
  StudentScoreProfile,
  SelectedInstitutionPlan,
} from '../types';
import { DEFAULT_STUDENTS } from '../data/undergraduateCatalog';
import { SAMPLE_STUDENT_PROFILES } from '../data/institutionsData';

export type MainPortalTab =
  | 'dashboard'
  | 'registration'
  | 'results'
  | 'audit'
  | 'selector'
  | 'courses'
  | 'roadmap'
  | 'ai-advisor'
  | 'planner';

export type PlannerSubTab =
  | 'recommendations'
  | 'basket'
  | 'audit'
  | 'academic-advisor'
  | 'compare';

interface NavigationHeaderProps {
  activeMainTab: MainPortalTab;
  setActiveMainTab: (tab: MainPortalTab) => void;
  plannerSubTab?: PlannerSubTab;
  setPlannerSubTab?: (subTab: PlannerSubTab) => void;
  student: UndergraduateStudentProfile;
  setStudent: (student: UndergraduateStudentProfile) => void;
  studentScoreProfile: StudentScoreProfile;
  setStudentScoreProfile: (profile: StudentScoreProfile) => void;
  selectedPlan: SelectedInstitutionPlan;
  semesterPlan: Course[];
  onOpenProfileModal: () => void;
  onBackToLanding?: () => void;
  onOpenMobileSidebar?: () => void;
}

const formatFirstAndLastName = (name: string): string => {
  if (!name) return 'Student';
  // Remove email domain if present
  let cleaned = name.includes('@') ? name.split('@')[0] : name;
  // Remove digits (e.g. 2019)
  cleaned = cleaned.replace(/\d+/g, ' ').trim();
  // Split on spaces, dots, dashes, underscores
  const parts = cleaned.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    const last = parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1).toLowerCase();
    return `${first} ${last}`;
  }
  if (parts.length === 1) {
    const single = parts[0];
    const lower = single.toLowerCase();
    // Check known concatenated case like "emmanuelozochi"
    if (lower.startsWith('emmanuel') && lower.length > 8) {
      const rest = lower.slice(8);
      return `Emmanuel ${rest.charAt(0).toUpperCase() + rest.slice(1)}`;
    }
    return single.charAt(0).toUpperCase() + single.slice(1).toLowerCase();
  }
  return 'Student';
};

const getInitials = (name: string) => {
  if (!name) return 'ST';
  const formatted = formatFirstAndLastName(name);
  const parts = formatted.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarGradient = (name: string) => {
  const gradients = [
    'from-blue-600 to-indigo-600',
    'from-emerald-600 to-teal-700',
    'from-violet-600 to-purple-700',
    'from-amber-600 to-orange-600',
    'from-rose-600 to-pink-600',
    'from-cyan-600 to-blue-700',
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return gradients[sum % gradients.length];
};

export const PortalHeader: React.FC<NavigationHeaderProps> = ({
  activeMainTab,
  setActiveMainTab,
  plannerSubTab,
  setPlannerSubTab,
  student,
  setStudent,
  studentScoreProfile,
  setStudentScoreProfile,
  selectedPlan,
  semesterPlan,
  onOpenProfileModal,
  onBackToLanding,
  onOpenMobileSidebar,
}) => {
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const totalPlannedCredits = semesterPlan.reduce((acc, c) => acc + c.credits, 0);
  const isOverload = totalPlannedCredits > student.maxTargetCreditsSemester;

  const isAdmissionSection =
    activeMainTab === 'selector' ||
    activeMainTab === 'courses' ||
    activeMainTab === 'ai-advisor' ||
    activeMainTab === 'roadmap';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Button */}
            {onOpenMobileSidebar && (
              <button
                onClick={onOpenMobileSidebar}
                className="flex items-center justify-center p-2 text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors cursor-pointer lg:hidden"
                title="Toggle Sidebar Navigation"
                aria-label="Toggle Sidebar Navigation"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="flex items-center justify-center p-2 text-slate-600 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 border border-slate-200 rounded-xl transition-colors cursor-pointer mr-1"
                title="Back to Welcome Page"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs relative shrink-0">
              <GraduationCap className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
                    advisors.
                  </span>
                  <span className="text-sm font-extrabold text-blue-600 tracking-tight leading-tight">
                    academic
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200/80">
                  Student Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                {isAdmissionSection
                  ? selectedPlan.selectedInstitution
                    ? `Selected: ${selectedPlan.selectedInstitution.shortName} • ${selectedPlan.selectedCourse?.name || 'Program Selection'}`
                    : 'Admissions & Institutional Placement Engine'
                  : `${student.university} • ${student.major}`}
              </p>
            </div>
          </div>

          {/* Student Status Profile Indicators */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
            {/* Logged-in User Capsule with Round Profile Pic, Name, and (:) Settings Button */}
            <div className="relative" id="user-profile-header-capsule">
              <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-full pl-1.5 pr-2 py-1 transition-all shadow-2xs">
                {/* Round Profile Pic */}
                <div className="relative shrink-0">
                  {student.avatarUrl ? (
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-xs"
                    />
                  ) : (
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${getAvatarGradient(
                        student.name
                      )} text-white flex items-center justify-center font-bold text-[11px] ring-2 ring-white shadow-xs`}
                    >
                      {getInitials(student.name)}
                    </div>
                  )}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"
                    title="Active Student Session"
                  />
                </div>

                {/* Logged-in User Name - First & Last Name only */}
                <div className="flex items-center text-left min-w-0">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight truncate max-w-[150px] sm:max-w-[200px]">
                    {formatFirstAndLastName(student.name)}
                  </span>
                </div>

                {/* (:) Vertical Ellipsis Button */}
                <button
                  id="profile-settings-menu-btn"
                  onClick={() => setIsProfileSettingsOpen(!isProfileSettingsOpen)}
                  className={`p-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer ${
                    isProfileSettingsOpen ? 'bg-slate-200 text-slate-900' : ''
                  }`}
                  title="Profile Settings & Options"
                  aria-label="Profile settings"
                  aria-expanded={isProfileSettingsOpen}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* (:) Settings Dropdown Menu */}
              {isProfileSettingsOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileSettingsOpen(false)}
                  />

                  <div
                    id="profile-settings-dropdown"
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-3 space-y-3 animate-in fade-in slide-in-from-top-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Student Mini Profile Card */}
                    <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="relative shrink-0">
                        {student.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-tr ${getAvatarGradient(
                              student.name
                            )} text-white flex items-center justify-center font-bold text-sm ring-2 ring-white shadow-xs`}
                          >
                            {getInitials(student.name)}
                          </div>
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-slate-900 truncate">
                          {formatFirstAndLastName(student.name)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          {student.studentId}
                        </div>
                        <div className="text-[10px] text-blue-600 font-semibold truncate">
                          {student.major} &bull; {student.level || student.standing}
                        </div>
                      </div>
                    </div>

                    {/* Setting: Edit Profile */}
                    <div className="space-y-1">
                      <button
                        id="setting-edit-profile-btn"
                        onClick={() => {
                          setIsProfileSettingsOpen(false);
                          onOpenProfileModal();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 rounded-xl transition-colors cursor-pointer text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Sliders className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <span className="block font-bold">Edit Profile</span>
                          <span className="block text-[10px] text-slate-500 font-normal">
                            Academic standing, career track & target credits
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Switch Student Account Persona */}
                    <div className="border-t border-slate-100 pt-2 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                        Switch Student Profile
                      </span>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {DEFAULT_STUDENTS.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setStudent(s);
                              setIsProfileSettingsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                              s.id === student.id
                                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {s.avatarUrl ? (
                                <img
                                  src={s.avatarUrl}
                                  alt={s.name}
                                  referrerPolicy="no-referrer"
                                  className="w-5 h-5 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div
                                  className={`w-5 h-5 rounded-full bg-gradient-to-tr ${getAvatarGradient(
                                    s.name
                                  )} text-white flex items-center justify-center font-bold text-[9px] shrink-0`}
                                >
                                  {getInitials(s.name)}
                                </div>
                              )}
                              <span className="truncate">{s.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                              {s.level}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Log Out */}
                    {onBackToLanding && (
                      <div className="border-t border-slate-100 pt-2">
                        <button
                          id="profile-logout-btn"
                          onClick={() => {
                            setIsProfileSettingsOpen(false);
                            onBackToLanding();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-3.5 h-3.5 shrink-0" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Contextual Badges based on Section */}
            {!isAdmissionSection && (
              <>
                {/* Semester Basket Pill */}
                <button
                  id="basket-quick-pill"
                  onClick={() => {
                    setActiveMainTab('planner');
                    setPlannerSubTab('basket');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                    isOverload
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>
                    {totalPlannedCredits} / {student.maxTargetCreditsSemester} Credits
                  </span>
                  {isOverload && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Level 1 Navigation: The Core Topics */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-semibold">
          {/* 1. Dashboard */}
          <button
            id="nav-dashboard"
            onClick={() => setActiveMainTab('dashboard')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* 2. Course Registration */}
          <button
            id="nav-course-registration"
            onClick={() => setActiveMainTab('registration')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'registration'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Course Registration</span>
            {semesterPlan.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                activeMainTab === 'registration' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
              }`}>
                {semesterPlan.length}
              </span>
            )}
          </button>

          {/* 3. Result / Transcript */}
          <button
            id="nav-results"
            onClick={() => setActiveMainTab('results')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'results'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Result / Transcript</span>
          </button>

          {/* 4. Degree Audit */}
          <button
            id="nav-audit"
            onClick={() => setActiveMainTab('audit')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'audit'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Degree Audit</span>
          </button>

          {/* 5. Admissions Matcher */}
          <button
            id="nav-step-selector"
            onClick={() => setActiveMainTab('selector')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'selector'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Admissions Matcher</span>
          </button>

          {/* 6. Admissions Roadmap */}
          <button
            id="nav-roadmap"
            onClick={() => setActiveMainTab('roadmap')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'roadmap'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Admissions Roadmap</span>
            {selectedPlan.selectedCourse && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* 7. AI Admissions Counselor */}
          <button
            id="nav-ai-advisor"
            onClick={() => setActiveMainTab('ai-advisor')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMainTab === 'ai-advisor'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Advisor</span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-800 px-1 py-0.2 rounded">
              Gemini
            </span>
          </button>
        </nav>

        {/* Level 2 Subnavigation: Only displayed when activeMainTab === 'planner' */}
        {activeMainTab === 'planner' && (
          <div className="flex items-center space-x-2 py-2 border-t border-slate-100 text-xs overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Curriculum Tools:
            </span>
            <button
              onClick={() => setPlannerSubTab('recommendations')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                plannerSubTab === 'recommendations'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Course Feed
            </button>
            <button
              onClick={() => setPlannerSubTab('basket')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                plannerSubTab === 'basket'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Schedule Basket ({semesterPlan.length})</span>
            </button>
            <button
              onClick={() => setPlannerSubTab('audit')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                plannerSubTab === 'audit'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Degree Audit
            </button>
            <button
              onClick={() => setPlannerSubTab('academic-advisor')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                plannerSubTab === 'academic-advisor'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Academic Workload AI</span>
            </button>
            <button
              onClick={() => setPlannerSubTab('compare')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                plannerSubTab === 'compare'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Compare Electives
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
