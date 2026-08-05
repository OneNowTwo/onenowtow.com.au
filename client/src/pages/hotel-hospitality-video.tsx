import { Link } from "wouter";
import Nav from "@/components/Nav";
import { SeoHead } from "@/components/SeoHead";
import { SiteFooter, RelatedLinks, PageHeroImage, ImagePair } from "@/components/SiteChrome";
import { hospitalityPhotos } from "@/lib/photos";

const communicateItems = [
  "Heritage and character",
  "Venue atmosphere",
  "Local neighbourhood story",
  "Food, beverage and customer experience",
  "Investor appeal",
  "Repositioning potential",
  "Multi-venue or precinct story",
];

const usefulFor = [
  "Hotel sales campaigns",
  "Pub and venue portfolios",
  "Hospitality precincts",
  "Resort and accommodation assets",
  "Investor communications",
  "Social cutdowns and campaign pages",
];

export default function HotelHospitalityVideo() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <SeoHead
        title="Hotel, Hospitality & Tourism Video Sydney | One Now Two"
        description="Video production for hotels, pubs, hospitality venues and tourism precinct campaigns. Capture heritage, ambience, local story and investor appeal."
        path="/hotel-hospitality-property-video"
      />
      <Nav />

      <main className="pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6 text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            Hotel and hospitality property video that sells the story behind the
            asset
          </h1>
          <p className="text-soft-grey text-lg md:text-xl leading-relaxed">
            Hospitality property campaigns need more than clean visuals. They need
            story, character and atmosphere.
          </p>
        </section>

        <PageHeroImage {...hospitalityPhotos.hero} />

        <section className="max-w-3xl mx-auto px-6 mb-16">
          <p className="text-soft-grey text-lg leading-relaxed mb-6">
            Hospitality property campaigns are not just about floor area and yield.
            The strongest campaigns communicate character, heritage, ambience,
            location and future potential.
          </p>
          <p className="text-soft-grey text-lg leading-relaxed">
            For hospitality and hotel assets, video helps communicate character,
            heritage, ambience, neighbourhood story and investor appeal.
          </p>
        </section>

        <ImagePair images={[hospitalityPhotos.pairA, hospitalityPhotos.pairB]} />

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

        <ImagePair images={[hospitalityPhotos.pairC, hospitalityPhotos.pairD]} />

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
              Bring the asset&apos;s character, history and opportunity into focus
            </h2>
            <p className="text-soft-grey text-lg mb-8">
              Send through the venue, location or campaign brief and we&apos;ll
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
              href: "/case-studies/jll-hotels-social-collective",
              label: "JLL Hotels Case Study",
            },
            { href: "/case-studies", label: "Case Studies" },
          ]}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
