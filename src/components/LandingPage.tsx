/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  GitBranch,
  CalendarCheck,
  Award,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
  TrendingUp,
  BookOpen,
  Sliders,
  ExternalLink,
  Plus,
  Compass,
  AlertTriangle,
  School,
  Check,
  Zap,
  Building2,
  FileText,
  Briefcase,
  DollarSign,
  Target,
  Menu,
  X,
  Star,
  Search,
} from 'lucide-react';
import { Course, UndergraduateStudentProfile } from '../types';
import { DEFAULT_STUDENTS } from '../data/undergraduateCatalog';
import { evaluateCourseRecommendation } from '../utils/courseMatchEngine';
import { AcademicRegistrationSection } from './AcademicRegistrationSection';

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
  onNavigateToTopic?: (tab: 'selector' | 'institutions' | 'courses' | 'ai-advisor' | 'roadmap' | 'planner') => void;
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

  // Active Category filter in Categories section
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Hero interactive course search
  const [heroSearchQuery, setHeroSearchQuery] = useState<string>('');

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

  // 6 Primary Academic Disciplines / Categories
  const academicCategories = [
    {
      id: 'computing',
      title: 'Computing & Artificial Intelligence',
      badge: 'STEM High Demand',
      description:
        'Software Engineering, Computer Science, Cybersecurity, Data Science, and Machine Learning systems.',
      avgCutoff: '230 - 275',
      duration: '4 Years',
      startingSalary: '$95,000 - $125,000',
      jobGrowth: '+28% (Very High)',
      topCareers: ['AI Systems Architect', 'Cloud Security Specialist', 'Full-Stack Engineer'],
      keySkills: ['Distributed Computing', 'Data Structures', 'Neural Networks'],
      accentColor: 'blue',
    },
    {
      id: 'engineering',
      title: 'Engineering & Industrial Robotics',
      badge: 'Accredited B.Eng',
      description:
        'Mechanical, Electrical/Electronics, Mechatronics, Civil, and Chemical Engineering disciplines.',
      avgCutoff: '215 - 260',
      duration: '5 Years',
      startingSalary: '$88,000 - $115,000',
      jobGrowth: '+22% (High)',
      topCareers: ['Automation & Robotics Lead', 'Renewable Energy Consultant', 'Embedded Firmware Engineer'],
      keySkills: ['Thermodynamics', 'Control Systems', 'CAD & Finite Element Analysis'],
      accentColor: 'orange',
    },
    {
      id: 'medicine',
      title: 'Clinical Medicine & Health Sciences',
      badge: 'Medical Board Verified',
      description:
        'Medicine & Surgery (MBBS), Pharmacy, Nursing Science, Medical Laboratory Science, and Public Health.',
      avgCutoff: '255 - 290',
      duration: '5 - 6 Years',
      startingSalary: '$110,000 - $145,000',
      jobGrowth: '+32% (Critical Need)',
      topCareers: ['Clinical Physician & Specialist', 'Pharmacotherapist', 'Health Informatics Director'],
      keySkills: ['Clinical Diagnostics', 'Pathophysiology', 'Pharmacology'],
      accentColor: 'blue',
    },
    {
      id: 'business',
      title: 'Business, FinTech & Management Economics',
      badge: 'Global Commerce',
      description:
        'Accounting, Financial Economics, Business Analytics, Banking & Finance, and Strategic Management.',
      avgCutoff: '200 - 245',
      duration: '4 Years',
      startingSalary: '$85,000 - $118,000',
      jobGrowth: '+18% (Steady Growth)',
      topCareers: ['Quantitative Financial Analyst', 'FinTech Product Lead', 'Corporate Strategy Consultant'],
      keySkills: ['Econometric Modeling', 'Risk Assessment', 'Financial Accounting'],
      accentColor: 'orange',
    },
    {
      id: 'law',
      title: 'Law & International Jurisprudence',
      badge: 'Bar Benchmark',
      description:
        'Civil Law, International Commercial Law, Public Policy, Constitutional Jurisprudence, and Human Rights.',
      avgCutoff: '240 - 275',
      duration: '5 Years',
      startingSalary: '$90,000 - $130,000',
      jobGrowth: '+16% (Competitive)',
      topCareers: ['Corporate Legal Counsel', 'Intellectual Property Attorney', 'Diplomatic & Policy Officer'],
      keySkills: ['Legal Drafting', 'Statutory Interpretation', 'Advocacy & Negotiation'],
      accentColor: 'blue',
    },
    {
      id: 'sciences',
      title: 'Applied Sciences & Biotechnology',
      badge: 'Research & Discovery',
      description:
        'Biochemistry, Microbiology, Industrial Chemistry, Biotechnology, Environmental Science, and Applied Physics.',
      avgCutoff: '190 - 235',
      duration: '4 Years',
      startingSalary: '$78,000 - $105,000',
      jobGrowth: '+20% (Expanding)',
      topCareers: ['Biotechnology Research Scientist', 'Clinical Toxicologist', 'Industrial Quality Assurance Lead'],
      keySkills: ['Genomic Sequencing', 'Chromatography', 'Bioinformatics'],
      accentColor: 'orange',
    },
  ];

  // High-Growth Graduate Careers mapped to degrees
  const careerPathways = [
    {
      title: 'AI & Cloud Infrastructure Architect',
      degreeCategory: 'Computing & Artificial Intelligence',
      targetDegrees: ['B.Sc Software Engineering', 'B.Sc Computer Science'],
      avgSalary: '$118,000',
      growthRate: '+29% through 2030',
      demandLevel: 'Top 1% National Demand',
      description:
        'Designs scalable multi-region distributed compute systems, deep learning model deployment pipelines, and zero-trust cloud security architectures.',
      coreCompetencies: ['Kubernetes & Cloud Native', 'PyTorch / TensorFlow', 'Distributed Algorithms'],
      certifications: ['AWS Solutions Architect', 'Google Cloud Professional Cloud Architect'],
    },
    {
      title: 'Clinical Physician & Medical Specialist',
      degreeCategory: 'Clinical Medicine & Health Sciences',
      targetDegrees: ['MBBS Medicine & Surgery'],
      avgSalary: '$138,000',
      growthRate: '+34% through 2030',
      demandLevel: 'Critical National Priority',
      description:
        'Delivers comprehensive diagnostic examinations, surgical treatment interventions, patient telemetry monitoring, and medical research clinical trials.',
      coreCompetencies: ['Internal Medicine', 'Emergency Therapeutics', 'Surgical Pathology'],
      certifications: ['National Medical Council Licensing', 'Specialist College Residency'],
    },
    {
      title: 'Quantitative Risk & FinTech Strategist',
      degreeCategory: 'Business, FinTech & Management Economics',
      targetDegrees: ['B.Sc Financial Economics', 'B.Sc Accounting & Analytics'],
      avgSalary: '$112,000',
      growthRate: '+24% through 2030',
      demandLevel: 'High Institutional Demand',
      description:
        'Constructs algorithmic risk models, real-time market liquidity assessments, and automated regulatory compliance frameworks for banking institutions.',
      coreCompetencies: ['Stochastic Calculus', 'Python Financial Modeling', 'Basel III Risk Frameworks'],
      certifications: ['CFA (Chartered Financial Analyst)', 'FRM (Financial Risk Manager)'],
    },
    {
      title: 'Autonomous Robotics & Systems Engineer',
      degreeCategory: 'Engineering & Industrial Robotics',
      targetDegrees: ['B.Eng Mechatronics', 'B.Eng Electrical & Electronics'],
      avgSalary: '$104,000',
      growthRate: '+26% through 2030',
      demandLevel: 'Expanding Manufacturing Sector',
      description:
        'Pioneers closed-loop automated assembly robotics, industrial sensor telemetry, micro-controller firmware, and real-time computer vision hardware.',
      coreCompetencies: ['ROS2 (Robot Operating System)', 'Embedded C++', 'PLC Automation'],
      certifications: ['IEEE Robotics Certification', 'Certified Automation Professional (CAP)'],
    },
  ];

  // FAQ Items
  const faqItems = [
    {
      question: 'How does Advisors Academic determine degree and cut-off eligibility?',
      answer:
        'Advisors Academic cross-references your entrance exam scores (UTME/SAT) and O-Level credit passes against verified departmental benchmarks across Federal, State, and Private higher institutions. The system evaluates both general institutional baselines and competitive departmental merit cut-offs.',
    },
    {
      question: 'Can I explore careers before choosing my academic degree program?',
      answer:
        'Yes! The platform bridges academic degrees directly with high-growth graduate careers. You can inspect average starting salaries, national market demand rates, required core competencies, and professional licensing exams before locking in your faculty choice.',
    },
    {
      question: 'What is the difference between Federal, State, and Private Universities?',
      answer:
        'Federal Universities offer heavily subsidized tuition and prestigious research faculties with competitive entrance cut-offs. State Universities offer regional priority and extensive local programs. Private Universities offer modern campus infrastructure, zero academic calendar strikes, and accelerated graduation tracks.',
    },
    {
      question: 'How does the Gemini AI Academic Counselor assist students?',
      answer:
        'Operating securely on the server-side, the AI Counselor analyzes your entrance exam scores, preferred academic categories, study habits, and geographic preferences to recommend the highest-probability institutions and lucrative degree combinations.',
    },
    {
      question: 'How does the undergraduate course recommendation and prerequisite DAG work?',
      answer:
        'Once enrolled, Advisors Academic tracks every completed course against your degree audit. Its directed acyclic graph (DAG) engine verifies prerequisite readiness, forecasts weekly study workloads, and prevents accidental course registration errors.',
    },
  ];

  // Filtered categories
  const displayedCategories =
    selectedCategoryTab === 'all'
      ? academicCategories
      : academicCategories.filter((c) => c.accentColor === selectedCategoryTab);

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

          {/* Primary Navigation Links with UL Elements Tag (not more than five items) */}
          <nav aria-label="Main Navigation" className="hidden md:block">
            <ul className="flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-700">
              <li>
                <button
                  onClick={() => scrollToSection('categories')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('careers')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('institutions')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Institutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('academic-info')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Registration
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2.5">
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
                  onClick={() => scrollToSection('categories')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('careers')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('institutions')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Institutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('academic-info')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Academic Registration
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
              Research accredited undergraduate degree programs, confirm prerequisite requirements, assess departmental admission cut-off marks, and chart a clear academic path toward careers in high-growth industries.
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

            {/* Quick Course Selector Chips */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-400 font-medium">Quick Courses:</span>
              {['CS-320', 'MATH-240', 'BIO-210', 'ECON-305', 'ENG-201'].map((code) => {
                const found = catalog.find((c) => c.code === code);
                if (!found) return null;
                return (
                  <button
                    key={code}
                    onClick={() => onViewDetails(found)}
                    className="px-2.5 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600"
                  >
                    {code}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons (Primary Blue & Secondary Orange Accent) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-1">
              <button
                onClick={() => scrollToSection('categories')}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Academic Categories</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('careers')}
                className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Discover Career Pathways</span>
              </button>
            </div>

            {/* Trust Metrics Strip in Blue & Orange (250+ Institutions) */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center w-full max-w-2xl">
              <div>
                <div className="text-xl sm:text-2xl font-black text-blue-600">6</div>
                <div className="text-xs text-slate-500 font-medium">Core Categories</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-orange-600">250+</div>
                <div className="text-xs text-slate-500 font-medium">Institutions</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">180+</div>
                <div className="text-xs text-slate-500 font-medium">Degree Programs</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600">98.4%</div>
                <div className="text-xs text-slate-500 font-medium">Placement Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEDICATED SECTION: CATEGORIES (#categories) */}
      <section id="categories" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Academic Categories
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore accredited degree pathways organized by academic discipline. Compare departmental cut-offs, graduation timeframes, and starting salary expectations.
            </p>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setSelectedCategoryTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Categories (6)
              </button>
              <button
                onClick={() => setSelectedCategoryTab('blue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryTab === 'blue'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                STEM & Medicine
              </button>
              <button
                onClick={() => setSelectedCategoryTab('orange')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryTab === 'orange'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Engineering, Commerce & Sciences
              </button>
            </div>
          </div>

          {/* Grid of 6 Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        cat.accentColor === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {cat.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{cat.duration}</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Metrics block */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Cut-Off Range
                      </span>
                      <span className="font-extrabold text-slate-900">{cat.avgCutoff}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Job Growth
                      </span>
                      <span className="font-extrabold text-emerald-700">{cat.jobGrowth}</span>
                    </div>
                  </div>

                  {/* Top careers */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      High-Growth Career Paths:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.topCareers.map((tc, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-white border border-slate-200 rounded px-2 py-0.5 text-slate-700"
                        >
                          {tc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      if (onNavigateToTopic) onNavigateToTopic('courses');
                      else onLaunchPortal();
                    }}
                    className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      cat.accentColor === 'blue'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    <span>Explore {cat.title.split('&')[0]} Degrees</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DEDICATED SECTION: CAREERS (#careers) */}
      <section id="careers" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Degree-to-Career Pathways
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every academic degree in Advisors Academic is mapped to market realities. Discover starting salary bands, corporate placement rates, and the required curriculum certifications.
            </p>
          </div>

          {/* 4 Featured High-Growth Career Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerPathways.map((cp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                      {cp.degreeCategory}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-2">{cp.title}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Avg Starting</span>
                    <span className="text-lg font-black text-emerald-700">{cp.avgSalary}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{cp.description}</p>

                {/* Target Degrees */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Accredited Degree Pathways:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cp.targetDegrees.map((deg, dIdx) => (
                      <span
                        key={dIdx}
                        className="text-[11px] font-semibold bg-slate-100 text-slate-800 rounded px-2 py-0.5"
                      >
                        {deg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Core Competencies & Certifications */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Core Skills
                    </span>
                    <ul className="space-y-1">
                      {cp.coreCompetencies.map((skill, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-1 text-[11px] text-slate-700">
                          <Check className="w-3 h-3 text-orange-500 shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Target Certifications
                    </span>
                    <ul className="space-y-1">
                      {cp.certifications.map((cert, cIdx) => (
                        <li key={cIdx} className="flex items-center gap-1 text-[11px] text-slate-700">
                          <Award className="w-3 h-3 text-blue-600 shrink-0" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 flex items-center">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {cp.growthRate}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 4-Stage Career Progression Pipeline */}
          <div className="bg-[#0b0e14] rounded-2xl border border-slate-800 p-6 sm:p-10 space-y-8 shadow-2xl">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                The Advisors Academic 4-Stage Career Readiness Pipeline
              </h3>
            </div>

            {/* Desktop & Tablet 2x2 Connected Pipeline (Image 2 style) */}
            <div className="hidden sm:block max-w-4xl mx-auto">
              {/* Row 1: Stage 1 -> Stage 2 */}
              <div className="flex items-center">
                {/* 1. Entrance & cut-off clearance (Blue) */}
                <div className="flex-1 bg-[#0e4477] border border-[#1b5591] rounded-xl py-4 sm:py-5 px-4 text-center shadow-md">
                  <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                    1. Entrance & cut-off clearance
                  </h4>
                  <p className="text-xs sm:text-sm text-sky-200 mt-1 font-normal">
                    JAMB UTME & O'level credits
                  </p>
                </div>

                {/* Arrow 1 -> 2 */}
                <div className="w-10 sm:w-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-4 text-slate-500 overflow-visible" viewBox="0 0 40 12" fill="none">
                    <line x1="0" y1="6" x2="33" y2="6" stroke="#64748b" strokeWidth="1.5" />
                    <polygon points="33,2 40,6 33,10" fill="#64748b" />
                  </svg>
                </div>

                {/* 2. Foundations & prerequisites (Rust / Terracotta) */}
                <div className="flex-1 bg-[#6a2b1d] border border-[#853724] rounded-xl py-4 sm:py-5 px-4 text-center shadow-md">
                  <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                    2. Foundations & prerequisites
                  </h4>
                  <p className="text-xs sm:text-sm text-orange-200 mt-1 font-normal">
                    100L-200L core courses
                  </p>
                </div>
              </div>

              {/* Stepped Connector from Stage 2 down to Stage 3 */}
              <div className="w-full h-12 sm:h-14 relative">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 1000 60"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M 850 0 L 850 30 L 280 30 L 280 50"
                    stroke="#64748b"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    fill="none"
                  />
                  <polygon points="275,48 280,58 285,48" fill="#64748b" />
                </svg>
              </div>

              {/* Row 2: Stage 3 -> Stage 4 */}
              <div className="flex items-center">
                {/* 3. SIWES & research project (Forest Green) */}
                <div className="flex-1 bg-[#174d3b] border border-[#236750] rounded-xl py-4 sm:py-5 px-4 text-center shadow-md">
                  <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                    3. SIWES & research project
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-normal">
                    300L-400L industrial training
                  </p>
                </div>

                {/* Arrow 3 -> 4 */}
                <div className="w-10 sm:w-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-4 text-slate-500 overflow-visible" viewBox="0 0 40 12" fill="none">
                    <line x1="0" y1="6" x2="33" y2="6" stroke="#64748b" strokeWidth="1.5" />
                    <polygon points="33,2 40,6 33,10" fill="#64748b" />
                  </svg>
                </div>

                {/* 4. NYSC & professional licensure (Ochre / Amber Brown) */}
                <div className="flex-1 bg-[#6e4618] border border-[#8c591e] rounded-xl py-4 sm:py-5 px-4 text-center shadow-md">
                  <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                    4. NYSC & professional licensure
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-200 mt-1 font-normal">
                    Youth service, board exams
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Stacked Flow (< 640px) */}
            <div className="sm:hidden space-y-3 max-w-sm mx-auto">
              <div className="bg-[#0e4477] border border-[#1b5591] rounded-xl p-4 text-center">
                <h4 className="text-sm font-semibold text-white">1. Entrance & cut-off clearance</h4>
                <p className="text-xs text-sky-200 mt-0.5">JAMB UTME & O'level credits</p>
              </div>

              <div className="flex justify-center text-slate-500 py-0.5">
                <svg className="w-3.5 h-4" viewBox="0 0 12 16" fill="none">
                  <line x1="6" y1="0" x2="6" y2="12" stroke="#64748b" strokeWidth="1.5" />
                  <polygon points="2,10 6,16 10,10" fill="#64748b" />
                </svg>
              </div>

              <div className="bg-[#6a2b1d] border border-[#853724] rounded-xl p-4 text-center">
                <h4 className="text-sm font-semibold text-white">2. Foundations & prerequisites</h4>
                <p className="text-xs text-orange-200 mt-0.5">100L-200L core courses</p>
              </div>

              <div className="flex justify-center text-slate-500 py-0.5">
                <svg className="w-3.5 h-4" viewBox="0 0 12 16" fill="none">
                  <line x1="6" y1="0" x2="6" y2="12" stroke="#64748b" strokeWidth="1.5" />
                  <polygon points="2,10 6,16 10,10" fill="#64748b" />
                </svg>
              </div>

              <div className="bg-[#174d3b] border border-[#236750] rounded-xl p-4 text-center">
                <h4 className="text-sm font-semibold text-white">3. SIWES & research project</h4>
                <p className="text-xs text-emerald-200 mt-0.5">300L-400L industrial training</p>
              </div>

              <div className="flex justify-center text-slate-500 py-0.5">
                <svg className="w-3.5 h-4" viewBox="0 0 12 16" fill="none">
                  <line x1="6" y1="0" x2="6" y2="12" stroke="#64748b" strokeWidth="1.5" />
                  <polygon points="2,10 6,16 10,10" fill="#64748b" />
                </svg>
              </div>

              <div className="bg-[#6e4618] border border-[#8c591e] rounded-xl p-4 text-center">
                <h4 className="text-sm font-semibold text-white">4. NYSC & professional licensure</h4>
                <p className="text-xs text-amber-200 mt-0.5">Youth service, board exams</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEDICATED SECTION: INSTITUTIONS (#institutions) */}
      <section id="institutions" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Higher Institutions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore national rankings, campus facilities, tuition brackets, and admission portals across Federal, State, and Private universities and polytechnics.
            </p>
          </div>

          {/* Institutional Tiers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Federal */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Federal Universities</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Heavily subsidized tuition, premier national research libraries, extensive student bodies, and competitive merit cut-off benchmarks.
              </p>
              <div className="text-xs font-semibold text-blue-600">
                Tuition: &#8358;45,000 - &#8358;95,000 / yr
              </div>
            </div>

            {/* State */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                <School className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">State Universities</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                State-funded universities with strong regional employment networks, favorable catchment quotas, and diverse professional programs.
              </p>
              <div className="text-xs font-semibold text-orange-600">
                Tuition: &#8358;90,000 - &#8358;180,000 / yr
              </div>
            </div>

            {/* Private */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Private Universities</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guaranteed academic calendar (zero strike interruptions), ultra-modern laboratory facilities, high faculty-to-student ratios, and corporate internships.
              </p>
              <div className="text-xs font-semibold text-blue-700">
                Tuition: &#8358;650,000 - &#8358;2,500,000 / yr
              </div>
            </div>

            {/* Polytechnics */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Polytechnics & Tech</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hands-on practical engineering workshops, National Diploma (ND) and Higher National Diploma (HND) tracks focused on industry craftsmanship.
              </p>
              <div className="text-xs font-semibold text-orange-600">
                Tuition: &#8358;35,000 - &#8358;70,000 / yr
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DEDICATED SECTION: STUDENT ACADEMIC REGISTRATION FORM (#academic-info) */}
      <AcademicRegistrationSection
        onExploreDegree={() => {
          if (onNavigateToTopic) onNavigateToTopic('courses');
          else onLaunchPortal();
        }}
      />

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
                "The career salary benchmarks helped me compare Mechatronics vs Mechanical Engineering before applying. The prerequisite DAG view has saved me from prerequisite errors every semester."
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
                The comprehensive higher education institution matching, academic category exploration, degree cut-offs, and career advisory platform.
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
                  <button onClick={() => scrollToSection('categories')} className="hover:text-orange-600 transition-colors cursor-pointer">
                    Academic Categories
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('careers')} className="hover:text-orange-600 transition-colors cursor-pointer">
                    Career Pathways
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('institutions')} className="hover:text-orange-600 transition-colors cursor-pointer">
                    Institutions Directory
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('academic-info')} className="hover:text-orange-600 transition-colors cursor-pointer">
                    Academic Registration
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
    </div>
  );
};
