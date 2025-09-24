
import { useEffect } from "react";
import logoUrl from "../assets/logo.png";

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function Thanks() {
  useEffect(() => {
    // Fire Google Ads conversion tracking when thanks page loads
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17589875168'
      });
    }
  }, []);
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 nav-backdrop">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex justify-between items-center py-4">
            <a 
              href="/" 
              className="flex items-center text-off-white no-underline" 
              aria-label="One Now Two"
              data-testid="link-logo"
            >
              <img 
                src={logoUrl} 
                alt="One Now Two Logo" 
                className="h-20 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </a>
            <a 
              href="/" 
              className="btn-outline"
              data-testid="button-home-header"
            >
              Home
            </a>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-4" data-testid="text-thanks-title">
            Thank you for your enquiry
          </h1>
          <p className="text-soft-grey text-lg mb-8" data-testid="text-thanks-description">
            We'll be in touch very soon.
          </p>
          <a 
            href="/"
            className="btn-outline inline-block"
            data-testid="button-return-home"
          >
            Back to Home
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 section-border text-center text-soft-grey text-sm">
        <div className="max-w-7xl mx-auto px-6" data-testid="text-footer-copyright">
          © {new Date().getFullYear()} One Now Two — Sydney, NSW
        </div>
      </footer>
    </div>
  );
}
