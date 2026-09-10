import { GraduationCap, MapPin, Phone, Mail, Shield, CheckCircle2, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Bihar Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">BBA MENTORS</span>
                <p className="text-xs text-blue-400 font-semibold tracking-wide uppercase">
                  Learn. Test. Improve.
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              BBA Mentors is a dedicated Bihar-focused home tuition and continuous student progress monitoring platform. We connect school students with verified mentors and track academic growth through structured weekly assessments and transparent parent reports.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Central Academic Office: Boring Canal Road / Bailey Road, Patna, Bihar - 800001</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Parent Counselor Helpline: +91 98000 11122 / 0612-2500001</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Academic Queries: support@bbamentors.com</span>
              </p>
            </div>
          </div>

          {/* Col 2: Programs & Tuition */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white">Tuition & Learning</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home-tuition')} className="hover:text-white transition">
                  Home Tuition (Offline 1-on-1)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('online-tuition')} className="hover:text-white transition">
                  Online Live Mentorship
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('classes')} className="hover:text-white transition">
                  Classes (Class 1 to 12)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('subjects')} className="hover:text-white transition">
                  Subjects (Math, Science & Languages)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('boards')} className="hover:text-white transition">
                  Boards: BSEB, CBSE, ICSE
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition">
                  Learning Cycle (Learn-Test-Improve)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: For Parents & Mentors */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white">For Parents & Mentors</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('find-mentor')} className="hover:text-white transition">
                  Find a Mentor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('parent-register')} className="hover:text-white transition">
                  Register Your Child
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('parent-login')} className="hover:text-white transition">
                  Parent Login & Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('become-mentor')} className="hover:text-white transition">
                  Become a Mentor (Apply)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mentor-login')} className="hover:text-white transition">
                  Mentor Login Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('locations')} className="hover:text-white transition">
                  Bihar Districts & Centers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white">Platform & Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition">
                  About BBA Mentors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition">
                  Contact Academic Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms-conditions')} className="hover:text-white transition">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bihar Coverage Badges */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-200">Active Bihar Districts:</span>
            {['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia', 'Begusarai', 'Bhojpur (Ara)', 'Samastipur', 'Nalanda'].map((d) => (
              <span key={d} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar with Copyright and Unobtrusive Admin Login */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BBA Mentors. All rights reserved. Bihar, India. Tagline: "Learn. Test. Improve."</p>

          <div className="flex items-center gap-4">
            <span className="text-slate-600">|</span>
            {/* Unobtrusive Admin Login Link as explicitly requested */}
            <button
              id="footer-admin-login-btn"
              onClick={() => onNavigate('admin-login')}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition text-[11px]"
              title="Restricted Staff Portal"
            >
              <Lock className="w-3 h-3 text-slate-600" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
