
import logoUrl from "../assets/logo.png";

export default function Enquire() {

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
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl mb-4" data-testid="text-enquire-title">
              Tell us about your day
            </h1>
            <p className="text-soft-grey text-lg" data-testid="text-enquire-description">
              We'd love to hear about your wedding plans and see if we're the right fit to capture your story.
            </p>
          </div>

          <div className="bg-[var(--bg)] border border-[var(--hairline)] rounded-lg p-8">
            <form action="https://formspree.io/f/meorqnnr" method="POST" className="space-y-6">
              <input type="hidden" name="_redirect" value="https://onenowtwo-58bea5.replit.app/thanks" />
              <input type="hidden" name="_subject" value="New Wedding Enquiry — One Now Two" />
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors"
                  data-testid="input-name"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  required
                  className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors"
                  data-testid="input-phone"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your email address"
                  required
                  className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors"
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <label htmlFor="wedding_date" className="block text-sm font-medium mb-2">
                  Wedding Date
                </label>
                <input
                  type="date"
                  id="wedding_date"
                  name="wedding_date"
                  required
                  className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors date-input"
                  data-testid="input-wedding-date"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-outline py-4 text-lg"
                data-testid="button-submit-enquiry"
              >
                Send Enquiry
              </button>
            </form>
          </div>
          
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
