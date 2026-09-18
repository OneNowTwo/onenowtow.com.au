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
};

export const caseStudies: CaseStudy[] = [
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
