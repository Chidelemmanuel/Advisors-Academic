/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  Search,
  MapPin,
  Award,
  GraduationCap,
  Users,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  DollarSign,
  Layers,
  BookOpen,
  Mail,
  CheckCircle2,
  X,
} from 'lucide-react';
import { HigherInstitution, InstitutionType } from '../types';
import { HIGHER_INSTITUTIONS, FACULTIES_DATA } from '../data/institutionsData';

interface InstitutionsDirectoryViewProps {
  onSelectInstitutionForPlan?: (institution: HigherInstitution) => void;
}

export const InstitutionsDirectoryView: React.FC<InstitutionsDirectoryViewProps> = ({
  onSelectInstitutionForPlan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedTuition, setSelectedTuition] = useState<string>('All');
  const [activeDetailInstitution, setActiveDetailInstitution] = useState<HigherInstitution | null>(null);

  // Filter logic
  const filteredInstitutions = HIGHER_INSTITUTIONS.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.popularCourses.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'All' || inst.type === selectedType;
    const matchesTuition = selectedTuition === 'All' || inst.tuitionCategory === selectedTuition;

    return matchesSearch && matchesType && matchesTuition;
  });

  return (
    <div className="space-y-6">
      {/* 1. Directory Header & Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Higher Institutions Directory
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {filteredInstitutions.length} Accredited Institutions Listed
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore Higher Institutions in Nigeria & West Africa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Compare Nigeria’s top Federal Universities, State Universities, Private Universities, and Polytechnics by ranking, tuition subsidies, acceptance rates, and faculties.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% NUC & COREN Verified</span>
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by institution name, city, course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              aria-label="Filter by Institution Type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Types (Federal, State, Private, Poly)</option>
              <option value="Federal University">Federal University</option>
              <option value="State University">State University</option>
              <option value="Private University">Private University</option>
              <option value="Institute of Technology">Institute of Technology</option>
              <option value="Polytechnic / Tech College">Polytechnic / Tech College</option>
            </select>
          </div>

          {/* Tuition Range Filter */}
          <div>
            <select
              aria-label="Filter by Tuition Category"
              value={selectedTuition}
              onChange={(e) => setSelectedTuition(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Tuition Categories</option>
              <option value="Low / Subsidized">Low / Subsidized (Federal)</option>
              <option value="Moderate">Moderate (State Institutions)</option>
              <option value="Private / Premium">Private / Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Institutions Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredInstitutions.map((inst) => {
          const faculties = FACULTIES_DATA.filter((f) => f.institutionId === inst.id);

          return (
            <div
              key={inst.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header with emblem & rank */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-black text-base shrink-0">
                      {inst.shortName}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {inst.name}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {inst.type} &bull; Established {inst.establishedYear}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 shrink-0">
                    Rank #{inst.nationalRanking}
                  </span>
                </div>

                {/* Location & Accreditation */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{inst.location.city}, {inst.location.stateCountry}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{inst.accreditationStatus.split(',')[0]}</span>
                  </div>
                </div>

                {/* Overview Text */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {inst.overview}
                </p>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Acceptance
                    </span>
                    <span className="font-extrabold text-slate-900">{inst.acceptanceRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Student Body
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {inst.totalStudents.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Faculties
                    </span>
                    <span className="font-extrabold text-indigo-600">{inst.facultiesCount}</span>
                  </div>
                </div>

                {/* Popular Courses Pills */}
                <div className="space-y-1 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Popular Programs:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {inst.popularCourses.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveDetailInstitution(inst)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>Campus Details & Facilities</span>
                </button>

                {onSelectInstitutionForPlan && (
                  <button
                    onClick={() => onSelectInstitutionForPlan(inst)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Select for Admission</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Detailed Institution Drawer / Modal */}
      {activeDetailInstitution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-black text-lg flex items-center justify-center border border-indigo-100">
                  {activeDetailInstitution.shortName}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeDetailInstitution.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeDetailInstitution.type} &bull; Ranked #{activeDetailInstitution.nationalRanking} Nationally
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveDetailInstitution(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overview */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 block text-sm">Institution Profile</span>
              <p className="text-slate-600 leading-relaxed">
                {activeDetailInstitution.overview}
              </p>
            </div>

            {/* Facilities List */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 block text-sm">Key Campus Facilities & Research Infrastructure</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeDetailInstitution.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-700 font-medium">{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tuition and Admissions Contact */}
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Annual Tuition Estimate:</span>
                <strong className="text-indigo-950 font-bold">
                  {activeDetailInstitution.annualTuitionEstimate}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Student-to-Faculty Ratio:</span>
                <strong className="text-slate-900 font-bold">
                  {activeDetailInstitution.studentFacultyRatio}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Admissions Contact:</span>
                <strong className="text-slate-900 font-bold">
                  {activeDetailInstitution.contactEmail}
                </strong>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <a
                href={activeDetailInstitution.admissionPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {onSelectInstitutionForPlan && (
                <button
                  onClick={() => {
                    onSelectInstitutionForPlan(activeDetailInstitution);
                    setActiveDetailInstitution(null);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Select Institution & Proceed</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
