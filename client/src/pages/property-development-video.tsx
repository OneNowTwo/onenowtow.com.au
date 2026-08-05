import { Link } from "wouter";
import Nav from "@/components/Nav";
import { SeoHead } from "@/components/SeoHead";
import { SiteFooter, RelatedLinks, PageHeroImage, ImagePair } from "@/components/SiteChrome";
import { developmentPhotos } from "@/lib/photos";

const communicateItems = [
  "Scale and masterplan context",
  "Infrastructure and connectivity",
  "Site progress and construction milestones",
  "Future built form and amenity",
  "Investor and stakeholder clarity",
  "Leasing and sales narrative",
  "Precinct and neighbourhood story",
];

const usefulFor = [
  "Pre-construction and off-the-plan campaigns",
  "Construction progress updates",
  "Practical completion and launch films",
  "Industrial and logistics estates",
  "Mixed-use and retail precincts",
  "Investor communications",
];

export default function PropertyDevelopmentVideo() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <SeoHead
        title="Property Development Video Sydney | One Now Two"
        description="Video for property developments across Sydney. Scale, context, infrastructure, progress and future potential for investors, tenants and sales teams."
        path="/property-development-video"
      />
      <Nav />

      <main className="pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6 text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            Property development video that explains scale, progress and potential
          </h1>
          <p className="text-soft-grey text-lg md:text-xl leading-relaxed">
            Developments need more than stills of a vacant site. Stakeholders need to
            understand what is coming, and why it matters.
          </p>
        </section>

        <PageHeroImage {...developmentPhotos.hero} />

        <section className="max-w-3xl mx-auto px-6 mb-16">
          <p className="text-soft-grey text-lg leading-relaxed mb-6">
            From early marketing through construction to practical completion, video
            helps investors, tenants and sales teams see the opportunity clearly —
            site context, infrastructure, progress and the finished story.
          </p>
          <p className="text-soft-grey text-lg leading-relaxed">
            Stills show a moment. Video shows how the project sits in its precinct,
            how access works, and how the asset will perform when complete.
          </p>
        </section>

        <ImagePair images={[developmentPhotos.pairA, developmentPhotos.pairB]} />

        <section className="py-16 section-border">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-3xl mb-8 text-center">
              What video helps communicate
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communicateItems.map((item) => (
                <div
                  key={item}
                  className="border border-[var(--hairline)] rounded-lg px-5 py-4 text-soft-grey"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <ImagePair images={[developmentPhotos.pairC, developmentPhotos.pairD]} />

        <section className="py-16 section-border">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-3xl mb-8 text-center">Useful for</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usefulFor.map((item) => (
                <div
                  key={item}
                  className="border border-[var(--hairline)] rounded-lg px-5 py-4 text-center text-soft-grey"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 section-border">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl mb-4">
              From site story to completion film
            </h2>
            <p className="text-soft-grey text-lg mb-8">
              Tell us the stage of the project and the audience — investors, tenants
              or the market — and we&apos;ll recommend the right approach.
            </p>
            <Link href="/enquire" className="btn-primary">
              Enquire
            </Link>
          </div>
        </section>

        <RelatedLinks
          links={[
            {
              href: "/development-marketing-video-sydney",
              label: "Development Marketing (detail)",
            },
            {
              href: "/industrial-warehouse-property-video",
              label: "Industrial & Warehouse",
            },
            {
              href: "/case-studies/emu-plains-industrial",
              label: "Emu Plains Case Study",
            },
          ]}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
