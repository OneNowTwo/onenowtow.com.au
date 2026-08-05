import { useState, useRef } from "react";
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
  const isHome = location === "/";
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

  const linkClass = isHome
    ? "text-white/90 hover:text-[var(--navy)] transition-colors"
    : "nav-link";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 ${
        isHome ? "nav-on-hero" : "nav-backdrop"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex justify-between items-center py-4">
          <Link
            href="/"
            className="flex items-center no-underline"
            aria-label="One Now Two"
            data-testid="link-logo"
          >
            <img
              src={logoUrl}
              alt="One Now Two commercial property video production Sydney"
              className={`h-16 md:h-20 w-auto transition-opacity opacity-90 hover:opacity-100 ${
                isHome ? "" : "invert"
              }`}
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
              >
                Services
                <svg
                  className="w-3 h-3 opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {servicesOpen && (
                <div className="nav-dropdown">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-[var(--ink)]/75 hover:text-[var(--navy)] hover:bg-[var(--navy)]/5 transition-colors no-underline"
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
              className={isHome ? "btn-outline-light" : "btn-outline"}
              data-testid="button-enquire-header"
            >
              Enquire
            </Link>
          </div>

          <button
            className={`lg:hidden p-2 ${isHome ? "text-white" : "text-[var(--ink)]"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
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
          <div
            className={`lg:hidden border-t py-4 space-y-1 ${
              isHome
                ? "border-white/20 bg-black/70"
                : "border-[var(--hairline)] bg-[var(--cream)]"
            }`}
          >
            <p
              className={`px-2 py-1 text-xs uppercase tracking-wider ${
                isHome ? "text-white/60" : "text-soft-grey"
              }`}
            >
              Services
            </p>
            {serviceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-2 py-2 transition-colors no-underline ${
                  isHome
                    ? "text-white/80 hover:text-[var(--navy)]"
                    : "text-soft-grey hover:text-[var(--navy)]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div
              className={`pt-2 border-t mt-2 space-y-1 ${
                isHome ? "border-white/20" : "border-[var(--hairline)]"
              }`}
            >
              <Link
                href="/portfolio"
                className={`block px-2 py-2 transition-colors no-underline ${
                  isHome ? "text-white/90 hover:text-white" : "nav-link"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                href="/case-studies"
                className={`block px-2 py-2 transition-colors no-underline ${
                  isHome ? "text-white/90 hover:text-white" : "nav-link"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                Case Studies
              </Link>
              <Link
                href="/about"
                className={`block px-2 py-2 transition-colors no-underline ${
                  isHome ? "text-white/90 hover:text-white" : "nav-link"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
              <Link
                href="/enquire"
                className={`block px-2 py-2 transition-colors no-underline ${
                  isHome ? "text-white/90 hover:text-white" : "nav-link"
                }`}
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
