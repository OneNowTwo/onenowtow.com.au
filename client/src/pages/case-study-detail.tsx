import { Link, useRoute } from "wouter";
import Nav from "@/components/Nav";
import { SeoHead, videoObjectSchema } from "@/components/SeoHead";
import { SiteFooter, RelatedLinks } from "@/components/SiteChrome";
import { LazyVimeoPlayer } from "@/components/LazyVimeoPlayer";
import { getCaseStudy } from "@/lib/caseStudies";
import NotFound from "@/pages/not-found";

export default function CaseStudyDetail() {
  const [, params] = useRoute("/case-studies/:slug");
  const study = params?.slug ? getCaseStudy(params.slug) : undefined;

  if (!study) {
    return <NotFound />;
  }

  const displayTitle = study.client
    ? `${study.title} — ${study.client}`
    : study.title;

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <SeoHead
        title={`${displayTitle} | Commercial Property Video Case Study | One Now Two`}
        description={study.metaDescription}
        path={`/case-studies/${study.slug}`}
        schema={videoObjectSchema({
          name: displayTitle,
          description: study.metaDescription,
          vimeoId: study.vimeoId,
        })}
      />
      <Nav />

      <main className="pt-28 md:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-soft-grey text-sm tracking-wider uppercase mb-4">
            Case Study
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mb-3 leading-tight">
            {study.title}
          </h1>
          <p className="text-soft-grey mb-10">
            {study.client ? `${study.client} · ` : ""}
            {study.sector} · {study.location}
          </p>

          <div className="mb-12">
            <LazyVimeoPlayer
              vimeoId={study.vimeoId}
              title={`${study.title} commercial property campaign video`}
            />
          </div>

          <div className="space-y-10 text-lg leading-relaxed">
            <div>
              <h2 className="font-serif text-2xl mb-3">The brief</h2>
              <p className="text-soft-grey">{study.campaignGoal}</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-3">
                What the film needed to communicate
              </h2>
              <p className="text-soft-grey">{study.whatVideoNeeded}</p>
            </div>

            {study.productionApproach && (
              <div>
                <h2 className="font-serif text-2xl mb-3">Production approach</h2>
                <p className="text-soft-grey">{study.productionApproach}</p>
              </div>
            )}

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

          <div className="text-center py-16 border border-[var(--hairline)] rounded-lg mt-12 px-6">
            <h2 className="font-serif text-3xl mb-4">
              Discuss a similar campaign
            </h2>
            <p className="text-soft-grey text-lg mb-8 max-w-xl mx-auto">
              Send through the listing or brief and we&apos;ll recommend the
              right video approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/enquire" className="btn-primary">
                Enquire
              </Link>
              <a href="mailto:hello@onenowtwo.com.au" className="btn-outline">
                Email the team
              </a>
            </div>
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
