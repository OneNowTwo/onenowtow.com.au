import { Link } from "wouter";
import Nav from "@/components/Nav";
import { SeoHead } from "@/components/SeoHead";
import { SiteFooter, RelatedLinks, PageHeroImage, ImagePair } from "@/components/SiteChrome";
import { photos } from "@/lib/photos";

const communicateItems = [
  "Location and catchment",
  "Tenant mix and street activation",
  "Foot traffic and trade area",
  "Access, parking and arrival",
  "Public realm and precinct amenity",
  "Future upside and repositioning",
  "Mixed-use and lifestyle offer",
];

const usefulFor = [
  "Shopping centre leasing campaigns",
  "Retail precinct sales",
  "Mixed-use developments",
  "High-street and strip retail",
  "Investor and stakeholder updates",
  "Campaign pages and social cutdowns",
];

export default function RetailShoppingPrecinctVideo() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <SeoHead
        title="Retail & Shopping Centre Video Sydney | One Now Two"
        description="Video for retail centres, shopping precincts and mixed-use campaigns. Show location, tenant mix, foot traffic, trade area and future upside."
        path="/retail-shopping-precinct-video"
      />
      <Nav />

      <main className="pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6 text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            Retail and shopping precinct video that shows why the location works
          </h1>
          <p className="text-soft-grey text-lg md:text-xl leading-relaxed">
            Retail campaigns need more than shopfront stills. Buyers and tenants need
            to understand catchment, activation and upside.
          </p>
        </section>

        <PageHeroImage {...photos.streetscape} />

        <section className="max-w-3xl mx-auto px-6 mb-16">
          <p className="text-soft-grey text-lg leading-relaxed mb-6">
            Shopping centres, high streets and mixed-use precincts sell on location,
            tenant mix, foot traffic and future potential — not floorplates alone.
          </p>
          <p className="text-soft-grey text-lg leading-relaxed">
            Video helps people understand the trade area, how customers arrive, how
            the public realm feels, and where the upside sits for owners and
            occupiers.
          </p>
        </section>

        <ImagePair images={[photos.precinctAerial, photos.sydneyCbdAerial]} />

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

        <ImagePair images={[photos.groundListing, photos.interiorCommercial]} />

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
              Show the catchment, the mix and the opportunity
            </h2>
            <p className="text-soft-grey text-lg mb-8">
              Send through the centre, precinct or campaign brief and we&apos;ll
              recommend the right video approach.
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
              href: "/property-development-video",
              label: "Property Developments",
            },
            { href: "/case-studies", label: "Case Studies" },
          ]}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
