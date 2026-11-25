export type CaseStudy = {
  slug: string;
  title: string;
  client?: string;
  sector: string;
  location: string;
  campaignGoal: string;
  whatVideoNeeded: string;
  /** Production approach — only where documented. */
  productionApproach?: string;
  body: string;
  deliverables: string[];
  vimeoId: string;
  relatedServiceHref: string;
  relatedServiceLabel: string;
  metaDescription: string;
  /** ISO date from a verified Vimeo upload. Omit when unknown. */
  uploadDate?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "investa-sydney-office-towers",
    title: "10–20 Bond Street & 100 Mount Street",
    client: "Investa",
    sector: "Commercial Offices",
    location: "Sydney CBD & North Sydney",
    campaignGoal:
      "Present two premium Sydney office assets in a single film and make their relationship across Sydney Harbour clear to an investor audience.",
    whatVideoNeeded:
      "Capture each building's architecture, arrival, workplace interiors, amenities and surrounding transport connections, while clearly locating both assets on opposite sides of the harbour.",
    productionApproach:
      "Ground-level cinematography at both properties, Sydney CBD and North Sydney drone footage, AI-assisted harbour transitions, aerial mapping and tracked building callouts.",
    body: "Two buildings, two sides of Sydney Harbour, one connected story. Our film combines detailed architectural and workplace coverage with aerial footage and purposeful motion graphics, allowing viewers to appreciate each property individually and understand how closely the two locations relate.",
    deliverables: [
      "Cinematic office property film",
      "Ground-level architectural and workplace footage",
      "Drone aerial footage",
      "AI-assisted cross-harbour transitions",
      "Animated location mapping and tracked building callouts",
    ],
    vimeoId: "1250145290",
    relatedServiceHref: "/commercial-office-video-sydney",
    relatedServiceLabel: "Commercial Office Video",
    metaDescription:
      "Investa office film by One Now Two showcasing 10–20 Bond Street in Sydney CBD and 100 Mount Street in North Sydney through drone, ground cinematography and motion graphics.",
    uploadDate: "2026-11-25",
  },
  {
    slug: "victoria-brown-chatswood",
    title: "Victoria & Brown — 475 Victoria Avenue, Chatswood",
    client: "Victoria & Brown",
    sector: "Commercial Offices",
    location: "Chatswood, Sydney",
    campaignGoal:
      "Introduce 475 Victoria Avenue as a workplace destination in Chatswood, with the building, its amenities and everyday life at the centre of the story.",
    whatVideoNeeded:
      "Communicate the building's character and facilities alongside the street-level experience and surrounding precinct, rather than presenting rooms in isolation.",
    productionApproach:
      "Produced with Alanplace using location cinematography across the architecture, workplace amenities, community spaces and Chatswood surrounds.",
    body: "475 Victoria Avenue is presented as more than an office address. This Victoria & Brown film, produced with Alanplace, connects the building's design and shared spaces with the everyday experience of working in Chatswood. The result is a destination-led property film built around the people, amenities and context of the place.",
    deliverables: [
      "Commercial property campaign film",
      "Architectural and ground-level cinematography",
      "Workplace and shared-amenity coverage",
      "Chatswood location and precinct footage",
    ],
    vimeoId: "1250147393",
    relatedServiceHref: "/commercial-office-video-sydney",
    relatedServiceLabel: "Commercial Office Video",
    metaDescription:
      "Victoria & Brown at 475 Victoria Avenue, Chatswood. A cinematic commercial office and workplace film produced by One Now Two with Alanplace.",
    uploadDate: "2026-11-25",
  },
  {
    slug: "gibbons-group-industrial",
    title: "Industrial Campaign",
    client: "Gibbons Group",
    sector: "Industrial & Logistics",
    location: "Sydney",
    campaignGoal:
      "Produce an industrial property campaign film for Gibbons Group.",
    whatVideoNeeded:
      "Communicate the practical character of the industrial asset — scale, setting and opportunity — for commercial property audiences.",
    productionApproach:
      "Industrial campaign video produced for Gibbons Group.",
    body: "Industrial buyers and occupiers need to understand how an asset works. This campaign film for Gibbons Group presents the property in a clear, cinematic format for commercial property communications.",
    deliverables: [
      "Campaign video",
    ],
    vimeoId: "1225814922",
    relatedServiceHref: "/industrial-warehouse-property-video",
    relatedServiceLabel: "Industrial & Warehouse Video",
    metaDescription:
      "Industrial property video case study for Gibbons Group. Commercial property campaign film by One Now Two.",
  },
  {
    slug: "198-power-street-glendenning",
    title: "198 Power Street, Glendenning",
    sector: "Industrial & Logistics",
    location: "Glendenning, Western Sydney",
    campaignGoal:
      "Showcase a freestanding industrial asset and communicate the practical features that matter to occupiers.",
    whatVideoNeeded:
      "The campaign needed to communicate scale, access, loading, hardstand, power and connectivity quickly.",
    productionApproach:
      "Ground and aerial coverage with motion graphics to clarify access and site context for buyers and occupiers.",
    body: "For industrial and logistics assets, buyers and occupiers need to understand how the site functions. The video helped show the property in motion, giving viewers a clearer understanding of the opportunity beyond still photography.",
    deliverables: [
      "Campaign video",
      "Drone footage",
      "Ground coverage",
      "Motion graphics",
      "Social cutdowns",
    ],
    vimeoId: "1215684356",
    relatedServiceHref: "/industrial-warehouse-property-video",
    relatedServiceLabel: "Industrial & Warehouse Video",
    metaDescription:
      "Industrial property video case study for 198 Power Street, Glendenning. Campaign film showing scale, access, loading, hardstand and connectivity.",
  },
  {
    slug: "the-yards",
    title: "The Yards, Kemps Creek",
    sector: "Industrial / Precinct",
    location: "Kemps Creek, Western Sydney",
    campaignGoal:
      "Capture the character and opportunity of the industrial precinct for campaign and sales communications.",
    whatVideoNeeded:
      "The film needed to explain how the asset sits in context — movement, atmosphere and the story of the place — not just façade and floor plate.",
    productionApproach:
      "Hero campaign film combining drone, ground coverage and motion graphics for precinct storytelling.",
    body: "Stills can document an asset. Video helps audiences understand why it matters. For The Yards at Kemps Creek, the campaign film brought scale, location and opportunity into a single, clear narrative for buyers and stakeholders.",
    deliverables: [
      "Campaign hero video",
      "Drone footage",
      "Social cutdowns",
      "Motion graphics",
    ],
    vimeoId: "1215685136",
    relatedServiceHref: "/industrial-warehouse-property-video",
    relatedServiceLabel: "Industrial & Warehouse Video",
    metaDescription:
      "Industrial property video case study for The Yards, Kemps Creek. Campaign film for precinct storytelling, scale and opportunity in Western Sydney.",
  },
  {
    slug: "emu-plains-industrial",
    title: "Emu Plains Development",
    client: "CBRE",
    sector: "Industrial & Warehouse",
    location: "Emu Plains, Western Sydney",
    campaignGoal:
      "Support a commercial industrial campaign with video that clarifies how the asset works on the ground.",
    whatVideoNeeded:
      "Occupiers needed to see scale, access, layout and surrounding connectivity — details that still photography alone can struggle to explain.",
    productionApproach:
      "Campaign film with drone coverage and motion graphics produced for CBRE’s industrial opportunity at Emu Plains.",
    body: "Industrial buyers and occupiers are often trying to understand how a site functions. Video can show movement, access, layout and surrounding infrastructure in a way that still photography cannot always communicate clearly.",
    deliverables: [
      "Campaign video",
      "Drone footage",
      "Motion graphics",
      "Social cutdowns",
    ],
    vimeoId: "1172749465",
    relatedServiceHref: "/industrial-warehouse-property-video",
    relatedServiceLabel: "Industrial & Warehouse Video",
    metaDescription:
      "Industrial warehouse property video case study for CBRE Emu Plains Development. Scale, access and connectivity for Western Sydney logistics.",
  },
  {
    slug: "jll-hotels-social-collective",
    title: "Social Collective",
    client: "JLL Hotels",
    sector: "Hotels & Hospitality",
    location: "Sydney",
    campaignGoal:
      "Create hospitality-focused campaign content that communicates character, ambience and investor appeal.",
    whatVideoNeeded:
      "Hotel and hospitality assets need more than clean visuals — the film had to carry story, atmosphere and the neighbourhood context that drives interest.",
    productionApproach:
      "Campaign and social-ready hospitality storytelling formatted for listing and social use.",
    body: "Hospitality property campaigns are not just about floor area and yield. The strongest campaigns communicate character, heritage, ambience, location and future potential.",
    deliverables: [
      "Campaign / social film",
      "Hospitality storytelling",
      "Social cutdowns",
    ],
    vimeoId: "1195210804",
    relatedServiceHref: "/hotel-hospitality-property-video",
    relatedServiceLabel: "Hotel & Hospitality Video",
    metaDescription:
      "Hotel and hospitality property video case study for JLL Hotels Social Collective. Character, ambience and investor appeal.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
