/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  Hash,
  Building2,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UndergraduateStudentProfile, AcademicLevel, AcademicStanding, CareerTrack } from '../types';
import { DEFAULT_STUDENTS } from '../data/undergraduateCatalog';

export interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signup' | 'login';
  onClose: () => void;
  onSuccess: (studentProfile?: UndergraduateStudentProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signup',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);

  // Sync mode if initialMode changes when opened
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  // Sign up fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [matricNumber, setMatricNumber] = useState('NAU/CSC/2024/0341');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('Nnamdi Azikiwe University (UNIZIK)');
  const [department, setDepartment] = useState('Computer Science');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('200L');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('NAU/CSC/2024/0341');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter both your First Name and Last Name.');
      return;
    }

    if (!matricNumber.trim()) {
      setErrorMessage('Please enter your matriculation or JAMB registration number (e.g., NAU/CSC/2024/0341).');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid institutional or personal email address.');
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const standingMap: Record<AcademicLevel, AcademicStanding> = {
        '100L': 'Freshman',
        '200L': 'Sophomore',
        '300L': 'Junior',
        '400L': 'Senior',
      };

      const cleanFirst = firstName.trim().charAt(0).toUpperCase() + firstName.trim().slice(1);
      const cleanLast = lastName.trim().charAt(0).toUpperCase() + lastName.trim().slice(1);
      const formattedFullName = `${cleanFirst} ${cleanLast}`;

      const newProfile: UndergraduateStudentProfile = {
        ...DEFAULT_STUDENTS[0],
        id: `stu_${Date.now()}`,
        name: formattedFullName,
        studentId: matricNumber.trim(),
        university: institution,
        major: department,
        level: academicLevel,
        standing: standingMap[academicLevel] || 'Sophomore',
      };

      // Persist in localStorage so subsequent logins or reloads retain this name
      try {
        const usersStr = localStorage.getItem('coursepath_saved_users');
        const savedUsers: Array<UndergraduateStudentProfile & { email?: string }> = usersStr
          ? JSON.parse(usersStr)
          : [];
        savedUsers.push({ ...newProfile, email: email.trim().toLowerCase() });
        localStorage.setItem('coursepath_saved_users', JSON.stringify(savedUsers));
        localStorage.setItem('coursepath_current_student', JSON.stringify(newProfile));
      } catch (err) {
        console.warn('Unable to persist to localStorage', err);
      }

      onSuccess(newProfile);
      onClose();
    }, 600);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please provide your Matriculation Number or Email.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // 1. Check if user exists in saved registered users from account creation
      let found: UndergraduateStudentProfile | undefined;
      try {
        const usersStr = localStorage.getItem('coursepath_saved_users');
        if (usersStr) {
          const savedUsers: Array<UndergraduateStudentProfile & { email?: string }> = JSON.parse(usersStr);
          const matched = savedUsers.find(
            (u) =>
              (u.email && u.email.toLowerCase() === loginIdentifier.trim().toLowerCase()) ||
              (u.studentId && u.studentId.toLowerCase() === loginIdentifier.trim().toLowerCase()) ||
              (u.name && u.name.toLowerCase() === loginIdentifier.trim().toLowerCase())
          );
          if (matched) {
            found = matched;
          }
        }
      } catch (err) {
        // ignore
      }

      // 2. Check demo students
      if (!found) {
        found = DEFAULT_STUDENTS.find(
          (s) =>
            s.studentId.toLowerCase() === loginIdentifier.trim().toLowerCase() ||
            s.name.toLowerCase().includes(loginIdentifier.trim().toLowerCase())
        );
      }

      // 3. Fallback: NEVER use raw email username (e.g. emmanuelozochi2019) as name
      let resolvedName = 'Student User';
      if (found) {
        resolvedName = found.name;
      } else {
        // Clean away email domain and numbers
        let cleaned = loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : loginIdentifier;
        cleaned = cleaned.replace(/\d+/g, ' ').trim();
        const parts = cleaned.split(/[\s._-]+/).filter(Boolean);
        if (parts.length >= 2) {
          const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
          const last = parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1).toLowerCase();
          resolvedName = `${first} ${last}`;
        } else if (parts.length === 1) {
          const single = parts[0].toLowerCase();
          if (single.startsWith('emmanuel') && single.length > 8) {
            const rest = single.slice(8);
            resolvedName = `Emmanuel ${rest.charAt(0).toUpperCase() + rest.slice(1)}`;
          } else {
            resolvedName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
          }
        }
      }

      const activeProfile: UndergraduateStudentProfile = found || {
        ...DEFAULT_STUDENTS[0],
        studentId: loginIdentifier.trim(),
        name: resolvedName,
      };

      try {
        localStorage.setItem('coursepath_current_student', JSON.stringify(activeProfile));
      } catch (e) {
        // ignore
      }

      onSuccess(activeProfile);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-2xl border border-slate-200 max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                mode === 'signup' ? 'bg-blue-600 shadow-blue-600/20' : 'bg-orange-500 shadow-orange-500/20'
              }`}
            >
              {mode === 'signup' ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {mode === 'signup' ? 'Student Registration & Sign Up' : 'Student & Applicant Portal Login'}
              </h2>
              <p className="text-xs text-slate-500">Advisors Academic Unified Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 bg-slate-50 border-b border-slate-100">
          <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-xl text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'signup' ? (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Emmanuel"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Ozochi"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Matriculation / Reg Number
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value.toUpperCase())}
                    placeholder="NAU/CSC/2024/0341"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Standard format: <code className="text-blue-600 font-bold">NAU/CSC/2024/0341</code>
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@unizik.edu.ng"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Medicine & Surgery">Medicine & Surgery</option>
                    <option value="Economics">Economics</option>
                    <option value="Accountancy">Accountancy</option>
                    <option value="Law">Law</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Current Level
                  </label>
                  <select
                    value={academicLevel}
                    onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    <option value="100L">100L (Freshman)</option>
                    <option value="200L">200L (Sophomore)</option>
                    <option value="300L">300L (Junior)</option>
                    <option value="400L">400L (Senior)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Profile...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account & Enter Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-orange-600 hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </span>
              </div>
            </form>
          ) : (
            /* LOG IN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Matriculation No. or Institutional Email
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. NAU/CSC/2024/0341"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Example: <code className="text-orange-600 font-bold">NAU/CSC/2024/0341</code>
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset link will be sent to your registered institutional department email.');
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <span>Remember my session</span>
                </label>
                <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>FERPA Secure</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Log In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
