import { useState } from "react";
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

function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <>
      <section className="relative bg-black overflow-hidden">
        <div className="relative w-full aspect-video md:aspect-auto md:min-h-[70vh] lg:min-h-screen">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover hero-iframe"
            style={{
              opacity: videoLoaded ? 1 : 0,
              transition: "opacity 1.5s ease-in-out",
              filter: "saturate(0.9) contrast(1.05) brightness(1.0)",
            }}
            onLoadedData={() => {
              setTimeout(() => setVideoLoaded(true), 300);
            }}
          >
            <source
              src="/media/hero/property-portfolio-aug26-short.mp4?v=20260810"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section className="py-16 md:py-24 section-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-5 text-[var(--ink)]"
            data-testid="text-hero-title"
          >
            Commercial property video for assets that need more than stills
          </h1>
          <p
            className="text-soft-grey text-lg md:text-xl leading-relaxed mb-6"
            data-testid="text-hero-subtitle"
          >
            One Now Two creates cinematic campaign content for commercial
            property teams across industrial, retail, hospitality, tourism and
            development projects.
          </p>
          <div
            className="text-sm text-soft-grey tracking-wider uppercase mb-8"
            data-testid="text-hero-location"
          >
            Sydney • Australia-Wide
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <Link
              href="/enquire"
              className="btn-primary"
              data-testid="button-hero-quote"
            >
              Enquire
            </Link>
            <Link
              href="/portfolio"
              className="btn-outline"
              data-testid="button-hero-portfolio"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const portfolioPreview = [
  {
    id: 1,
    title: "Hilton Hotel Sydney",
    vimeoId: "1159058515"
  },
  {
    id: 2,
    title: "Rydges Hotel",
    vimeoId: "1159058749"
  },
  {
    id: 3,
    title: "JLL - Longueville Hotel",
    vimeoId: "1159066187"
  },
  {
    id: 4,
    title: "Rhodes Central Shopping Centre",
    vimeoId: "1159058719"
  },
  {
    id: 5,
    title: "CBRE - Emu Plains Development",
    vimeoId: "1172749465"
  },
  {
    id: 6,
    title: "Parsons Creek Farm",
    vimeoId: "396407744"
  }
];

const serviceCategories = [
  {
    href: "/industrial-warehouse-property-video",
    title: "Industrial & Warehouse",
    description:
      "Scale, access, truck movement, hardstand, clearance and connectivity.",
  },
  {
    href: "/retail-shopping-precinct-video",
    title: "Retail & Shopping Precincts",
    description:
      "Location, tenant mix, foot traffic, trade area and future upside.",
  },
  {
    href: "/hotel-hospitality-property-video",
    title: "Hotels, Hospitality & Tourism",
    description:
      "Character, heritage, atmosphere, guest experience and investor appeal.",
  },
  {
    href: "/property-development-video",
    title: "Property Developments",
    description:
      "Scale, context, infrastructure, progress and future potential.",
  },
];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<typeof portfolioPreview[0] | null>(null);

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

        <section id="proof" className="py-16 section-border">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[var(--ink)] text-xl md:text-2xl leading-relaxed font-serif" data-testid="text-proof">
              Stills show what the asset looks like.
              <br />
              Video helps people understand why it matters.
            </p>
          </div>
        </section>

        <section id="categories" className="py-20 section-border">
          <div className="max-w-4xl mx-auto px-6 text-center mb-14">
            <h2
              className="font-serif text-3xl md:text-4xl mb-6"
              data-testid="text-services-title"
            >
              Commercial property video for assets that need more than stills
            </h2>
            <p className="text-soft-grey text-lg leading-relaxed mb-4">
              One Now Two creates cinematic campaign content for commercial property
              teams across industrial, retail, hospitality, tourism and development
              projects.
            </p>
            <p className="text-soft-grey text-lg leading-relaxed">
              Stills show what the asset looks like. Video helps buyers, occupiers
              and investors understand the scale, setting, story and opportunity.
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {serviceCategories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="p-7 border border-[var(--hairline)] rounded-lg bg-[var(--cream)]/60 group hover:border-[var(--navy)]/30 hover:bg-[var(--cream)] transition-colors no-underline block"
                >
                  <h3 className="font-serif text-xl mb-3 text-[var(--ink)] group-hover:text-[var(--navy)] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-soft-grey text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  <span className="text-soft-grey text-sm group-hover:text-[var(--navy)] transition-colors">
                    → Learn more
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 section-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[var(--surface)]">
                <img
                  src={industrialPhotos.hero.src}
                  alt={industrialPhotos.hero.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[var(--surface)]">
                <img
                  src={retailPhotos.hero.src}
                  alt={retailPhotos.hero.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[var(--surface)]">
                <img
                  src={hospitalityPhotos.hero.src}
                  alt={hospitalityPhotos.hero.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[var(--surface)]">
                <img
                  src={developmentPhotos.hero.src}
                  alt={developmentPhotos.hero.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="text-center text-soft-grey text-sm mt-8">
              Looking for the broader overview?{" "}
              <Link
                href="/commercial-property-video-production-sydney"
                className="text-[var(--navy)] underline-offset-2 hover:underline"
              >
                Commercial property video production in Sydney
              </Link>
            </p>
          </div>
        </section>

        <section id="portfolio-preview" className="py-20 section-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl mb-2" data-testid="text-works-title">Selected Works</h2>
              <p className="text-soft-grey" data-testid="text-works-subtitle">A handful only. The rest—by request.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {portfolioPreview.map((work) => (
                <button 
                  key={work.id}
                  onClick={() => setSelectedVideo(work)}
                  className="block w-full text-left cursor-pointer group"
                  data-testid={`button-portfolio-${work.id}`}
                >
                  <figure className="m-0">
                    <VimeoThumbnail
                      vimeoId={work.vimeoId}
                      title={`${work.title} commercial property campaign video`}
                      className="rounded-lg"
                    />
                    <figcaption className="mt-3 text-soft-grey group-hover:text-[var(--navy)] transition-colors">
                      {work.title}
                    </figcaption>
                  </figure>
                </button>
              ))}
            </div>

            <div className="text-center mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/portfolio" className="btn-outline">
                View Full Portfolio
              </Link>
              <Link href="/case-studies" className="btn-outline">
                Case Studies
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 section-border">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl mb-4 opacity-50">01</div>
                <h3 className="font-serif text-xl mb-2">Shoot</h3>
                <p className="text-soft-grey text-sm">We come to you, capture the property with precision and style.</p>
              </div>
              <div>
                <div className="text-4xl mb-4 opacity-50">02</div>
                <h3 className="font-serif text-xl mb-2">Edit</h3>
                <p className="text-soft-grey text-sm">Fast turnaround editing with colour grading and music.</p>
              </div>
              <div>
                <div className="text-4xl mb-4 opacity-50">03</div>
                <h3 className="font-serif text-xl mb-2">Deliver</h3>
                <p className="text-soft-grey text-sm">Files delivered in all formats you need, ready to publish.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 section-border">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-xl text-center mb-10 text-soft-grey">Trusted by leading brands</h2>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
              <div className="bg-white/90 rounded-lg px-6 py-4">
                <img src={jllLogo} alt="JLL commercial property video client" className="h-8 md:h-10 w-auto object-contain" />
              </div>
              <div className="bg-white/90 rounded-lg px-6 py-4">
                <img src={cbreLogo} alt="CBRE industrial warehouse property video client" className="h-6 md:h-8 w-auto object-contain" />
              </div>
              <div className="bg-white/90 rounded-lg px-6 py-4">
                <img src={rydgesLogo} alt="Rydges Hotels hospitality property video client" className="h-8 md:h-10 w-auto object-contain" />
              </div>
              <div className="bg-white/90 rounded-lg px-6 py-4">
                <img src={arissaLogo} alt="Arissa commercial property campaign client" className="h-6 md:h-8 w-auto object-contain" />
              </div>
              <div className="bg-white/90 rounded-lg px-6 py-4">
                <img src={asheMorganLogo} alt="Ashe Morgan commercial property video client" className="h-8 md:h-10 w-auto object-contain" />
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="py-20 section-border bg-[var(--navy)] text-[var(--cream)]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl mb-4">
              Ready to brief the next campaign?
            </h2>
            <p className="text-[var(--cream)]/75 text-lg mb-8">
              Tell us the asset, the audience and the timeline — we&apos;ll recommend
              the right video approach.
            </p>
            <Link 
              href="/enquire"
              className="inline-block bg-[var(--cream)] text-[var(--navy)] no-underline px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-all"
              data-testid="button-enquire-cta"
            >
              Enquire
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />

      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
          data-testid="modal-video-overlay"
        >
          <div 
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-all"
              data-testid="button-close-modal"
            >
              ×
            </button>
            <iframe
              src={`https://player.vimeo.com/video/${selectedVideo.vimeoId}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0&autopause=0`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              data-testid="iframe-video-player"
              title={`${selectedVideo.title} commercial property campaign video`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
