import {
  Laptop,
  CheckCircle2,
  Video,
  Clock,
  Sparkles,
  BarChart3,
  Calendar,
  ArrowRight,
} from 'lucide-react';

interface OnlineTuitionProps {
  onNavigate: (view: string) => void;
}

export function OnlineTuitionPage({ onNavigate }: OnlineTuitionProps) {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-left max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
            Live 1-on-1 Interactive Classes
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Online Live Mentorship & Progress System
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Connect your child with top educators from premier institutions (NIT Patna, Patna Science College, IITs) anywhere in Bihar. Includes digital whiteboard, interactive assessments, and automated parent reports.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('find-mentor')}
              className="px-5 py-2.5 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-blue-800 transition"
            >
              Browse Online Mentors
            </button>
            <button
              onClick={() => onNavigate('parent-register')}
              className="px-5 py-2.5 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 transition"
            >
              Book a Free Online Demo Class
            </button>
          </div>
        </div>

        {/* 4 Pillars of Online Tuition */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Top Mentors Everywhere',
              desc: 'Students in smaller towns (Arrah, Samastipur, Madhubani) get access to NIT Patna & Patna Science College top mentors.',
              icon: Laptop,
            },
            {
              title: 'Interactive 2-Way Video',
              desc: 'Not a pre-recorded video lecture. Real-time live audio and video with digital stylus problem solving.',
              icon: Video,
            },
            {
              title: 'Session Class Notes & Logs',
              desc: 'Annotated PDF notes shared immediately after every class along with mentor homework guidelines.',
              icon: Sparkles,
            },
            {
              title: 'Online BBA Weekly Assessment',
              desc: 'Weekend online exam platform with automated timer, score report, and topic-wise gap breakdown.',
              icon: BarChart3,
            },
          ].map((item) => {
            const IconComp = item.icon;
            return (
              <div key={item.title} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold">
                  <IconComp className="w-5 h-5 text-emerald-800" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Comparison: Home Tuition vs Online Tuition */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-left space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Compare: Home Tuition vs Online Tuition
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                  <th className="p-3">Feature</th>
                  <th className="p-3 text-blue-900 font-extrabold">Home Tuition (Offline)</th>
                  <th className="p-3 text-emerald-800 font-extrabold">Online Live Mentorship</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Physical Presence</td>
                  <td className="p-3 text-blue-900 font-medium">In-person mentor at your home</td>
                  <td className="p-3">Live HD 2-way video session</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Geographical Reach</td>
                  <td className="p-3">Within your district & colony radius</td>
                  <td className="p-3 text-emerald-800 font-medium">Any town/village across Bihar</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Weekly BBA Assessments</td>
                  <td className="p-3">Included in Portal / Printed</td>
                  <td className="p-3">Online Timed Test Engine</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Parent Progress Tracking</td>
                  <td className="p-3">Real-time Digital Dashboard</td>
                  <td className="p-3">Real-time Digital Dashboard</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Flexibility & Rescheduling</td>
                  <td className="p-3">Coordinated with tutor</td>
                  <td className="p-3 text-emerald-800 font-medium">Highly flexible time slots</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
