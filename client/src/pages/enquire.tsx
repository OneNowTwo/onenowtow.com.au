
import { useState } from "react";
import logoUrl from "../assets/logo.png";

export default function Enquire() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    weddingDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('phone', formData.phone);
      formDataObj.append('email', formData.email);
      formDataObj.append('wedding_date', formData.weddingDate);
      formDataObj.append('_subject', 'New Wedding Enquiry — One Now Two');

      const response = await fetch('https://formspree.io/f/meorqnnr', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formDataObj
      });

      if (response.ok) {
        window.location.href = `${window.location.origin}/thanks`;
      } else {
        alert('Sorry, something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Sorry, something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                  value={formData.phone}
                  onChange={handleInputChange}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors"
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <label htmlFor="weddingDate" className="block text-sm font-medium mb-2">
                  Wedding Date
                </label>
                <input
                  type="date"
                  id="weddingDate"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors date-input"
                  data-testid="input-wedding-date"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-outline py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-submit-enquiry"
              >
                {isSubmitting ? 'Sending...' : 'Send Enquiry'}
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
