import { Link } from "wouter";
import logoUrl from "../assets/logo.png";

export function SiteHeader({ active }: { active?: string }) {
  const linkClass = (path: string) =>
    active === path
      ? "text-white"
      : "text-off-white hover:text-white transition-colors";

  return (
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
              alt="One Now Two commercial property video production Sydney"
              className="h-16 md:h-20 w-auto opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/services" className={linkClass("/services")}>
              Services
            </Link>
            <Link href="/portfolio" className={linkClass("/portfolio")}>
              Portfolio
            </Link>
            <Link href="/case-studies" className={linkClass("/case-studies")}>
              Case Studies
            </Link>
            <Link href="/about" className={linkClass("/about")}>
              About
            </Link>
            <Link href="/enquire" className="btn-outline">
              Enquire
            </Link>
          </div>
          <Link href="/enquire" className="btn-outline md:hidden">
            Enquire
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="py-8 section-border text-center text-soft-grey text-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link
            href="/commercial-property-video-production-sydney"
            className="hover:text-white transition-colors"
          >
            Commercial Property Video
          </Link>
          <Link
            href="/industrial-warehouse-property-video"
            className="hover:text-white transition-colors"
          >
            Industrial & Warehouse
          </Link>
          <Link
            href="/commercial-property-photography-drone"
            className="hover:text-white transition-colors"
          >
            Photography & Drone
          </Link>
          <Link
            href="/hotel-hospitality-property-video"
            className="hover:text-white transition-colors"
          >
            Hotel & Hospitality
          </Link>
          <Link href="/case-studies" className="hover:text-white transition-colors">
            Case Studies
          </Link>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} One Now Two — Sydney, Australia</div>
          <div className="flex gap-6">
            <Link href="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <Link href="/portfolio" className="hover:text-white transition-colors">
              Portfolio
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/enquire" className="hover:text-white transition-colors">
              Enquire
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function RelatedLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <section className="py-16 section-border">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-serif text-2xl mb-6">Related</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="btn-outline">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
