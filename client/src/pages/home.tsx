import { useEffect } from "react";
import logoUrl from "../assets/logo.png";

const portfolioWorks = [
  {
    id: 1,
    title: "A & J — Kangaroo Valley — 2025",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    link: "https://vimeo.com/76979871",
    alt: "Elegant outdoor wedding ceremony in Kangaroo Valley"
  },
  {
    id: 2,
    title: "S & M — Sydney CBD — 2024",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    alt: "Modern city wedding with Sydney CBD skyline backdrop"
  },
  {
    id: 3,
    title: "L & T — Hunter Valley — 2025",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    link: "https://vimeo.com/318097471",
    alt: "Romantic vineyard wedding ceremony in Hunter Valley wine country"
  },
  {
    id: 4,
    title: "E & R — South Coast — 2024",
    image: "https://images.unsplash.com/photo-1503863937795-62954a3c0f05?q=80&w=1200&auto=format&fit=crop",
    link: "https://vimeo.com/177524264",
    alt: "Beautiful coastal wedding ceremony overlooking the South Coast beaches"
  },
  {
    id: 5,
    title: "C & P — Blue Mountains — 2023",
    image: "https://images.unsplash.com/photo-1521316730702-829a8e30dfdf?q=80&w=1200&auto=format&fit=crop",
    link: "#",
    alt: "Scenic mountain wedding ceremony in the Blue Mountains wilderness"
  },
  {
    id: 6,
    title: "N & H — Byron Bay — 2025",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    link: "#",
    alt: "Dreamy beachfront wedding ceremony at sunset in Byron Bay"
  }
];

export default function Home() {
  useEffect(() => {
    // Simple fade-in animation trigger using Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    // Observe all elements with fade-in-trigger class
    document.querySelectorAll('.fade-in-trigger').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 nav-backdrop">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex justify-between items-center py-4">
            <a 
              href="#top" 
              className="flex items-center text-off-white no-underline" 
              aria-label="One Now Two"
              data-testid="link-logo"
            >
              <img 
                src={logoUrl} 
                alt="One Now Two Logo" 
                className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </a>
            <a 
              href="#enquire" 
              className="btn-outline"
              data-testid="button-enquire-header"
            >
              Enquire
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center">
          <video 
            className="absolute inset-0 w-full h-full object-cover hero-video" 
            autoPlay 
            muted 
            loop 
            playsInline 
            poster="https://images.unsplash.com/photo-1508898578281-774ac4893bd0?q=80&w=1920&auto=format&fit=crop"
            data-testid="video-hero"
          >
            <source src="https://cdn.coverr.co/videos/coverr-bride-and-groom-walking-1528/1080p.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 hero-veil"></div>
          
          <div className="relative text-center px-6 fade-in">
            <div className="font-semibold text-sm tracking-wider uppercase opacity-80 mb-4" data-testid="text-hero-brand">
              One Now Two
            </div>
            <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-3" data-testid="text-hero-title">
              The sounds around the vows
            </h1>
            <div className="text-sm text-soft-grey tracking-wider uppercase mb-6" data-testid="text-hero-location">
              Sydney • New South Wales • Australia
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="#works" 
                className="btn-outline"
                data-testid="button-selected-works"
              >
                Selected works
              </a>
              <a 
                href="#why" 
                className="btn-outline"
                data-testid="button-why-weddings"
              >
                Why I film weddings
              </a>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section id="why" className="py-20 section-border">
          <div className="max-w-4xl mx-auto px-6 text-center fade-in-trigger">
            <h2 className="font-serif text-3xl mb-2" data-testid="text-why-title">Why I do this</h2>
            <p className="text-soft-grey text-lg leading-relaxed max-w-3xl mx-auto" data-testid="text-why-description">
              After a decade crafting TVCs and brand films at Young Buck Media, I moved into weddings
              to make something quieter—and truer. I work calmly on the day, listen more than I speak,
              and cut with restraint so your film feels timeless next year and in twenty.
            </p>
          </div>
        </section>

        {/* Selected Works Section */}
        <section id="works" className="py-20 section-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8 fade-in-trigger">
              <h2 className="font-serif text-3xl mb-2" data-testid="text-works-title">Selected Works</h2>
              <p className="text-soft-grey" data-testid="text-works-subtitle">A handful only. The rest—by request.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 fade-in-trigger">
              {portfolioWorks.map((work) => (
                <a 
                  key={work.id}
                  href={work.link}
                  target="_blank" 
                  rel="noreferrer" 
                  className="block"
                  data-testid={`link-portfolio-${work.id}`}
                >
                  <figure className="portfolio-figure m-0">
                    <img 
                      src={work.image}
                      alt={work.alt}
                      className="portfolio-thumb"
                      data-testid={`img-portfolio-${work.id}`}
                    />
                    <figcaption className="portfolio-caption" data-testid={`text-portfolio-caption-${work.id}`}>
                      {work.title}
                    </figcaption>
                  </figure>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Ethos Section */}
        <section id="ethos" className="py-20 section-border">
          <div className="max-w-3xl mx-auto px-6 text-center fade-in-trigger">
            <h2 className="font-serif text-3xl mb-6" data-testid="text-ethos-title">An ethos of restraint</h2>
            <div className="space-y-3">
              <p className="text-soft-grey text-lg" data-testid="text-ethos-1">Observe quietly.</p>
              <p className="text-soft-grey text-lg" data-testid="text-ethos-2">Edit honestly.</p>
              <p className="text-soft-grey text-lg" data-testid="text-ethos-3">Leave space for feeling.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="enquire" className="py-20 section-border">
          <div className="max-w-2xl mx-auto px-6 text-center fade-in-trigger">
            <h2 className="font-serif text-3xl mb-6" data-testid="text-contact-title">Dates are limited.</h2>
            <a 
              href="mailto:hello@onenowtwo.com.au?subject=Wedding Enquiry — One Now Two" 
              className="inline-block btn-outline mb-3"
              data-testid="button-enquire-email"
            >
              Enquire by email
            </a>
            <p className="text-soft-grey text-sm" data-testid="text-contact-note">
              Prefer a call? Add your number in the email and I'll ring you back.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 section-border text-center text-soft-grey text-sm">
        <div className="max-w-7xl mx-auto px-6" data-testid="text-footer-copyright">
          © {new Date().getFullYear()} One Now Two — Sydney, NSW
        </div>
      </footer>
    </div>
  );
}
