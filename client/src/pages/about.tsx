import { Link } from "wouter";
import logoUrl from "../assets/logo.png";

export default function About() {
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
              <Link href="/portfolio" className="text-off-white hover:text-white transition-colors">Portfolio</Link>
              <Link href="/about" className="text-white">About</Link>
              <Link href="/enquire" className="btn-outline">Enquire</Link>
            </div>
            <Link href="/enquire" className="btn-outline md:hidden">Enquire</Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">About</h1>
          </div>

          <div className="space-y-8 text-lg leading-relaxed">
            <p className="text-soft-grey">
              I'm Michael — a cinematographer, director, and producer with over 15 years of experience in video production.
            </p>

            <p className="text-soft-grey">
              Based in Sydney, I've spent the past decade crafting TVCs, brand films, and commercial content for agencies and brands across Australia. Now I'm bringing that same level of craft to property video production.
            </p>

            <p className="text-soft-grey">
              I work fast, stay organised, and make handover easy. Whether it's a quick walkthrough or a full development film, I approach every project with the same attention to detail.
            </p>

            <div className="border-t border-b border-[var(--hairline)] py-8 my-12">
              <h2 className="font-serif text-2xl mb-6">Tools & Workflow</h2>
              <ul className="space-y-3 text-soft-grey">
                <li>• <strong className="text-white">Edit:</strong> Adobe Premiere Pro, DaVinci Resolve</li>
                <li>• <strong className="text-white">Motion & Titles:</strong> After Effects</li>
                <li>• <strong className="text-white">Colour:</strong> DaVinci Resolve</li>
                <li>• <strong className="text-white">AI-Assisted:</strong> Mood boards, fast concepts, and post graphics support — used thoughtfully, not gimmicky</li>
              </ul>
            </div>

            <p className="text-soft-grey">
              Servicing Sydney, Greater Sydney, and NSW. Available for regional and interstate projects.
            </p>

            <div className="text-center pt-8">
              <Link href="/enquire" className="btn-primary">
                Get in Touch
              </Link>
            </div>
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
    </div>
  );
}
