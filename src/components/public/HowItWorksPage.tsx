import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Calendar,
  BarChart3,
  TrendingUp,
  FileText,
  Clock,
  ShieldCheck,
  Target,
  Sparkles,
} from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (view: string) => void;
}

export function HowItWorksPage({ onNavigate }: HowItWorksProps) {
  const steps = [
    {
      num: '01',
      title: 'Parent Registration & Academic Assessment Needs',
      desc: 'Parents specify the student’s class (Class 1 to 12), education board (BSEB, CBSE, ICSE), specific subjects needing help, residential locality, and preferred class timings.',
      detail: 'Includes previous term marks and areas where the student is struggling so we prepare a tailored diagnostic baseline.',
      badge: 'Step 1',
    },
    {
      num: '02',
      title: 'Mentor Matching & Background Verification',
      desc: 'Our academic coordination team matches a qualified home tutor verified with identity checks, academic credentials from renowned colleges (NIT Patna, Patna University, BHU), and teaching experience.',
      detail: 'Parents receive mentor profile with qualifications, college, reviews, and teaching history before the first session.',
      badge: 'Step 2',
    },
    {
      num: '03',
      title: 'Structured Daily Home Tuition & Concept Clear',
      desc: 'Classes are conducted 1-on-1 at home. The mentor teaches syllabus concepts, works through NCERT / Bihar Board textbooks, solves doubts, and provides daily homework.',
      detail: 'After each session, the mentor logs class topic, student understanding rating, and homework on the BBA Mentors portal.',
      badge: 'Step 3',
    },
    {
      num: '04',
      title: 'Weekly BBA Mentors Standard Assessment',
      desc: 'Every weekend, students take a timed assessment covering the syllabus taught during the week. This tests retention, accuracy, and board exam answer formatting.',
      detail: 'Tests are standardized across BSEB and CBSE standards with objective and subjective evaluation.',
      badge: 'Step 4',
    },
    {
      num: '05',
      title: 'Algorithmic Performance Analysis & Topic Diagnosis',
      desc: 'Our progress engine calculates the weekly score, marks gain/loss compared to previous tests, overall mastery percentage, and classifies Strong Topics vs. Weak Topics.',
      detail: 'Identifies exact conceptual gaps (e.g. "Trigonometric identities in Math" or "Chemical equations balancing").',
      badge: 'Step 5',
    },
    {
      num: '06',
      title: 'Actionable Improvement Plan & Parent Progress Report',
      desc: 'A monthly formal progress report and weekly digital updates are generated directly for the parent, including attendance records, exam trajectory graphs, and teacher remarks.',
      detail: 'Parents can review the report online, download PDF versions, or request an academic counselor review meeting.',
      badge: 'Step 6',
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-800" />
            <span>The Science of Measurable Learning</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How BBA Mentors Works
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Most home tuition relies on blind trust without accountability. BBA Mentors transforms tuition into an engineered learning system where parents clearly see weekly results.
          </p>
        </div>

        {/* The 6-Stage Timeline */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-6 items-start text-left hover:border-blue-300 transition group shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black text-xl shrink-0 group-hover:bg-blue-800 transition">
                {s.num}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{s.desc}</p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{s.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The Closed Loop System Graphic */}
        <div className="p-8 sm:p-12 rounded-3xl bg-blue-950 text-white text-center space-y-8">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Closed-Loop Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Parent → Student → Teacher → Daily Learning → Weekly Assessment → Analysis → Parent Report
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Continuous loop ensures student challenges are flagged and solved immediately rather than discovered during final exams.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('find-mentor')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-sm shadow"
            >
              Find a Suitable Mentor
            </button>
            <button
              onClick={() => onNavigate('parent-register')}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 rounded-xl text-blue-950 font-black text-sm shadow"
            >
              Register Your Child Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
