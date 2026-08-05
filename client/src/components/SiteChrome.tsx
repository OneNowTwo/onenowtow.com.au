import { Link } from "wouter";

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
          <Link href="/blog" className="hover:text-white transition-colors">
            Blog
          </Link>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} One Now Two — Sydney, Australia</div>
          <div className="flex gap-6">
            <Link href="/services" className="hover:text-white transition-colors">
              Packages
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

/** Full-bleed image band for service/SEO pages */
export function PageHeroImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 mb-16">
      <div className="aspect-[21/9] md:aspect-[2.4/1] overflow-hidden rounded-lg bg-[var(--hairline)]">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}

/** Two-up image strip */
export function ImagePair({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img) => (
          <div
            key={img.src}
            className="aspect-[4/3] overflow-hidden rounded-lg bg-[var(--hairline)]"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
