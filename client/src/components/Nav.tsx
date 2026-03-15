import { useState, useRef } from "react";
import { Link } from "wouter";
import logoUrl from "../assets/logo.png";

const serviceLinks = [
  { href: "/commercial-office-video-sydney", label: "Commercial Office Video" },
  { href: "/industrial-warehouse-video-sydney", label: "Industrial & Warehouse Video" },
  { href: "/development-marketing-video-sydney", label: "Development Marketing Video" },
  { href: "/drone-aerial-property-video-sydney", label: "Drone & Aerial Filming" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 200);
  };

  return (
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

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-off-white hover:text-white transition-colors flex items-center gap-1 py-2">
                Services
                <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 w-64 bg-[#111] border border-[var(--hairline)] rounded-lg py-2 shadow-xl">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-soft-grey hover:text-white hover:bg-white/5 transition-colors no-underline"
                      onClick={() => setServicesOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/services" className="text-off-white hover:text-white transition-colors">Packages</Link>
            <Link href="/portfolio" className="text-off-white hover:text-white transition-colors">Portfolio</Link>
            <Link href="/blog" className="text-off-white hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="text-off-white hover:text-white transition-colors">About</Link>
            <Link href="/enquire" className="btn-outline" data-testid="button-enquire-header">Enquire</Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-off-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--hairline)] py-4 space-y-1">
            <p className="px-2 py-1 text-xs text-soft-grey uppercase tracking-wider">Services</p>
            {serviceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-2 py-2 text-soft-grey hover:text-white transition-colors no-underline"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[var(--hairline)] mt-2 space-y-1">
              <Link href="/services" className="block px-2 py-2 text-off-white hover:text-white transition-colors no-underline" onClick={() => setMobileOpen(false)}>Packages</Link>
              <Link href="/portfolio" className="block px-2 py-2 text-off-white hover:text-white transition-colors no-underline" onClick={() => setMobileOpen(false)}>Portfolio</Link>
              <Link href="/blog" className="block px-2 py-2 text-off-white hover:text-white transition-colors no-underline" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link href="/about" className="block px-2 py-2 text-off-white hover:text-white transition-colors no-underline" onClick={() => setMobileOpen(false)}>About</Link>
              <Link href="/enquire" className="block px-2 py-2 text-off-white hover:text-white transition-colors no-underline" onClick={() => setMobileOpen(false)}>Enquire</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
