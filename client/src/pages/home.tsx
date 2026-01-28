import { useEffect, useState } from "react";
import { Link } from "wouter";
import logoUrl from "../assets/logo.png";

function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover hero-iframe"
        style={{ 
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out',
          filter: 'saturate(0.7) contrast(1.05) brightness(0.75)'
        }}
        onLoadedData={() => {
          setTimeout(() => setVideoLoaded(true), 300);
        }}
      >
        <source src="/media/hero/One Now Two Banner Video Property Portfolio.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative text-center px-6">
        <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-4 text-white" data-testid="text-hero-title">
          Elevating commercial property through cinematic storytelling.
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8" data-testid="text-hero-subtitle">
          Stunning real estate videos that captivate buyers, tenants, and investors.
        </p>
        <div className="text-sm text-white/70 tracking-wider uppercase mb-8" data-testid="text-hero-location">
          Sydney • Australia-Wide
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/enquire" 
            className="btn-primary"
            data-testid="button-hero-quote"
          >
            Get a Quote
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
    title: "Marina Square Shopping Centre",
    vimeoId: "1159058601"
  },
  {
    id: 4,
    title: "The Oaks Development",
    vimeoId: "1159058909"
  },
  {
    id: 5,
    title: "Sovereign Interiors",
    vimeoId: "1159058790"
  },
  {
    id: 6,
    title: "Rhodes Central Shopping Centre",
    vimeoId: "1159058719"
  }
];

const packages = [
  {
    title: "Signature Series",
    description: "Ultimate production value for prestigious commercial properties. Dual cameras, premium drone, voice-over."
  },
  {
    title: "Professional Series",
    description: "Comprehensive coverage for commercial properties. Full-day filming with 4K cinema camera."
  },
  {
    title: "Essential Series",
    description: "Half-day shoot perfect for smaller commercial spaces. Quick turnaround, quality results."
  }
];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<typeof portfolioPreview[0] | null>(null);

  return (
    <div className="min-h-screen w-full">
      <header className="fixed top-0 left-0 right-0 z-30 nav-backdrop">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex justify-between items-center py-4">
            <Link 
              href="/" 
              className="flex items-center text-off-white no-underline" 
              aria-label="One Now Two"
              data-testid="link-logo"
            >
              <img 
                src={logoUrl} 
                alt="One Now Two Logo" 
                className="h-16 md:h-20 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/services" className="text-off-white hover:text-white transition-colors">Services</Link>
              <Link href="/portfolio" className="text-off-white hover:text-white transition-colors">Portfolio</Link>
              <Link href="/about" className="text-off-white hover:text-white transition-colors">About</Link>
              <Link href="/enquire" className="btn-outline" data-testid="button-enquire-header">Enquire</Link>
            </div>
            <Link 
              href="/enquire" 
              className="btn-outline md:hidden"
              data-testid="button-enquire-mobile"
            >
              Enquire
            </Link>
          </nav>
        </div>
      </header>

      <main id="top">
        <HeroSection />

        <section id="proof" className="py-16 section-border">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-soft-grey text-xl leading-relaxed" data-testid="text-proof">
              Faster interest. Cleaner listings. Better brand.
            </p>
          </div>
        </section>

        <section id="services" className="py-20 section-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl mb-4" data-testid="text-services-title">Our Packages</h2>
              <p className="text-soft-grey">Tailored video production for commercial real estate.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <div key={index} className="p-6 border border-[var(--hairline)] rounded-lg">
                  <h3 className="font-serif text-xl mb-3">{pkg.title}</h3>
                  <p className="text-soft-grey text-sm">{pkg.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/services" className="btn-outline">
                View All Packages
              </Link>
            </div>
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
                    <div className="aspect-video bg-[var(--hairline)] rounded-lg overflow-hidden relative">
                      <iframe
                        src={`https://player.vimeo.com/video/${work.vimeoId}?background=1&autoplay=0&loop=1&byline=0&title=0&muted=1`}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ transform: 'scale(1.2)' }}
                        frameBorder="0"
                        allow="autoplay"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <figcaption className="mt-3 text-soft-grey group-hover:text-white transition-colors">
                      {work.title}
                    </figcaption>
                  </figure>
                </button>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/portfolio" className="btn-outline">
                View Full Portfolio
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

        <section id="cta" className="py-20 section-border">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl mb-4">Ready to elevate your listings?</h2>
            <p className="text-soft-grey text-lg mb-8">
              Get in touch to discuss your next project.
            </p>
            <Link 
              href="/enquire"
              className="btn-primary"
              data-testid="button-enquire-cta"
            >
              Get a Quote
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 section-border text-center text-soft-grey text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div data-testid="text-footer-copyright">
            © {new Date().getFullYear()} One Now Two — Sydney, Australia
          </div>
          <div className="flex gap-6">
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/enquire" className="hover:text-white transition-colors">Enquire</Link>
          </div>
        </div>
      </footer>

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
            />
          </div>
        </div>
      )}
    </div>
  );
}
