import { Link } from "wouter";
import logoUrl from "../assets/logo.png";

const services = [
  {
    title: "Listing Walkthrough Video",
    duration: "30–90 seconds",
    description: "Cinematic property walkthroughs that highlight the flow and feel of a home. Perfect for online listings and social sharing.",
    includes: ["Professional filming", "Colour grading", "Music licensing", "Multiple formats"],
    turnaround: "48–72 hours"
  },
  {
    title: "Social Cuts / Reels Package",
    duration: "15–60 seconds each",
    description: "Vertical video packages optimised for Instagram Reels and TikTok. Includes captions and trending formats.",
    includes: ["3–5 vertical cuts", "Captions included", "Trend-aware editing", "Ready to post"],
    turnaround: "24–48 hours"
  },
  {
    title: "Drone & Aerials",
    duration: "As needed",
    description: "Stunning aerial perspectives that showcase the property's location, surroundings, and scale.",
    includes: ["Licensed drone operator", "4K footage", "Aerial photography", "Location context shots"],
    turnaround: "48–72 hours"
  },
  {
    title: "Agent Piece-to-Camera",
    duration: "30–60 seconds",
    description: "Professional on-camera presentation filmed on location. Build your personal brand with polished agent videos.",
    includes: ["Direction & coaching", "Professional audio", "Multiple takes", "Branded outro"],
    turnaround: "48–72 hours"
  },
  {
    title: "Development & Commercial Films",
    duration: "2–5 minutes",
    description: "Comprehensive video packages for developers, architects, and commercial properties. Multi-location shoots available.",
    includes: ["Pre-production planning", "Multi-day shoots", "Interviews optional", "Full post-production"],
    turnaround: "1–2 weeks"
  }
];

export default function Services() {
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
              <Link href="/services" className="text-white">Services</Link>
              <Link href="/portfolio" className="text-off-white hover:text-white transition-colors">Portfolio</Link>
              <Link href="/about" className="text-off-white hover:text-white transition-colors">About</Link>
              <Link href="/enquire" className="btn-outline">Enquire</Link>
            </div>
            <Link href="/enquire" className="btn-outline md:hidden">Enquire</Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Services</h1>
            <p className="text-soft-grey text-lg max-w-2xl mx-auto">
              Professional video production for the property industry. Fast turnarounds, flexible packages.
            </p>
          </div>

          <div className="space-y-8">
            {services.map((service, index) => (
              <div key={index} className="border border-[var(--hairline)] rounded-lg p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-serif text-2xl mb-1">{service.title}</h2>
                    <p className="text-soft-grey text-sm">{service.duration}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-soft-grey text-sm">Turnaround: {service.turnaround}</span>
                  </div>
                </div>
                
                <p className="text-soft-grey mb-6">{service.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm uppercase tracking-wider mb-3 opacity-60">Includes</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {service.includes.map((item, i) => (
                      <li key={i} className="text-soft-grey text-sm flex items-center gap-2">
                        <span className="text-white">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/enquire" className="btn-outline inline-block">
                  Enquire
                </Link>
              </div>
            ))}
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
