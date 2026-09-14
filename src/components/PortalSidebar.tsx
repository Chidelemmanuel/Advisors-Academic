/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  GraduationCap,
  Sparkles,
  Compass,
  MapPin,
  LogOut,
  User,
  ChevronRight,
  X,
  Layers,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { UndergraduateStudentProfile, Course } from '../types';

export type PortalSidebarTab =
  | 'dashboard'
  | 'registration'
  | 'results'
  | 'audit'
  | 'selector'
  | 'roadmap'
  | 'ai-advisor';

interface PortalSidebarProps {
  activeTab: PortalSidebarTab;
  setActiveTab: (tab: PortalSidebarTab) => void;
  student: UndergraduateStudentProfile;
  semesterPlan: Course[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenProfileModal: () => void;
  onLogout: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeTab,
  setActiveTab,
  student,
  semesterPlan,
  isOpenMobile,
  onCloseMobile,
  onOpenProfileModal,
  onLogout,
}) => {
  const registeredCount = semesterPlan.length;
  const auditProgress = Math.min(
    100,
    Math.round((student.completedCredits / student.totalDegreeCreditsRequired) * 100)
  );

  const academicNavItems = [
    {
      id: 'dashboard' as PortalSidebarTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Academic overview & stats',
    },
    {
      id: 'registration' as PortalSidebarTab,
      label: 'Course Registration',
      icon: BookOpen,
      badge: registeredCount > 0 ? `${registeredCount} Courses` : null,
      badgeColor: 'bg-orange-100 text-orange-700',
      description: 'Catalog & enrolled units',
    },
    {
      id: 'results' as PortalSidebarTab,
      label: 'Result / Transcript',
      icon: Award,
      badge: `${student.currentGpa.toFixed(2)} GPA`,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Semester grades & slip',
    },
    {
      id: 'audit' as PortalSidebarTab,
      label: 'Degree Audit',
      icon: GraduationCap,
      badge: `${auditProgress}%`,
      badgeColor: 'bg-blue-100 text-blue-700',
      description: 'Curriculum requirements',
    },
  ];

  const guidanceNavItems = [
    {
      id: 'selector' as PortalSidebarTab,
      label: 'Admissions Matcher',
      icon: Compass,
      badge: '5-Step',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      description: 'Entrance scores & cut-offs',
    },
    {
      id: 'roadmap' as PortalSidebarTab,
      label: 'Admissions Roadmap',
      icon: MapPin,
      badge: null,
      description: 'Clearance & status',
    },
    {
      id: 'ai-advisor' as PortalSidebarTab,
      label: 'AI Academic Advisor',
      icon: Sparkles,
      badge: 'Gemini',
      badgeColor: 'bg-purple-100 text-purple-700',
      description: 'Smart counseling & plans',
    },
  ];

  const handleNavClick = (tab: PortalSidebarTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-sm tracking-tight">
                    advisors.
                  </span>
                  <span className="font-black text-blue-600 text-sm tracking-tight">
                    academic
                  </span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Student Portal
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)]">
            {/* Section 1: Academic Portal */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Academic Management
              </div>

              {academicNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Section 2: Admissions & Guidance */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Admissions & Guidance
              </div>

              {guidanceNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Student Profile Card & Logout */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2">
          {/* Student Profile Quick Capsule */}
          <div
            onClick={onOpenProfileModal}
            className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                {student.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                  {student.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  {student.studentId}
                </div>
              </div>
            </div>
            <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
          </div>

          {/* Log Out Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors border border-slate-200 hover:border-rose-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
