import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';

// Public Pages
import { HomePage } from './components/public/HomePage.tsx';
import { FindMentorPage } from './components/public/FindMentorPage.tsx';
import { HowItWorksPage } from './components/public/HowItWorksPage.tsx';
import { HomeTuitionPage } from './components/public/HomeTuitionPage.tsx';
import { OnlineTuitionPage } from './components/public/OnlineTuitionPage.tsx';
import { ClassesBoardsLocationsPage } from './components/public/ClassesBoardsLocationsPage.tsx';
import { BecomeMentorPage } from './components/public/BecomeMentorPage.tsx';
import { AboutContactFaqPage } from './components/public/AboutContactFaqPage.tsx';
import {
  ParentRegisterPage,
  ParentLoginPage,
  MentorLoginPage,
  AdminLoginPage,
} from './components/public/AuthPages.tsx';

// Protected Dashboards
import { ParentDashboard } from './components/parent/ParentDashboard.tsx';
import { MentorDashboard } from './components/mentor/MentorDashboard.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';

function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [navigationData, setNavigationData] = useState<any>(null);

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: string, data?: any) => {
    setCurrentView(view);
    if (data !== undefined) {
      setNavigationData(data);
    }
  };

  // Helper for rendering current view with role protection
  const renderContent = () => {
    switch (currentView) {
      // 1. Core Public Views
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;

      case 'find-mentor':
        return <FindMentorPage onNavigate={handleNavigate} initialFilter={navigationData} />;

      case 'how-it-works':
        return <HowItWorksPage onNavigate={handleNavigate} />;

      case 'home-tuition':
        return <HomeTuitionPage onNavigate={handleNavigate} />;

      case 'online-tuition':
        return <OnlineTuitionPage onNavigate={handleNavigate} />;

      case 'curriculum':
      case 'classes':
      case 'subjects':
      case 'boards':
      case 'locations':
        return (
          <ClassesBoardsLocationsPage
            initialTab={
              currentView === 'boards'
                ? 'boards'
                : currentView === 'locations'
                ? 'locations'
                : currentView === 'subjects'
                ? 'subjects'
                : currentView === 'classes'
                ? 'classes'
                : navigationData?.tab || 'classes'
            }
            onNavigate={handleNavigate}
          />
        );

      case 'become-mentor':
        return <BecomeMentorPage onNavigate={handleNavigate} />;

      case 'about':
        return <AboutContactFaqPage viewType="about" onNavigate={handleNavigate} />;

      case 'contact':
        return <AboutContactFaqPage viewType="contact" onNavigate={handleNavigate} />;

      case 'faq':
        return <AboutContactFaqPage viewType="faq" onNavigate={handleNavigate} />;

      case 'privacy':
      case 'privacy-policy':
        return <AboutContactFaqPage viewType="privacy" onNavigate={handleNavigate} />;

      case 'terms':
      case 'terms-conditions':
        return <AboutContactFaqPage viewType="terms" onNavigate={handleNavigate} />;

      // 2. Authentication Views (supporting both naming styles so all buttons work)
      case 'login-parent':
      case 'parent-login':
        return (
          <ParentLoginPage
            onNavigate={handleNavigate}
            onSuccess={() => handleNavigate('parent-dashboard')}
          />
        );

      case 'register-parent':
      case 'parent-register':
        return (
          <ParentRegisterPage
            onNavigate={handleNavigate}
            onSuccess={() => handleNavigate('parent-dashboard')}
          />
        );

      case 'login-mentor':
      case 'mentor-login':
        return (
          <MentorLoginPage
            onNavigate={handleNavigate}
            onSuccess={() => handleNavigate('mentor-dashboard')}
          />
        );

      case 'login-admin':
      case 'admin-login':
        return (
          <AdminLoginPage
            onNavigate={handleNavigate}
            onSuccess={() => handleNavigate('admin-dashboard')}
          />
        );

      // 3. Portals / Dashboards (Protected)
      case 'parent-dashboard':
        if (!isAuthenticated || user?.role !== 'PARENT') {
          return (
            <ParentLoginPage
              onNavigate={handleNavigate}
              onSuccess={() => handleNavigate('parent-dashboard')}
            />
          );
        }
        return <ParentDashboard onNavigate={handleNavigate} />;

      case 'mentor-dashboard':
        if (!isAuthenticated || user?.role !== 'MENTOR') {
          return (
            <MentorLoginPage
              onNavigate={handleNavigate}
              onSuccess={() => handleNavigate('mentor-dashboard')}
            />
          );
        }
        return <MentorDashboard onNavigate={handleNavigate} />;

      case 'admin-dashboard':
        if (!isAuthenticated || user?.role !== 'ADMIN') {
          return (
            <AdminLoginPage
              onNavigate={handleNavigate}
              onSuccess={() => handleNavigate('admin-dashboard')}
            />
          );
        }
        return <AdminDashboard onNavigate={handleNavigate} />;

      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-200 selection:text-slate-900 font-sans">
      {/* Universal Navigation Bar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 w-full">{renderContent()}</main>

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
