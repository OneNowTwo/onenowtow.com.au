import { Link } from "wouter";
import Nav from "@/components/Nav";
import { SeoHead, localBusinessSchema } from "@/components/SeoHead";
import { SiteFooter, RelatedLinks, PageHeroImage, ImagePair } from "@/components/SiteChrome";
import { photos } from "@/lib/photos";

const deliverables = [
  "Campaign hero videos",
  "Drone and aerial footage",
  "Ground photography",
  "Motion graphics and overlays",
  "Agent-led walkthroughs",
  "Social cutdowns",
  "Pitch deck and campaign page assets",
];

const sectors = [
  "Industrial and warehouse",
  "Office leasing",
  "Hotels and hospitality",
  "Retail and mixed-use",
  "Development and precinct campaigns",
];

export default function CommercialPropertyVideoSydney() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <SeoHead
        title="Commercial Property Video Production Sydney | One Now Two"
        description="Commercial property video production in Sydney for industrial, warehouse, office, hotel and hospitality campaigns. Strategy, filming, drone, editing, motion graphics and social cutdowns."
        path="/commercial-property-video-production-sydney"
        schema={localBusinessSchema}
      />
      <Nav />

      <main className="pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6 text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            Commercial property video production for Sydney property campaigns
          </h1>
          <p className="text-soft-grey text-lg md:text-xl leading-relaxed">
            One Now Two produces cinematic commercial property videos for agents,
            vendors and property sales teams across Sydney and NSW.
          </p>
        </section>

        <PageHeroImage {...photos.sydneyCbdAerial} />

        <section className="max-w-3xl mx-auto px-6 mb-16">
          <p className="text-soft-grey text-lg leading-relaxed mb-6">
            Commercial property campaigns often need to explain more than what an
            asset looks like. The best video work helps buyers, occupiers and
            vendors understand scale, location, access, movement and opportunity
            quickly.
          </p>
          <p className="text-soft-grey text-lg leading-relaxed">
            Stills show what the asset looks like. Video helps people understand
            why it matters.
          </p>
        </section>

        <ImagePair images={[photos.cornerLotAerial, photos.locationOverlay]} />

        <section className="py-16 section-border">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-3xl mb-8 text-center">What we produce</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliverables.map((item) => (
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

        <ImagePair images={[photos.officeFacade, photos.motionGraphicStill]} />

        <section className="py-16 section-border">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-serif text-3xl mb-6">
              Built for commercial property campaigns
            </h2>
            <p className="text-soft-grey text-lg leading-relaxed">
              Our work is designed for property sales teams that need campaign
              assets for listings, pitch decks, information memorandums, EDMs,
              LinkedIn, social media and buyer follow-up.
            </p>
          </div>
        </section>

        <section className="py-16 section-border">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-3xl mb-8 text-center">
              Sectors we work across
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectors.map((item) => (
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
              Have a commercial property campaign coming up?
            </h2>
            <p className="text-soft-grey text-lg mb-8">
              Send through the listing, location or campaign brief and we&apos;ll
              recommend the right mix of video, drone and photography.
            </p>
            <Link href="/enquire" className="btn-primary">
              Enquire
            </Link>
          </div>
        </section>

        <RelatedLinks
          links={[
            {
              href: "/industrial-warehouse-property-video",
              label: "Industrial & Warehouse",
            },
            {
              href: "/commercial-property-photography-drone",
              label: "Photography & Drone",
            },
            {
              href: "/hotel-hospitality-property-video",
              label: "Hotel & Hospitality",
            },
            { href: "/case-studies", label: "Case Studies" },
          ]}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
