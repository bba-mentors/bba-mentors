import { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  School,
  FileCheck,
  Search,
  ShieldCheck,
} from 'lucide-react';
import {
  ALL_38_BIHAR_DISTRICTS,
  BIHAR_DIVISIONS,
  TOTAL_BIHAR_DISTRICTS_COUNT,
  TOTAL_BIHAR_ACTIVE_MENTORS_COUNT,
} from '../../data/biharDistricts.ts';
import { ACADEMIC_LEVELS } from '../../data/academicClasses.ts';

interface ClassesBoardsLocationsProps {
  initialTab?: 'classes' | 'subjects' | 'boards' | 'locations';
  onNavigate: (view: string, data?: any) => void;
}

export function ClassesBoardsLocationsPage({
  initialTab = 'classes',
  onNavigate,
}: ClassesBoardsLocationsProps) {
  const [tab, setTab] = useState<'classes' | 'subjects' | 'boards' | 'locations'>(initialTab);
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const filteredDistricts = ALL_38_BIHAR_DISTRICTS.filter((d) => {
    const matchesDivision = selectedDivision === 'All' || d.division === selectedDivision;
    const term = locationSearch.toLowerCase().trim();
    const matchesSearch =
      !term ||
      d.name.toLowerCase().includes(term) ||
      (d.hindiName && d.hindiName.includes(term)) ||
      d.headquarters.toLowerCase().includes(term) ||
      d.popularAreas.some((a) => a.toLowerCase().includes(term));
    return matchesDivision && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Tabs Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
            Academics & Regional Coverage
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Curriculum, Boards & Bihar Coverage
          </h1>
          <p className="text-slate-600 text-sm">
            Everything tailored to Bihar students' education standards from primary foundational skills to board exam rank excellence.
          </p>

          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {[
              { id: 'classes', label: 'Classes (1-12)' },
              { id: 'subjects', label: 'Key Subjects' },
              { id: 'boards', label: 'Boards (BSEB, CBSE, ICSE)' },
              { id: 'locations', label: 'Bihar Locations' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                  tab === t.id
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: CLASSES (Nursery to 12) */}
        {tab === 'classes' && (
          <div className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ACADEMIC_LEVELS.map((c) => (
                <div key={c.classes} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-800 inline-block">
                      {c.level}
                    </span>
                    <h3 className="text-xl font-black text-slate-900">{c.classes}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{c.focus}</p>
                    <div className="pt-2 border-t border-slate-100 text-xs">
                      <span className="font-bold text-slate-800 block text-[11px] mb-1">Subjects Covered:</span>
                      <span className="text-slate-500">{c.subjects}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const filterTarget = c.classes.includes('Nursery') ? 'Nursery' : c.classes.includes('Class 1') ? 'Class 1' : c.classes.includes('Class 6') ? 'Class 6' : c.classes.includes('Class 9') ? 'Class 9' : 'Class 11';
                      onNavigate('find-mentor', { classGrade: filterTarget });
                    }}
                    className="w-full mt-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs text-center transition"
                  >
                    Find Mentors for {c.classes}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SUBJECTS */}
        {tab === 'subjects' && (
          <div className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Mathematics',
                  icon: BookOpen,
                  tagline: 'From Arithmetic to Calculus & Coordinate Geometry',
                  desc: 'Structured formula sheets, step-by-step NCERT exercise solutions, daily calculation speed drills, and theorem proofs with continuous weekend assessments.',
                },
                {
                  name: 'Science (Physics, Chem, Bio)',
                  icon: Sparkles,
                  tagline: 'Deep Conceptual Understanding & Diagram Practice',
                  desc: 'Real-world visual analogies, ray diagrams, chemical equations balancing, circuit solving, and clear answers formatted for maximum marks in board exams.',
                },
                {
                  name: 'English & Hindi Languages',
                  icon: FileCheck,
                  tagline: 'Grammar (Vyakaran), Writing Skills & Literature',
                  desc: 'Letter writing, essay drafting, reading comprehension passages, poem interpretations, and precise grammar rules that boost overall percentage.',
                },
                {
                  name: 'Social Science',
                  icon: School,
                  tagline: 'History, Geography, Political Science, Economics',
                  desc: 'Timeline memorization methods, map pointing practice, cause-and-effect answer structures, and NCERT back-exercise mastery.',
                },
                {
                  name: 'Commerce (11th & 12th)',
                  icon: BookOpen,
                  tagline: 'Accountancy, Business Studies, Economics',
                  desc: 'Journal entries, balance sheets, ledger posting, micro/macro economics graphs, and case-study analysis.',
                },
                {
                  name: 'Sanskrit & Regional Languages',
                  icon: GraduationCap,
                  tagline: 'Scoring Board Exam Language Prep',
                  desc: 'Sandhi, Samas, Dhaturoop, Shabdaroop, and translation practice specifically aligned with BSEB Matric syllabus.',
                },
              ].map((s) => (
                <div key={s.name} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                    <s.icon className="w-5 h-5 text-blue-800" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{s.name}</h3>
                  <p className="text-xs font-semibold text-blue-800">{s.tagline}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BOARDS (BSEB, CBSE, ICSE) */}
        {tab === 'boards' && (
          <div className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-blue-200 shadow-sm space-y-4">
                <span className="px-2.5 py-1 rounded bg-blue-900 text-white font-bold text-xs uppercase">
                  Bihar Special
                </span>
                <h3 className="text-2xl font-black text-slate-900">BSEB (Bihar Board)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bihar School Examination Board (Matric Class 10 & Inter Class 12).
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>50% Objective OMR Question Mastery with fast elimination techniques.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Bilingual support in Hindi Medium and English Medium textbooks.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>SCERT & NCERT alignment with official Bihar Board model papers.</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('find-mentor', { board: 'BSEB' })}
                  className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs transition text-center"
                >
                  Find BSEB Mentors
                </button>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <span className="px-2.5 py-1 rounded bg-slate-800 text-white font-bold text-xs uppercase">
                  National Benchmark
                </span>
                <h3 className="text-2xl font-black text-slate-900">CBSE</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Central Board of Secondary Education (Class 1 to 12).
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Focus on Case-based and Competency-based analytical questions.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Thorough line-by-line NCERT theory and exemplar problem solving.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Internal assessment, practicals, and periodic test prep.</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('find-mentor', { board: 'CBSE' })}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition text-center"
                >
                  Find CBSE Mentors
                </button>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <span className="px-2.5 py-1 rounded bg-purple-900 text-white font-bold text-xs uppercase">
                  Comprehensive Syllabus
                </span>
                <h3 className="text-2xl font-black text-slate-900">ICSE</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Council for the Indian School Certificate Examinations (ICSE & ISC).
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Rich English Literature, Merchant of Venice / Shakespeare interpretation.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Detailed laboratory physics, organic chemistry, and biology diagrams.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>In-depth application questions and project paper review.</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('find-mentor', { board: 'ICSE' })}
                  className="w-full py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold text-xs transition text-center"
                >
                  Find ICSE Mentors
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BIHAR LOCATIONS (ALL 38 DISTRICTS) */}
        {tab === 'locations' && (
          <div className="space-y-6 text-left">
            {/* All 38 Districts State-Wide Guarantee Banner */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-500/30 space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>State-Wide Network • Bihar All 38 Districts Active</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    बिहार के सभी 38 जिलों में BBA Mentors सक्रिय
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    पटना, गया, मुजफ्फरपुर से लेकर किशनगंज और अरवल तक—हमारा सत्यापित गृह-शिक्षण एवं डिजिटल मेंटरशिप नेटवर्क बिहार के हर प्रमंडल एवं जिले में 100% सक्रिय है।
                  </p>
                </div>
                <div className="flex gap-4 sm:gap-6 bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 shrink-0">
                  <div className="text-center">
                    <span className="block text-2xl sm:text-3xl font-black text-amber-300">
                      {TOTAL_BIHAR_DISTRICTS_COUNT}
                    </span>
                    <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">
                      Districts Covered
                    </span>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <span className="block text-2xl sm:text-3xl font-black text-emerald-400">
                      {TOTAL_BIHAR_ACTIVE_MENTORS_COUNT}+
                    </span>
                    <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">
                      Verified Mentors
                    </span>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <span className="block text-2xl sm:text-3xl font-black text-blue-300">9</span>
                    <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">
                      Divisions
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Search & Division Selector */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by District, City, or Locality (उदा. Patna, Motihari, Kankarbagh, Siwan)..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/20 transition"
                  />
                  {locationSearch && (
                    <button
                      onClick={() => setLocationSearch('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onNavigate('find-mentor')}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs rounded-xl transition shadow-md whitespace-nowrap"
                >
                  Book Free Demo Anywhere in Bihar →
                </button>
              </div>

              {/* Division Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => setSelectedDivision('All')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                    selectedDivision === 'All'
                      ? 'bg-amber-400 text-blue-950 font-black shadow-xs'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  All Bihar (सभी 38 जिले)
                </button>
                {BIHAR_DIVISIONS.map((div) => (
                  <button
                    key={div.name}
                    onClick={() => setSelectedDivision(div.name)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      selectedDivision === div.name
                        ? 'bg-amber-400 text-blue-950 font-black shadow-xs'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {div.name.replace(' Division', '')} ({div.districts.length})
                  </button>
                ))}
              </div>
            </div>

            {/* District Grid Listing */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    District Directory ({filteredDistricts.length} of 38 Districts)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verified Home Tutors and Continuous Diagnostic Mentorship in each jurisdiction
                  </p>
                </div>
                {selectedDivision !== 'All' && (
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Showing {selectedDivision}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDistricts.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition space-y-2.5 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                          <MapPin className="w-4 h-4 text-blue-900 shrink-0" />
                          <span>{d.name}</span>
                        </div>
                        {d.hindiName && (
                          <span className="text-[11px] font-semibold text-slate-500 block pl-5.5">
                            {d.hindiName} • HQ: {d.headquarters}
                          </span>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-extrabold shrink-0">
                        {d.activeMentorsCount} Mentors
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        <strong className="text-slate-700">Popular Localities:</strong> {d.popularAreas.join(', ')}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        <span>Home Tutors & 1-on-1 Demo Active</span>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-200/70 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {d.division?.replace(' Division', '')}
                      </span>
                      <button
                        onClick={() => onNavigate('find-mentor', { district: d.name.split(' ')[0] })}
                        className="text-xs font-bold text-blue-900 group-hover:text-blue-700 flex items-center gap-1 hover:underline"
                      >
                        <span>Find Mentors in {d.name.split(' ')[0]}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDistricts.length === 0 && (
                <div className="text-center py-10 space-y-3">
                  <p className="text-slate-500 text-sm">No districts matching "{locationSearch}".</p>
                  <button
                    onClick={() => {
                      setLocationSearch('');
                      setSelectedDivision('All');
                    }}
                    className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-bold"
                  >
                    Reset Filter to All 38 Districts
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
