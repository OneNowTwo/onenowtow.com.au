import { useEffect, useState } from "react";
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
      {/* Poster image for immediate loading */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/media/hero/hero-poster.jpg')`,
          filter: 'grayscale(100%) contrast(1.05) brightness(0.85)',
          opacity: videoLoaded ? 0 : 1,
          transition: 'opacity 1s ease-in-out'
        }}
      />
      
      {/* Optimized video with better mobile handling */}
      <iframe
        src={`https://player.vimeo.com/video/1113411900?background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&controls=0&muted=1&autopause=0${isMobile ? '&quality=720p' : '&quality=1080p'}`}
        className="absolute inset-0 w-full h-full hero-iframe"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="One Now Two Hero Video"
        data-testid="video-hero"
        id="hero-video-iframe"
        onLoad={() => {
          // Give video a moment to start playing before showing
          setTimeout(() => setVideoLoaded(true), 800);
        }}
      />
      <div className="absolute inset-0 hero-veil"></div>
      
      <div className="relative text-center px-6 fade-in">
        <div className="font-display font-semibold text-xl tracking-wider uppercase opacity-80 mb-4" data-testid="text-hero-brand">
          One Now Two
        </div>
        <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-3" data-testid="text-hero-title">
          We capture what surrounds the vows.
        </h1>
        <div className="text-sm text-soft-grey tracking-wider uppercase mb-6" data-testid="text-hero-location">
          Sydney • New South Wales • Australia
        </div>

        <div className="flex justify-center mt-8">
          <a 
            href="#why" 
            className="text-off-white opacity-70 hover:opacity-100 transition-opacity"
            data-testid="button-scroll-down"
            aria-label="Scroll down"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

const portfolioWorks = [
  {
    id: 1,
    title: "A Collection",
    image: "https://i.vimeocdn.com/video/760427384-9d57a65c82ebef4c531273c6e65caf060d136724535c56939018dca5a80d1a94-d_1280?region=us",
    link: "https://vimeo.com/318097471",
    alt: "A Collection wedding film"
  },
  {
    id: 2,
    title: "Venue Scouting",
    image: "https://i.ytimg.com/vi/Ek8lNOt6gM8/maxresdefault.jpg",
    link: "https://youtu.be/Ek8lNOt6gM8",
    alt: "Venue Scouting wedding film"
  },
  {
    id: 3,
    title: "The Day Before",
    image: "https://i.vimeocdn.com/video/795382231-e1e26e3945ca104ac62a4c2efd2b4638fe49f9c45889e4d6d18303215d50d021-d_295x166?region=us",
    link: "https://vimeo.com/345569949",
    alt: "The Day Before wedding film"
  },
  {
    id: 4,
    title: "Tanya X Tommy",
    image: "https://i.vimeocdn.com/video/2048647170-ab113728b074d7220e87a33f8142ba95f0aba490ad226a3ed36947cf89156b0e-d_640?region=us",
    link: "https://vimeo.com/177341669",
    alt: "Tanya X Tommy wedding film"
  }
];



export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<typeof portfolioWorks[0] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    weddingDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const getEmbedUrl = (url: string) => {
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0&autopause=0`;
    } else if (url.includes('youtu.be') || url.includes('youtube.com')) {
      const videoId = url.includes('youtu.be') ? url.split('/').pop() : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`;
    }
    return url;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData object
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('phone', formData.phone);
      formDataObj.append('email', formData.email);
      formDataObj.append('wedding_date', formData.weddingDate);
      formDataObj.append('_subject', 'New Wedding Enquiry — One Now Two');

      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/meorqnr', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formDataObj
      });

      if (response.ok) {
        // Redirect to thanks page for conversion tracking
        window.location.href = '/thanks';
      } else {
        alert('Sorry, something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Sorry, something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



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
                className="h-20 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </a>
            <a 
              href="/enquire" 
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
        <HeroSection />



        {/* Why Section */}
        <section id="why" className="py-20 section-border">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-soft-grey text-lg leading-relaxed max-w-3xl mx-auto" data-testid="text-why-description">
              After a decade crafting TVCs and brand films, we moved into weddings
              to make something quieter—and truer. We work calmly on the day, we listen,
              and cut with restraint so your film holds, long after the day.
            </p>
          </div>
        </section>

        {/* Selected Works Section */}
        <section id="works" className="py-20 section-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl mb-2" data-testid="text-works-title">Selected Works</h2>
              <p className="text-soft-grey" data-testid="text-works-subtitle">A handful only. The rest—by request.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {portfolioWorks.map((work) => (
                <button 
                  key={work.id}
                  onClick={() => setSelectedVideo(work)}
                  className="block w-full text-left cursor-pointer"
                  data-testid={`button-portfolio-${work.id}`}
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
                </button>
              ))}
            </div>
          </div>
        </section>



        {/* Ethos Section */}
        <section className="py-20 section-border">
          <div className="max-w-3xl mx-auto px-6 text-center fade-in-trigger">
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
            <p className="text-soft-grey text-lg mb-6" data-testid="text-contact-description">
              Tell us about your day.
            </p>
            <a 
              href="/enquire"
              className="inline-block btn-outline"
              data-testid="button-enquire-open"
            >
              Enquire
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 section-border text-center text-soft-grey text-sm">
        <div className="max-w-7xl mx-auto px-6" data-testid="text-footer-copyright">
          © {new Date().getFullYear()} One Now Two — Sydney, NSW
        </div>
      </footer>

      {/* Enquiry Form Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => !formSubmitted && setShowForm(false)}
          data-testid="modal-form-overlay"
        >
          <div 
            className="relative w-full max-w-md bg-[var(--bg)] border border-[var(--hairline)] rounded-lg p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {!formSubmitted ? (
              <>
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 text-[var(--muted-grey)] hover:text-[var(--ink)] text-xl"
                  data-testid="button-close-form"
                >
                  ×
                </button>
                
                <h3 className="font-serif text-2xl mb-6 text-center">Tell us about your day</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors"
                    data-testid="input-name"
                  />
                  
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors"
                    data-testid="input-phone"
                  />
                  
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors"
                    data-testid="input-email"
                  />
                  
                  <input
                    type="date"
                    name="weddingDate"
                    placeholder="Save the Date"
                    value={formData.weddingDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-[var(--light-accent)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-white/50 transition-colors date-input"
                    data-testid="input-wedding-date"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-outline py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-submit-enquiry"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <h3 className="font-serif text-2xl mb-4">Thanks.</h3>
                <p className="text-[var(--muted-grey)] mb-6">We'll come back to you shortly.</p>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormSubmitted(false);
                  }}
                  className="btn-outline"
                  data-testid="button-close-thanks"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Modal */}
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
              src={getEmbedUrl(selectedVideo.link)}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              data-testid="iframe-video-player"
              id="modal-video-iframe"
            />
          </div>
        </div>
      )}
    </div>
  );
}
