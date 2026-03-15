import { Link } from "wouter";
import Nav from "../components/Nav";
import { usePageMeta } from "../hooks/use-page-meta";

export default function CommercialOfficeVideo() {
  usePageMeta(
    "Commercial Office Video Production Sydney | One Now Two",
    "Cinematic video production for commercial office buildings in Sydney. One Now Two helps agents and developers market office assets with high-quality property videos that attract tenants and investors."
  );

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-soft-grey hover:text-white transition-colors text-sm no-underline">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
            Commercial Office Video Production Sydney
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 text-soft-grey leading-relaxed">
            <p>
              When a commercial office building hits the market, first impressions matter. In a competitive Sydney leasing
              and sales environment, agents and developers need marketing content that communicates quality before a
              prospective tenant or buyer ever sets foot in the building.
            </p>
            <p>
              One Now Two produces cinematic video content for commercial office buildings across Sydney — from boutique
              strata suites in the inner suburbs to A-grade towers in the CBD and North Sydney.
            </p>
            <p>
              Our office property videos are built to work across every channel your campaign runs on: listing portals
              like realcommercial.com.au and commercialrealestate.com.au, investor information memorandums, email
              campaigns, LinkedIn, and paid social.
            </p>

            <h2 className="font-serif text-2xl text-[var(--ink)] mt-10 mb-4">What we film:</h2>
            <ul className="space-y-2 list-none pl-0">
              {[
                "Building exteriors and architectural detail",
                "Lobby, reception, and common areas",
                "Typical floor plates and fitout options",
                "End-of-trip facilities, car parking, and building services",
                "Views and aspect",
                "Surrounding precinct and amenity",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-soft-grey mt-1">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p>
              Every video is edited to a cinematic standard — not a quick walkthrough with shaky handheld footage. We
              use professional cinema cameras, stabilised movement, and colour grading that reflects the quality of the
              asset.
            </p>
            <p>
              If you're an agent or developer with a commercial office listing in Sydney, we'd be glad to show you what
              we've produced for similar assets.
            </p>
          </div>

          <div className="mt-12 p-6 border border-[var(--hairline)] rounded-lg">
            <p className="text-soft-grey mb-4">
              View our portfolio or get in touch to discuss your listing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/portfolio" className="btn-outline">View Portfolio</Link>
              <Link href="/enquire" className="btn-primary">Get a Quote</Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--hairline)]">
            <p className="text-soft-grey text-sm mb-4">Other services:</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/industrial-warehouse-video-sydney" className="text-soft-grey hover:text-white transition-colors">Industrial &amp; Warehouse Video</Link>
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
