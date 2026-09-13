import { useState, type FormEvent } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  CheckCircle2,
  FileText,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { BIHAR_38_DISTRICTS } from '../../data/biharDistricts.ts';

interface SupportProps {
  viewType: 'about' | 'contact' | 'faq' | 'privacy' | 'terms';
  onNavigate: (view: string) => void;
}

export function AboutContactFaqPage({ viewType, onNavigate }: SupportProps) {
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    district: 'Patna',
    subject: 'Tuition Inquiry',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      await api.requestDemoTuition({
        parentName: contactForm.name,
        mobile: contactForm.phone,
        studentClass: 'Inquiry',
        board: 'Inquiry',
        district: contactForm.district,
        city: contactForm.district,
        notes: `[Contact Form] ${contactForm.subject}: ${contactForm.message}`,
      });
      setContactSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. ABOUT PAGE */}
        {viewType === 'about' && (
          <div className="space-y-10 text-left">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                Our Mission in Bihar
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                About BBA Mentors
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                BBA Mentors was founded with a single conviction: <strong>tuition without continuous assessment is just an unverified expense.</strong> Parents across Bihar invest hard-earned money in private tuition, but rarely know if their child is actually improving until disappointing school exam marks arrive.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-blue-800" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Verified Educators</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We rigorously vet every tutor's identity, college degrees (NIT Patna, Patna Science College, etc.), and pedagogical style before assigning them to your home.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5 text-blue-800" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Weekly Standard Exams</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every weekend, students take objective and conceptual assessments aligned with BSEB and CBSE syllabi. This provides undeniable proof of concept retention.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-blue-800" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Measurable Progress</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our algorithm diagnoses Strong Topics vs. Weak Topics, alerting both the parent and the mentor to exactly where extra practice is required.
                </p>
              </div>
            </div>

            <div className="p-8 bg-blue-900 text-white rounded-2xl space-y-4">
              <h2 className="text-xl sm:text-2xl font-black">
                "Learn. Test. Improve."
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
                By combining dedicated 1-on-1 mentorship with software-driven learning diagnostics, BBA Mentors empowers students across Patna, Gaya, Muzaffarpur, Bhagalpur, Darbhanga and all of Bihar to excel in their academic goals.
              </p>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => onNavigate('find-mentor')}
                  className="px-5 py-2.5 bg-amber-400 text-blue-950 font-bold text-xs rounded-xl hover:bg-amber-300 transition"
                >
                  Find a Suitable Mentor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. CONTACT US PAGE */}
        {viewType === 'contact' && (
          <div className="space-y-10 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                Bihar Academic Support
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Contact BBA Mentors
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Have questions regarding home tuition, tutor matching, or weekly exams? Our academic counselors are here to help.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Contact Info Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <MapPin className="w-4 h-4 text-blue-900" />
                    <span>Central Academic Office</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    BBA Mentors, Tingachiya, Katihar, Bihar - 854112
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>Helpline Numbers</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Parent Counseling & Helpline:{' '}
                    <a href="tel:+919576767949" className="text-blue-900 font-bold hover:underline">
                      +91 9576767949
                    </a>
                  </p>
                  <p className="text-[11px] text-slate-400">Hours: Mon - Sun (8:00 AM to 9:00 PM)</p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span>Email Inquiries</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Official Email:{' '}
                    <a href="mailto:bbatestseries@gmail.com" className="text-blue-900 font-bold hover:underline">
                      bbatestseries@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4">Send an Inquiry</h3>

                {contactSubmitted ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-emerald-900 text-sm">Message Sent Successfully</h4>
                    <p className="text-xs text-emerald-700">
                      Our Bihar academic counselor will connect with you within 2 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} autoComplete="off" className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Kishore"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit mobile"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                        <select
                          value={contactForm.district}
                          onChange={(e) => setContactForm({ ...contactForm, district: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                        >
                          {BIHAR_38_DISTRICTS.map((d) => (
                            <option key={d.name} value={d.name}>{d.name} ({d.hindiName})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Topic</label>
                      <select
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                      >
                        <option value="Home Tuition Inquiry">Home Tuition Matching</option>
                        <option value="Online Live Mentorship">Online Live Classes</option>
                        <option value="Weekly Assessment Platform">Weekly Assessment System</option>
                        <option value="Tutor Application">Tutor / Mentor Application</option>
                        <option value="Other Query">Other Question</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message / Requirement *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Tell us about student's class, board, and topics needing help..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs transition shadow"
                    >
                      {contactLoading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. FAQ PAGE */}
        {viewType === 'faq' && (
          <div className="space-y-8 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                Got Questions?
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Transparent answers to everything parents in Bihar ask about BBA Mentors.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'How does BBA Mentors verify its tutors and mentors?',
                  a: 'Every mentor goes through a 3-step verification process: 1. Aadhaar and residential address background check. 2. Degree certificate verification from accredited institutions (NIT Patna, Patna Science College, Delhi University, etc.). 3. A mock demo class evaluation to check communication skills, patience, and subject clarity.',
                },
                {
                  q: 'How does the Weekly Assessment work?',
                  a: 'Every weekend, BBA Mentors publishes a standardized assessment covering the syllabus taught during that week. The student takes the test on our portal or on paper. The score is immediately calculated, analyzed, and shared directly with parents along with specific weak topic flags.',
                },
                {
                  q: 'What if we are unhappy with the assigned mentor?',
                  a: 'We offer an immediate, hassle-free replacement guarantee. If for any reason the teaching pace or style does not suit your child, inform our academic coordinator and we will arrange an alternate verified mentor without additional fees.',
                },
                {
                  q: 'What are the tuition fees for home tuition across Bihar?',
                  a: 'Home tuition fees generally range between ₹3,500 to ₹7,500 per month depending on the student’s class grade (Primary, Matric 10th, or Intermediate 12th), number of subjects, and weekly session frequency. All fees include the full BBA Mentors progress tracking system, weekly exams, and monthly parent reports.',
                },
                {
                  q: 'Do you cover Bihar Board (BSEB) syllabus in Hindi medium?',
                  a: 'Yes! We have mentors specialized in both BSEB Hindi Medium and BSEB English Medium, trained specifically on the 50% objective MCQ pattern and SCERT/NCERT textbook curriculum.',
                },
                {
                  q: 'Can parents monitor attendance and homework daily?',
                  a: 'Yes. Every day after completing a session, the mentor logs the topic covered, homework given, student understanding rating, and attendance directly on their portal, which updates the parent’s smartphone dashboard in real-time.',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-slate-900 hover:bg-slate-50 transition"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === idx ? 'rotate-180 text-blue-900' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PRIVACY POLICY */}
        {viewType === 'privacy' && (
          <div className="space-y-6 text-left bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h1 className="text-2xl font-black text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Effective Date: January 1, 2026</p>
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>
                BBA Mentors ("we", "our", "us") values the privacy of parents, students, and educators. This Privacy Policy details how we collect, safeguard, and utilize data across our platform.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Data We Collect</h4>
              <p>
                We collect contact information (names, mobile numbers, emails), student academic information (class, board, test scores, homework logs), and mentor verification documents purely to deliver home tuition matching and progress reports.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Use of Information</h4>
              <p>
                Data is strictly used to match suitable mentors, calculate weekly academic progress reports, and notify parents of class attendance and assessment outcomes. We never sell personal information to third-party advertisers.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Security</h4>
              <p>
                All account sessions are encrypted and role-protected. Admin dashboards are safeguarded by strict authentication layers.
              </p>
            </div>
          </div>
        )}

        {/* 5. TERMS & CONDITIONS */}
        {viewType === 'terms' && (
          <div className="space-y-6 text-left bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h1 className="text-2xl font-black text-slate-900">Terms & Conditions</h1>
            <p className="text-xs text-slate-500">Last updated: January 1, 2026</p>
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">1. Academic Integrity & Services</h4>
              <p>
                BBA Mentors facilitates personalized tuition and academic monitoring. While we implement proven pedagogical assessment cycles, final academic marks depend on student effort, consistent practice, and school examinations.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Session Rescheduling & Safety</h4>
              <p>
                Both parents and mentors are expected to provide reasonable notice for session rescheduling. Home tuition visits must occur in safe, appropriate study areas within the parent's residence.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Assessment Guidelines</h4>
              <p>
                Weekly examinations must be attempted honestly without external unauthorized aids to ensure the algorithmic progress report accurately reflects true student comprehension.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
