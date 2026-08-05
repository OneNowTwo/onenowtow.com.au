import { Link } from "wouter";
import { SeoHead } from "@/components/SeoHead";
import { SiteHeader, SiteFooter, RelatedLinks } from "@/components/SiteChrome";

const captureOptions = [
  {
    title: "Ground photography",
    points: [
      "Listing-ready images",
      "Interior/exterior coverage",
      "For IMs, EDMs and socials",
    ],
  },
  {
    title: "Aerial stills",
    points: [
      "Scale and site context",
      "Roads, access and precinct",
      "Optional boundary overlays",
    ],
  },
  {
    title: "Photo + drone",
    points: [
      "Ground and aerial images",
      "Captured in one visit",
      "Fast campaign delivery",
    ],
  },
  {
    title: "Campaign video",
    points: [
      "Half-day or full-day filming options",
      "Drone footage",
      "Motion graphics and overlays",
      "60–90 second hero videos",
      "Social cutdowns available",
    ],
  },
];

export default function CommercialPhotographyDrone() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <SeoHead
        title="Commercial Property Photography & Drone Sydney | One Now Two"
        description="Ground photography, aerial stills, drone footage and video content for commercial property campaigns in Sydney. Package stills, drone and video into one efficient shoot."
        path="/commercial-property-photography-drone"
      />
      <SiteHeader />

      <main className="pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6 text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            Commercial property photography, drone and video captured in one shoot
          </h1>
          <p className="text-soft-grey text-lg md:text-xl leading-relaxed">
            Campaign content for property teams that need ground photography,
            aerial context and video assets captured efficiently.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-6 mb-20">
          <p className="text-soft-grey text-lg leading-relaxed">
            For many campaigns, the easiest way to add video is to package it with
            the photography and drone work already being organised. One Now Two can
            capture ground images, aerial stills, drone footage and video content
            in one streamlined shoot.
          </p>
        </section>

        <section className="py-16 section-border">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-serif text-3xl mb-10 text-center">
              Campaign capture options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {captureOptions.map((option) => (
                <div
                  key={option.title}
                  className="border border-[var(--hairline)] rounded-lg p-6"
                >
                  <h3 className="font-serif text-xl mb-4">{option.title}</h3>
                  <ul className="space-y-2 text-soft-grey">
                    {option.points.map((point) => (
                      <li key={point}>• {point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 section-border">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-serif text-3xl mb-6">Built for campaign quoting</h2>
            <p className="text-soft-grey text-lg leading-relaxed">
              For commercial property teams preparing vendor marketing quotes, One
              Now Two can package photography, drone and video into one efficient
              shoot. Campaign pricing is handled privately by enquiry and proposal.
            </p>
          </div>
        </section>

        <section className="py-20 section-border">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl mb-4">
              Need a package for a campaign quote?
            </h2>
            <p className="text-soft-grey text-lg mb-8">
              Send through the asset, location and campaign requirements and
              we&apos;ll recommend the right capture option.
            </p>
            <Link href="/enquire" className="btn-primary">
              Enquire
            </Link>
          </div>
        </section>

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
            { href: "/case-studies", label: "Case Studies" },
          ]}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
