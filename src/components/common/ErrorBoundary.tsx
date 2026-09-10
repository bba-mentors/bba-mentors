import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, Phone, MessageCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[BBA Mentors Uncaught UI Error]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    try {
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-slate-900">
                Kuch Samasya Aayi Hai / Something Went Wrong
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aapka data bilkul surakshit hai. Kripya page reload karein ya mukhya prishth (Home) par jayein.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                id="error-reload-btn"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Page Reload Karein</span>
              </button>
              <button
                id="error-home-btn"
                onClick={this.handleGoHome}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 border border-slate-300"
              >
                <Home className="w-4 h-4" />
                <span>Home Par Jayein</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-[11px] text-slate-500 font-medium">Turant Sahayata Ke Liye / Need Immediate Help:</p>
              <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                <a
                  href="tel:+919800011122"
                  className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 98000 11122</span>
                </a>
                <span className="text-slate-300">|</span>
                <a
                  href="https://wa.me/919800011122?text=Namaste%20BBA%20Mentors%20Team%2C%20mujhe%20website%20par%20sahayata%20chahiye"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
