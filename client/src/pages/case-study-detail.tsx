import { Link, useRoute } from "wouter";
import Nav from "@/components/Nav";
import { SeoHead, videoObjectSchema } from "@/components/SeoHead";
import { SiteFooter, RelatedLinks } from "@/components/SiteChrome";
import { getCaseStudy } from "@/lib/caseStudies";
import NotFound from "@/pages/not-found";

export default function CaseStudyDetail() {
  const [, params] = useRoute("/case-studies/:slug");
  const study = params?.slug ? getCaseStudy(params.slug) : undefined;

  if (!study) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <SeoHead
        title={`${study.title} | Commercial Property Video Case Study | One Now Two`}
        description={study.metaDescription}
        path={`/case-studies/${study.slug}`}
        schema={videoObjectSchema({
          name: study.title,
          description: study.metaDescription,
          vimeoId: study.vimeoId,
        })}
      />
      <Nav />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-soft-grey text-sm tracking-wider uppercase mb-4">
            Case Study
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">{study.title}</h1>
          <p className="text-soft-grey mb-10">
            {study.sector} • {study.location}
          </p>

          <div className="aspect-video bg-[var(--hairline)] rounded-lg overflow-hidden mb-12 relative">
            <iframe
              src={`https://player.vimeo.com/video/${study.vimeoId}?title=0&byline=0&portrait=0`}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={`${study.title} commercial property campaign video`}
            />
          </div>

          <div className="space-y-10 text-lg leading-relaxed">
            <div>
              <h2 className="font-serif text-2xl mb-3">Campaign goal</h2>
              <p className="text-soft-grey">{study.campaignGoal}</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-3">
                What the video needed to explain
              </h2>
              <p className="text-soft-grey">{study.whatVideoNeeded}</p>
            </div>

            <div>
              <p className="text-soft-grey">{study.body}</p>
            </div>

            <div className="border-t border-b border-[var(--hairline)] py-8">
              <h2 className="font-serif text-2xl mb-4">Deliverables</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-soft-grey">
                {study.deliverables.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center py-16">
            <h2 className="font-serif text-3xl mb-4">
              Planning a commercial property campaign?
            </h2>
            <p className="text-soft-grey text-lg mb-8">
              Send through the listing or brief and we&apos;ll recommend the right
              video approach.
            </p>
            <Link href="/enquire" className="btn-primary">
              Enquire
            </Link>
          </div>
        </div>

        <RelatedLinks
          links={[
            {
              href: study.relatedServiceHref,
              label: study.relatedServiceLabel,
            },
            { href: "/case-studies", label: "All Case Studies" },
            {
              href: "/commercial-property-video-production-sydney",
              label: "Commercial Property Video",
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
