import { Link } from "wouter";
import Nav from "../components/Nav";
import { usePageMeta } from "../hooks/use-page-meta";

export default function DroneAerialVideo() {
  usePageMeta(
    "Drone & Aerial Property Video Sydney | One Now Two",
    "Professional drone and aerial video for commercial property in Sydney. One Now Two provides CASA-certified drone filming for property listings, development sites and marketing campaigns."
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
            Drone &amp; Aerial Property Video Sydney
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 text-soft-grey leading-relaxed">
            <p>
              Aerial footage changes the way a property is understood. From the ground, you see a building. From the
              air, you see a site — its scale, its position, its relationship to roads, infrastructure, and surrounding
              amenity. For commercial property marketing, that context is often the difference between a prospect
              enquiring and scrolling past.
            </p>
            <p>
              One Now Two provides professional drone and aerial filming for commercial property across Sydney. All
              drone operations are conducted under CASA certification, with full public liability insurance and
              appropriate airspace approvals.
            </p>

            <h2 className="font-serif text-2xl text-[var(--ink)] mt-10 mb-4">What aerial footage adds to a commercial property campaign</h2>

            <p>
              For industrial and logistics properties, aerial footage communicates site area, hardstand, truck access,
              and proximity to motorways and freight infrastructure in a single shot. No floor plan or written
              description does this as efficiently.
            </p>
            <p>
              For development sites, aerial footage establishes the site's footprint and its relationship to the
              surrounding urban context — critical for investor and purchaser decision-making.
            </p>
            <p>
              For commercial office buildings, aerial footage captures the building's position within the precinct,
              views from upper floors, and the quality of the surrounding environment.
            </p>
            <p>
              For retail and hospitality assets, aerial footage shows foot traffic patterns, car park capacity, and
              the catchment the property draws from.
            </p>

            <h2 className="font-serif text-2xl text-[var(--ink)] mt-10 mb-4">Our approach</h2>
            <p>
              We don't bolt drone footage on as an add-on. It's integrated into the overall video production from the
              planning stage — so the aerial sequences work in rhythm with ground-level footage and tell a cohesive
              story rather than feeling like separate clips stitched together.
            </p>
            <p>
              Every drone flight is planned around the golden hour where possible — early morning or late afternoon —
              when Sydney's light is at its most cinematic.
            </p>
          </div>

          <div className="mt-12 p-6 border border-[var(--hairline)] rounded-lg">
            <p className="text-soft-grey mb-4">
              Drone filming is available as part of a full production package or as a standalone service. Talk to us about your property.
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
              <Link href="/industrial-warehouse-video-sydney" className="text-soft-grey hover:text-white transition-colors">Industrial &amp; Warehouse Video</Link>
              <Link href="/development-marketing-video-sydney" className="text-soft-grey hover:text-white transition-colors">Development Marketing Video</Link>
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
