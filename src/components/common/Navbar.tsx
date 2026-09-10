import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  User,
  Shield,
  BookOpen,
  MapPin,
  Sparkles,
  RotateCcw,
  LogOut,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { NotificationItem } from '../../types/index.ts';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then((res) => setNotifications(res))
        .catch(() => {});
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <button
            id="nav-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-900 text-white flex items-center justify-center font-extrabold shadow-sm group-hover:bg-blue-800 transition">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>BBA MENTORS</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  Bihar
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Learn. Test. Improve.</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-home"
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'home'
                  ? 'text-blue-950 bg-blue-100/80 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              id="nav-how-it-works"
              onClick={() => onNavigate('how-it-works')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'how-it-works'
                  ? 'text-blue-950 bg-blue-100/80 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              How It Works
            </button>
            <button
              id="nav-find-mentor"
              onClick={() => onNavigate('find-mentor')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'find-mentor'
                  ? 'text-blue-950 bg-blue-100/80 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Find a Mentor
            </button>
            <button
              id="nav-home-tuition"
              onClick={() => onNavigate('home-tuition')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'home-tuition'
                  ? 'text-blue-950 bg-blue-100/80 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home Tuition
            </button>
            <button
              id="nav-online-tuition"
              onClick={() => onNavigate('online-tuition')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'online-tuition'
                  ? 'text-blue-950 bg-blue-100/80 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Online Tuition
            </button>
            <button
              id="nav-boards"
              onClick={() => onNavigate('boards')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'boards'
                  ? 'text-blue-950 bg-blue-100/80 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Boards
            </button>
            <button
              id="nav-locations"
              onClick={() => onNavigate('locations')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'locations'
                  ? 'text-blue-950 bg-blue-100/80 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Bihar Locations
            </button>
            <button
              id="nav-become-mentor"
              onClick={() => onNavigate('become-mentor')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'become-mentor'
                  ? 'text-blue-950 bg-blue-100/80 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Become a Mentor
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    id="user-notifications-btn"
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 relative transition"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-800">Notifications</span>
                        <span className="text-[11px] text-slate-500">{unreadCount} unread</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-xs text-slate-400 text-center">No notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className="p-3 hover:bg-slate-50 text-xs">
                              <p className="font-semibold text-slate-800">{n.title}</p>
                              <p className="text-slate-600 mt-0.5">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Role portal button */}
                <button
                  id="user-portal-btn"
                  onClick={() => {
                    if (role === 'PARENT') onNavigate('parent-dashboard');
                    else if (role === 'MENTOR') onNavigate('mentor-dashboard');
                    else if (role === 'ADMIN') onNavigate('admin-dashboard');
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 font-semibold text-sm hover:bg-blue-100 transition"
                >
                  <User className="w-4 h-4 text-blue-700" />
                  <span>{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-blue-600 text-white rounded">
                    {role}
                  </span>
                </button>

                <button
                  id="user-logout-btn"
                  onClick={() => {
                    logout();
                    onNavigate('home');
                  }}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-parent-login-btn"
                  onClick={() => onNavigate('parent-login')}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition ${
                    currentView === 'parent-login' || currentView === 'login-parent'
                      ? 'text-blue-950 bg-blue-100 font-bold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Parent Login
                </button>
                <button
                  id="nav-mentor-login-btn"
                  onClick={() => onNavigate('mentor-login')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition border ${
                    currentView === 'mentor-login' || currentView === 'login-mentor'
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold'
                      : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 border-emerald-200'
                  }`}
                >
                  Mentor Login
                </button>
                <button
                  id="nav-find-mentor-cta-btn"
                  onClick={() => onNavigate('find-mentor')}
                  className={`px-4 py-2.5 text-sm font-bold text-white rounded-xl shadow-xs transition ${
                    currentView === 'find-mentor'
                      ? 'bg-blue-950 ring-2 ring-blue-300'
                      : 'bg-blue-900 hover:bg-blue-800'
                  }`}
                >
                  Find a Mentor
                </button>
                <button
                  id="nav-register-child-cta-btn"
                  onClick={() => onNavigate('parent-register')}
                  className={`px-3.5 py-2.5 text-sm font-bold rounded-xl transition ${
                    currentView === 'parent-register' || currentView === 'register-parent'
                      ? 'bg-amber-500 text-blue-950 ring-2 ring-amber-300 shadow-sm'
                      : 'text-blue-900 bg-amber-400 hover:bg-amber-300'
                  }`}
                >
                  Register Child
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => {
                onNavigate('find-mentor');
                setMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs text-center ${
                currentView === 'find-mentor'
                  ? 'bg-blue-950 text-white ring-2 ring-blue-300'
                  : 'bg-blue-900 text-white'
              }`}
            >
              Find a Mentor
            </button>
            <button
              onClick={() => {
                onNavigate('parent-register');
                setMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs text-center ${
                currentView === 'parent-register' || currentView === 'register-parent'
                  ? 'bg-amber-500 text-blue-950 ring-2 ring-amber-300'
                  : 'bg-amber-400 text-blue-950'
              }`}
            >
              Register Child
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded ${
                currentView === 'home'
                  ? 'text-blue-900 bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('how-it-works');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded ${
                currentView === 'how-it-works'
                  ? 'text-blue-900 bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => {
                onNavigate('find-mentor');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded ${
                currentView === 'find-mentor'
                  ? 'text-blue-900 bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Find a Mentor
            </button>
            <button
              onClick={() => {
                onNavigate('home-tuition');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded ${
                currentView === 'home-tuition'
                  ? 'text-blue-900 bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home Tuition
            </button>
            <button
              onClick={() => {
                onNavigate('online-tuition');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded ${
                currentView === 'online-tuition'
                  ? 'text-blue-900 bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Online Tuition
            </button>
            <button
              onClick={() => {
                onNavigate('boards');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded ${
                currentView === 'boards'
                  ? 'text-blue-900 bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Boards (BSEB, CBSE, ICSE)
            </button>
            <button
              onClick={() => {
                onNavigate('locations');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded ${
                currentView === 'locations'
                  ? 'text-blue-900 bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Bihar Locations
            </button>
            <button
              onClick={() => {
                onNavigate('become-mentor');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded ${
                currentView === 'become-mentor'
                  ? 'text-blue-900 bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Become a Mentor
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    if (role === 'PARENT') onNavigate('parent-dashboard');
                    else if (role === 'MENTOR') onNavigate('mentor-dashboard');
                    else if (role === 'ADMIN') onNavigate('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 bg-blue-50 text-blue-900 rounded-lg font-bold text-xs flex items-center justify-between"
                >
                  <span>Open {role} Dashboard ({user.name})</span>
                  <User className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    onNavigate('home');
                  }}
                  className="w-full py-2 px-3 text-red-600 text-xs font-semibold text-left"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onNavigate('parent-login');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-3 border rounded text-center text-xs font-bold transition ${
                    currentView === 'parent-login' || currentView === 'login-parent'
                      ? 'border-blue-900 bg-blue-50 text-blue-900 font-extrabold'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Parent Login
                </button>
                <button
                  onClick={() => {
                    onNavigate('mentor-login');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-3 border rounded text-center text-xs font-bold transition ${
                    currentView === 'mentor-login' || currentView === 'login-mentor'
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-950 font-extrabold'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Mentor Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
