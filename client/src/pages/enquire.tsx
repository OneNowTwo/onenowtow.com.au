import { useState } from "react";
import { Link } from "wouter";
import logoUrl from "../assets/logo.png";

export default function Enquire() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyAddress: '',
    clientType: '',
    serviceType: '',
    preferredDate: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      formDataObj.append('property_address', formData.propertyAddress);
      formDataObj.append('client_type', formData.clientType);
      formDataObj.append('service_type', formData.serviceType);
      formDataObj.append('preferred_date', formData.preferredDate);
      formDataObj.append('message', formData.message);
      formDataObj.append('_subject', 'New Property Video Enquiry — One Now Two');

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
      <header className="fixed top-0 left-0 right-0 z-30 nav-backdrop">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex justify-between items-center py-4">
            <Link 
              href="/" 
              className="flex items-center text-off-white no-underline" 
              aria-label="One Now Two"
            >
              <img 
                src={logoUrl} 
                alt="One Now Two Logo" 
                className="h-16 md:h-20 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/services" className="text-off-white hover:text-white transition-colors">Services</Link>
              <Link href="/portfolio" className="text-off-white hover:text-white transition-colors">Portfolio</Link>
              <Link href="/about" className="text-off-white hover:text-white transition-colors">About</Link>
              <Link href="/" className="btn-outline">Home</Link>
            </div>
            <Link href="/" className="btn-outline md:hidden">Home</Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Get a Quote
            </h1>
            <p className="text-soft-grey text-lg">
              Tell us about your property and what you need. We'll get back to you within 24 hours.
            </p>
          </div>

          <div className="bg-[var(--bg)] border border-[var(--hairline)] rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
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
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone *
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
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
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
                />
              </div>

              <div>
                <label htmlFor="propertyAddress" className="block text-sm font-medium mb-2">
                  Property Address / Suburb
                </label>
                <input
                  type="text"
                  id="propertyAddress"
                  name="propertyAddress"
                  placeholder="e.g. 123 Main St, Surry Hills"
                  value={formData.propertyAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="clientType" className="block text-sm font-medium mb-2">
                    I am a...
                  </label>
                  <select
                    id="clientType"
                    name="clientType"
                    value={formData.clientType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--light-accent)] rounded-lg text-[var(--ink)] focus:outline-none focus:border-white/50 transition-colors"
                  >
                    <option value="">Select...</option>
                    <option value="agent">Real Estate Agent</option>
                    <option value="vendor">Vendor / Homeowner</option>
                    <option value="developer">Developer</option>
                    <option value="architect">Architect / Designer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium mb-2">
                    What do you need?
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--light-accent)] rounded-lg text-[var(--ink)] focus:outline-none focus:border-white/50 transition-colors"
                  >
                    <option value="">Select...</option>
                    <option value="walkthrough">Listing Walkthrough</option>
                    <option value="reels">Social Cuts / Reels</option>
                    <option value="drone">Drone / Aerials</option>
                    <option value="agent-video">Agent Piece-to-Camera</option>
                    <option value="commercial">Commercial / Development Film</option>
                    <option value="other">Other / Multiple</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium mb-2">
                  Preferred Shoot Date
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors date-input"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us more about the property or project..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Enquiry'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-8 section-border text-center text-soft-grey text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} One Now Two — Sydney, NSW</div>
          <div className="flex gap-6">
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/enquire" className="hover:text-white transition-colors">Enquire</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
