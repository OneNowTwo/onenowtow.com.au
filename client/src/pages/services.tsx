import { Link } from "wouter";
import logoUrl from "../assets/logo.png";

const packages = [
  {
    name: "Signature Series",
    tagline: "Ultimate production value for prestigious commercial properties",
    duration: "90–120 seconds",
    deliverables: [
      "Main feature (90-120 seconds)",
      "1 x 30-second social media edit",
      "5 x 15-second social media cutdowns"
    ],
    includes: [
      "Comprehensive pre-production consultation and site assessment",
      "Full-day professional filming with dual 4K cinema cameras",
      "Premium aerial drone coverage with multiple flight paths",
      "Professional architectural lighting setup",
      "Advanced stabilisation equipment for smooth motion shots",
      "Dedicated sound recording for ambience",
      "Custom motion graphics and branded elements",
      "Detailed property specifications overlays",
      "Full colour correction and cinematic grade",
      "Professional voice-over narration",
      "Licensed premium background music",
      "Three rounds of revisions"
    ],
    team: "Producer, Director, Cinematographer & Drone Operator"
  },
  {
    name: "Professional Series",
    tagline: "Comprehensive coverage for commercial properties",
    duration: "60–90 seconds",
    deliverables: [
      "Main feature (60-90 seconds)",
      "Social media cut (30 seconds)"
    ],
    includes: [
      "Pre-production consultation",
      "Full-day filming with 4K cinema camera",
      "Standard drone footage package",
      "Professional lighting setup",
      "Property showcase with steady motion shots",
      "Basic motion graphics",
      "Property information overlays",
      "Colour correction and grading",
      "Professional voice-over",
      "Licensed background music",
      "Two rounds of revisions"
    ],
    team: "Cinematographer, Drone Operator & Assistant"
  },
  {
    name: "Essential Series",
    tagline: "Half-day shoot perfect for smaller commercial spaces",
    duration: "60 seconds",
    deliverables: [
      "Single video (60 seconds)"
    ],
    includes: [
      "Brief consultation",
      "Half-day filming with 4K cinema camera",
      "Essential drone footage (up to 2 flight paths)",
      "Basic lighting setup",
      "Essential property coverage",
      "Simple motion graphics",
      "Basic property information overlays",
      "Colour correction",
      "Licensed background music",
      "Two rounds of revisions"
    ],
    team: "Cinematographer, Drone Operator"
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
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Packages</h1>
            <p className="text-soft-grey text-lg max-w-2xl mx-auto">
              Showcase your commercial properties with cinematic precision. We create stunning real estate videos that captivate buyers, tenants, and investors.
            </p>
          </div>

          <div className="space-y-12">
            {packages.map((pkg, index) => (
              <div key={index} className="border border-[var(--hairline)] rounded-lg p-8">
                <div className="mb-6">
                  <h2 className="font-serif text-3xl mb-2">{pkg.name}</h2>
                  <p className="text-soft-grey uppercase text-sm tracking-wider">{pkg.tagline}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-sm uppercase tracking-wider mb-4 opacity-60">Deliverables</h4>
                    <ul className="space-y-2">
                      {pkg.deliverables.map((item, i) => (
                        <li key={i} className="text-soft-grey flex items-start gap-2">
                          <span className="text-white mt-1">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm uppercase tracking-wider mb-4 opacity-60">Production Team</h4>
                    <p className="text-soft-grey">{pkg.team}</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-sm uppercase tracking-wider mb-4 opacity-60">Package Includes</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="text-soft-grey text-sm flex items-start gap-2">
                        <span className="text-white">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/enquire" className="btn-outline inline-block">
                  Enquire About This Package
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 p-8 border border-[var(--hairline)] rounded-lg">
            <h3 className="font-serif text-2xl mb-4">Need something custom?</h3>
            <p className="text-soft-grey mb-6">
              We also offer tailored packages for unique projects. Get in touch to discuss your requirements.
            </p>
            <Link href="/enquire" className="btn-primary">
              Get a Quote
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 section-border text-center text-soft-grey text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} One Now Two — Sydney, Australia</div>
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
