export const POINTS_EARN = [
  {
    id: "video_approved",
    points: 100,
    title: "Approved Looksee",
    detail: "Film a real hostel walkthrough. Once it passes review, you get 100 points.",
  },
  {
    id: "first_upload_bonus",
    points: 100,
    title: "First Looksee bonus",
    detail: "Your first approved video also unlocks a one-time +100. First post = 200.",
  },
  {
    id: "helpful_10",
    points: 25,
    title: "Helped 10 travellers",
    detail: "When 10 people mark your video helpful, you pick up another 25.",
  },
  {
    id: "helpful_50",
    points: 50,
    title: "Helped 50 travellers",
    detail: "A Looksee that actually helps people book? That’s +50 more.",
  },
] as const;

export type RewardCategory =
  | "pub"
  | "bar"
  | "nightclub"
  | "surf"
  | "experience"
  | "food";

export type AffiliateOffer = {
  id: string;
  destinationSlug: string;
  destinationName: string;
  name: string;
  area: string;
  category: RewardCategory;
  offer: string;
  pointsCost: number;
  valueLabel: string;
  blurb: string;
};

export const REWARD_CATEGORY_LABELS: Record<RewardCategory, string> = {
  pub: "Pub",
  bar: "Bar",
  nightclub: "Nightclub",
  surf: "Surf",
  experience: "Experience",
  food: "Food",
};

/** What points buy. Costs line up with earn rates: 1 video = a drink, a few videos = a night out. */
export const POINTS_REWARDS = [
  {
    points: 100,
    title: "Schooner or house drink",
    detail: "One approved Looksee = a cold one at a partner pub or bar.",
    category: "pub" as RewardCategory,
  },
  {
    points: 150,
    title: "Pizza + pint",
    detail: "Late feed after the pub crawl. Typical $12–18 value.",
    category: "food" as RewardCategory,
  },
  {
    points: 200,
    title: "Nightclub or backpacker bar entry",
    detail: "Skip the door charge at a partner club or hostel bar night.",
    category: "nightclub" as RewardCategory,
  },
  {
    points: 250,
    title: "Cocktail or two house wines",
    detail: "A proper sit-down drink, not just the happy-hour tap.",
    category: "bar" as RewardCategory,
  },
  {
    points: 400,
    title: "Intro surf lesson",
    detail: "Group lesson discount on the east coast — Bondi, Byron, Noosa, Coolangatta.",
    category: "surf" as RewardCategory,
  },
  {
    points: 600,
    title: "Snorkel or reef day add-on",
    detail: "Whitsundays or Cairns reef trip credit. A few Looksees cover a chunk of the tour.",
    category: "experience" as RewardCategory,
  },
  {
    points: 800,
    title: "Harbour Bridge climb discount",
    detail: "Serious Sydney bucket-list credit. Roughly a few nights of filming.",
    category: "experience" as RewardCategory,
  },
] as const;

export const AFFILIATE_OFFERS: AffiliateOffer[] = [
  {
    id: "syd-pitt-pub",
    destinationSlug: "sydney",
    destinationName: "Sydney",
    name: "Pitt Street Schooner",
    area: "Haymarket / Central",
    category: "pub",
    offer: "House schooner or basic spirit mix",
    pointsCost: 100,
    valueLabel: "~$9",
    blurb: "Two minutes from Wake Up and Railway Square. The classic first-night pint.",
  },
  {
    id: "syd-kings-cross",
    destinationSlug: "sydney",
    destinationName: "Sydney",
    name: "Cross Social",
    area: "Potts Point",
    category: "nightclub",
    offer: "Guest-list / door charge waived",
    pointsCost: 200,
    valueLabel: "~$15–25",
    blurb: "Backpacker club night. Show your Looksee balance at the door when partners go live.",
  },
  {
    id: "syd-bondi-surf",
    destinationSlug: "sydney",
    destinationName: "Sydney",
    name: "Bondi Intro Surf",
    area: "Bondi Beach",
    category: "surf",
    offer: "Group lesson discount",
    pointsCost: 400,
    valueLabel: "~$25 off",
    blurb: "Board, wetsuit, 2 hours. The reason people stay at Mad Monkey.",
  },
  {
    id: "syd-bridge",
    destinationSlug: "sydney",
    destinationName: "Sydney",
    name: "Harbour Bridge climb",
    area: "The Rocks",
    category: "experience",
    offer: "Climb credit / discount",
    pointsCost: 800,
    valueLabel: "~$40–60 off",
    blurb: "The big one. A handful of approved hostel videos toward a Sydney icon.",
  },
  {
    id: "syd-late-pizza",
    destinationSlug: "sydney",
    destinationName: "Sydney",
    name: "Chinatown Late Slice",
    area: "Haymarket",
    category: "food",
    offer: "Pizza + pint combo",
    pointsCost: 150,
    valueLabel: "~$16",
    blurb: "After the hostel bar shuts. Walking distance from Base Sydney.",
  },
  {
    id: "byr-beach-hotel",
    destinationSlug: "byron-bay",
    destinationName: "Byron Bay",
    name: "Bay Street Jugs",
    area: "Town centre",
    category: "pub",
    offer: "Schooner or share jug discount",
    pointsCost: 100,
    valueLabel: "~$10",
    blurb: "The courtyard pint after a Nomads or Wake Up check-in.",
  },
  {
    id: "byr-surf",
    destinationSlug: "byron-bay",
    destinationName: "Byron Bay",
    name: "The Pass Surf School",
    area: "Main Beach / The Pass",
    category: "surf",
    offer: "Intro group lesson",
    pointsCost: 400,
    valueLabel: "~$25 off",
    blurb: "Byron’s the surf town. Points should get you in the water, not just the pub.",
  },
  {
    id: "byr-club",
    destinationSlug: "byron-bay",
    destinationName: "Byron Bay",
    name: "Cavanbah Nights",
    area: "Jonson Street",
    category: "nightclub",
    offer: "Entry or first drink",
    pointsCost: 200,
    valueLabel: "~$15",
    blurb: "Backpacker night out without another $20 at the door.",
  },
  {
    id: "gc-surfers-club",
    destinationSlug: "gold-coast",
    destinationName: "Gold Coast",
    name: "Orchid Avenue Door",
    area: "Surfers Paradise",
    category: "nightclub",
    offer: "Club entry waived",
    pointsCost: 200,
    valueLabel: "~$20",
    blurb: "The strip. If you filmed Surf & Sun or Nomads, this is the night.",
  },
  {
    id: "gc-coolangatta-surf",
    destinationSlug: "gold-coast",
    destinationName: "Gold Coast",
    name: "Snapper Surf Lesson",
    area: "Coolangatta",
    category: "surf",
    offer: "Group lesson discount",
    pointsCost: 400,
    valueLabel: "~$25 off",
    blurb: "Better waves than Surfers. Pairs with Coolangatta YHA stays.",
  },
  {
    id: "gc-pub",
    destinationSlug: "gold-coast",
    destinationName: "Gold Coast",
    name: "Cavill Tap",
    area: "Surfers Paradise",
    category: "pub",
    offer: "House schooner",
    pointsCost: 100,
    valueLabel: "~$9",
    blurb: "Pre-club pint. One Looksee covers it.",
  },
  {
    id: "bne-valley",
    destinationSlug: "brisbane",
    destinationName: "Brisbane",
    name: "Valley Guest List",
    area: "Fortitude Valley",
    category: "nightclub",
    offer: "Door charge waived",
    pointsCost: 200,
    valueLabel: "~$15–20",
    blurb: "Why people stay at Bunk. Film the hostel, spend it on the night out.",
  },
  {
    id: "bne-pub",
    destinationSlug: "brisbane",
    destinationName: "Brisbane",
    name: "Roma Street Pint",
    area: "CBD / South Bank",
    category: "pub",
    offer: "House schooner",
    pointsCost: 100,
    valueLabel: "~$9",
    blurb: "Handy for Brisbane City YHA and Base Uptown.",
  },
  {
    id: "bne-bar",
    destinationSlug: "brisbane",
    destinationName: "Brisbane",
    name: "West End Wine",
    area: "West End",
    category: "bar",
    offer: "House wine or cocktail",
    pointsCost: 250,
    valueLabel: "~$18",
    blurb: "Chill night for Somewhere To Stay people who skip the Valley.",
  },
  {
    id: "noo-surf",
    destinationSlug: "noosa",
    destinationName: "Noosa",
    name: "Noosa Heads Surf",
    area: "Main Beach",
    category: "surf",
    offer: "Intro lesson discount",
    pointsCost: 400,
    valueLabel: "~$25 off",
    blurb: "Halse Lodge is a two-minute walk from the break.",
  },
  {
    id: "noo-bar",
    destinationSlug: "noosa",
    destinationName: "Noosa",
    name: "Hastings Sundowner",
    area: "Hastings Street",
    category: "bar",
    offer: "Cocktail or two house beers",
    pointsCost: 250,
    valueLabel: "~$20",
    blurb: "The fancy strip. Points take the sting out of Noosa prices.",
  },
  {
    id: "air-lagoon",
    destinationSlug: "airlie-beach",
    destinationName: "Airlie Beach",
    name: "Lagoon Bar Tab",
    area: "Airlie Esplanade",
    category: "bar",
    offer: "First drink or schooner",
    pointsCost: 100,
    valueLabel: "~$10",
    blurb: "Base and Beaches are on the lagoon. This is the 4pm ritual.",
  },
  {
    id: "air-club",
    destinationSlug: "airlie-beach",
    destinationName: "Airlie Beach",
    name: "Shute Harbour Nights",
    area: "Main strip",
    category: "nightclub",
    offer: "Backpacker bar entry",
    pointsCost: 200,
    valueLabel: "~$15",
    blurb: "Magnums energy without paying twice — once for the dorm, once for the door.",
  },
  {
    id: "air-reef",
    destinationSlug: "airlie-beach",
    destinationName: "Airlie Beach",
    name: "Whitsundays snorkel credit",
    area: "Marina",
    category: "experience",
    offer: "Day-trip discount",
    pointsCost: 600,
    valueLabel: "~$30–40 off",
    blurb: "The reason you came to Airlie. A few hostel videos toward the boat.",
  },
  {
    id: "cns-gilligans",
    destinationSlug: "cairns",
    destinationName: "Cairns",
    name: "Grafton Street Bar",
    area: "City",
    category: "nightclub",
    offer: "Entry or first drink",
    pointsCost: 200,
    valueLabel: "~$15",
    blurb: "The Cairns backpacker night. Film Gilligan’s, spend it downstairs.",
  },
  {
    id: "cns-reef",
    destinationSlug: "cairns",
    destinationName: "Cairns",
    name: "Outer reef day credit",
    area: "Reef fleet",
    category: "experience",
    offer: "Tour discount",
    pointsCost: 600,
    valueLabel: "~$30–40 off",
    blurb: "The expensive day. Points from hostel videos should chip the ticket.",
  },
  {
    id: "cns-pub",
    destinationSlug: "cairns",
    destinationName: "Cairns",
    name: "Esplanade Pint",
    area: "Cairns Esplanade",
    category: "pub",
    offer: "House schooner",
    pointsCost: 100,
    valueLabel: "~$9",
    blurb: "Tropic Days territory. One Looksee, one beer, watch the bats.",
  },
];

export const HOME_FAQS = [
  {
    q: "What is Looksee?",
    a: "Looksee is hostel videos filmed by travellers who just stayed there — dorms, bathrooms, kitchens, common rooms. Not the property’s marketing shoot.",
  },
  {
    q: "How do Looksee Points work?",
    a: "Approved videos earn 100 points. Your first approved Looksee also gets a +100 bonus. If other travellers mark your video helpful, you can earn another 25 (at 10) and 50 (at 50). Spend points on backpacker stuff: pints, club entry, surf lessons, reef trips, a Bridge climb.",
  },
  {
    q: "What can I actually get with points?",
    a: "100 points is roughly a schooner. 200 is nightclub entry. 400 is an intro surf lesson. 600 is a snorkel/reef credit. 800 is a Harbour Bridge climb discount. Partners are rolling out city by city along the east coast.",
  },
  {
    q: "When can I redeem?",
    a: "You can earn points now. Redemption goes live with each city’s partners — pubs, bars, clubs, surf schools and experiences. We’ll show a code or QR on your profile when a venue is live.",
  },
  {
    q: "Who can upload?",
    a: "Anyone who’s actually staying (or just stayed) at the hostel. Film recent, unfiltered walkthroughs. We review before videos go public, and before points land.",
  },
  {
    q: "Do hostels pay for this?",
    a: "No. Hostels don’t buy rankings or hide bad rooms. Booking links may earn Looksee a commission. Points come from filming useful videos, not from the property.",
  },
  {
    q: "How recent are the videos?",
    a: "We surface the newest approved Looksees first. If a hostel only has older clips, you’ll see that on the card. The whole point is “what it looks like right now.”",
  },
] as const;

export function affiliatesForDestination(slug: string): AffiliateOffer[] {
  return AFFILIATE_OFFERS.filter((offer) => offer.destinationSlug === slug);
}

export function destinationSlugsWithAffiliates(): Array<{ slug: string; name: string }> {
  const seen = new Map<string, string>();
  for (const offer of AFFILIATE_OFFERS) {
    if (!seen.has(offer.destinationSlug)) {
      seen.set(offer.destinationSlug, offer.destinationName);
    }
  }
  return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
}
