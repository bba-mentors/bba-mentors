import { useState, type FormEvent } from 'react';
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  Users,
  Search,
  BookOpen,
  Sparkles,
  ChevronRight,
  MapPin,
  Check,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/api.ts';

interface HomePageProps {
  onNavigate: (view: string, data?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [demoForm, setDemoForm] = useState({
    parentName: '',
    mobile: '',
    studentClass: 'Class 10',
    board: 'CBSE',
    district: 'Patna',
    city: 'Patna',
  });
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const handleDemoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!demoForm.parentName || !demoForm.mobile) return;
    setDemoSubmitting(true);
    try {
      await api.requestDemoTuition(demoForm);
      setDemoSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setDemoSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Bihar’s Premier Student Progress & Home Tuition System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                BBA MENTORS
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-800 mt-2">
                  Personalized Home Tuition. Measurable Improvement.
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Get the right mentor for your child and track learning progress through regular assessments and performance reports.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-home-tuition-btn"
                  onClick={() => onNavigate('home-tuition')}
                  className="px-6 py-3.5 rounded-xl bg-blue-900 text-white font-bold text-base hover:bg-blue-800 transition shadow-md shadow-blue-950/10 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Home Tuition (घर पर ट्यूशन)</span>
                </button>
                <button
                  id="hero-find-mentor-btn"
                  onClick={() => onNavigate('find-mentor')}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-base hover:bg-slate-200 transition border border-slate-200 flex items-center gap-2"
                >
                  <span>Find a Mentor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="hero-register-child-btn"
                  onClick={() => onNavigate('parent-register')}
                  className="px-5 py-3.5 rounded-xl bg-amber-400 text-blue-950 font-extrabold text-base hover:bg-amber-300 transition shadow-sm flex items-center gap-2"
                >
                  <span>Register Child</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 text-slate-700">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Verified Mentor Profiles</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">Weekly</div>
                  <div className="text-xs text-slate-500 font-medium">Standard Assessments</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-blue-800">+7% to +15%</div>
                  <div className="text-xs text-slate-500 font-medium">Measurable Improvement</div>
                </div>
              </div>
            </div>

            {/* Right Visual: Student + Mentor + Progress Badge Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-7 space-y-5">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-900 text-base">
                      AS
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Aarav Sharma</div>
                      <div className="text-xs text-slate-500">Class 10 (CBSE) • Patna</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" />
                    +7% Improvement
                  </span>
                </div>

                {/* Assigned Mentor Callout */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    AK
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Mentor: Er. Amit Kumar</span>
                    <span className="text-slate-500">B.Tech NIT Patna • Mathematics & Science</span>
                  </div>
                </div>

                {/* Score Progress Graph Preview */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Weekly Exam Progress (Week 1 → Week 5)</span>
                    <span className="text-emerald-600 font-bold">81% Current</span>
                  </div>
                  <div className="h-10 flex items-end gap-2 pt-2">
                    <div className="flex-1 bg-blue-100 rounded-t h-[65%] flex items-center justify-center text-[10px] font-bold text-blue-900">
                      65%
                    </div>
                    <div className="flex-1 bg-blue-200 rounded-t h-[69%] flex items-center justify-center text-[10px] font-bold text-blue-900">
                      69%
                    </div>
                    <div className="flex-1 bg-blue-300 rounded-t h-[72%] flex items-center justify-center text-[10px] font-bold text-blue-900">
                      72%
                    </div>
                    <div className="flex-1 bg-blue-400 rounded-t h-[76%] flex items-center justify-center text-[10px] font-bold text-blue-900">
                      76%
                    </div>
                    <div className="flex-1 bg-emerald-500 rounded-t h-[81%] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      81%
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 px-1 font-medium">
                    <span>W1</span>
                    <span>W2</span>
                    <span>W3</span>
                    <span>W4</span>
                    <span>W5</span>
                  </div>
                </div>

                {/* Strong & Weak Topics */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <span className="font-bold text-emerald-800 block text-[11px] mb-1">Strong Topics</span>
                    <span className="text-slate-700">Statistics, Reading</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                    <span className="font-bold text-amber-800 block text-[11px] mb-1">Focus Target</span>
                    <span className="text-slate-700">Trigonometry, Algebra</span>
                  </div>
                </div>

                {/* Teacher Remark Quote */}
                <div className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                  "Aarav's trigonometry problem solving speed increased by 30% after targeted drills."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION A: HOW BBA MENTORS WORKS (5 Steps) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-800">
              Clear & Transparent Academic Methodology
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How BBA Mentors Works
            </p>
            <p className="text-slate-600 text-sm sm:text-base">
              From your first registration to continuous weekly improvement, we manage the entire academic cycle so parents never have to guess.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              {
                step: 'Step 1',
                title: 'Register Your Child',
                desc: 'Submit your child’s class, board (BSEB / CBSE / ICSE), subjects, and residential location in Bihar.',
              },
              {
                step: 'Step 2',
                title: 'Get a Suitable Mentor',
                desc: 'We match a verified mentor with proven credentials matching your board and syllabus requirements.',
              },
              {
                step: 'Step 3',
                title: 'Personalized Learning',
                desc: 'Daily 1-on-1 home tuition sessions, concept clearing, and disciplined homework monitoring.',
              },
              {
                step: 'Step 4',
                title: 'Weekly Assessment',
                desc: 'Standardized BBA Mentors weekend exams to test retention and identify exact weak topics.',
              },
              {
                step: 'Step 5',
                title: 'Track Improvement',
                desc: 'Review weekly performance metrics, score differences, and comprehensive monthly parent reports.',
              },
            ].map((s, idx) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 relative hover:border-blue-300 transition group shadow-sm"
              >
                <div className="inline-block px-3 py-1 rounded-md bg-blue-900 text-white font-black text-xs">
                  {s.step}
                </div>
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-900 transition">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION A.5: DEDICATED HOME TUITION SPOTLIGHT (घर पर व्यक्तिगत पढ़ाई) */}
      <section className="py-20 bg-gradient-to-b from-blue-950 to-blue-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>बिहार का सबसे अनुशासित होम ट्यूशन नेटवर्क (Doorstep 1-on-1 Learning)</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                घर बैठे 1-on-1 होम ट्यूशन,{' '}
                <span className="text-amber-400">हर संडे टेस्ट</span> और 100% वेरिफाइड शिक्षक
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                BBA Mentors आपके घर के 3-5 किमी दायरे में रहने वाले योग्य और बैकग्राउंड-वेरिफाइड शिक्षक उपलब्ध कराता है। आपके बच्चे को मिलता है पूरा 1-on-1 व्यक्तिगत ध्यान, दैनिक होमवर्क ट्रैकिंग और स्वतंत्र साप्ताहिक टेस्ट।
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('home-tuition')}
                  className="px-6 py-3 rounded-xl bg-amber-400 text-blue-950 font-black text-sm hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition flex items-center gap-2"
                >
                  <span>होम ट्यूशन के बारे में विस्तार से जानें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('home-tuition')}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>2-दिन की निशुल्क डेमो क्लास बुक करें</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-black text-sm">
                  100%
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">सुरक्षित व पारदर्शी सेवा</h4>
                  <p className="text-xs text-slate-300">अभिभावक से शून्य बिचौलिया कमीशन</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200 border-t border-white/10 pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>आधार, कॉलेज डिग्री व पुलिस सत्यापन</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>छात्राओं के लिए महिला शिक्षिका का विकल्प</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>पसंद न आने पर 48 घंटे में मुफ्त ट्यूटर रिप्लेसमेंट</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>BSEB (मैट्रिक/इंटर) व CBSE दोनों बोर्ड में दक्ष</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 4 Pillars of BBA Home Tuition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {[
              {
                title: 'आने-जाने की थकान से मुक्ति',
                desc: 'भीड़-भाड़ वाले ऑटो या ट्रैफिक में समय गंवाए बिना बच्चा घर के शांत वातावरण में पढ़ता है।',
                icon: MapPin,
              },
              {
                title: 'सत्यापित शिक्षक प्रोफाइल',
                desc: 'NIT पटना, पटना साइंस कॉलेज और DU जैसे शीर्ष संस्थानों से शिक्षित योग्य गृह शिक्षक।',
                icon: ShieldCheck,
              },
              {
                title: 'साप्ताहिक संडे टेस्ट सीरीज',
                desc: 'ट्यूटर ने पूरे हफ्ते क्या पढ़ाया, हर रविवार टेस्ट पेपर से उसकी वास्तविक जांच होती है।',
                icon: Award,
              },
              {
                title: 'डिजिटल अटेंडेंस व क्लास लॉग',
                desc: 'हर क्लास के बाद ट्यूटर ऐप में टॉपिक और होमवर्क दर्ज करता है जो अभिभावक के फोन पर दिखता है।',
                icon: BarChart3,
              },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">{p.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

          {/* City Quick Links */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">होम ट्यूटर उपलब्ध:</span>
            {['पटना (Patna)', 'गया (Gaya)', 'मुजफ्फरपुर (Muzaffarpur)', 'भागलपुर (Bhagalpur)', 'दरभंगा (Darbhanga)', 'पूर्णिया (Purnia)', 'बेगूसराय (Begusarai)', 'आरा (Ara)'].map((city) => (
              <button
                key={city}
                onClick={() => onNavigate('home-tuition')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition font-medium text-[11px]"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION B: WHY BBA MENTORS (8 Pillars) */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-800">
              Why Parents Choose BBA Mentors
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why BBA Mentors
            </p>
            <p className="text-slate-600 text-sm sm:text-base">
              A comprehensive system built for accountability, quality tuition, and measured academic results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Personalized Home Tuition',
                desc: '1-on-1 focused instruction at the safety of your home across major Bihar districts.',
                icon: BookOpen,
              },
              {
                title: 'Verified Mentor Profiles',
                desc: 'Background checked educators from top Bihar and national colleges (NIT Patna, Patna Science College, DU).',
                icon: ShieldCheck,
              },
              {
                title: 'Regular Assessments',
                desc: 'Weekly standardized tests aligned with BSEB and CBSE board curriculum benchmarks.',
                icon: Award,
              },
              {
                title: 'Performance Tracking',
                desc: 'Real-time calculation of percentage gains, previous vs. current scores, and trends.',
                icon: TrendingUp,
              },
              {
                title: 'Weak Topic Identification',
                desc: 'Granular diagnosis down to chapter subtopics (e.g. Trigonometry identities vs. Polynomials).',
                icon: AlertCircle,
              },
              {
                title: 'Parent Progress Reports',
                desc: 'Transparent monthly report cards highlighting attendance, test averages, and mentor remarks.',
                icon: BarChart3,
              },
              {
                title: 'Attendance Monitoring',
                desc: 'Digital daily check-ins: Present, Absent, or Rescheduled logs verified on your phone.',
                icon: Calendar,
              },
              {
                title: 'Homework Tracking',
                desc: 'Daily homework assignments with due dates and teacher feedback loops.',
                icon: CheckCircle2,
              },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-white border border-slate-200 text-left space-y-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                    <IconComp className="w-5 h-5 text-blue-800" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION C: LEARNING CYCLE */}
      <section className="py-20 bg-blue-950 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-amber-400">
              The BBA Mentors Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">The Learning Cycle</h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              A continuous flywheel that transforms sporadic home tutoring into a predictable growth science.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto text-xs sm:text-sm font-black">
            <div className="px-5 py-3 rounded-xl bg-blue-900 border border-blue-700 shadow-md">
              1. LEARN
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <div className="px-5 py-3 rounded-xl bg-blue-900 border border-blue-700 shadow-md">
              2. TEST
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <div className="px-5 py-3 rounded-xl bg-blue-900 border border-blue-700 shadow-md">
              3. ANALYSE
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <div className="px-5 py-3 rounded-xl bg-blue-900 border border-blue-700 shadow-md">
              4. IMPROVE
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <div className="px-5 py-3 rounded-xl bg-amber-400 text-blue-950 font-black shadow-md">
              5. REPEAT
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D: PARENT DASHBOARD PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-800">
              Complete Transparency For Parents
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Parent Dashboard Preview
            </p>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything you need to observe your child’s academic transformation from anywhere on your mobile phone or computer.
            </p>
          </div>

          {/* Realistic Dashboard Box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Welcome Parent</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Rajesh Sharma</h3>
                <p className="text-xs text-slate-500">Student: Aarav Sharma • Class 10 CBSE • Patna</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('parent-login')}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition"
                >
                  Launch Live Parent Dashboard
                </button>
              </div>
            </div>

            {/* Dashboard 6 Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-left">
                <span className="text-[11px] font-semibold text-slate-500 block">Overall Score</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">78%</span>
                <span className="text-[10px] text-slate-400">Previous: 71%</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-left">
                <span className="text-[11px] font-semibold text-slate-500 block">Weekly Score</span>
                <span className="text-2xl font-black text-blue-900 block mt-1">81%</span>
                <span className="text-[10px] text-slate-400">Assessment #5</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-left">
                <span className="text-[11px] font-semibold text-slate-500 block">Attendance</span>
                <span className="text-2xl font-black text-emerald-700 block mt-1">92%</span>
                <span className="text-[10px] text-slate-400">11 of 12 Present</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-left">
                <span className="text-[11px] font-semibold text-slate-500 block">Classes Done</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">10</span>
                <span className="text-[10px] text-slate-400">Target: 12 sessions</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-left">
                <span className="text-[11px] font-semibold text-slate-500 block">Improvement</span>
                <span className="text-2xl font-black text-emerald-600 block mt-1">+7%</span>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                  ↑ Improved
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-left">
                <span className="text-[11px] font-semibold text-slate-500 block">Upcoming Exam</span>
                <span className="text-base font-bold text-slate-900 block mt-1">Test #6</span>
                <span className="text-[10px] text-blue-700 font-semibold">Sunday 10:00 AM</span>
              </div>
            </div>

            {/* Performance breakdown columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-xl bg-white border border-slate-200 text-left space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Strong Topics</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-semibold">Statistics</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-semibold">Reading</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-semibold">Hindi Grammar</span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 text-left space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">Weak Topics</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-xs font-semibold">Trigonometry</span>
                  <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-xs font-semibold">Algebra</span>
                  <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-xs font-semibold">Grammar</span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 text-left space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">Teacher Remarks</h4>
                <p className="text-xs text-slate-600 italic">
                  "Focus on Trigonometry and Grammar during the next learning cycle. Homework completion is consistent."
                </p>
                <div className="text-[11px] font-bold text-slate-700 pt-1">— Er. Amit Kumar (NIT Patna)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: CTA & DEMO REQUEST FORM */}
      <section className="py-20 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-block px-3 py-1 rounded bg-amber-400 text-blue-950 text-xs font-extrabold tracking-wider uppercase">
                Take The First Step
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                "Give Your Child More Than Tuition — Give Them a Learning System."
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Connect with verified mentors in your neighborhood across Patna, Gaya, Muzaffarpur, Bhagalpur, Darbhanga and other Bihar locations. Weekly assessment reports delivered directly to parents.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id="cta-find-mentor-btn"
                  onClick={() => onNavigate('find-mentor')}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition shadow"
                >
                  Find a Mentor Now
                </button>
                <button
                  id="cta-register-child-btn"
                  onClick={() => onNavigate('parent-register')}
                  className="px-6 py-3.5 rounded-xl bg-amber-400 text-blue-950 font-black text-sm hover:bg-amber-300 transition"
                >
                  Register Your Child
                </button>
              </div>
            </div>

            {/* Quick Demo Class Request Box */}
            <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-xl">
              <h3 className="text-lg font-black tracking-tight text-slate-900">
                Book a Free Academic Counseling Call
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Our Bihar academic counselor will contact you within 2 hours.
              </p>

              {demoSubmitted ? (
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-sm">Request Received!</h4>
                  <p className="text-xs text-emerald-700">
                    Thank you! Our BBA Mentors coordinator will call you to understand your child’s learning needs.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-3.5 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Parent's Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={demoForm.parentName}
                      onChange={(e) => setDemoForm({ ...demoForm, parentName: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={demoForm.mobile}
                        onChange={(e) => setDemoForm({ ...demoForm, mobile: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Student Class *
                      </label>
                      <select
                        value={demoForm.studentClass}
                        onChange={(e) => setDemoForm({ ...demoForm, studentClass: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                      >
                        {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Education Board
                      </label>
                      <select
                        value={demoForm.board}
                        onChange={(e) => setDemoForm({ ...demoForm, board: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                      >
                        <option value="CBSE">CBSE</option>
                        <option value="BSEB">BSEB (Bihar Board)</option>
                        <option value="ICSE">ICSE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Bihar District
                      </label>
                      <select
                        value={demoForm.district}
                        onChange={(e) => setDemoForm({ ...demoForm, district: e.target.value, city: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                      >
                        {['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia', 'Begusarai', 'Bhojpur (Ara)'].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={demoSubmitting}
                    className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition shadow"
                  >
                    {demoSubmitting ? 'Submitting...' : 'Request Counseling Call'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
