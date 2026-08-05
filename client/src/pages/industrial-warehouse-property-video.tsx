import { Link } from "wouter";
import Nav from "@/components/Nav";
import { SeoHead } from "@/components/SeoHead";
import { SiteFooter, RelatedLinks, PageHeroImage, ImagePair } from "@/components/SiteChrome";
import { industrialPhotos } from "@/lib/photos";

const explainItems = [
  "Scale and layout",
  "Truck access and movement",
  "Hardstand and loading",
  "Internal clearance",
  "Office-to-warehouse connection",
  "Power and infrastructure",
  "Motorway access",
  "Surrounding precinct context",
];

export default function IndustrialWarehousePropertyVideo() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <SeoHead
        title="Industrial & Warehouse Property Video Sydney | One Now Two"
        description="Industrial and warehouse property video production for Sydney commercial real estate campaigns. Show scale, truck access, loading, hardstand, clearance and connectivity."
        path="/industrial-warehouse-property-video"
      />
      <Nav />

      <main className="pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6 text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            Industrial and warehouse property video that explains how the asset
            works
          </h1>
          <p className="text-soft-grey text-lg md:text-xl leading-relaxed">
            Industrial property is practical. The marketing should be too.
          </p>
        </section>

        <PageHeroImage {...industrialPhotos.hero} />

        <section className="max-w-3xl mx-auto px-6 mb-16">
          <p className="text-soft-grey text-lg leading-relaxed mb-6">
            For warehouses, logistics facilities and industrial land, video helps
            clarify the details that stills often struggle to explain.
          </p>
          <p className="text-soft-grey text-lg leading-relaxed">
            Video helps explain scale, access, movement, location and opportunity
            — including truck access, hardstand, loading, clearance, power, layout
            and motorway connectivity.
          </p>
        </section>

        <ImagePair images={[industrialPhotos.pairA, industrialPhotos.pairB]} />

        <section className="py-16 section-border">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-3xl mb-8 text-center">
              What video helps explain
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {explainItems.map((item) => (
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

        <ImagePair images={[industrialPhotos.pairC, industrialPhotos.pairD]} />

        <section className="py-16 section-border">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-serif text-3xl mb-6">Why it matters</h2>
            <p className="text-soft-grey text-lg leading-relaxed mb-6">
              Industrial buyers and occupiers are often trying to understand how a
              site functions. Video can show movement, access, layout and
              surrounding infrastructure in a way that still photography cannot
              always communicate clearly.
            </p>
            <p className="text-soft-grey text-lg leading-relaxed">
              One Now Two has produced commercial property campaign content with
              industrial and logistics teams across Western Sydney.
            </p>
          </div>
        </section>

        <section className="py-20 section-border">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl mb-4">
              Planning an industrial campaign?
            </h2>
            <p className="text-soft-grey text-lg mb-8">
              Send us the listing or campaign brief and we&apos;ll recommend the
              right level of video, drone and photography.
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
              href: "/commercial-property-photography-drone",
              label: "Photography & Drone",
            },
            { href: "/case-studies", label: "Case Studies" },
            {
              href: "/case-studies/198-power-street-glendenning",
              label: "198 Power Street Case Study",
            },
          ]}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
