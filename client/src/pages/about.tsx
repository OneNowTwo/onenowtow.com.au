import { Link } from "wouter";
import Nav from "../components/Nav";
import { SiteFooter } from "@/components/SiteChrome";
import { SeoHead } from "@/components/SeoHead";
import { industrialPhotos } from "@/lib/photos";

export default function About() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <SeoHead
        title="About | One Now Two"
        description="One Now Two is a Sydney-based production company creating commercial property video, drone and photography for campaigns across Australia."
        path="/about"
      />
      <Nav />

      <main className="pt-28 md:pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-soft-grey text-sm tracking-wider uppercase mb-3">
              About
            </p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              One Now Two
            </h1>
            <p className="text-soft-grey text-lg leading-relaxed">
              A Sydney-based production company focused on commercial property
              campaign content.
            </p>
          </div>

          <div className="mb-12 aspect-[16/9] overflow-hidden rounded-lg bg-[var(--surface)]">
            <img
              src={industrialPhotos.pairD.src}
              alt="Behind the scenes on an industrial warehouse video production"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-soft-grey mb-14">
            <p>
              One Now Two produces video, drone, photography and social cutdowns
              for commercial property campaigns — industrial and logistics, retail,
              hotels and hospitality, tourism and developments.
            </p>
            <p>
              Based in Sydney, we work with agents, vendors and property sales
              teams across NSW and Australia-wide. The focus is practical campaign
              content: clear enough for buyers and occupiers, strong enough for
              the listing, the deck and the social cut.
            </p>
            <p>
              The team brings more than 15 years of video production experience —
              including TVCs, brand films and commercial work for agencies — to
              commercial property campaigns.
            </p>
          </div>

          <section className="border-t border-b border-[var(--hairline)] py-10 mb-14">
            <h2 className="font-serif text-2xl mb-6">How a project usually runs</h2>
            <ol className="space-y-6 text-soft-grey">
              <li>
                <h3 className="font-serif text-xl text-[var(--ink)] mb-2">
                  1. Brief and planning
                </h3>
                <p className="leading-relaxed">
                  We start with the asset, the audience and where the content needs
                  to land. That shapes shot lists, access requirements and whether
                  drone, ground coverage or motion graphics are required.
                </p>
              </li>
              <li>
                <h3 className="font-serif text-xl text-[var(--ink)] mb-2">
                  2. Shoot
                </h3>
                <p className="leading-relaxed">
                  On site, the goal is to show how the property works — scale,
                  access, atmosphere and context — not just a set of stills in
                  motion.
                </p>
              </li>
              <li>
                <h3 className="font-serif text-xl text-[var(--ink)] mb-2">
                  3. Edit and delivery
                </h3>
                <p className="leading-relaxed">
                  You receive campaign-ready files for the channels you need —
                  hero film, cutdowns and stills organised for handover.
                </p>
              </li>
            </ol>
          </section>

          <section className="mb-14">
            <h2 className="font-serif text-2xl mb-4">Sectors</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-soft-grey">
              <li>• Industrial & Logistics</li>
              <li>• Retail & Shopping Precincts</li>
              <li>• Hotels, Hospitality & Tourism</li>
              <li>• Property Developments</li>
            </ul>
          </section>

          <div className="text-center border border-[var(--hairline)] rounded-lg p-8">
            <h2 className="font-serif text-2xl mb-3">Discuss a project</h2>
            <p className="text-soft-grey mb-6">
              Send a brief through the enquiry form, or email the team directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
              <Link href="/enquire" className="btn-primary">
                Enquire
              </Link>
              <a href="mailto:hello@onenowtwo.com.au" className="btn-outline">
                hello@onenowtwo.com.au
              </a>
            </div>
            <p className="text-soft-grey text-sm">
              Phone:{" "}
              <a
                href="tel:+61449783720"
                className="text-[var(--navy)] underline-offset-2 hover:underline"
              >
                0449 783 720
              </a>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
