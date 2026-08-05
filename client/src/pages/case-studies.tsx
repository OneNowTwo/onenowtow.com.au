import { Link } from "wouter";
import { SeoHead } from "@/components/SeoHead";
import { SiteHeader, SiteFooter, RelatedLinks } from "@/components/SiteChrome";
import { caseStudies } from "@/lib/caseStudies";

export default function CaseStudies() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <SeoHead
        title="Commercial Property Video Case Studies | One Now Two"
        description="Recent commercial property video work by One Now Two across industrial, hospitality, office, retail and commercial real estate campaigns."
        path="/case-studies"
      />
      <SiteHeader active="/case-studies" />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Recent commercial property campaign work
            </h1>
            <p className="text-soft-grey text-lg max-w-2xl mx-auto">
              Selected industrial, hospitality and commercial real estate campaigns
              produced for property sales teams across Sydney and NSW.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="block group border border-[var(--hairline)] rounded-lg overflow-hidden hover:border-white/30 transition-colors"
              >
                <div className="aspect-video bg-[var(--hairline)] relative overflow-hidden">
                  <iframe
                    src={`https://player.vimeo.com/video/${study.vimeoId}?background=1&autoplay=0&loop=1&byline=0&title=0&muted=1`}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ transform: "scale(1.2)" }}
                    frameBorder="0"
                    allow="autoplay"
                    title={`${study.title} commercial property campaign video`}
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-6">
                  <p className="text-soft-grey text-sm mb-2">
                    {study.sector} • {study.location}
                  </p>
                  <h2 className="font-serif text-2xl group-hover:text-white transition-colors">
                    {study.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <RelatedLinks
          links={[
            {
              href: "/commercial-property-video-production-sydney",
              label: "Commercial Property Video",
            },
            {
              href: "/industrial-warehouse-property-video",
              label: "Industrial & Warehouse",
            },
            {
              href: "/hotel-hospitality-property-video",
              label: "Hotel & Hospitality",
            },
            {
              href: "/commercial-property-photography-drone",
              label: "Photography & Drone",
            },
          ]}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
