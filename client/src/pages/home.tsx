import { useEffect, useState } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";
import { SiteFooter } from "@/components/SiteChrome";
import { VimeoThumbnail } from "@/components/VimeoThumbnail";
import {
  industrialPhotos,
  retailPhotos,
  hospitalityPhotos,
  developmentPhotos,
} from "@/lib/photos";
import arissaLogo from "@assets/Arissa_1769577580214.png";
import jllLogo from "@assets/JLL-Logo-Positive-10-29mm-RGB-1-002_1769577580216.png";
import cbreLogo from "@assets/png-clipart-cbre-group-real-estate-commercial-property-busines_1769577580216.png";
import rydgesLogo from "@assets/Rydges_Hotels_&_Resorts_Logo_1769577580217.png";
import asheMorganLogo from "@assets/sponslogos4_1769577580217.png";
import { SeoHead, localBusinessSchema } from "@/components/SeoHead";

const HERO_VIDEO = "/media/hero/property-portfolio-aug26-short.mp4?v=20260810";
const HERO_POSTER = "/media/hero/hero-poster.jpg?v=20260924";
/** Clean still for reduced-motion / no-autoplay fallback */
const HERO_STILL = hospitalityPhotos.pairA.src;

const clientLogos = [
  { src: jllLogo, alt: "JLL" },
  { src: cbreLogo, alt: "CBRE" },
  { src: rydgesLogo, alt: "Rydges Hotels & Resorts" },
  { src: arissaLogo, alt: "Arissa" },
  { src: asheMorganLogo, alt: "Ashe Morgan" },
];

const featuredProjects = [
  {
    id: "gibbons",
    title: "Industrial Campaign",
    client: "Gibbons Group",
    sector: "Industrial & Logistics",
    description:
      "Industrial campaign film produced for Gibbons Group.",
    vimeoId: "1225814922",
    href: "/case-studies/gibbons-group-industrial",
    cta: "View case study",
  },
  {
    id: "jll-hotels",
    title: "Social Collective",
    client: "JLL Hotels",
    sector: "Hotels & Hospitality",
    description:
      "Hospitality campaign and social content focused on character, ambience and investor appeal.",
    vimeoId: "1195210804",
    href: "/case-studies/jll-hotels-social-collective",
    cta: "View case study",
  },
  {
    id: "emu-plains",
    title: "Emu Plains Development",
    client: "CBRE",
    sector: "Industrial / Development",
    description:
      "Industrial campaign video showing how the site works on the ground — access, layout and surrounding connectivity.",
    vimeoId: "1172749465",
    href: "/case-studies/emu-plains-industrial",
    cta: "View case study",
  },
];

const sectors = [
  {
    href: "/industrial-warehouse-property-video",
    title: "Industrial & Logistics",
    description:
      "Scale, access, truck movement, hardstand, clearance and connectivity.",
    image: industrialPhotos.hero,
  },
  {
    href: "/retail-shopping-precinct-video",
    title: "Retail & Shopping Precincts",
    description:
      "Location, tenant mix, foot traffic, trade area and future upside.",
    image: retailPhotos.hero,
  },
  {
    href: "/hotel-hospitality-property-video",
    title: "Hotels, Hospitality & Tourism",
    description:
      "Character, heritage, atmosphere, guest experience and investor appeal.",
    image: hospitalityPhotos.hero,
  },
  {
    href: "/property-development-video",
    title: "Property Developments",
    description:
      "Scale, context, infrastructure, progress and future potential.",
    image: developmentPhotos.hero,
  },
];

function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [preferStill, setPreferStill] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPreferStill(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <>
      {/* Cream band under sticky nav; video sits below in its own black frame */}
      <section className="bg-[var(--bg)] pt-[4.75rem] md:pt-[5.25rem]">
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          {preferStill ? (
            <img
              src={HERO_STILL}
              alt=""
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            <>
              <img
                src={HERO_POSTER}
                alt=""
                className="absolute inset-0 w-full h-full object-contain"
                aria-hidden="true"
              />
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={HERO_POSTER}
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  opacity: videoLoaded ? 1 : 0,
                  transition: "opacity 1.2s ease-in-out",
                }}
                onLoadedData={() => {
                  setTimeout(() => setVideoLoaded(true), 200);
                }}
              >
                <source src={HERO_VIDEO} type="video/mp4" />
              </video>
            </>
          )}
        </div>
      </section>

      <section className="bg-[var(--bg)] section-border">
        <div className="max-w-3xl mx-auto px-6 py-14 md:py-20 text-center">
          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-5 text-[var(--ink)]"
            data-testid="text-hero-title"
          >
            Commercial property. Captured properly.
          </h1>
          <p
            className="text-soft-grey text-base md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Video, drone and photography for commercial property campaigns. Based
            in Sydney. Working Australia-wide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <Link
              href="/portfolio"
              className="btn-outline"
              data-testid="button-hero-portfolio"
            >
              View our work
            </Link>
            <Link
              href="/enquire"
              className="btn-primary"
              data-testid="button-hero-enquire"
            >
              Discuss a project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <SeoHead
        title="One Now Two | Commercial Property Video Production Sydney"
        description="Commercial property video, drone and photography for agents, vendors and property sales teams across Sydney and NSW. Industrial, warehouse, hotel and hospitality campaigns."
        path="/"
        schema={localBusinessSchema}
      />
      <Nav />

      <main id="top">
        <HeroSection />

        <section
          id="clients"
          className="py-10 md:py-12 section-border"
          aria-label="Clients"
        >
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-center text-soft-grey text-sm tracking-wider uppercase mb-6">
              Trusted by property teams
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              {clientLogos.map((logo) => (
                <div
                  key={logo.alt}
                  className="bg-white rounded-md px-5 py-3 h-14 md:h-16 flex items-center justify-center min-w-[7.5rem]"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-7 md:h-8 w-auto max-w-[7rem] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="featured-work" className="py-14 md:py-16 section-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2
                className="font-serif text-3xl md:text-4xl mb-2"
                data-testid="text-works-title"
              >
                Selected campaign work
              </h2>
              <p className="text-soft-grey" data-testid="text-works-subtitle">
                A mix of industrial, hospitality and development campaigns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <article
                  key={project.id}
                  className="flex flex-col border border-[var(--hairline)] rounded-lg overflow-hidden bg-[var(--cream)]/50"
                >
                  <Link
                    href={project.href}
                    className="group block no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy)]"
                  >
                    <VimeoThumbnail
                      vimeoId={project.vimeoId}
                      title={`${project.title} campaign video`}
                    />
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs uppercase tracking-wider text-soft-grey mb-1">
                      {project.sector}
                      {project.client ? ` · ${project.client}` : ""}
                    </p>
                    <h3 className="font-serif text-xl mb-2 text-[var(--ink)]">
                      {project.title}
                    </h3>
                    <p className="text-soft-grey text-sm leading-relaxed mb-4 flex-1">
                      {project.description}
                    </p>
                    <Link
                      href={project.href}
                      className="text-sm text-[var(--navy)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--navy)]"
                    >
                      {project.cta} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/portfolio" className="btn-outline">
                View full portfolio
              </Link>
              <Link href="/case-studies" className="btn-outline">
                All case studies
              </Link>
            </div>
          </div>
        </section>

        <section id="sectors" className="py-14 md:py-16 section-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2
                className="font-serif text-3xl md:text-4xl mb-3"
                data-testid="text-services-title"
              >
                Sectors we work across
              </h2>
              <p className="text-soft-grey max-w-2xl mx-auto">
                Campaign content for commercial property teams — video, drone,
                photography and social cutdowns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {sectors.map((sector) => (
                <Link
                  key={sector.href}
                  href={sector.href}
                  className="group relative block overflow-hidden rounded-lg border border-[var(--hairline)] no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy)]"
                >
                  <div className="aspect-[16/10] bg-[var(--surface)]">
                    <img
                      src={sector.image.src}
                      alt={sector.image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-white">
                    <h3 className="font-serif text-xl md:text-2xl mb-1">
                      {sector.title}
                    </h3>
                    <p className="text-white/85 text-sm leading-relaxed">
                      {sector.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="approach" className="py-14 md:py-16 section-border">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-center">
              How we work
            </h2>
            <p className="text-soft-grey text-lg leading-relaxed mb-6 text-center">
              One Now Two is a Sydney-based production company focused on
              commercial property campaigns — video, drone, photography and social
              cutdowns for agents, vendors and property sales teams.
            </p>
            <p className="text-soft-grey leading-relaxed mb-10 text-center">
              The process is practical: understand the brief and the audience,
              plan the shoot, capture the asset properly, then deliver
              campaign-ready content.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="border border-[var(--hairline)] rounded-lg p-5">
                <p className="text-xs uppercase tracking-wider text-soft-grey mb-2">
                  01
                </p>
                <h3 className="font-serif text-xl mb-2">Brief & planning</h3>
                <p className="text-soft-grey text-sm leading-relaxed">
                  Confirm the asset, audience and channels so the shoot covers
                  what the campaign actually needs.
                </p>
              </div>
              <div className="border border-[var(--hairline)] rounded-lg p-5">
                <p className="text-xs uppercase tracking-wider text-soft-grey mb-2">
                  02
                </p>
                <h3 className="font-serif text-xl mb-2">Shoot</h3>
                <p className="text-soft-grey text-sm leading-relaxed">
                  On-site capture with ground and aerial coverage matched to the
                  property type and campaign brief.
                </p>
              </div>
              <div className="border border-[var(--hairline)] rounded-lg p-5">
                <p className="text-xs uppercase tracking-wider text-soft-grey mb-2">
                  03
                </p>
                <h3 className="font-serif text-xl mb-2">Edit & delivery</h3>
                <p className="text-soft-grey text-sm leading-relaxed">
                  Edited campaign film and cutdowns delivered ready for listings,
                  decks, websites and social.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/about" className="btn-outline">
                About us
              </Link>
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="py-16 md:py-20 section-border bg-[var(--navy)] text-[var(--cream)]"
        >
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl mb-4">
              Discuss your next campaign
            </h2>
            <p className="text-[var(--cream)]/80 text-lg mb-8">
              Send through the asset, audience and timing — we&apos;ll recommend
              a practical approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <Link
                href="/enquire"
                className="inline-flex items-center justify-center min-h-[2.875rem] px-6 py-3 rounded-[0.4rem] text-sm font-medium bg-[var(--cream)] text-[var(--navy)] no-underline hover:opacity-90"
                data-testid="button-enquire-cta"
              >
                Enquire
              </Link>
            </div>
            <p className="text-[var(--cream)]/70 text-sm">
              Prefer to email?{" "}
              <a
                href="mailto:hello@onenowtwo.com.au"
                className="text-[var(--cream)] underline underline-offset-2 hover:opacity-90"
              >
                hello@onenowtwo.com.au
              </a>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
