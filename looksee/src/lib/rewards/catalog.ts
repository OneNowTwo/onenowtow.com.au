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

/** Core spend ladder — Looksee marketing currency, not a payment system. */
export const POINTS_REWARDS = [
  {
    points: 100,
    title: "Free schooner / house drink",
    detail: "One approved Looksee. The bar’s cost is a couple of dollars; you walk in with mates.",
    category: "pub" as RewardCategory,
  },
  {
    points: 200,
    title: "Nightclub entry",
    detail: "Door charge waived at a partner backpacker bar or club.",
    category: "nightclub" as RewardCategory,
  },
  {
    points: 250,
    title: "Cocktail",
    detail: "A proper drink, not just the tap special.",
    category: "bar" as RewardCategory,
  },
  {
    points: 400,
    title: "Surf lesson discount",
    detail: "Typical $20 off an intro group lesson — Bondi, Byron, Noosa, Coolangatta.",
    category: "surf" as RewardCategory,
  },
  {
    points: 600,
    title: "Reef / snorkel discount",
    detail: "Credit off a Whitsundays or Cairns day trip. A few Looksees toward the boat.",
    category: "experience" as RewardCategory,
  },
  {
    points: 800,
    title: "BridgeClimb discount",
    detail: "Sydney bucket-list credit. Looksee created the points; the operator gives the deal.",
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
    valueLabel: "Free schooner",
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
    valueLabel: "Entry waived",
    blurb: "Backpacker club night. Show your Looksee code at the door when partners go live.",
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
    valueLabel: "$20 off",
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
    valueLabel: "Climb discount",
    blurb: "The big one. A handful of approved hostel videos toward a Sydney icon.",
  },
  {
    id: "syd-chinatown-pour",
    destinationSlug: "sydney",
    destinationName: "Sydney",
    name: "Chinatown House Pour",
    area: "Haymarket",
    category: "pub",
    offer: "House schooner",
    pointsCost: 100,
    valueLabel: "Free schooner",
    blurb: "After the hostel bar shuts. Walking distance from Base Sydney.",
  },
  {
    id: "syd-cocktail",
    destinationSlug: "sydney",
    destinationName: "Sydney",
    name: "Darlinghurst Mixer",
    area: "Darlinghurst",
    category: "bar",
    offer: "House cocktail",
    pointsCost: 250,
    valueLabel: "Cocktail",
    blurb: "A proper drink after the hostel bar. Oxford Street, walking distance from most CBD dorms.",
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
    valueLabel: "Free schooner",
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
    valueLabel: "$20 off",
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
    valueLabel: "Entry waived",
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
    valueLabel: "Entry waived",
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
    valueLabel: "$20 off",
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
    valueLabel: "Free schooner",
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
    valueLabel: "Entry waived",
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
    valueLabel: "Free schooner",
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
    valueLabel: "Cocktail",
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
    valueLabel: "$20 off",
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
    valueLabel: "Cocktail",
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
    valueLabel: "Free schooner",
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
    valueLabel: "Entry waived",
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
    valueLabel: "Tour discount",
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
    valueLabel: "Entry waived",
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
    valueLabel: "Tour discount",
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
    valueLabel: "Free schooner",
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
    a: "Upload a useful hostel video. If we approve it, you get 100 points (200 on your first). Helpful videos can earn extra. Spend those points on drinks, nights out, surf lessons and experiences while you travel. Points are Looksee’s backpacker currency — not cash, not a bank balance.",
  },
  {
    q: "What can I get with points?",
    a: "100 = free schooner / house drink. 200 = nightclub entry. 250 = cocktail. 400 = surf lesson discount. 600 = reef/snorkel discount. 800 = BridgeClimb discount. Three useful videos is already a night out.",
  },
  {
    q: "Do businesses buy or owe us points?",
    a: "No. Looksee creates the points. The venue provides the reward (a beer, a discount, door entry). When you redeem, points leave your Looksee account. The bar doesn’t purchase 100 points from us — they give you a schooner that maybe cost them $2–$3, and they get a backpacker (and often their mates) in the door.",
  },
  {
    q: "If a venue gives a free drink and pays Looksee, don’t they lose twice?",
    a: "That’s the trap in the simple version, so we don’t sell points. The venue chooses a reward that’s cheap for them. Later we might charge a monthly listing or a small fee per customer we actually send — acquisition, not a second invoice for the beer. First partners are free until we can prove the foot traffic.",
  },
  {
    q: "How do I redeem?",
    a: "Earn points now. When a partner is live, you’ll get a code or QR on your profile. Show it at the venue, they give you the agreed reward, your points drop. We’re lining up the first venues for free to prove it works.",
  },
  {
    q: "Who can upload?",
    a: "Anyone who’s actually staying (or just stayed) at the hostel. Film in the last 14 days. Cap is 3 Looksees a day, 3 per hostel every 14 days, and one clip per area (dorm, bathroom, kitchen…) so the queue doesn’t fill with spam. We review before videos go public, and before points land.",
  },
  {
    q: "Do hostels pay to be on Looksee?",
    a: "No. Hostels don’t buy rankings or hide bad rooms. Booking links may earn Looksee a commission later. Points come from filming useful videos, not from the property.",
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
