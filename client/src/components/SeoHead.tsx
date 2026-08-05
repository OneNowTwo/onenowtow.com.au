import { useEffect } from "react";

interface SeoHeadProps {
  title: string;
  description: string;
  path: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_URL = "https://www.onenowtwo.com.au";

export function SeoHead({ title, description, path, schema }: SeoHeadProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", `${SITE_URL}${path}`);
    setMeta("property", "og:type", "website");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE_URL}${path}`);

    const existing = document.querySelectorAll('script[data-seo-schema]');
    existing.forEach((node) => node.remove());

    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      schemas.forEach((item) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-schema", "true");
        script.textContent = JSON.stringify(item);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.querySelectorAll('script[data-seo-schema]').forEach((node) => node.remove());
    };
  }, [title, description, path, JSON.stringify(schema ?? null)]);

  return null;
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "One Now Two",
  url: SITE_URL,
  email: "hello@onenowtwo.com.au",
  telephone: "+61 449 783 720",
  description:
    "Commercial property video production for agents, vendors and property sales teams across Sydney and NSW.",
  areaServed: [
    { "@type": "City", name: "Sydney" },
    { "@type": "State", name: "New South Wales" },
    { "@type": "Country", name: "Australia" },
  ],
  serviceType: "Commercial property video production",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sydney",
    addressRegion: "NSW",
    addressCountry: "AU",
  },
};

export function videoObjectSchema({
  name,
  description,
  vimeoId,
  uploadDate,
}: {
  name: string;
  description: string;
  vimeoId: string;
  uploadDate?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: `https://vumbnail.com/${vimeoId}.jpg`,
    embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
    contentUrl: `https://vimeo.com/${vimeoId}`,
    uploadDate: uploadDate || "2025-01-01",
    publisher: {
      "@type": "Organization",
      name: "One Now Two",
      url: SITE_URL,
    },
  };
}
