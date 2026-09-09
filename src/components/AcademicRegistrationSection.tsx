/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Building2,
  School,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  User,
  Hash,
  Layers,
  Sparkles,
  Download,
  RotateCcw,
  Check,
  ChevronRight,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import {
  ACADEMIC_REGISTRY_DATA,
  RegistryInstitution,
  RegistryFaculty,
  RegistryDepartment,
  RegistryProgramme,
} from '../data/academicRegistryData';

interface AcademicRegistrationSectionProps {
  onRegistrationComplete?: (info: {
    institution: RegistryInstitution;
    faculty: RegistryFaculty;
    department: RegistryDepartment;
    programme: RegistryProgramme;
    studentName: string;
    matricNumber: string;
    academicLevel: string;
    session: string;
  }) => void;
  onExploreDegree?: () => void;
}

export const AcademicRegistrationSection: React.FC<AcademicRegistrationSectionProps> = ({
  onRegistrationComplete,
  onExploreDegree,
}) => {
  // 1. Institution selection
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('unizik');

  // Find currently selected institution
  const selectedInstitution = useMemo(() => {
    return (
      ACADEMIC_REGISTRY_DATA.find((inst) => inst.id === selectedInstitutionId) ||
      ACADEMIC_REGISTRY_DATA[0]
    );
  }, [selectedInstitutionId]);

  // Available faculties for the current institution
  const availableFaculties = useMemo(() => {
    return selectedInstitution.faculties || [];
  }, [selectedInstitution]);

  // 2. Faculty selection (defaults to first available faculty)
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('unizik-sci');

  // Find currently selected faculty
  const selectedFaculty = useMemo(() => {
    return (
      availableFaculties.find((fac) => fac.id === selectedFacultyId) ||
      availableFaculties[0] ||
      null
    );
  }, [availableFaculties, selectedFacultyId]);

  // Available departments for the current faculty
  const availableDepartments = useMemo(() => {
    return selectedFaculty ? selectedFaculty.departments : [];
  }, [selectedFaculty]);

  // 3. Department selection
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('unizik-sci-cs');

  // Find currently selected department
  const selectedDepartment = useMemo(() => {
    return (
      availableDepartments.find((dept) => dept.id === selectedDepartmentId) ||
      availableDepartments[0] ||
      null
    );
  }, [availableDepartments, selectedDepartmentId]);

  // Available programmes for the current department
  const availableProgrammes = useMemo(() => {
    return selectedDepartment ? selectedDepartment.programmes : [];
  }, [selectedDepartment]);

  // 4. Programme/Course of Study selection
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>('prog-unizik-cs');

  // Find currently selected programme
  const selectedProgramme = useMemo(() => {
    return (
      availableProgrammes.find((prog) => prog.id === selectedProgrammeId) ||
      availableProgrammes[0] ||
      null
    );
  }, [availableProgrammes, selectedProgrammeId]);

  // Additional student particulars
  const [studentName, setStudentName] = useState<string>('Emeka Nwosu');
  const [matricNumber, setMatricNumber] = useState<string>('NAU/CSC/2024/0341');
  const [academicLevel, setAcademicLevel] = useState<string>('100 Level (Year 1)');
  const [academicSession, setAcademicSession] = useState<string>('2026/2027 Session');
  const [studyMode, setStudyMode] = useState<string>('Full-Time Regular');

  // Form submission state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionSuccessTime, setSubmissionSuccessTime] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Cascading handlers
  const handleInstitutionChange = (newInstId: string) => {
    setSelectedInstitutionId(newInstId);
    const newInst = ACADEMIC_REGISTRY_DATA.find((i) => i.id === newInstId);
    if (newInst && newInst.faculties.length > 0) {
      const firstFaculty = newInst.faculties[0];
      setSelectedFacultyId(firstFaculty.id);
      if (firstFaculty.departments.length > 0) {
        const firstDept = firstFaculty.departments[0];
        setSelectedDepartmentId(firstDept.id);
        if (firstDept.programmes.length > 0) {
          setSelectedProgrammeId(firstDept.programmes[0].id);
        } else {
          setSelectedProgrammeId('');
        }
      } else {
        setSelectedDepartmentId('');
        setSelectedProgrammeId('');
      }
    } else {
      setSelectedFacultyId('');
      setSelectedDepartmentId('');
      setSelectedProgrammeId('');
    }
    setIsSubmitted(false);
    setValidationError(null);
  };

  const handleFacultyChange = (newFacId: string) => {
    setSelectedFacultyId(newFacId);
    const faculty = availableFaculties.find((f) => f.id === newFacId);
    if (faculty && faculty.departments.length > 0) {
      const firstDept = faculty.departments[0];
      setSelectedDepartmentId(firstDept.id);
      if (firstDept.programmes.length > 0) {
        setSelectedProgrammeId(firstDept.programmes[0].id);
      } else {
        setSelectedProgrammeId('');
      }
    } else {
      setSelectedDepartmentId('');
      setSelectedProgrammeId('');
    }
    setIsSubmitted(false);
    setValidationError(null);
  };

  const handleDepartmentChange = (newDeptId: string) => {
    setSelectedDepartmentId(newDeptId);
    const dept = availableDepartments.find((d) => d.id === newDeptId);
    if (dept && dept.programmes.length > 0) {
      setSelectedProgrammeId(dept.programmes[0].id);
    } else {
      setSelectedProgrammeId('');
    }
    setIsSubmitted(false);
    setValidationError(null);
  };

  const handleProgrammeChange = (newProgId: string) => {
    setSelectedProgrammeId(newProgId);
    setIsSubmitted(false);
    setValidationError(null);
  };

  // Quick preset loader
  const handleLoadPreset = (
    instId: string,
    facId: string,
    deptId: string,
    progId: string,
    presetName: string,
    presetMatric: string
  ) => {
    setSelectedInstitutionId(instId);
    setSelectedFacultyId(facId);
    setSelectedDepartmentId(deptId);
    setSelectedProgrammeId(progId);
    setStudentName(presetName);
    setMatricNumber(presetMatric);
    setIsSubmitted(false);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setValidationError('Please enter the student full name.');
      return;
    }
    if (!selectedInstitution || !selectedFaculty || !selectedDepartment || !selectedProgramme) {
      setValidationError('Please select all required academic hierarchy fields.');
      return;
    }

    setValidationError(null);
    setIsSubmitted(true);
    setSubmissionSuccessTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    if (onRegistrationComplete) {
      onRegistrationComplete({
        institution: selectedInstitution,
        faculty: selectedFaculty,
        department: selectedDepartment,
        programme: selectedProgramme,
        studentName,
        matricNumber,
        academicLevel,
        session: academicSession,
      });
    }
  };

  return (
    <section id="academic-info" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Academic Information & Registration Form
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Specify your accredited higher institution, faculty, department, and degree programme to configure your official student profile and initialize your academic course audit.
          </p>

          {/* Quick Presets for Convenient Testing */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Quick Select:</span>
            <button
              type="button"
              id="preset-nau-btn"
              onClick={() =>
                handleLoadPreset(
                  'unizik',
                  'unizik-sci',
                  'unizik-sci-cs',
                  'prog-unizik-cs',
                  'Emeka Nwosu',
                  'NAU/CSC/2024/0341'
                )
              }
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                selectedInstitutionId === 'unizik' && selectedProgrammeId === 'prog-unizik-cs'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              NAU &bull; Computer Science
            </button>
            <button
              type="button"
              id="preset-coou-btn"
              onClick={() =>
                handleLoadPreset(
                  'coou',
                  'coou-med',
                  'coou-med-mbbs',
                  'prog-coou-mbbs',
                  'Chiamaka Okoli',
                  'COOU/MED/2024/0112'
                )
              }
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                selectedInstitutionId === 'coou' && selectedProgrammeId === 'prog-coou-mbbs'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              COOU &bull; Medicine & Surgery
            </button>
            <button
              type="button"
              id="preset-unn-btn"
              onClick={() =>
                handleLoadPreset(
                  'unn',
                  'unn-law',
                  'unn-law-pub',
                  'prog-unn-law',
                  'Kelechi Eze',
                  'UNN/LAW/2024/0895'
                )
              }
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                selectedInstitutionId === 'unn' && selectedProgrammeId === 'prog-unn-law'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              UNN &bull; Law
            </button>
          </div>
        </div>

        {/* Main Grid: Form (Left) & Real-time Live Credential Preview Slip (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: The Academic Registration Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Student Academic Enrollment
                </h3>
                <p className="text-xs text-slate-500">
                  Select your academic placement hierarchy with synchronized dependencies.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                <Layers className="w-3.5 h-3.5" />
                <span>4-Tier Hierarchy</span>
              </div>
            </div>

            {/* Validation Notice if any */}
            {validationError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* FIELD 1: INSTITUTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="registration-institution-select"
                    className="text-xs font-bold text-slate-800 flex items-center gap-1.5"
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Institution</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Step 1 of 4
                  </span>
                </div>

                <div className="relative">
                  <select
                    id="registration-institution-select"
                    value={selectedInstitutionId}
                    onChange={(e) => handleInstitutionChange(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer appearance-none"
                  >
                    {ACADEMIC_REGISTRY_DATA.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.shortName}) &bull; {inst.type}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span>Location: {selectedInstitution.city}, {selectedInstitution.state}</span>
                  <span className="text-blue-600 font-semibold">{selectedInstitution.accreditation}</span>
                </div>
              </div>

              {/* FIELD 2: FACULTY / SCHOOL (Cascades from Institution) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="registration-faculty-select"
                    className="text-xs font-bold text-slate-800 flex items-center gap-1.5"
                  >
                    <School className="w-4 h-4 text-orange-600" />
                    <span>Faculty / School</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Step 2 of 4 &bull; Updates with Institution
                  </span>
                </div>

                <div className="relative">
                  <select
                    id="registration-faculty-select"
                    value={selectedFacultyId}
                    onChange={(e) => handleFacultyChange(e.target.value)}
                    disabled={availableFaculties.length === 0}
                    className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer appearance-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    {availableFaculties.map((fac) => (
                      <option key={fac.id} value={fac.id}>
                        {fac.name} ({fac.shortCode})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
                {selectedFaculty && (
                  <div className="text-[11px] text-slate-500 px-1 flex items-center justify-end">
                    <span className="text-slate-600 font-medium">
                      {selectedFaculty.departments.length} Academic Departments
                    </span>
                  </div>
                )}
              </div>

              {/* FIELD 3: DEPARTMENT (Cascades from Faculty) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="registration-department-select"
                    className="text-xs font-bold text-slate-800 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Department</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Step 3 of 4 &bull; Updates with Faculty
                  </span>
                </div>

                <div className="relative">
                  <select
                    id="registration-department-select"
                    value={selectedDepartmentId}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    disabled={availableDepartments.length === 0}
                    className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer appearance-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    {availableDepartments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} [{dept.code}]
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
                {selectedDepartment && (
                  <div className="text-[11px] text-slate-500 px-1 flex items-center justify-end">
                    <span className="text-emerald-700 font-medium">
                      {selectedDepartment.programmes.length} Registered Programme(s)
                    </span>
                  </div>
                )}
              </div>

              {/* FIELD 4: PROGRAMME / COURSE OF STUDY (Cascades from Department) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="registration-programme-select"
                    className="text-xs font-bold text-slate-800 flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Programme / Course of Study</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Step 4 of 4 &bull; Target Qualification
                  </span>
                </div>

                <div className="relative">
                  <select
                    id="registration-programme-select"
                    value={selectedProgrammeId}
                    onChange={(e) => handleProgrammeChange(e.target.value)}
                    disabled={availableProgrammes.length === 0}
                    className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer appearance-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    {availableProgrammes.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.name} &bull; {prog.degreeAwarded} ({prog.durationYears} Years)
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>

                {selectedProgramme && (
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between font-bold text-blue-900">
                      <span>Award: {selectedProgramme.degreeAwarded}</span>
                      <span>Duration: {selectedProgramme.durationYears} Academic Years</span>
                      <span>Credits: {selectedProgramme.totalCreditsRequired} Units</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal pt-0.5">
                      {selectedProgramme.description}
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION: STUDENT PARTICULARS */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Student Details & Cohort
                  </span>
                  <span className="text-[11px] text-slate-400">Optional Personalization</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="student-fullname-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Student Full Name</span>
                    </label>
                    <input
                      type="text"
                      id="student-fullname-input"
                      value={studentName}
                      onChange={(e) => {
                        setStudentName(e.target.value);
                        setIsSubmitted(false);
                      }}
                      placeholder="e.g. Chidi Okonkwo"
                      className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>

                  {/* Matriculation / Registration Number */}
                  <div className="space-y-1.5">
                    <label htmlFor="student-matric-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-slate-400" />
                      <span>Matric / Reg Number</span>
                    </label>
                    <input
                      type="text"
                      id="student-matric-input"
                      value={matricNumber}
                      onChange={(e) => {
                        setMatricNumber(e.target.value);
                        setIsSubmitted(false);
                      }}
                      placeholder="e.g. NAU/CSC/2024/0341"
                      className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  id="submit-registration-btn"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Register Academic Information</span>
                </button>

                <button
                  type="button"
                  id="reset-form-btn"
                  onClick={() => {
                    handleInstitutionChange('unizik');
                    setStudentName('Emeka Nwosu');
                    setMatricNumber('NAU/CSC/2024/0341');
                    setAcademicLevel('100 Level (Year 1)');
                    setAcademicSession('2026/2027 Session');
                    setIsSubmitted(false);
                    setValidationError(null);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Real-time Live Credential Preview Card & Registration Slip */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6 relative overflow-hidden">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 leading-tight">
                      Official Academic Record
                    </div>
                    <div className="text-[10px] text-slate-500">Live Registry Verification Slip</div>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isSubmitted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Validated</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>Pending Save</span>
                    </>
                  )}
                </span>
              </div>

              {/* Student Header Summary */}
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0">
                  {studentName.trim() ? studentName.trim().charAt(0) : 'S'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold text-slate-900 truncate">
                    {studentName.trim() || 'Student Name'}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="font-mono font-medium">{matricNumber || 'MATRIC-TBD'}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown of the 4 Selected Dropdown Fields */}
              <div className="space-y-3 text-xs">
                {/* 1. Institution */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <Building2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      1. Institution
                    </span>
                    <span className="font-bold text-slate-900 text-xs block">
                      {selectedInstitution.name} ({selectedInstitution.shortName})
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {selectedInstitution.type} &bull; {selectedInstitution.state}
                    </span>
                  </div>
                </div>

                {/* 2. Faculty / School */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <School className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      2. Faculty / School
                    </span>
                    <span className="font-bold text-slate-900 text-xs block">
                      {selectedFaculty ? selectedFaculty.name : 'Not Selected'}
                    </span>
                    {selectedFaculty && (
                      <span className="text-[11px] text-slate-500 block">
                        Code: {selectedFaculty.shortCode}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Department */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <BookOpen className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      3. Academic Department
                    </span>
                    <span className="font-bold text-slate-900 text-xs block">
                      {selectedDepartment ? selectedDepartment.name : 'Not Selected'}
                    </span>
                    {selectedDepartment && (
                      <span className="text-[11px] text-slate-500 block">
                        Dept Code: {selectedDepartment.code}
                      </span>
                    )}
                  </div>
                </div>

                {/* 4. Programme / Course of Study */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                  <GraduationCap className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-blue-600 block tracking-wider">
                      4. Programme / Course of Study
                    </span>
                    <span className="font-extrabold text-blue-950 text-xs sm:text-sm block">
                      {selectedProgramme ? selectedProgramme.name : 'Not Selected'}
                    </span>
                    {selectedProgramme && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-blue-800">
                        <span className="bg-white px-2 py-0.5 rounded-md border border-blue-200">
                          {selectedProgramme.degreeAwarded}
                        </span>
                        <span>{selectedProgramme.durationYears} Years</span>
                        <span>&bull;</span>
                        <span>{selectedProgramme.totalCreditsRequired} Required Units</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submission Status Alert Card */}
              {isSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wide block">
                        Registration Completed Successfully
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Recorded at {submissionSuccessTime} &bull; Verified in Registry
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed pt-1">
                    Your academic records for <strong>{selectedProgramme?.name}</strong> at <strong>{selectedInstitution.shortName}</strong> are confirmed and indexed into your active study audit.
                  </p>
                  {onExploreDegree && (
                    <button
                      type="button"
                      id="view-degree-audit-btn"
                      onClick={onExploreDegree}
                      className="w-full mt-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Launch Course Curriculum & Audit</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-500 text-xs flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    Accreditation-synchronized registration database verified across Nigerian Higher Education institutions.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
