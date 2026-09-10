import { useState, type FormEvent } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Send,
  Calendar,
  IndianRupee,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ALL_38_BIHAR_DISTRICTS } from '../../data/biharDistricts.ts';

interface BecomeMentorProps {
  onNavigate: (view: string) => void;
}

export function BecomeMentorPage({ onNavigate }: BecomeMentorProps) {
  const { registerMentor } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    district: 'Patna',
    city: 'Patna',
    preferredAreas: 'Boring Road, Kankarbagh',
    qualification: 'B.Tech / M.Sc Mathematics',
    college: 'NIT Patna',
    teachingExperience: '3+ Years',
    subjects: 'Mathematics, Science',
    classes: 'Class 8, Class 9, Class 10',
    boards: 'CBSE, BSEB',
    teachingMode: 'Home Tuition',
    availability: 'Mon-Sat 4:00 PM - 8:00 PM',
    expectedFee: '₹4,500 - ₹6,000 / month',
    about: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const msg = await registerMentor({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        district: form.district,
        city: form.city,
        preferredAreas: form.preferredAreas.split(',').map((s) => s.trim()),
        qualification: form.qualification,
        college: form.college,
        teachingExperience: form.teachingExperience,
        subjects: form.subjects.split(',').map((s) => s.trim()),
        classes: form.classes.split(',').map((s) => s.trim()),
        boards: form.boards.split(',').map((s) => s.trim()),
        teachingMode: form.teachingMode,
        availability: form.availability,
        expectedFee: form.expectedFee,
        about: form.about || 'Dedicated educator focused on building student confidence and rigorous problem solving.',
      });
      setSubmittedMessage(msg || 'Application submitted successfully! Our academic team will verify your credentials.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Join Bihar’s Trusted Educator Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Become a BBA Mentor
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Teach motivated school students, earn competitive compensation, and be part of a structured academic tracking system.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Timely Payments</h4>
            <p className="text-xs text-slate-500">Transparent billing and monthly payouts directly to your bank account.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Nearby Students</h4>
            <p className="text-xs text-slate-500">Matched with home tuition batches within your preferred colony radius.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Digital Teaching Tools</h4>
            <p className="text-xs text-slate-500">Class reporting, attendance logs, and weekly test papers managed for you.</p>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-left">
          {submittedMessage ? (
            <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">Application Under Verification</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                {submittedMessage}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('mentor-dashboard')}
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition"
                >
                  Go to Mentor Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                  1. Personal & Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Er. Saurabh Anand"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit phone number"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="mentor@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Qualifications */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                  2. Academic Qualifications & College
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Degree *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.Tech / M.Sc / B.Ed"
                      value={form.qualification}
                      onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">College / University *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NIT Patna / Patna Science College"
                      value={form.college}
                      onChange={(e) => setForm({ ...form, college: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Experience *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 4 Years"
                      value={form.teachingExperience}
                      onChange={(e) => setForm({ ...form, teachingExperience: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Teaching Preferences */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                  3. Teaching Profile & Location in Bihar
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bihar District ({ALL_38_BIHAR_DISTRICTS.length} Districts Open for Registration) *
                    </label>
                    <select
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                    >
                      {ALL_38_BIHAR_DISTRICTS.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} {d.hindiName ? `(${d.hindiName})` : ''} - {d.headquarters}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Localities / Colonies *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Boring Road, Bailey Road, Patliputra"
                      value={form.preferredAreas}
                      onChange={(e) => setForm({ ...form, preferredAreas: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subjects (comma-separated) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mathematics, Physics"
                      value={form.subjects}
                      onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Classes you teach (comma-separated) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nursery, LKG, UKG, Class 1 to 5, Class 9, Class 10"
                      value={form.classes}
                      onChange={(e) => setForm({ ...form, classes: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Boards</label>
                    <input
                      type="text"
                      value={form.boards}
                      onChange={(e) => setForm({ ...form, boards: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mode & Expected Fee</label>
                    <input
                      type="text"
                      value={form.expectedFee}
                      onChange={(e) => setForm({ ...form, expectedFee: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">About Your Teaching Style & Results</label>
                  <textarea
                    rows={3}
                    placeholder="Describe how you help students build conceptual foundation and solve exam questions..."
                    value={form.about}
                    onChange={(e) => setForm({ ...form, about: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-sm transition shadow"
              >
                {submitting ? 'Submitting Application...' : 'Submit Mentor Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
