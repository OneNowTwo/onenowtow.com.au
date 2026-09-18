import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import logoUrl from "../assets/logo.png";

const serviceLinks = [
  {
    href: "/industrial-warehouse-property-video",
    label: "Industrial & Warehouse",
  },
  {
    href: "/retail-shopping-precinct-video",
    label: "Retail & Shopping Precincts",
  },
  {
    href: "/hotel-hospitality-property-video",
    label: "Hotels, Hospitality & Tourism",
  },
  {
    href: "/property-development-video",
    label: "Property Developments",
  },
];

export default function Nav() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location]);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location]);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 200);
  };

  const linkClass =
    "nav-link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy)]";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 bg-[var(--cream)]/95 border-b border-[var(--hairline)] backdrop-blur-md transition-shadow duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex justify-between items-center py-3 md:py-3.5">
          <Link
            href="/"
            className="flex items-center no-underline -ml-1"
            aria-label="One Now Two"
            data-testid="link-logo"
          >
            <img
              src={logoUrl}
              alt="One Now Two commercial property video production Sydney"
              className="w-auto h-16 md:h-20 invert transition-opacity opacity-95 hover:opacity-100"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`${linkClass} flex items-center gap-1 py-2`}
                type="button"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                Services
                <svg
                  className="w-3 h-3 opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {servicesOpen && (
                <div className="nav-dropdown" role="menu">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm text-[var(--ink)]/75 hover:text-[var(--navy)] hover:bg-[var(--navy)]/5 transition-colors no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--navy)]"
                      onClick={() => setServicesOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/portfolio" className={linkClass}>
              Portfolio
            </Link>
            <Link href="/case-studies" className={linkClass}>
              Case Studies
            </Link>
            <Link href="/about" className={linkClass}>
              About
            </Link>
            <Link
              href="/enquire"
              className="btn-outline"
              data-testid="button-enquire-header"
            >
              Enquire
            </Link>
          </div>

          <button
            className="lg:hidden p-2 min-h-11 min-w-11 text-[var(--ink)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            type="button"
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

        {mobileOpen && (
          <div className="lg:hidden border-t border-[var(--hairline)] py-4 space-y-1 bg-[var(--cream)]">
            <p className="px-2 py-1 text-xs uppercase tracking-wider text-soft-grey">
              Services
            </p>
            {serviceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-2 py-2.5 text-soft-grey hover:text-[var(--navy)] transition-colors no-underline"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[var(--hairline)] mt-2 space-y-1">
              <Link
                href="/portfolio"
                className="block px-2 py-2.5 nav-link no-underline"
                onClick={() => setMobileOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                href="/case-studies"
                className="block px-2 py-2.5 nav-link no-underline"
                onClick={() => setMobileOpen(false)}
              >
                Case Studies
              </Link>
              <Link
                href="/about"
                className="block px-2 py-2.5 nav-link no-underline"
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
              <Link
                href="/enquire"
                className="block px-2 py-2.5 nav-link no-underline"
                onClick={() => setMobileOpen(false)}
              >
                Enquire
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
