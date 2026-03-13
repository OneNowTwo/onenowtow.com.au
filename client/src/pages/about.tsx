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
            <h1 className="font-serif text-4xl md:text-5xl mb-4">About Us</h1>
          </div>

          <div className="space-y-8 text-lg leading-relaxed">
            <p className="text-soft-grey">
              At One Now Two, we specialise in crafting exceptional video content tailored for commercial real estate.
            </p>

            <p className="text-soft-grey">
              Based in Sydney, we proudly serve Newcastle, the Central Coast, regional NSW, and beyond — across Australia and internationally.
            </p>

            <p className="text-soft-grey">
              With over 15 years of experience in video production, our team brings a cinematic approach to every project. We've spent years crafting TVCs, brand films, and commercial content for agencies and brands — now we're bringing that same level of craft to property video production.
            </p>

            <div className="border-t border-b border-[var(--hairline)] py-8 my-12">
              <h2 className="font-serif text-2xl mb-6">What We Cover</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-soft-grey">
                <div>• Commercial Real Estate</div>
                <div>• Hotels & Resorts</div>
                <div>• Shopping Centres</div>
                <div>• Office Leasing</div>
                <div>• Industrial Properties</div>
                <div>• Residential Developments</div>
              </div>
            </div>

            <p className="text-soft-grey">
              We work fast, stay organised, and make handover easy. Whether it's a quick walkthrough or a full development film, we approach every project with the same attention to detail.
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
          <div>© {new Date().getFullYear()} One Now Two — Sydney, Australia</div>
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
