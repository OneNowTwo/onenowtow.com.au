import { Link } from "wouter";
import logoUrl from "../assets/logo.png";
import { usePageMeta } from "../hooks/use-page-meta";

export default function BlogCommercialPropertyVideo() {
  usePageMeta(
    "Commercial Property Video Production Sydney — Why Agents Are Making the Switch | One Now Two",
    "Why Sydney's top commercial real estate agents are investing in professional video production for their property listings — and what it's doing for their campaigns."
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
          <p className="text-soft-grey text-sm mb-4 tracking-wider uppercase">One Now Two — March 2026</p>

          <h1 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
            Commercial Property Video Production Sydney: Why Agents Are Making the Switch
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 text-soft-grey leading-relaxed">
            <p>
              There's a version of commercial property marketing that most agents have been doing for years: a set of
              professional stills, a floor plan, a copywritten description, and a listing on realcommercial.com.au.
              It works well enough. But in 2025, it's no longer enough to stand out.
            </p>
            <p>
              Sydney's commercial property market is competitive. Whether it's an industrial asset in Western Sydney,
              an A-grade office in the CBD, or a development site in a growth corridor, the buyers, tenants, and
              investors looking at your listing are sophisticated. They're doing their research online before they
              ever pick up the phone. And increasingly, they expect video.
            </p>

            <h2 className="font-serif text-2xl text-[var(--ink)] mt-10 mb-4">The shift is already happening</h2>
            <p>
              Look at how the top commercial agencies in Sydney — CBRE, JLL, Colliers, Knight Frank, Ray White
              Commercial — are marketing their premium listings. Video is now standard on anything above a certain
              value threshold. The question isn't whether to use video. It's what kind of video, and whether you're
              producing it at a quality that reflects the asset.
            </p>
            <p>
              That's where most agents hit a wall. The options tend to be: an iPhone walkthrough that looks
              amateurish, a generic video production company that doesn't understand commercial property, or a
              specialist operator who knows both the product and the market.
            </p>

            <h2 className="font-serif text-2xl text-[var(--ink)] mt-10 mb-4">What good commercial property video actually does</h2>
            <p>
              A well-produced commercial property video does several things simultaneously. It gives a remote buyer
              or tenant enough visual information to make a decision about inspecting. It communicates the quality
              of the asset in a way that static images can't. It works across every channel in your campaign —
              listing portals, investor IM, email campaigns, LinkedIn, and paid social. And it positions you as an
              agent who markets assets at a professional standard.
            </p>
            <p>
              That last point matters more than people realise. The video you produce for one listing becomes a
              signal to every other owner in your market about how you work.
            </p>

            <h2 className="font-serif text-2xl text-[var(--ink)] mt-10 mb-4">Industrial and logistics is a particular opportunity</h2>
            <p>
              Sydney's industrial property market has been the standout performer in Australian commercial real
              estate for several years running. With vacancy near historic lows and rents rising sharply, industrial
              assets are moving. Agents who are winning industrial mandates are investing in marketing that reflects
              the value of these assets — and video is a core part of that.
            </p>
            <p>
              Aerial footage showing site area, hardstand, and motorway access. Interior footage communicating
              clearance heights and dock configurations. Precinct footage establishing the logistics advantages of
              the location. These are the things a buyer or tenant needs to understand — and video communicates them
              faster and more convincingly than any other format.
            </p>

            <h2 className="font-serif text-2xl text-[var(--ink)] mt-10 mb-4">What to look for in a commercial property video production company</h2>
            <p>
              Not every video production company is set up for commercial property. The ones that are will understand
              the asset classes, know what buyers and tenants are looking for, and produce content that works in a
              B2B marketing context — not a consumer advertising context.
            </p>
            <p>
              Look for: a portfolio that includes commercial, industrial, and development assets (not just
              residential). Experience working to the timelines and workflows of commercial agency campaigns. The
              ability to handle both ground-level and aerial production in-house. And a production standard that
              reflects the quality of the assets you're marketing.
            </p>
            <p>
              One Now Two was built specifically for this market. We work with commercial agents, industrial property
              specialists, and developers across Sydney to produce cinematic video content that moves the needle on
              campaigns.
            </p>
            <p>
              If you have a listing coming up and want to understand what professional video production would look
              like for it — get in touch. We're happy to share examples and talk through what's involved.
            </p>
          </div>

          <div className="mt-12 p-6 border border-[var(--hairline)] rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/portfolio" className="btn-outline">View Portfolio</Link>
              <Link href="/enquire" className="btn-primary">Get in Touch</Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--hairline)]">
            <p className="text-soft-grey text-sm mb-4">Our services:</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/commercial-office-video-sydney" className="text-soft-grey hover:text-white transition-colors">Commercial Office Video</Link>
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
