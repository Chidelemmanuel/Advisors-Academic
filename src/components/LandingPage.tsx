/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Award,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  ExternalLink,
  Plus,
  Compass,
  AlertTriangle,
  School,
  Check,
  Zap,
  Building2,
  FileText,
  Menu,
  X,
  Star,
  Search,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { Course, UndergraduateStudentProfile } from '../types';
import { DEFAULT_STUDENTS } from '../data/undergraduateCatalog';
import { AuthModal } from './AuthModal';

interface LandingPageProps {
  catalog: Course[];
  student: UndergraduateStudentProfile;
  setStudent: (student: UndergraduateStudentProfile) => void;
  semesterPlan: Course[];
  onAddToPlan: (course: Course) => void;
  onRemoveFromPlan: (courseId: string) => void;
  onInspectPrereqs: (course: Course) => void;
  onViewDetails: (course: Course) => void;
  onCompareCourse: (course: Course) => void;
  onLaunchPortal: () => void;
  onNavigateToTopic?: (tab: 'selector' | 'courses' | 'ai-advisor' | 'roadmap' | 'planner') => void;
  onOpenProfileModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  catalog,
  student,
  setStudent,
  semesterPlan,
  onAddToPlan,
  onRemoveFromPlan,
  onInspectPrereqs,
  onViewDetails,
  onCompareCourse,
  onLaunchPortal,
  onNavigateToTopic,
  onOpenProfileModal,
}) => {
  // Mobile Navigation Drawer Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Hero interactive course search
  const [heroSearchQuery, setHeroSearchQuery] = useState<string>('');

  // Auth Modal State (Sign Up & Log In)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // FAQ Items
  const faqItems = [
    {
      question: 'How does Advisors Academic determine degree and cut-off eligibility?',
      answer:
        'Advisors Academic cross-references your entrance exam scores (UTME/SAT) and O-Level credit passes against verified departmental benchmarks across Federal, State, and Private higher institutions. The system evaluates both general institutional baselines and competitive departmental merit cut-offs.',
    },
    {
      question: 'What is the difference between Federal, State, and Private Universities?',
      answer:
        'Federal Universities offer heavily subsidized tuition and prestigious research faculties with competitive entrance cut-offs. State Universities offer regional priority and extensive local programs. Private Universities offer modern campus infrastructure, zero academic calendar strikes, and accelerated graduation tracks.',
    },
    {
      question: 'How does the Gemini AI Academic Counselor assist students?',
      answer:
        'Operating securely on the server-side, the AI Counselor analyzes your entrance exam scores, study habits, and geographic preferences to recommend the highest-probability institutions and lucrative degree combinations.',
    },
    {
      question: 'How does the undergraduate course recommendation and prerequisite DAG work?',
      answer:
        'Once enrolled, Advisors Academic tracks every completed course against your degree audit. Its directed acyclic graph (DAG) engine verifies prerequisite readiness, forecasts weekly study workloads, and prevents accidental course registration errors.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NAVBAR SECTION */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Software Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 relative shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border border-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-tight">
                advisors.
              </span>
              <span className="font-extrabold text-blue-600 text-sm sm:text-base tracking-tight leading-tight">
                academic
              </span>
            </div>
          </div>

          {/* Primary Navigation Links with UL Elements Tag */}
          <nav aria-label="Main Navigation" className="hidden md:block">
            <ul className="flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-700">
              <li>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </nav>

          {/* Action and Mobile Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-orange-500" />
              <span>Log In</span>
            </button>

            <button
              onClick={() => {
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs shadow-blue-600/20"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with the same UL tag */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg">
            <ul className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
              <li>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-orange-500" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION (Blue & Orange Theme) */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 bg-linear-to-b from-white via-blue-50/30 to-orange-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-6">
            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Find the Right Course for Your <span className="text-blue-600">Future</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Research accredited undergraduate degree programs, confirm prerequisite requirements, assess departmental admission cut-off marks, and chart a clear academic path toward your graduation.
            </p>

            {/* Interactive Course Search Bar */}
            <div className="relative w-full max-w-xl">
              <div className="flex items-center bg-white rounded-xl border border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-1.5">
                <Search className="w-5 h-5 text-slate-400 ml-2.5 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search courses (e.g., CS-320, Data Science, Calculus, Medicine)..."
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden py-1.5 text-left"
                />
                {heroSearchQuery && (
                  <button
                    onClick={() => setHeroSearchQuery('')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 mr-1 text-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onNavigateToTopic) onNavigateToTopic('courses');
                    else onLaunchPortal();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  Explore Courses
                </button>
              </div>

              {/* Instant Search Suggestions Dropdown */}
              {heroSearchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-30 max-h-60 overflow-y-auto divide-y divide-slate-100 p-1 text-left">
                  {catalog
                    .filter(
                      (c) =>
                        c.name.toLowerCase().includes(heroSearchQuery.toLowerCase()) ||
                        c.code.toLowerCase().includes(heroSearchQuery.toLowerCase()) ||
                        c.department.toLowerCase().includes(heroSearchQuery.toLowerCase())
                    )
                    .slice(0, 6)
                    .map((matchCourse) => (
                      <div
                        key={matchCourse.id}
                        onClick={() => {
                          onViewDetails(matchCourse);
                          setHeroSearchQuery('');
                        }}
                        className="p-2.5 hover:bg-blue-50/70 rounded-lg cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                              {matchCourse.code}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{matchCourse.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {matchCourse.department} &bull; {matchCourse.credits} Credits &bull; Level {matchCourse.level}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-blue-600">View Syllabus &rarr;</span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Action Buttons: Sign Up (Primary Blue) & Log In (Secondary Orange) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            </div>

            {/* Trust Metrics Strip in Blue & Orange (250+ Institutions) */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center w-full max-w-2xl">
              <div>
                <div className="text-xl sm:text-2xl font-black text-blue-600">250+</div>
                <div className="text-xs text-slate-500 font-medium">Institutions</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-orange-600">180+</div>
                <div className="text-xs text-slate-500 font-medium">Degree Programs</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium">NUC Accredited</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600">98.4%</div>
                <div className="text-xs text-slate-500 font-medium">Placement Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 9. TESTIMONIALS / REVIEWS */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Thousands of Aspiring Undergraduates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Advisors Academic showed me that with my 248 UTME score, I could comfortably clear the cut-off for Software Engineering instead of settling. Today I'm on track for a 3.9 GPA."
              </p>
              <div>
                <div className="text-xs font-extrabold text-slate-900">David O.</div>
                <div className="text-[11px] text-slate-500">Sophomore &bull; Software Engineering</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "The institutional cut-off benchmarks helped me compare Mechatronics vs Mechanical Engineering before applying. The prerequisite DAG view has saved me from prerequisite errors every semester."
              </p>
              <div>
                <div className="text-xs font-extrabold text-slate-900">Zainab A.</div>
                <div className="text-[11px] text-slate-500">Junior &bull; Mechatronics Engineering</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "The AI Counselor gave me realistic advice about Medicine cut-offs and suggested Pharmacy as a strong second choice. I am thriving in my coursework now."
              </p>
              <div>
                <div className="text-xs font-extrabold text-slate-900">Emeka N.</div>
                <div className="text-[11px] text-slate-500">Freshman &bull; Clinical Pharmacy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Know About Advisors Academic
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 overflow-hidden transition-all bg-white"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4.5 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{item.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-orange-600 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-4.5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 relative shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border border-white" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-tight">
                    advisors.
                  </span>
                  <span className="font-extrabold text-blue-600 text-sm sm:text-base tracking-tight leading-tight">
                    academic
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                The comprehensive higher education institution matching, degree cut-offs, and academic registration platform.
              </p>
              <div className="text-[11px] text-slate-400">
                &copy; {new Date().getFullYear()} Advisors Academic. All rights reserved.
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px]">
                Platform Navigation
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => scrollToSection('faq')} className="hover:text-orange-600 transition-colors cursor-pointer">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px]">
                Compliance & Standards
              </span>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Accreditation Verification: Active</span>
                </li>
                <li><span>University Registrar Data Sync</span></li>
                <li><span>Departmental Cut-Off Standards</span></li>
                <li><span>Academic Integrity Guidelines</span></li>
                <li><span>FERPA Compliance Standard</span></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Unified Sign Up & Log In Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(profile) => {
          if (profile) {
            setStudent(profile);
          }
          onLaunchPortal();
        }}
      />
    </div>
  );
};
