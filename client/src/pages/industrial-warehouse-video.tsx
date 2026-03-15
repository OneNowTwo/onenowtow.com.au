import { Link } from "wouter";
import logoUrl from "../assets/logo.png";
import { usePageMeta } from "../hooks/use-page-meta";

export default function IndustrialWarehouseVideo() {
  usePageMeta(
    "Industrial & Warehouse Video Production Sydney | One Now Two",
    "Video production for industrial properties, warehouses and logistics facilities across Sydney. One Now Two helps commercial agents showcase industrial assets with cinematic property videos."
  );

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <header className="fixed top-0 left-0 right-0 z-30 nav-backdrop">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center text-off-white no-underline" aria-label="One Now Two">
              <img src={logoUrl} alt="One Now Two Logo" className="h-16 md:h-20 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/services" className="text-off-white hover:text-white transition-colors">Services</Link>
              <Link href="/portfolio" className="text-off-white hover:text-white transition-colors">Portfolio</Link>
              <Link href="/about" className="text-off-white hover:text-white transition-colors">About</Link>
              <Link href="/enquire" className="btn-outline">Enquire</Link>
            </div>
            <Link href="/enquire" className="btn-outline md:hidden">Enquire</Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
            Industrial &amp; Warehouse Video Production Sydney
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 text-soft-grey leading-relaxed">
            <p>
              Sydney's industrial and logistics property market is one of the most active in the country. With vacancy
              rates at historic lows and demand from e-commerce and supply chain operators at an all-time high,
              industrial assets are moving fast — and the agents marketing them need content that matches the quality
              of the deals they're doing.
            </p>
            <p>
              One Now Two produces cinematic video content for industrial and warehouse properties across Greater Sydney
              — Western Sydney, South West Sydney, the Inner West, and outer metro corridors including Badgerys Creek
              and the Aerotropolis precinct.
            </p>
            <p>
              We work with commercial agents, industrial property specialists, and development managers to produce video
              content that communicates the full story of an industrial asset: its scale, functionality, location, and
              investment credentials.
            </p>

            <h2 className="font-serif text-2xl text-[var(--ink)] mt-10 mb-4">What we film:</h2>
            <ul className="space-y-2 list-none pl-0">
              {[
                "External building facades, hardstand areas, and site boundaries",
                "Internal warehouse floor space, clearance heights, and column spacing",
                "Loading docks, container height roller doors, and truck access",
                "Office and amenity areas",
                "Yard and truck marshalling areas",
                "Surrounding road infrastructure and logistics connectivity",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-soft-grey mt-1">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p>
              Industrial property buyers and tenants are sophisticated. They're looking at specifications, not just
              aesthetics. Our videos present the full picture — compelling enough to generate enquiry, detailed enough
              to pre-qualify prospects.
            </p>
            <p>
              Whether it's a 2,000sqm strata unit in Wetherill Park or a 50,000sqm prime logistics facility in
              Moorebank, we know how to film it properly.
            </p>
          </div>

          <div className="mt-12 p-6 border border-[var(--hairline)] rounded-lg">
            <p className="text-soft-grey mb-4">
              Talk to us about your industrial listing. We're fast to mobilise and familiar with Sydney's key industrial precincts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/portfolio" className="btn-outline">View Portfolio</Link>
              <Link href="/enquire" className="btn-primary">Get a Quote</Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--hairline)]">
            <p className="text-soft-grey text-sm mb-4">Other services:</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/commercial-office-video-sydney" className="text-soft-grey hover:text-white transition-colors">Commercial Office Video</Link>
              <Link href="/development-marketing-video-sydney" className="text-soft-grey hover:text-white transition-colors">Development Marketing Video</Link>
              <Link href="/drone-aerial-property-video-sydney" className="text-soft-grey hover:text-white transition-colors">Drone &amp; Aerial Filming</Link>
            </div>
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
