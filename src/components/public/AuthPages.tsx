import { useState, type FormEvent } from 'react';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { BIHAR_38_DISTRICTS } from '../../data/biharDistricts.ts';
import { BIHAR_SCHOOL_CLASSES } from '../../data/classes.ts';

interface AuthPageProps {
  onNavigate: (view: string, data?: any) => void;
  onSuccess?: () => void;
}

// 1. PARENT REGISTRATION PAGE
export function ParentRegisterPage({ onNavigate, onSuccess }: AuthPageProps) {
  const { registerParent, isLoading } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    district: 'Patna',
    city: '',
    address: '',
    // Child info
    childName: '',
    classGrade: 'Class 10',
    board: 'CBSE',
    schoolName: '',
    targetSubjects: '',
    weakSubjects: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanMobile = form.mobile.replace(/[\s\-\(\)\+]/g, '');
    const raw10 = cleanMobile.startsWith('91') && cleanMobile.length === 12 ? cleanMobile.slice(2) : cleanMobile;

    if (!/^[6-9]\d{9}$/.test(raw10)) {
      setErrorMsg('Kripya ek maanya 10-digit mobile number darj karein (e.g. 9835012345)');
      return;
    }

    if (!form.password || form.password.length < 6) {
      setErrorMsg('Password kam se kam 6 characters ka hona chahiye (Minimum 6 characters required)');
      return;
    }

    try {
      await registerParent({
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: raw10,
        password: form.password,
        district: form.district,
        city: form.city.trim() || form.district,
        address: form.address.trim(),
        childName: form.childName ? form.childName.trim() : undefined,
        classGrade: form.childName ? form.classGrade : undefined,
        board: form.childName ? form.board : undefined,
        schoolName: form.childName ? form.schoolName.trim() : undefined,
        targetSubjects: form.childName ? form.targetSubjects.split(',').map((s) => s.trim()) : undefined,
        weakSubjects: form.childName ? form.weakSubjects.split(',').map((s) => s.trim()) : undefined,
      });
      if (onSuccess) {
        onSuccess();
      } else {
        onNavigate('parent-dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-left space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Parent Onboarding
          </span>
          <h2 className="text-2xl font-black text-slate-900">Register Your Child</h2>
          <p className="text-xs text-slate-500">
            Set up your parent account and get your child enrolled in the BBA Mentors progress monitoring system.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1">
              Parent Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunil Kumar"
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
                  placeholder="10-digit mobile"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bihar District *</label>
                <select
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                >
                  {BIHAR_38_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>{d.name} ({d.hindiName})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Colony / Locality *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Boring Road"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>
          </div>

          {/* Child Details */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1">
              Child’s Academic Profile
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Child’s Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ankit Kumar"
                  value={form.childName}
                  onChange={(e) => setForm({ ...form, childName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Grade</label>
                <select
                  value={form.classGrade}
                  onChange={(e) => setForm({ ...form, classGrade: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                >
                  {BIHAR_SCHOOL_CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Education Board</label>
                <select
                  value={form.board}
                  onChange={(e) => setForm({ ...form, board: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                >
                  <option value="CBSE">CBSE</option>
                  <option value="BSEB">BSEB (Bihar Board)</option>
                  <option value="ICSE">ICSE</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subjects Needing Attention</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Science"
                  value={form.targetSubjects}
                  onChange={(e) => setForm({ ...form, targetSubjects: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-sm transition shadow"
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration & Open Dashboard'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('parent-login')}
            className="text-blue-900 font-bold hover:underline"
          >
            Login to Parent Portal
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. PARENT LOGIN PAGE
export function ParentLoginPage({ onNavigate, onSuccess }: AuthPageProps) {
  const { login, loginWithGoogle, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      if (onSuccess) {
        onSuccess();
      } else {
        onNavigate('parent-dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Firebase Google Sign-In failed.');
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Kripya apna email aur password darj karein');
      return;
    }
    try {
      await login(cleanEmail, password, 'PARENT');
      if (onSuccess) {
        onSuccess();
      } else {
        onNavigate('parent-dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-left space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Parent Login</h2>
          <p className="text-xs text-slate-500">
            Sign in to check your child's weekly test scores, attendance, and progress report.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              autoComplete="off"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              autoComplete="off"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-sm transition shadow cursor-pointer"
          >
            {isLoading ? 'Signing In...' : 'Login to Parent Portal'}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            या Firebase से जारी रखें
          </span>
          <div className="border-t border-slate-200 w-full"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs text-slate-700 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google (Firebase)</span>
        </button>

        <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
          <p>
            Don’t have an account?{' '}
            <button
              onClick={() => onNavigate('parent-register')}
              className="text-blue-900 font-bold hover:underline"
            >
              Register your child
            </button>
          </p>
          <p>
            Are you a tutor?{' '}
            <button
              onClick={() => onNavigate('mentor-login')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Mentor Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// 3. MENTOR LOGIN PAGE
export function MentorLoginPage({ onNavigate, onSuccess }: AuthPageProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Kripya apna mentor email aur password darj karein');
      return;
    }
    try {
      await login(cleanEmail, password, 'MENTOR');
      if (onSuccess) {
        onSuccess();
      } else {
        onNavigate('mentor-dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-left space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Mentor Login</h2>
          <p className="text-xs text-slate-500">
            Submit daily class reports, mark attendance, and assign homework for your tuition students.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mentor Email</label>
            <input
              type="email"
              required
              autoComplete="off"
              placeholder="Enter your registered mentor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              autoComplete="off"
              placeholder="Enter your mentor password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm transition shadow"
          >
            {isLoading ? 'Signing In...' : 'Login to Mentor Dashboard'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Want to become an educator with BBA Mentors?{' '}
          <button
            onClick={() => onNavigate('become-mentor')}
            className="text-emerald-800 font-bold hover:underline"
          >
            Apply as a Mentor
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. ADMIN LOGIN PAGE (Unobtrusive Footer entry, secure role-based access)
export function AdminLoginPage({ onNavigate, onSuccess }: AuthPageProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Kripya admin email aur password darj karein');
      return;
    }
    try {
      await login(cleanEmail, password, 'ADMIN');
      if (onSuccess) {
        onSuccess();
      } else {
        onNavigate('admin-dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unauthorized admin credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl text-left space-y-6 text-slate-200">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">BBA Mentors Staff Portal</h2>
          <p className="text-xs text-slate-400">
            Restricted administrative system. Sirf authorized admin hi access kar sakte hain.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-900/40 text-red-300 border border-red-800 rounded-lg text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Administrative Email</label>
            <input
              id="admin-email-input"
              type="email"
              required
              placeholder="Enter authorized admin email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Password</label>
            <input
              type="password"
              required
              autoComplete="off"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-sm transition shadow"
          >
            {isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter Admin Panel'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-slate-300 transition"
          >
            ← Return to Public Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
