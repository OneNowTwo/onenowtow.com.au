
import { useEffect } from "react";
import logoUrl from "../assets/logo.png";

export default function Thanks() {
  useEffect(() => {
    // Fire Google Ads conversion tracking when thanks page loads
    if (window.gtag) {
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
            >
              Home
            </a>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="fade-in">
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Thank you.
            </h1>
            <p className="text-soft-grey text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              We've received your enquiry and will be in touch soon to discuss your wedding day.
            </p>
            <a 
              href="/"
              className="inline-block btn-outline"
            >
              Return Home
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 section-border text-center text-soft-grey text-sm">
        <div className="max-w-7xl mx-auto px-6">
          © {new Date().getFullYear()} One Now Two — Sydney, NSW
        </div>
      </footer>
    </div>
  );
}
