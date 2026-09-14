/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Sliders,
  Sparkles,
  Layers,
  ArrowLeft,
  ChevronDown,
  Trash2,
  Plus,
  X,
  Check,
  Download,
  RotateCcw,
  GraduationCap,
} from 'lucide-react';
import { Course, UndergraduateStudentProfile } from '../types';

const ACADEMIC_SESSIONS = [
  '2022-2023',
  '2023-2024',
  '2024-2025',
  '2025-2026',
  '2026-2027',
  '2027-2028',
  '2028-2029',
  '2029-2030',
  '2030-2031',
];

export interface SemesterCourseRow {
  id: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  status: 'Core' | 'Elective' | 'Required' | 'General';
  isRegistered: boolean;
}

// Generates 20 authentic university courses (exceeds 15 lines as required)
function getInitialCurriculumCourses(level: string, semester: string): SemesterCourseRow[] {
  const isFirstSemester = semester !== 'Second Semester';

  if (level.includes('100')) {
    return isFirstSemester
      ? [
          { id: '101', courseCode: 'CSC 101', courseTitle: 'Introduction to Computer Science & Computing', credits: 3, status: 'Core', isRegistered: true },
          { id: '102', courseCode: 'CSC 103', courseTitle: 'Introduction to Problem Solving with Python', credits: 3, status: 'Core', isRegistered: true },
          { id: '103', courseCode: 'MTH 101', courseTitle: 'Elementary Mathematics I (Algebra & Trigonometry)', credits: 3, status: 'Required', isRegistered: true },
          { id: '104', courseCode: 'MTH 103', courseTitle: 'Vectors, Geometry & Dynamics', credits: 3, status: 'Required', isRegistered: true },
          { id: '105', courseCode: 'PHY 101', courseTitle: 'General Physics I (Mechanics & Thermal Physics)', credits: 3, status: 'Required', isRegistered: true },
          { id: '106', courseCode: 'PHY 107', courseTitle: 'General Physics Laboratory Practice I', credits: 1, status: 'Required', isRegistered: true },
          { id: '107', courseCode: 'CHM 101', courseTitle: 'General Chemistry I', credits: 3, status: 'Required', isRegistered: false },
          { id: '108', courseCode: 'CHM 107', courseTitle: 'General Chemistry Laboratory I', credits: 1, status: 'Required', isRegistered: false },
          { id: '109', courseCode: 'GST 101', courseTitle: 'Use of English & Communication Skills I', credits: 2, status: 'General', isRegistered: true },
          { id: '110', courseCode: 'GST 103', courseTitle: 'Nigerian Peoples and Culture', credits: 2, status: 'General', isRegistered: true },
          { id: '111', courseCode: 'GST 107', courseTitle: 'Philosophy, Logic and Critical Thinking', credits: 2, status: 'General', isRegistered: false },
          { id: '112', courseCode: 'CSC 105', courseTitle: 'Computer Applications & Office Productivity Systems', credits: 2, status: 'Elective', isRegistered: false },
          { id: '113', courseCode: 'CSC 107', courseTitle: 'Digital Literacy & Modern Internet Technologies', credits: 2, status: 'Elective', isRegistered: false },
          { id: '114', courseCode: 'MTH 105', courseTitle: 'Introductory Differential & Integral Calculus', credits: 3, status: 'Elective', isRegistered: false },
          { id: '115', courseCode: 'STA 101', courseTitle: 'Introductory Statistics & Descriptive Data Methods', credits: 2, status: 'Elective', isRegistered: false },
          { id: '116', courseCode: 'PHY 103', courseTitle: 'Vibrations, Waves, Sound and Optics', credits: 2, status: 'Elective', isRegistered: false },
          { id: '117', courseCode: 'GST 105', courseTitle: 'History and Philosophy of Natural Science', credits: 2, status: 'General', isRegistered: false },
          { id: '118', courseCode: 'CSC 109', courseTitle: 'Algorithmic Flowcharting and Pseudocode Logic', credits: 2, status: 'Core', isRegistered: false },
          { id: '119', courseCode: 'LIB 101', courseTitle: 'Library Studies & Electronic Information Retrieval', credits: 1, status: 'General', isRegistered: false },
          { id: '120', courseCode: 'BIO 101', courseTitle: 'General Biology for Physical Sciences', credits: 2, status: 'Elective', isRegistered: false },
        ]
      : [
          { id: '121', courseCode: 'CSC 102', courseTitle: 'Introduction to Computer Programming in C', credits: 3, status: 'Core', isRegistered: true },
          { id: '122', courseCode: 'CSC 104', courseTitle: 'Computer Systems Foundations & Information Architecture', credits: 2, status: 'Core', isRegistered: true },
          { id: '123', courseCode: 'MTH 102', courseTitle: 'Elementary Mathematics II (Calculus & Coordinate Geometry)', credits: 3, status: 'Required', isRegistered: true },
          { id: '124', courseCode: 'PHY 102', courseTitle: 'General Physics II (Electricity & Magnetism)', credits: 3, status: 'Required', isRegistered: true },
          { id: '125', courseCode: 'PHY 108', courseTitle: 'General Physics Laboratory Practice II', credits: 1, status: 'Required', isRegistered: true },
          { id: '126', courseCode: 'GST 102', courseTitle: 'Use of English & Communication Skills II', credits: 2, status: 'General', isRegistered: true },
          { id: '127', courseCode: 'GST 104', courseTitle: 'Social Sciences & Citizenship Education', credits: 2, status: 'General', isRegistered: false },
          { id: '128', courseCode: 'CSC 106', courseTitle: 'Web Page Construction with HTML, CSS and JavaScript', credits: 2, status: 'Elective', isRegistered: false },
          { id: '129', courseCode: 'CSC 108', courseTitle: 'Information Technology Hardware Architecture', credits: 2, status: 'Core', isRegistered: false },
          { id: '130', courseCode: 'STA 102', courseTitle: 'Probability Theory and Inference Concepts', credits: 2, status: 'Required', isRegistered: false },
          { id: '131', courseCode: 'CHM 102', courseTitle: 'General Chemistry II (Organic & Inorganic)', credits: 3, status: 'Elective', isRegistered: false },
          { id: '132', courseCode: 'MTH 104', courseTitle: 'Introduction to Mathematical Modeling', credits: 2, status: 'Elective', isRegistered: false },
          { id: '133', courseCode: 'CSC 110', courseTitle: 'Computer Ethics & Cyber Law Awareness', credits: 2, status: 'General', isRegistered: false },
          { id: '134', courseCode: 'GST 108', courseTitle: 'Peace Studies & Conflict Resolution', credits: 2, status: 'General', isRegistered: false },
          { id: '135', courseCode: 'PHY 104', courseTitle: 'Modern Physics and Atomic Theory', credits: 2, status: 'Elective', isRegistered: false },
          { id: '136', courseCode: 'CSC 112', courseTitle: 'Command Line Utilities & Linux Administration', credits: 2, status: 'Elective', isRegistered: false },
          { id: '137', courseCode: 'MTH 106', courseTitle: 'Introductory Real Analysis', credits: 2, status: 'Elective', isRegistered: false },
          { id: '138', courseCode: 'CSC 114', courseTitle: 'Visual Programming Techniques', credits: 2, status: 'Elective', isRegistered: false },
          { id: '139', courseCode: 'STA 104', courseTitle: 'Statistical Computing with Spreadsheet Packages', credits: 2, status: 'Elective', isRegistered: false },
          { id: '140', courseCode: 'CED 142', courseTitle: 'Introduction to Vocational Entrepreneurship', credits: 2, status: 'General', isRegistered: false },
        ];
  }

  if (level.includes('200')) {
    return [
      { id: '201', courseCode: 'CSC 201', courseTitle: 'Computer Programming I (Object-Oriented Programming in Java)', credits: 3, status: 'Core', isRegistered: true },
      { id: '202', courseCode: 'CSC 203', courseTitle: 'Data Structures and Algorithm Foundations', credits: 3, status: 'Core', isRegistered: true },
      { id: '203', courseCode: 'CSC 205', courseTitle: 'Discrete Structures & Computational Logic', credits: 3, status: 'Core', isRegistered: true },
      { id: '204', courseCode: 'CSC 207', courseTitle: 'Computer Organization & Assembly Language', credits: 3, status: 'Core', isRegistered: true },
      { id: '205', courseCode: 'CSC 209', courseTitle: 'Digital Electronics & Logic Design Architecture', credits: 3, status: 'Core', isRegistered: true },
      { id: '206', courseCode: 'MTH 201', courseTitle: 'Mathematical Methods I (Ordinary Differential Equations)', credits: 3, status: 'Required', isRegistered: false },
      { id: '207', courseCode: 'MTH 203', courseTitle: 'Linear Algebra I (Matrices, Vectors & Transformations)', credits: 3, status: 'Required', isRegistered: false },
      { id: '208', courseCode: 'PHY 201', courseTitle: 'Electric Circuits, Semis & Electronics Principles', credits: 3, status: 'Required', isRegistered: false },
      { id: '209', courseCode: 'PHY 207', courseTitle: 'Applied Electronics Laboratory Experimentation', credits: 1, status: 'Required', isRegistered: false },
      { id: '210', courseCode: 'GST 201', courseTitle: 'Peace Studies and Conflict Resolution Management', credits: 2, status: 'General', isRegistered: true },
      { id: '211', courseCode: 'GST 203', courseTitle: 'Entrepreneurship and Innovation Business Models', credits: 2, status: 'General', isRegistered: false },
      { id: '212', courseCode: 'STA 201', courseTitle: 'Probability Models and Statistical Methodologies', credits: 3, status: 'Required', isRegistered: false },
      { id: '213', courseCode: 'CSC 211', courseTitle: 'Information Systems Design and Relational Foundations', credits: 2, status: 'Elective', isRegistered: false },
      { id: '214', courseCode: 'CSC 213', courseTitle: 'File Organization and Secondary Memory Structures', credits: 2, status: 'Elective', isRegistered: false },
      { id: '215', courseCode: 'CSC 215', courseTitle: 'Web Applications Architecture and UI Frameworks', credits: 2, status: 'Elective', isRegistered: false },
      { id: '216', courseCode: 'CSC 217', courseTitle: 'System Analysis, Modeling and UML Specifications', credits: 3, status: 'Core', isRegistered: false },
      { id: '217', courseCode: 'MTH 205', courseTitle: 'Mathematical Analysis for Computer Scientists', credits: 3, status: 'Elective', isRegistered: false },
      { id: '218', courseCode: 'CSC 219', courseTitle: 'Scientific Computing with C and GNU Fortran', credits: 2, status: 'Elective', isRegistered: false },
      { id: '219', courseCode: 'CSC 221', courseTitle: 'Computer Hardware Engineering & Troubleshooting', credits: 2, status: 'Elective', isRegistered: false },
      { id: '220', courseCode: 'CSC 223', courseTitle: 'Social and Professional Ethics in Computing', credits: 2, status: 'Core', isRegistered: false },
    ];
  }

  // Level 300 (Default for our student) & Level 400+
  return [
    { id: '301', courseCode: 'CSC 301', courseTitle: 'Structured Programming in C++ & Java Enterprise', credits: 3, status: 'Core', isRegistered: true },
    { id: '302', courseCode: 'CSC 303', courseTitle: 'Operating Systems Architecture & Kernel Scheduling', credits: 3, status: 'Core', isRegistered: true },
    { id: '303', courseCode: 'CSC 305', courseTitle: 'Database Design & Distributed Management Systems', credits: 3, status: 'Core', isRegistered: true },
    { id: '304', courseCode: 'CSC 307', courseTitle: 'Software Engineering Methodologies & Testing', credits: 3, status: 'Core', isRegistered: true },
    { id: '305', courseCode: 'CSC 309', courseTitle: 'Computer Architecture & Microprocessor Systems', credits: 3, status: 'Core', isRegistered: true },
    { id: '306', courseCode: 'CSC 311', courseTitle: 'Operations Research & Linear Optimization Methods', credits: 2, status: 'Core', isRegistered: true },
    { id: '307', courseCode: 'CSC 313', courseTitle: 'Data Communications, Protocols & Cloud Networks', credits: 3, status: 'Core', isRegistered: false },
    { id: '308', courseCode: 'CSC 315', courseTitle: 'Artificial Intelligence & Neural Network Models', credits: 3, status: 'Elective', isRegistered: false },
    { id: '309', courseCode: 'CSC 317', courseTitle: 'Web Systems Development, Full-Stack & Microservices', credits: 2, status: 'Elective', isRegistered: false },
    { id: '310', courseCode: 'CSC 319', courseTitle: 'Comparative Programming Languages & Paradigms', credits: 2, status: 'Core', isRegistered: false },
    { id: '311', courseCode: 'CSC 321', courseTitle: 'Computer Graphics & Visual Simulation Computing', credits: 2, status: 'Elective', isRegistered: false },
    { id: '312', courseCode: 'CSC 323', courseTitle: 'Automata Theory & Formal Language Foundations', credits: 3, status: 'Core', isRegistered: false },
    { id: '313', courseCode: 'CSC 325', courseTitle: 'Mobile Application Architecture for Android & iOS', credits: 2, status: 'Elective', isRegistered: false },
    { id: '314', courseCode: 'CSC 327', courseTitle: 'Cyber Security, Threat Intelligence & Cryptography', credits: 2, status: 'Elective', isRegistered: false },
    { id: '315', courseCode: 'CSC 329', courseTitle: 'Cloud Infrastructure Engineering & DevOps CI/CD', credits: 3, status: 'Elective', isRegistered: false },
    { id: '316', courseCode: 'MTH 311', courseTitle: 'Numerical Analysis & Scientific Computational Methods', credits: 3, status: 'Required', isRegistered: false },
    { id: '317', courseCode: 'CED 341', courseTitle: 'Entrepreneurship Development & Practical Innovation', credits: 2, status: 'General', isRegistered: true },
    { id: '318', courseCode: 'STA 311', courseTitle: 'Statistical Inference & Multivariate Analysis', credits: 3, status: 'Required', isRegistered: false },
    { id: '319', courseCode: 'CSC 333', courseTitle: 'Human-Computer Interaction & User Interface Engineering', credits: 2, status: 'Elective', isRegistered: false },
    { id: '320', courseCode: 'CSC 399', courseTitle: 'Industrial Training Readiness Seminar (SIWES)', credits: 2, status: 'Core', isRegistered: false },
  ];
}

interface CourseRegistrationViewProps {
  catalog: Course[];
  student: UndergraduateStudentProfile;
  semesterPlan: Course[];
  onAddToPlan: (course: Course) => void;
  onRemoveFromPlan: (courseId: string) => void;
  onClearPlan: () => void;
  onInspectPrereqs: (course: Course) => void;
  onViewDetails: (course: Course) => void;
  onCompareCourse: (course: Course) => void;
  onOpenAdvisor: () => void;
  compareCourseA: Course;
  compareCourseB: Course;
  onShowToast?: (message: string) => void;
}

export const CourseRegistrationView: React.FC<CourseRegistrationViewProps> = ({
  catalog,
  student,
  semesterPlan,
  onAddToPlan,
  onRemoveFromPlan,
  onClearPlan,
  onInspectPrereqs,
  onViewDetails,
  onCompareCourse,
  onOpenAdvisor,
  compareCourseA,
  compareCourseB,
  onShowToast,
}) => {
  // Session selection state
  const [isSessionSelected, setIsSessionSelected] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');

  // Course table items state (starts with 20 lines)
  const [coursesList, setCoursesList] = useState<SemesterCourseRow[]>(() =>
    getInitialCurriculumCourses('300 Level', 'First Semester')
  );

  // Manual Add Course inline form modal/accordion state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newCode, setNewCode] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCredits, setNewCredits] = useState<number>(3);
  const [newStatus, setNewStatus] = useState<'Core' | 'Elective' | 'Required' | 'General'>('Core');

  // Registration feedback / toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRegisteredCompleted, setIsRegisteredCompleted] = useState<boolean>(false);
  const [showPrintSlipModal, setShowPrintSlipModal] = useState<boolean>(false);

  // Trigger toast with auto-hide
  const triggerSuccessToast = (msg: string) => {
    setToastMessage(msg);
    if (onShowToast) {
      onShowToast(msg);
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // When submitting the Session Selection form
  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sess = selectedSession || '2025-2026';
    const lvl = selectedLevel || (student.level ? `${student.level} Level` : '300 Level');
    const sem = selectedSemester || 'First Semester';

    setSelectedSession(sess);
    setSelectedLevel(lvl);
    setSelectedSemester(sem);

    // Initialize course list tailored to that level/semester
    const initialList = getInitialCurriculumCourses(lvl, sem);
    setCoursesList(initialList);
    setIsRegisteredCompleted(false);
    setIsSessionSelected(true);
  };

  // Toggle registered status for a course in the table
  const handleToggleCourse = (id: string) => {
    setCoursesList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isRegistered: !c.isRegistered } : c))
    );
  };

  // Completely delete a row from the list
  const handleDeleteRow = (id: string) => {
    setCoursesList((prev) => prev.filter((c) => c.id !== id));
  };

  // Add custom course to the table
  const handleAddCustomCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTitle.trim()) return;

    const newCourseItem: SemesterCourseRow = {
      id: `custom_${Date.now()}`,
      courseCode: newCode.trim().toUpperCase(),
      courseTitle: newTitle.trim(),
      credits: Number(newCredits) || 3,
      status: newStatus,
      isRegistered: true,
    };

    setCoursesList((prev) => [newCourseItem, ...prev]);
    setNewCode('');
    setNewTitle('');
    setNewCredits(3);
    setIsAddModalOpen(false);
  };

  // Computed summary
  const registeredCourses = coursesList.filter((c) => c.isRegistered);
  const totalRegisteredUnits = registeredCourses.reduce((sum, c) => sum + c.credits, 0);

  // Register button action
  const handleFinalRegister = () => {
    setIsRegisteredCompleted(true);
    triggerSuccessToast('COURSE REGISTRATION COMPLETED SUCCESSFULLY');
  };

  // 1. Initial Screen: Exact Design from User Screenshot (Course Registration / Select Session)
  if (!isSessionSelected) {
    return (
      <div className="space-y-6 pt-2 pb-12">
        {/* Breadcrumb */}
        <div className="text-[13px] text-slate-500 font-normal">
          <span>Course Registration</span>
          <span className="text-slate-400 mx-0.5">/</span>
          <span> Select Session</span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-[26px] font-bold text-[#1a4478] tracking-tight">
          Course Registration
        </h1>

        {/* Main Card */}
        <div className="bg-white border border-slate-200/90 rounded-md shadow-2xs overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white">
            <h2 className="text-sm sm:text-base font-bold text-[#1a4478]">
              Select Session
            </h2>
          </div>

          {/* Card Form */}
          <form onSubmit={handleSessionSubmit} className="p-6 sm:p-8 space-y-6 sm:space-y-8">
            {/* Row 1: Academic Session */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="w-full sm:w-1/4 text-xs sm:text-sm font-bold text-slate-900 shrink-0 mb-2 sm:mb-0">
                Academic Session
              </label>
              <div className="relative w-full sm:w-3/4">
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className={`w-full border border-slate-200 hover:border-slate-300 rounded-md py-2.5 pl-3.5 pr-10 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-colors shadow-2xs ${
                    !selectedSession ? 'text-slate-400' : 'text-slate-800 font-medium'
                  }`}
                >
                  <option value="" className="text-slate-400">
                    Select Academic Session
                  </option>
                  {ACADEMIC_SESSIONS.map((sess) => (
                    <option key={sess} value={sess} className="text-slate-800">
                      {sess}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Row 2: Select Level */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="w-full sm:w-1/4 text-xs sm:text-sm font-bold text-slate-900 shrink-0 mb-2 sm:mb-0">
                Select Level
              </label>
              <div className="relative w-full sm:w-3/4">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className={`w-full border border-slate-200 hover:border-slate-300 rounded-md py-2.5 pl-3.5 pr-10 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-colors shadow-2xs ${
                    !selectedLevel ? 'text-slate-400' : 'text-slate-800 font-medium'
                  }`}
                >
                  <option value="" className="text-slate-400">
                    Select Level
                  </option>
                  <option value="100 Level" className="text-slate-800">100 Level</option>
                  <option value="200 Level" className="text-slate-800">200 Level</option>
                  <option value="300 Level" className="text-slate-800">300 Level</option>
                  <option value="400 Level" className="text-slate-800">400 Level</option>
                  <option value="500 Level" className="text-slate-800">500 Level</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Row 3: Select Semester */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="w-full sm:w-1/4 text-xs sm:text-sm font-bold text-slate-900 shrink-0 mb-2 sm:mb-0">
                Select Semester
              </label>
              <div className="relative w-full sm:w-3/4">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className={`w-full border border-slate-200 hover:border-slate-300 rounded-md py-2.5 pl-3.5 pr-10 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-colors shadow-2xs ${
                    !selectedSemester ? 'text-slate-400' : 'text-slate-800 font-medium'
                  }`}
                >
                  <option value="" className="text-slate-400">
                    Select Semester
                  </option>
                  <option value="First Semester" className="text-slate-800">First Semester</option>
                  <option value="Second Semester" className="text-slate-800">Second Semester</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#1d68ed] hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs sm:text-sm px-6 py-2 rounded-md transition-all shadow-2xs cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. Active Course Registration Table (exceeds 15 lines, with manual add/remove and toast)
  // Reusable official A4 Course Registration Slip
  const renderA4Slip = (isForModal: boolean = false) => (
    <div
      className={`bg-white text-black ${
        isForModal
          ? 'p-6 sm:p-10 border border-slate-300 shadow-xl rounded-sm max-w-[210mm] w-full mx-auto'
          : 'p-4 print-slip'
      }`}
      style={{ minHeight: isForModal ? '270mm' : undefined }}
    >
      {/* Institutional Crest & Header */}
      <div className="text-center border-b-2 border-black pb-3 space-y-1">
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center font-black text-sm bg-slate-50">
            NAU
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight uppercase">
              {student.university || 'NNAMDI AZIKIWE UNIVERSITY, AWKA'}
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
              FACULTY OF PHYSICAL SCIENCES &bull; DEPARTMENT OF COMPUTER SCIENCE
            </p>
          </div>
        </div>
        <div className="pt-2">
          <div className="text-xs sm:text-sm font-black uppercase tracking-widest bg-slate-100 py-1 border-y border-black">
            COURSE REGISTRATION FORM
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold pt-1 text-slate-800">
            ACADEMIC SESSION: {selectedSession} &bull; SEMESTER: {selectedSemester.toUpperCase()} &bull; LEVEL: {selectedLevel.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Student Biodata Table */}
      <div className="mt-4 border border-black text-[11px]">
        <div className="grid grid-cols-4 border-b border-black">
          <div className="p-1.5 font-bold bg-slate-100 border-r border-black">STUDENT NAME:</div>
          <div className="p-1.5 font-bold border-r border-black uppercase truncate">{student.name}</div>
          <div className="p-1.5 font-bold bg-slate-100 border-r border-black">MATRICULATION NO:</div>
          <div className="p-1.5 font-mono font-bold uppercase">{student.studentId || 'NAU/CSC/2026/001'}</div>
        </div>
        <div className="grid grid-cols-4 border-b border-black">
          <div className="p-1.5 font-bold bg-slate-100 border-r border-black">GENDER:</div>
          <div className="p-1.5 font-semibold border-r border-black uppercase">{student.gender || 'Male'}</div>
          <div className="p-1.5 font-bold bg-slate-100 border-r border-black">SEMESTER:</div>
          <div className="p-1.5 font-semibold uppercase">{selectedSemester}</div>
        </div>
        <div className="grid grid-cols-4">
          <div className="p-1.5 font-bold bg-slate-100 border-r border-black">PROGRAMME / MAJOR:</div>
          <div className="p-1.5 font-semibold border-r border-black truncate">{student.major || 'Computer Science (B.Sc.)'}</div>
          <div className="p-1.5 font-bold bg-slate-100 border-r border-black">DATE GENERATED:</div>
          <div className="p-1.5 font-semibold">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      {/* Course Schedule Table */}
      <div className="mt-4">
        <table className="w-full border-collapse text-[10.5px] border border-black">
          <thead>
            <tr className="bg-slate-100 border-b border-black font-black uppercase text-[10px]">
              <th className="p-1.5 border-r border-black w-8 text-center">S/N</th>
              <th className="p-1.5 border-r border-black w-24 text-left">COURSE CODE</th>
              <th className="p-1.5 border-r border-black text-left">COURSE TITLE</th>
              <th className="p-1.5 border-r border-black w-14 text-center">UNITS</th>
              <th className="p-1.5 border-r border-black w-16 text-center">STATUS</th>
              <th className="p-1.5 text-center w-24">SIGNATURE</th>
            </tr>
          </thead>
          <tbody>
            {registeredCourses.map((c, idx) => (
              <tr key={c.id} className="border-b border-slate-300">
                <td className="p-1 text-center border-r border-black font-semibold">{idx + 1}</td>
                <td className="p-1 border-r border-black font-mono font-bold">{c.courseCode}</td>
                <td className="p-1 border-r border-black font-medium">{c.courseTitle}</td>
                <td className="p-1 text-center border-r border-black font-bold">{c.credits}</td>
                <td className="p-1 text-center border-r border-black font-semibold">{c.status}</td>
                <td className="p-1 text-center border-black font-mono text-[9px] text-slate-300">&nbsp;</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 border-t-2 border-black font-bold text-[11px]">
              <td colSpan={3} className="p-1.5 text-right border-r border-black">
                TOTAL REGISTERED COURSES: <strong>{registeredCourses.length}</strong>
              </td>
              <td colSpan={3} className="p-1.5 text-left pl-3">
                TOTAL CREDIT UNITS: <strong>{totalRegisteredUnits} UNITS</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Verification Signatures & Stamp */}
      <div className="mt-6 grid grid-cols-3 gap-6 text-[10px] text-center print-avoid-break">
        <div className="space-y-6">
          <div className="h-6 border-b border-dashed border-black" />
          <div>
            <div className="font-bold uppercase">Student's Signature</div>
            <div className="text-slate-500">Date: _________________</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-6 border-b border-dashed border-black" />
          <div>
            <div className="font-bold uppercase">Course Advisor</div>
            <div className="text-slate-500">Signature &amp; Date</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-6 border-b border-dashed border-black" />
          <div>
            <div className="font-bold uppercase">Head of Dept (H.O.D.)</div>
            <div className="text-slate-500">Signature &amp; Date</div>
          </div>
        </div>
      </div>

      {/* Official Stamp Box */}
      <div className="mt-4 border border-dashed border-black p-2 text-center text-[9px] font-bold text-slate-600 rounded-sm print-avoid-break">
        OFFICIAL DEPARTMENTAL STAMP &amp; VERIFICATION SEAL
        <div className="h-6" />
      </div>

      <div className="mt-2 text-[8.5px] text-center text-slate-500 border-t border-slate-200 pt-1">
        Official Course Registration Slip generated via Academic Advisors Portal. Valid only when signed and officially stamped.
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-6 pt-2 pb-16 relative screen-only">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-500">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0 animate-bounce" />
            <div>
              <div className="text-xs font-black tracking-wide uppercase">
                {toastMessage}
              </div>
              <div className="text-[11px] text-emerald-100 mt-0.5">
                {selectedSession} &bull; {selectedSemester} course record saved.
              </div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-[13px] text-slate-500 font-normal">
          <button
            onClick={() => setIsSessionSelected(false)}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Course Registration
          </button>
          <span className="text-slate-400 mx-1">/</span>
          <span>{selectedSession}</span>
          <span className="text-slate-400 mx-1">/</span>
          <span>{selectedLevel}</span>
          <span className="text-slate-400 mx-1">/</span>
          <span className="text-slate-700 font-semibold">{selectedSemester}</span>
        </div>

        <button
          onClick={() => setIsSessionSelected(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Session / Level</span>
        </button>
      </div>

      {/* 1 Unified Box Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        {/* Title: School Name & Course Registration Subtitle */}
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1a4478] tracking-tight uppercase">
              {student.university || 'Nnamdi Azikiwe University (NAU)'}
            </h1>
            <div className="text-sm sm:text-base font-extrabold text-slate-800 tracking-wide mt-1 uppercase flex flex-wrap items-center gap-2">
              <span>Course Registration</span>
              <span className="text-slate-300 font-normal text-xs">•</span>
              <span className="text-xs font-semibold text-slate-500 normal-case">
                {selectedSession} ({selectedSemester} &bull; {selectedLevel})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowPrintSlipModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Course Form (A4)</span>
            </button>
          </div>
        </div>

        {/* Details in the same box: Student Name, Matric Number, Gender, Semester */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">
              Student Name
            </span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm block mt-0.5 truncate">
              {student.name}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">
              Matric Number
            </span>
            <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm block mt-0.5">
              {student.studentId || 'NAU/CSC/2026/001'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">
              Gender
            </span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm block mt-0.5">
              {student.gender || 'Male'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">
              Semester
            </span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm block mt-0.5">
              {selectedSemester}
            </span>
          </div>
        </div>
      </div>

      {/* Completed Registration Alert (if submitted) */}
      {isRegisteredCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                COURSE REGISTRATION COMPLETED SUCCESSFULLY
              </h3>
              <p className="text-emerald-700 mt-0.5">
                Your courses have been officially verified and submitted for departmental screening.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintSlipModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Course Form (A4)</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100/80 p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-800">
            Curriculum Courses ({coursesList.length} Available Courses)
          </span>
          <span className="h-4 w-px bg-slate-300" />
          <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            {registeredCourses.length} Registered ({totalRegisteredUnits} Credits)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(!isAddModalOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom / Carryover Course</span>
          </button>
        </div>
      </div>

      {/* Inline Modal/Accordion to Manually Add Course */}
      {isAddModalOpen && (
        <form
          onSubmit={handleAddCustomCourse}
          className="bg-white border-2 border-blue-500/40 rounded-xl p-5 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Add Another Course Manually to Schedule</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Course Code</label>
              <input
                type="text"
                placeholder="e.g. CSC 318"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg p-2 font-mono font-bold uppercase focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Course Title</label>
              <input
                type="text"
                placeholder="e.g. Advanced Object-Oriented Frameworks"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Credits</label>
                <select
                  value={newCredits}
                  onChange={(e) => setNewCredits(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg p-2 font-bold"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-bold text-slate-700"
                >
                  <option value="Core">Core</option>
                  <option value="Elective">Elective</option>
                  <option value="Required">Required</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              Add to Course Table
            </button>
          </div>
        </form>
      )}

      {/* 3. The Main Course Registration Table (Exceeds 15 lines: S/N -- COURSE -- COURSE CODE -- ...) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-14 text-center">S/N</th>
                <th className="py-3.5 px-4 min-w-[220px]">COURSE</th>
                <th className="py-3.5 px-4 w-32">COURSE CODE</th>
                <th className="py-3.5 px-4 w-28 text-center">CREDIT UNIT</th>
                <th className="py-3.5 px-4 w-28 text-center">STATUS</th>
                <th className="py-3.5 px-4 w-40 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coursesList.map((c, index) => {
                const sn = index + 1;
                return (
                  <tr
                    key={c.id}
                    className={`transition-colors ${
                      c.isRegistered ? 'bg-white hover:bg-blue-50/30' : 'bg-slate-50/50 hover:bg-slate-100/50 opacity-75'
                    }`}
                  >
                    {/* S/N */}
                    <td className="py-3 px-4 text-center font-bold text-slate-500 font-mono">
                      {sn}
                    </td>

                    {/* COURSE (Title) */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 leading-snug">
                        {c.courseTitle}
                      </div>
                      {!c.isRegistered && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          (Not selected for this semester)
                        </span>
                      )}
                    </td>

                    {/* COURSE CODE */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-black text-blue-900 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded text-[11px]">
                        {c.courseCode}
                      </span>
                    </td>

                    {/* CREDIT UNIT */}
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {c.credits} {c.credits === 1 ? 'Unit' : 'Units'}
                    </td>

                    {/* STATUS */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.status === 'Core'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : c.status === 'Required'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : c.status === 'General'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    {/* ACTION (Manually Add and Remove) */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {c.isRegistered ? (
                          <button
                            type="button"
                            onClick={() => handleToggleCourse(c.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer shadow-2xs"
                            title="Remove from registration list"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleCourse(c.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer shadow-2xs"
                            title="Add to registration list"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteRow(c.id)}
                          className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete course row completely"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary & Registration Action */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-3">
              <span>Total Courses Selected: <strong className="text-blue-700">{registeredCourses.length}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Total Units: <strong className="text-blue-700">{totalRegisteredUnits}</strong> Credits</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Departmental Minimum: 12 Units &bull; Maximum Allowed: 24 Units.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const resetList = getInitialCurriculumCourses(selectedLevel || '300 Level', selectedSemester || 'First Semester');
                setCoursesList(resetList);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Selection</span>
            </button>

            {/* REGISTER BUTTON BELOW */}
            <button
              type="button"
              onClick={handleFinalRegister}
              className="bg-[#1d68ed] hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs sm:text-sm px-8 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* 3. A4 Printable Slip (Automatic for browser Ctrl+P or window.print) */}
    <div className="print-only">
      {renderA4Slip(false)}
    </div>

    {/* 4. A4 Print Preview Modal */}
    {showPrintSlipModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs no-print">
        <div className="bg-slate-100 rounded-2xl border border-slate-300 max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col">
          {/* Modal Header Bar */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Official A4 Course Registration Slip
                </h3>
                <p className="text-[11px] text-slate-500">
                  Standard A4 Paper Format &bull; {selectedSession} ({selectedSemester})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPrintSlipModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print A4 Form Now</span>
              </button>
            </div>
          </div>

          {/* Modal Document Body (Rendered as physical A4 paper sheet) */}
          <div className="p-4 sm:p-8 bg-slate-200/70 flex justify-center">
            {renderA4Slip(true)}
          </div>
        </div>
      </div>
    )}
  </>
  );
};
