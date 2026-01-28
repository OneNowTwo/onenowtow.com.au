import { useState } from "react";
import { Link } from "wouter";
import logoUrl from "../assets/logo.png";

const portfolioItems = [
  {
    id: 1,
    title: "Hilton Hotel Sydney",
    vimeoId: "1159058515",
    category: "Hotels & Resorts",
    location: "Sydney CBD"
  },
  {
    id: 2,
    title: "Rydges Hotel",
    vimeoId: "1159058749",
    category: "Hotels & Resorts",
    location: "Sydney"
  },
  {
    id: 3,
    title: "Longueville Hotel",
    vimeoId: "1159066187",
    category: "Hotels & Resorts",
    location: "Sydney"
  },
  {
    id: 4,
    title: "The Bridge Hotel",
    vimeoId: "1159066039",
    category: "Hotels & Resorts",
    location: "Sydney"
  },
  {
    id: 5,
    title: "Marina Square Shopping Centre",
    vimeoId: "1159058601",
    category: "Shopping Centres",
    location: "Sydney"
  },
  {
    id: 6,
    title: "Rhodes Central Shopping Centre",
    vimeoId: "1159058719",
    category: "Shopping Centres",
    location: "Rhodes"
  },
  {
    id: 7,
    title: "The Oaks Development",
    vimeoId: "1159058909",
    category: "Commercial",
    location: "Sydney"
  },
  {
    id: 8,
    title: "Sovereign Interiors",
    vimeoId: "1159058790",
    category: "Commercial",
    location: "Sydney"
  },
  {
    id: 9,
    title: "Tallpoppie Muswellbrook",
    vimeoId: "1159058866",
    category: "Commercial",
    location: "Muswellbrook"
  },
  {
    id: 10,
    title: "District",
    vimeoId: "1159066087",
    category: "Commercial",
    location: "Sydney"
  },
  {
    id: 11,
    title: "Crescent Launch Day",
    vimeoId: "1149506208",
    category: "Commercial",
    location: "Sydney"
  },
  {
    id: 12,
    title: "Jacksons Ranch",
    vimeoId: "1159058566",
    category: "Commercial",
    location: "NSW"
  },
  {
    id: 13,
    title: "Barranca Kangaroo Valley",
    vimeoId: "1159058696",
    category: "Commercial",
    location: "Kangaroo Valley"
  },
  {
    id: 14,
    title: "Porbeski Architects",
    vimeoId: "1159058666",
    category: "Commercial",
    location: "Sydney"
  },
  {
    id: 15,
    title: "Supamart",
    vimeoId: "1159058834",
    category: "Commercial",
    location: "Sydney"
  },
  {
    id: 16,
    title: "Parsons Creek Farm",
    vimeoId: "396407744",
    category: "Commercial",
    location: "NSW"
  }
];

export default function Portfolio() {
  const [selectedVideo, setSelectedVideo] = useState<typeof portfolioItems[0] | null>(null);

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <header className="fixed top-0 left-0 right-0 z-30 nav-backdrop">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex justify-between items-center py-4">
            <Link 
              href="/" 
              className="flex items-center text-off-white no-underline" 
              aria-label="One Now Two"
            >
              <img 
                src={logoUrl} 
                alt="One Now Two Logo" 
                className="h-16 md:h-20 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/services" className="text-off-white hover:text-white transition-colors">Services</Link>
              <Link href="/portfolio" className="text-white">Portfolio</Link>
              <Link href="/about" className="text-off-white hover:text-white transition-colors">About</Link>
              <Link href="/enquire" className="btn-outline">Enquire</Link>
            </div>
            <Link href="/enquire" className="btn-outline md:hidden">Enquire</Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Portfolio</h1>
            <p className="text-soft-grey text-lg max-w-2xl mx-auto">
              A selection of property videos we've produced for developers, agents, and commercial clients across Australia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setSelectedVideo(item)}
                className="block w-full text-left cursor-pointer group"
              >
                <div className="aspect-video bg-[var(--hairline)] rounded-lg overflow-hidden mb-3 relative">
                  <iframe
                    src={`https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=0&loop=1&byline=0&title=0&muted=1`}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ transform: 'scale(1.2)' }}
                    frameBorder="0"
                    allow="autoplay"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
                <h3 className="font-serif text-lg group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-soft-grey text-sm">{item.category} • {item.location}</p>
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-8 section-border text-center text-soft-grey text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} One Now Two — Sydney, Australia</div>
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
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-all"
            >
              ×
            </button>
            <iframe
              src={`https://player.vimeo.com/video/${selectedVideo.vimeoId}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0&autopause=0`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
