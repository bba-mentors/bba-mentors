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
} from 'lucide-react';

interface ClassesBoardsLocationsProps {
  initialTab?: 'classes' | 'subjects' | 'boards' | 'locations';
  onNavigate: (view: string, data?: any) => void;
}

export function ClassesBoardsLocationsPage({
  initialTab = 'classes',
  onNavigate,
}: ClassesBoardsLocationsProps) {
  const [tab, setTab] = useState<'classes' | 'subjects' | 'boards' | 'locations'>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

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

        {/* TAB 1: CLASSES (1 to 12) */}
        {tab === 'classes' && (
          <div className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  level: 'Primary Wing',
                  classes: 'Class 1 to 5',
                  focus: 'Foundational literacy, numeracy, phonics, basic arithmetic, curiosity, neat handwriting, and disciplined study habits.',
                  subjects: 'English, Hindi, Mathematics, EVS / General Knowledge',
                },
                {
                  level: 'Middle School',
                  classes: 'Class 6 to 8',
                  focus: 'Transition from basic concepts to analytical problem solving. Algebra introduction, science experimentation, and grammar mastery.',
                  subjects: 'Maths, Science (Physics/Chem/Bio), Social Science, Hindi, English, Sanskrit',
                },
                {
                  level: 'Secondary / Board Exam',
                  classes: 'Class 9 & 10',
                  focus: 'Matric & Secondary Board readiness. Concept mastery of NCERT / Bihar Board books, theorem proofs, formula drills, and previous 10-year question practice.',
                  subjects: 'Advanced Mathematics, Science, Social Science, Hindi / Urdu, English',
                },
                {
                  level: 'Senior Secondary',
                  classes: 'Class 11 & 12',
                  focus: 'Rigorous preparation for intermediate exams (BSEB / CBSE) along with competitive entrance foundations (JEE, NEET, CUET, CA Foundation).',
                  subjects: 'PCM (Physics, Chem, Math) / PCB (Biology) / Commerce / Arts',
                },
              ].map((c) => (
                <div key={c.classes} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                    {c.level}
                  </span>
                  <h3 className="text-xl font-black text-slate-900">{c.classes}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.focus}</p>
                  <div className="pt-2 border-t border-slate-100 text-xs">
                    <span className="font-bold text-slate-800 block text-[11px] mb-1">Subjects Covered:</span>
                    <span className="text-slate-500">{c.subjects}</span>
                  </div>
                  <button
                    onClick={() => onNavigate('find-mentor', { classGrade: c.classes.split(' ')[1] ? `Class ${c.classes.split(' ')[1].split('-')[0]}` : c.classes })}
                    className="w-full mt-2 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs text-center transition"
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

        {/* TAB 4: BIHAR LOCATIONS */}
        {tab === 'locations' && (
          <div className="space-y-6 text-left">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Key Educational Hubs & Coverage in Bihar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    district: 'Patna',
                    mentors: 142,
                    colonies: 'Boring Road, Bailey Road, Kankarbagh, Rajendra Nagar, Danapur, Patliputra, Ashiana Nagar, Exhibition Road, Anisabad, Fraser Road',
                  },
                  {
                    district: 'Gaya',
                    mentors: 48,
                    colonies: 'Civil Lines, AP Colony, Delha, Manpur, Bodhgaya Road, Rampur, Jail Road',
                  },
                  {
                    district: 'Muzaffarpur',
                    mentors: 62,
                    colonies: 'Mithanpura, Zero Mile, Aamgola, Kalambagh Road, Brahampura, Juran Chapra, Maripur',
                  },
                  {
                    district: 'Bhagalpur',
                    mentors: 54,
                    colonies: 'Tilka Manjhi, Adampur, Zero Mile, Khanjarpur, Nathnagar, Barari, University Road',
                  },
                  {
                    district: 'Darbhanga',
                    mentors: 39,
                    colonies: 'Laheriasarai, Tower Chowk, Mirzapur, Donar, Benta, Allalpatti, Kathalbari',
                  },
                  {
                    district: 'Purnia',
                    mentors: 31,
                    colonies: 'Line Bazar, Bhatta Bazar, Madhubani, Navratan Hatta, Gulabbagh, Polytechnic Chowk',
                  },
                  {
                    district: 'Begusarai',
                    mentors: 26,
                    colonies: 'Har-Har Mahadev Chowk, Kali Sthan, Refinery Township, Bishanpur, Subhash Chowk',
                  },
                  {
                    district: 'Bhojpur (Ara)',
                    mentors: 29,
                    colonies: 'Nawada, Katira, Anaith, Chandwa, Jagdeo Nagar, Sheoganj, Gausganj',
                  },
                  {
                    district: 'Samastipur & Nalanda',
                    mentors: 35,
                    colonies: 'Magadh Dairy, Mohanpur, Kashipur, Bihar Sharif, Hospital Road, Ramchandrapur',
                  },
                ].map((l) => (
                  <div key={l.district} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <MapPin className="w-4 h-4 text-blue-700" />
                        <span>{l.district}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-extrabold">
                        {l.mentors} Mentors
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{l.colonies}</p>
                    <button
                      onClick={() => onNavigate('find-mentor', { district: l.district.split(' ')[0] })}
                      className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1 pt-1"
                    >
                      <span>Search mentors in {l.district}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
