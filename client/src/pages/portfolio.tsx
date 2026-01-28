import { useState } from "react";
import { Link } from "wouter";
import logoUrl from "../assets/logo.png";

const portfolioItems = [
  {
    id: 1,
    title: "Hilton Hotel Sydney",
    vimeoId: "1159058566",
    category: "Hotel",
    location: "Sydney CBD"
  },
  {
    id: 2,
    title: "Bridge Hotel Rozelle",
    vimeoId: "396407744",
    category: "Hotel",
    location: "Rozelle"
  },
  {
    id: 3,
    title: "DKO Property Development",
    vimeoId: "775600383",
    category: "Development",
    location: "Sydney"
  },
  {
    id: 4,
    title: "Jacksons Ranch Walkthrough",
    vimeoId: "1159058790",
    category: "Residential",
    location: "NSW"
  },
  {
    id: 5,
    title: "Rhodes Central Shopping Centre",
    vimeoId: "1149506208",
    category: "Commercial",
    location: "Rhodes"
  },
  {
    id: 6,
    title: "Rydges Hotel",
    vimeoId: "1159058866",
    category: "Hotel",
    location: "Sydney"
  },
  {
    id: 7,
    title: "Marina Square Shopping Centre",
    vimeoId: "1159058909",
    category: "Commercial",
    location: "Sydney"
  },
  {
    id: 8,
    title: "Sovereign Interiors",
    vimeoId: "1159058834",
    category: "Commercial",
    location: "Sydney"
  },
  {
    id: 9,
    title: "The Oaks Development",
    vimeoId: "1159058749",
    category: "Development",
    location: "Sydney"
  },
  {
    id: 10,
    title: "Tallpoppie Muswellbrook",
    vimeoId: "1159058719",
    category: "Development",
    location: "Muswellbrook"
  },
  {
    id: 11,
    title: "Supamart",
    vimeoId: "1159058696",
    category: "Commercial",
    location: "Sydney"
  },
  {
    id: 12,
    title: "Porbeski Architects",
    vimeoId: "1159058666",
    category: "Commercial",
    location: "Sydney"
  },
  {
    id: 13,
    title: "Palazzo Luxury Apartments",
    vimeoId: "1159058641",
    category: "Residential",
    location: "Sydney"
  },
  {
    id: 14,
    title: "District Development",
    vimeoId: "1159058601",
    category: "Development",
    location: "Sydney"
  },
  {
    id: 15,
    title: "Barranca Kangaroo Valley",
    vimeoId: "1159058515",
    category: "Residential",
    location: "Kangaroo Valley"
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
              A selection of property videos we've produced for developers, agents, and commercial clients across Sydney and NSW.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setSelectedVideo(item)}
                className="block w-full text-left cursor-pointer group"
              >
                <div className="aspect-video bg-[var(--hairline)] rounded-lg overflow-hidden mb-3">
                  <img 
                    src={`https://vumbnail.com/${item.vimeoId}.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = `https://i.vimeocdn.com/video/${item.vimeoId}_640.jpg`;
                    }}
                  />
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
          <div>© {new Date().getFullYear()} One Now Two — Sydney, NSW</div>
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
