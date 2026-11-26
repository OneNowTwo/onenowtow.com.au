import { caseStudies } from "../client/src/lib/caseStudies";

export const SITE_URL = "https://www.onenowtwo.com.au";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/media/hero/hero-poster.jpg`;

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  robots: string;
  ogImage: string;
  status: 200 | 404;
  known: boolean;
  schema?: Record<string, unknown> | Record<string, unknown>[];
};

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
    thumbnailUrl: `${SITE_URL}/media/thumbs/${vimeoId}.jpg`,
    embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
    contentUrl: `https://vimeo.com/${vimeoId}`,
    ...(uploadDate ? { uploadDate } : {}),
    publisher: {
      "@type": "Organization",
      name: "One Now Two",
      url: SITE_URL,
    },
  };
}

function meta(
  path: string,
  title: string,
  description: string,
  extras: Partial<PageMeta> = {},
): PageMeta {
  return {
    path,
    title,
    description,
    robots: extras.robots ?? "index, follow",
    ogImage: extras.ogImage ?? DEFAULT_OG_IMAGE,
    status: extras.status ?? 200,
    known: extras.known ?? true,
    schema: extras.schema,
  };
}

function caseStudyDisplayTitle(study: (typeof caseStudies)[number]) {
  return study.client && !study.title.startsWith(study.client)
    ? `${study.title} — ${study.client}`
    : study.title;
}

const PAGE_META: Record<string, PageMeta> = {
  "/": meta(
    "/",
    "One Now Two | Commercial Property Video Production Sydney",
    "Commercial property video, drone and photography for agents, vendors and property sales teams across Sydney and NSW. Industrial, warehouse, hotel and hospitality campaigns.",
    { schema: localBusinessSchema },
  ),
  "/services": meta(
    "/services",
    "Production packages | One Now Two",
    "Campaign video production packages for commercial property. Discuss scope and deliverables with One Now Two, Sydney.",
  ),
  "/portfolio": meta(
    "/portfolio",
    "Portfolio | Commercial Property Video | One Now Two",
    "Selected commercial property films by One Now Two — office, industrial, hospitality, retail and development campaigns across Sydney and Australia.",
  ),
  "/about": meta(
    "/about",
    "About | One Now Two",
    "One Now Two is a Sydney-based production company creating commercial property video, drone and photography for campaigns across Australia.",
  ),
  "/enquire": meta(
    "/enquire",
    "Enquire | One Now Two",
    "Discuss a commercial property video, drone or photography campaign with One Now Two.",
  ),
  "/thanks": meta(
    "/thanks",
    "Thank you | One Now Two",
    "We've received your enquiry and will be in touch to discuss your commercial property campaign.",
    { robots: "noindex, follow" },
  ),
  "/commercial-office-video-sydney": meta(
    "/commercial-office-video-sydney",
    "Commercial Office Video Production Sydney | One Now Two",
    "Cinematic video production for commercial office buildings in Sydney. One Now Two helps agents and developers market office assets with high-quality property videos that attract tenants and investors.",
  ),
  "/development-marketing-video-sydney": meta(
    "/development-marketing-video-sydney",
    "Development Marketing Video Production Sydney | One Now Two",
    "Video production for property developers in Sydney. One Now Two creates cinematic development marketing videos for commercial, mixed-use and industrial development projects.",
  ),
  "/drone-aerial-property-video-sydney": meta(
    "/drone-aerial-property-video-sydney",
    "Drone & Aerial Property Video Sydney | One Now Two",
    "Professional drone and aerial video for commercial property in Sydney. One Now Two provides CASA-certified drone filming for property listings, development sites and marketing campaigns.",
  ),
  "/blog": meta(
    "/blog",
    "Blog | One Now Two — Commercial Property Video Sydney",
    "Insights on commercial property video production, marketing, and the Sydney real estate market from One Now Two.",
  ),
  "/blog/commercial-property-video-production-sydney": meta(
    "/blog/commercial-property-video-production-sydney",
    "Commercial Property Video Production Sydney — Why Agents Are Making the Switch | One Now Two",
    "Why Sydney's top commercial real estate agents are investing in professional video production for their property listings — and what it's doing for their campaigns.",
  ),
  "/commercial-property-video-production-sydney": meta(
    "/commercial-property-video-production-sydney",
    "Commercial Property Video Production Sydney | One Now Two",
    "Commercial property video production in Sydney for industrial, warehouse, office, hotel and hospitality campaigns. Strategy, filming, drone, editing, motion graphics and social cutdowns.",
    { schema: localBusinessSchema },
  ),
  "/industrial-warehouse-property-video": meta(
    "/industrial-warehouse-property-video",
    "Industrial & Warehouse Property Video Sydney | One Now Two",
    "Industrial and warehouse property video production for Sydney commercial real estate campaigns. Show scale, truck access, loading, hardstand, clearance and connectivity.",
  ),
  "/commercial-property-photography-drone": meta(
    "/commercial-property-photography-drone",
    "Commercial Property Photography & Drone Sydney | One Now Two",
    "Ground photography, aerial stills, drone footage and video content for commercial property campaigns in Sydney. Package stills, drone and video into one efficient shoot.",
  ),
  "/hotel-hospitality-property-video": meta(
    "/hotel-hospitality-property-video",
    "Hotel, Hospitality & Tourism Video Sydney | One Now Two",
    "Video production for hotels, pubs, hospitality venues and tourism precinct campaigns. Capture heritage, ambience, local story and investor appeal.",
  ),
  "/retail-shopping-precinct-video": meta(
    "/retail-shopping-precinct-video",
    "Retail & Shopping Centre Video Sydney | One Now Two",
    "Video for retail centres, shopping precincts and mixed-use campaigns. Show location, tenant mix, foot traffic, trade area and future upside.",
  ),
  "/property-development-video": meta(
    "/property-development-video",
    "Property Development Video Sydney | One Now Two",
    "Video for property developments across Sydney. Scale, context, infrastructure, progress and future potential for investors, tenants and sales teams.",
  ),
  "/case-studies": meta(
    "/case-studies",
    "Commercial Property Video Case Studies | One Now Two",
    "Recent commercial property video work by One Now Two across industrial, hospitality, office, retail and commercial real estate campaigns.",
  ),
};

for (const study of caseStudies) {
  const displayTitle = caseStudyDisplayTitle(study);
  const path = `/case-studies/${study.slug}`;
  PAGE_META[path] = meta(
    path,
    `${displayTitle} | Commercial Property Video Case Study | One Now Two`,
    study.metaDescription,
    {
      schema: videoObjectSchema({
        name: displayTitle,
        description: study.metaDescription,
        vimeoId: study.vimeoId,
        uploadDate: study.uploadDate,
      }),
    },
  );
}

const notFoundMeta = meta(
  "/",
  "Page not found | One Now Two",
  "The page you requested is not available. Visit One Now Two for commercial property video production in Sydney.",
  { robots: "noindex, follow", status: 404, known: false },
);

export function getRequestPath(url: string): string {
  const pathOnly = url.split("?")[0].split("#")[0] || "/";
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) {
    return pathOnly.slice(0, -1);
  }
  return pathOnly;
}

export function getPageMeta(pathname: string): PageMeta {
  const path = getRequestPath(pathname);
  const found = PAGE_META[path];
  if (found) return found;
  return { ...notFoundMeta, path };
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function upsertMeta(
  html: string,
  attr: "name" | "property",
  key: string,
  content: string,
): string {
  const re = new RegExp(
    `<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*\\/?>`,
    "i",
  );
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

export function applyPageMetaToHtml(html: string, page: PageMeta): string {
  const url = `${SITE_URL}${page.path}`;
  let next = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(page.title)}</title>`);
  if (/<link\s+rel="canonical"/i.test(next)) {
    next = next.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${url}" />`,
    );
  } else {
    next = next.replace("</head>", `    <link rel="canonical" href="${url}" />\n  </head>`);
  }

  next = upsertMeta(next, "name", "description", page.description);
  next = upsertMeta(next, "name", "robots", page.robots);
  next = upsertMeta(next, "property", "og:title", page.title);
  next = upsertMeta(next, "property", "og:description", page.description);
  next = upsertMeta(next, "property", "og:url", url);
  next = upsertMeta(next, "property", "og:type", "website");
  next = upsertMeta(next, "property", "og:image", page.ogImage);
  next = upsertMeta(next, "name", "twitter:card", "summary_large_image");
  next = upsertMeta(next, "name", "twitter:title", page.title);
  next = upsertMeta(next, "name", "twitter:description", page.description);
  next = upsertMeta(next, "name", "twitter:image", page.ogImage);

  next = next.replace(
    /\s*<script type="application\/ld\+json" data-seo-schema="true">[\s\S]*?<\/script>/g,
    "",
  );

  if (page.schema) {
    const schemas = Array.isArray(page.schema) ? page.schema : [page.schema];
    const scripts = schemas
      .map(
        (item) =>
          `    <script type="application/ld+json" data-seo-schema="true">${JSON.stringify(item)}</script>`,
      )
      .join("\n");
    next = next.replace("</head>", `${scripts}\n  </head>`);
  }

  return next;
}

function setDocumentMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function applyPageMetaToDocument(page: PageMeta) {
  if (typeof document === "undefined") return;

  document.title = page.title;
  const url = `${SITE_URL}${page.path}`;

  setDocumentMeta("name", "description", page.description);
  setDocumentMeta("name", "robots", page.robots);
  setDocumentMeta("property", "og:title", page.title);
  setDocumentMeta("property", "og:description", page.description);
  setDocumentMeta("property", "og:url", url);
  setDocumentMeta("property", "og:type", "website");
  setDocumentMeta("property", "og:image", page.ogImage);
  setDocumentMeta("name", "twitter:card", "summary_large_image");
  setDocumentMeta("name", "twitter:title", page.title);
  setDocumentMeta("name", "twitter:description", page.description);
  setDocumentMeta("name", "twitter:image", page.ogImage);

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);

  document.querySelectorAll("script[data-seo-schema]").forEach((node) => node.remove());
  if (page.schema) {
    const schemas = Array.isArray(page.schema) ? page.schema : [page.schema];
    schemas.forEach((item) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-schema", "true");
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    });
  }
}
