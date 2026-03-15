import { Link } from "wouter";
import Nav from "../components/Nav";
import { usePageMeta } from "../hooks/use-page-meta";

export default function DevelopmentMarketingVideo() {
  usePageMeta(
    "Development Marketing Video Production Sydney | One Now Two",
    "Video production for property developers in Sydney. One Now Two creates cinematic development marketing videos for commercial, mixed-use and industrial development projects."
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
            Development Marketing Video Production Sydney
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 text-soft-grey leading-relaxed">
            <p>
              A development project lives or dies on the quality of its marketing. Before a single slab is poured,
              developers need to sell the vision — to investors, to anchor tenants, to finance partners, and to the
              market. Video is the most powerful tool in that kit.
            </p>
            <p>
              One Now Two produces development marketing videos for commercial property developers across Sydney. We
              work with developers from project launch through to practical completion — creating content that evolves
              with the project at every stage.
            </p>

            <h2 className="font-serif text-2xl text-[var(--ink)] mt-10 mb-4">Pre-construction and off-the-plan</h2>
            <p>
              Before construction begins, we work with renders, CGIs, and site footage to produce a compelling video
              narrative that communicates the project's vision. We direct the piece as a film, not a slideshow of
              stills — adding movement, pacing, narration, and music that positions the development for its target
              audience.
            </p>

            <h2 className="font-serif text-2xl text-[var(--ink)] mt-10 mb-4">Under construction</h2>
            <p>
              Progress videos keep investors informed and the market engaged. We return to site at key construction
              milestones to document the build and produce content for your investor updates, LinkedIn, and project
              website.
            </p>

            <h2 className="font-serif text-2xl text-[var(--ink)] mt-10 mb-4">Practical completion</h2>
            <p>
              When the building is finished, we produce the flagship property film — a cinematic piece that captures
              the architecture, the fitout quality, the amenity, and the location story. This becomes the centrepiece
              of your leasing or sales campaign.
            </p>

            <p>
              We've worked across commercial office, industrial, mixed-use, retail, and hospitality development
              projects. If you have a development in Sydney that needs cinematic video content at any stage, we'd
              welcome a conversation.
            </p>
          </div>

          <div className="mt-12 p-6 border border-[var(--hairline)] rounded-lg">
            <p className="text-soft-grey mb-4">
              Get in touch to discuss your development project. We work with developers across Greater Sydney.
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
