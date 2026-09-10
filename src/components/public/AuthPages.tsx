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
import { ALL_38_BIHAR_DISTRICTS } from '../../data/biharDistricts.ts';
import { ALL_ACADEMIC_CLASSES } from '../../data/academicClasses.ts';

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
    city: 'Patna',
    address: 'Boring Road',
    // Child info
    childName: '',
    classGrade: 'Class 10',
    board: 'CBSE',
    schoolName: 'St. Michael’s High School, Patna',
    targetSubjects: 'Mathematics, Science',
    weakSubjects: 'Mathematics',
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bihar District ({ALL_38_BIHAR_DISTRICTS.length}) *
                </label>
                <select
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                >
                  {ALL_38_BIHAR_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} {d.hindiName ? `(${d.hindiName})` : ''}
                    </option>
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
                  {ALL_ACADEMIC_CLASSES.map((c) => (
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
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const fillDemo = () => {
    setEmail('rajesh.sharma@example.com');
    setPassword('Parent123!');
    setErrorMsg(null);
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

        {/* Demo Autofill Banner */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
          <span className="text-blue-900 font-medium">Testing as Demo Parent?</span>
          <button
            type="button"
            onClick={fillDemo}
            className="px-2.5 py-1 bg-blue-900 text-white rounded font-bold text-[11px] hover:bg-blue-800"
          >
            Autofill Rajesh Sharma
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. rajesh.sharma@example.com"
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-sm transition shadow"
          >
            {isLoading ? 'Signing In...' : 'Login to Parent Portal'}
          </button>
        </form>

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

  const fillDemo = () => {
    setEmail('amit.kumar@bbamentors.com');
    setPassword('Mentor123!');
    setErrorMsg(null);
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

        {/* Demo Autofill Banner */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
          <span className="text-emerald-900 font-medium">Demo Mentor Account:</span>
          <button
            type="button"
            onClick={fillDemo}
            className="px-2.5 py-1 bg-emerald-700 text-white rounded font-bold text-[11px] hover:bg-emerald-800"
          >
            Autofill Er. Amit Kumar
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mentor Email</label>
            <input
              type="email"
              required
              placeholder="e.g. amit.kumar@bbamentors.com"
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
              placeholder="Enter mentor password"
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

  const fillDemo = () => {
    setEmail('admin@bbamentors.com');
    setPassword('Admin123!');
    setErrorMsg(null);
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
            Restricted administrative system. All activities are authenticated and logged.
          </p>
        </div>

        {/* Demo Autofill Banner */}
        <div className="p-3 bg-slate-700/60 border border-slate-600 rounded-xl flex items-center justify-between text-xs">
          <span className="text-amber-400 font-medium">Evaluation Demo Admin:</span>
          <button
            type="button"
            onClick={fillDemo}
            className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded font-bold text-[11px] hover:bg-amber-400"
          >
            Autofill Admin
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-900/40 text-red-300 border border-red-800 rounded-lg text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Administrative Email</label>
            <input
              type="email"
              required
              placeholder="admin@bbamentors.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Access Token / Password</label>
            <input
              type="password"
              required
              placeholder="Enter staff security key"
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
