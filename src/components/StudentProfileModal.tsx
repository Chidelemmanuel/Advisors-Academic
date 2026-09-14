/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  User,
  Award,
  GraduationCap,
  Sliders,
  Check,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { UndergraduateStudentProfile, CareerTrack, AcademicStanding, AcademicLevel } from '../types';

interface StudentProfileModalProps {
  student: UndergraduateStudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UndergraduateStudentProfile) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<UndergraduateStudentProfile>({ ...student });

  const careerTracks: CareerTrack[] = [
    'Artificial Intelligence & ML',
    'Cloud & Distributed Systems',
    'Cybersecurity & Networks',
    'Data Science & Analytics',
    'Full-Stack Software Engineering',
  ];

  const standings: AcademicStanding[] = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
  const levels: AcademicLevel[] = ['100L', '200L', '300L', '400L'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = formData.name.trim();
    let cleaned = raw.includes('@') ? raw.split('@')[0] : raw;
    cleaned = cleaned.replace(/\d+/g, ' ').trim();
    const parts = cleaned.split(/[\s._-]+/).filter(Boolean);
    let finalName = formData.name;
    if (parts.length >= 2) {
      const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
      const last = parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1).toLowerCase();
      finalName = `${first} ${last}`;
    }
    let finalStudentId = formData.studentId ? formData.studentId.trim() : 'NAU/CSC/2026/001';
    if (finalStudentId.includes('@') || finalStudentId.toLowerCase().includes('emmanuelozochi')) {
      finalStudentId = 'NAU/CSC/2026/001';
    }
    let finalAdviser = formData.academicAdviserName;
    if (finalAdviser?.includes('Marcus Chen')) {
      finalAdviser = '';
    }
    const updatedProfile = {
      ...formData,
      name: finalName,
      studentId: finalStudentId,
      academicAdviserName: finalAdviser,
    };
    try {
      localStorage.setItem('coursepath_current_student', JSON.stringify(updatedProfile));
    } catch (err) {
      // ignore
    }
    onSave(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Academic Profile & Preferences
              </h3>
              <p className="text-xs text-slate-500">
                Configure your standing, career track, and credit parameters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          {/* Round Profile Picture Selection & Preview */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
            <div className="relative shrink-0">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg ring-2 ring-indigo-500/30 shadow-xs">
                  {formData.name ? formData.name.substring(0, 2).toUpperCase() : 'ST'}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1.5 w-full">
              <label className="font-semibold text-slate-700 block text-xs">Profile Picture Avatar</label>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  {
                    label: 'David',
                    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=160&h=160',
                  },
                  {
                    label: 'Chioma',
                    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160&h=160',
                  },
                  {
                    label: 'Oluwaseun',
                    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160&h=160',
                  },
                  {
                    label: 'Scholar',
                    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160&h=160',
                  },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarUrl: preset.url })}
                    className={`relative rounded-full p-0.5 border-2 transition-all cursor-pointer ${
                      formData.avatarUrl === preset.url
                        ? 'border-indigo-600 scale-105 ring-1 ring-indigo-600'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarUrl: undefined })}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                    !formData.avatarUrl
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Initials
                </button>
              </div>
            </div>
          </div>

          {/* Matriculation ID, Name and Major */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Matriculation ID</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full text-xs font-mono font-bold border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="NAU/CSC/2026/001"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Undergraduate Major</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          {/* Standing, Level & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Academic Standing</label>
              <select
                value={formData.standing}
                onChange={(e) => setFormData({ ...formData, standing: e.target.value as AcademicStanding })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-medium"
              >
                {standings.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Academic Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as AcademicLevel })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-medium"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gender</label>
              <select
                value={formData.gender || 'Male'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Cumulative GPA (4.0)</label>
              <input
                type="number"
                step="0.01"
                min="1.0"
                max="4.0"
                value={formData.currentGpa}
                onChange={(e) => setFormData({ ...formData, currentGpa: parseFloat(e.target.value) || 3.5 })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 font-bold text-slate-900"
                required
              />
            </div>
          </div>

          {/* Career Track */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Career Track & Specialization Concentration
            </label>
            <select
              value={formData.selectedTrack}
              onChange={(e) => setFormData({ ...formData, selectedTrack: e.target.value as CareerTrack })}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-semibold text-indigo-900"
            >
              {careerTracks.map((track) => (
                <option key={track} value={track}>{track}</option>
              ))}
            </select>
          </div>

          {/* Career Goal */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Target Post-Graduation Career Aspiration
            </label>
            <input
              type="text"
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          {/* Credit Limits & Workload Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Semester Credit Cap (Max target)
              </label>
              <input
                type="number"
                min="12"
                max="24"
                value={formData.maxTargetCreditsSemester}
                onChange={(e) => setFormData({ ...formData, maxTargetCreditsSemester: parseInt(e.target.value, 10) || 16 })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Standard full-time cap: 15-18 credits</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Max Study Workload (Hours / Week)
              </label>
              <input
                type="number"
                min="10"
                max="50"
                value={formData.preferredWeeklyHours}
                onChange={(e) => setFormData({ ...formData, preferredWeeklyHours: parseInt(e.target.value, 10) || 24 })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Study hours outside classroom lectures</span>
            </div>
          </div>

          {/* Learning Style */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Preferred Assessment Style</label>
            <select
              value={formData.learningStyle}
              onChange={(e) => setFormData({ ...formData, learningStyle: e.target.value as any })}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-medium"
            >
              <option value="Project & Practical">Project & Practical (Hands-on labs & coding projects)</option>
              <option value="Balanced Exams & Projects">Balanced Exams & Projects (Even distribution)</option>
              <option value="Theoretical & Proofs">Theoretical & Proofs (Mathematical & algorithmic rigor)</option>
            </select>
          </div>

          {/* Completed Courses Summary */}
          <div className="pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-700 block mb-1">
              Completed Transcript Courses ({formData.completedCourses.length})
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
              {formData.completedCourses.map((c) => (
                <span
                  key={c.code}
                  className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 flex items-center gap-1 shadow-2xs"
                >
                  <span className="font-bold">{c.code}</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                    {c.grade}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
