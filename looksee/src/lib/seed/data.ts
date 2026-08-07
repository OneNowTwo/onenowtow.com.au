import type {
  Destination,
  Hostel,
  Profile,
  Rating,
  Video,
  VideoCategory,
} from "@/lib/types/database";

/** Fixed demo IDs so URLs and relations stay stable across reloads. */
const ids = {
  destinations: {
    sydney: "d1000001-0000-4000-8000-000000000001",
    byron: "d1000001-0000-4000-8000-000000000002",
    goldCoast: "d1000001-0000-4000-8000-000000000003",
    brisbane: "d1000001-0000-4000-8000-000000000004",
    noosa: "d1000001-0000-4000-8000-000000000005",
    airlie: "d1000001-0000-4000-8000-000000000006",
    cairns: "d1000001-0000-4000-8000-000000000007",
  },
  users: {
    emma: "u1000001-0000-4000-8000-000000000001",
    jake: "u1000001-0000-4000-8000-000000000002",
    sofia: "u1000001-0000-4000-8000-000000000003",
    liam: "u1000001-0000-4000-8000-000000000004",
    mia: "u1000001-0000-4000-8000-000000000005",
    noah: "u1000001-0000-4000-8000-000000000006",
    aya: "u1000001-0000-4000-8000-000000000007",
    tom: "u1000001-0000-4000-8000-000000000008",
  },
} as const;

const SAMPLE_VIDEOS = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
] as const;

const CATEGORIES: VideoCategory[] = [
  "dorm",
  "bed",
  "bathroom",
  "kitchen",
  "common_area",
  "social_nightlife",
  "private_room",
];

function daysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

export const seedProfiles: Profile[] = [
  {
    id: ids.users.emma,
    email: "emma@example.com",
    first_name: "Emma",
    avatar_url: "https://i.pravatar.cc/150?u=emma-looksee",
    nationality: "UK",
    current_city: "Sydney",
    role: "traveller",
    points_balance: 450,
    created_at: isoDaysAgo(120),
    updated_at: isoDaysAgo(2),
  },
  {
    id: ids.users.jake,
    email: "jake@example.com",
    first_name: "Jake",
    avatar_url: "https://i.pravatar.cc/150?u=jake-looksee",
    nationality: "Australia",
    current_city: "Byron Bay",
    role: "traveller",
    points_balance: 325,
    created_at: isoDaysAgo(90),
    updated_at: isoDaysAgo(1),
  },
  {
    id: ids.users.sofia,
    email: "sofia@example.com",
    first_name: "Sofia",
    avatar_url: "https://i.pravatar.cc/150?u=sofia-looksee",
    nationality: "Spain",
    current_city: "Gold Coast",
    role: "traveller",
    points_balance: 620,
    created_at: isoDaysAgo(200),
    updated_at: isoDaysAgo(3),
  },
  {
    id: ids.users.liam,
    email: "liam@example.com",
    first_name: "Liam",
    avatar_url: "https://i.pravatar.cc/150?u=liam-looksee",
    nationality: "Ireland",
    current_city: "Brisbane",
    role: "traveller",
    points_balance: 275,
    created_at: isoDaysAgo(60),
    updated_at: isoDaysAgo(5),
  },
  {
    id: ids.users.mia,
    email: "mia@example.com",
    first_name: "Mia",
    avatar_url: "https://i.pravatar.cc/150?u=mia-looksee",
    nationality: "Canada",
    current_city: "Noosa",
    role: "traveller",
    points_balance: 510,
    created_at: isoDaysAgo(150),
    updated_at: isoDaysAgo(4),
  },
  {
    id: ids.users.noah,
    email: "noah@example.com",
    first_name: "Noah",
    avatar_url: "https://i.pravatar.cc/150?u=noah-looksee",
    nationality: "Germany",
    current_city: "Airlie Beach",
    role: "traveller",
    points_balance: 190,
    created_at: isoDaysAgo(40),
    updated_at: isoDaysAgo(6),
  },
  {
    id: ids.users.aya,
    email: "aya@example.com",
    first_name: "Aya",
    avatar_url: "https://i.pravatar.cc/150?u=aya-looksee",
    nationality: "Japan",
    current_city: "Cairns",
    role: "traveller",
    points_balance: 380,
    created_at: isoDaysAgo(80),
    updated_at: isoDaysAgo(2),
  },
  {
    id: ids.users.tom,
    email: "tom@example.com",
    first_name: "Tom",
    avatar_url: "https://i.pravatar.cc/150?u=tom-looksee",
    nationality: "USA",
    current_city: "Sydney",
    role: "traveller",
    points_balance: 100,
    created_at: isoDaysAgo(20),
    updated_at: isoDaysAgo(8),
  },
];

export const seedDestinations: Destination[] = [
  {
    id: ids.destinations.sydney,
    name: "Sydney",
    slug: "sydney",
    country: "Australia",
    description: "Harbour city hostels, beach vibes and late-night bars.",
    hero_image_url:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80",
    latitude: -33.8688,
    longitude: 151.2093,
    active: true,
    created_at: isoDaysAgo(300),
  },
  {
    id: ids.destinations.byron,
    name: "Byron Bay",
    slug: "byron-bay",
    country: "Australia",
    description: "Surf, wellness and backpacker energy on the NSW north coast.",
    hero_image_url:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    latitude: -28.6474,
    longitude: 153.602,
    active: true,
    created_at: isoDaysAgo(300),
  },
  {
    id: ids.destinations.goldCoast,
    name: "Gold Coast",
    slug: "gold-coast",
    country: "Australia",
    description: "Beachfront dorms, theme parks and Surfers nightlife.",
    hero_image_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    latitude: -28.0167,
    longitude: 153.4,
    active: true,
    created_at: isoDaysAgo(300),
  },
  {
    id: ids.destinations.brisbane,
    name: "Brisbane",
    slug: "brisbane",
    country: "Australia",
    description: "River city base for east-coast travellers.",
    hero_image_url:
      "https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=1200&q=80",
    latitude: -27.4698,
    longitude: 153.0251,
    active: true,
    created_at: isoDaysAgo(300),
  },
  {
    id: ids.destinations.noosa,
    name: "Noosa",
    slug: "noosa",
    country: "Australia",
    description: "Chill coastal town with national park trails and cafés.",
    hero_image_url:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
    latitude: -26.3927,
    longitude: 153.0917,
    active: true,
    created_at: isoDaysAgo(300),
  },
  {
    id: ids.destinations.airlie,
    name: "Airlie Beach",
    slug: "airlie-beach",
    country: "Australia",
    description: "Gateway to the Whitsundays — boats, bars and lagoon life.",
    hero_image_url:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    latitude: -20.2675,
    longitude: 148.7169,
    active: true,
    created_at: isoDaysAgo(300),
  },
  {
    id: ids.destinations.cairns,
    name: "Cairns",
    slug: "cairns",
    country: "Australia",
    description: "Reef and rainforest jump-off with a strong backpacker scene.",
    hero_image_url:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
    latitude: -16.9186,
    longitude: 145.7781,
    active: true,
    created_at: isoDaysAgo(300),
  },
];

type HostelSeed = {
  id: string;
  destination_id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  hero_image_url: string;
  preferred_booking_url: string;
  price_from_aud: number;
  vibe: number;
  scores: {
    cleanliness: number;
    sleep: number;
    social: number;
    security: number;
    location: number;
  };
};

const hostelDefs: HostelSeed[] = [
  // Sydney
  {
    id: "h1000001-0000-4000-8000-000000000001",
    destination_id: ids.destinations.sydney,
    name: "Wake Up Sydney",
    slug: "wake-up-sydney",
    description: "Central Station base with rooftop views and mixed dorms.",
    address: "509 Pitt St, Sydney NSW 2000",
    latitude: -33.883,
    longitude: 151.205,
    hero_image_url:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 42,
    vibe: 35,
    scores: { cleanliness: 4.1, sleep: 3.6, social: 4.4, security: 4.0, location: 4.7 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000002",
    destination_id: ids.destinations.sydney,
    name: "Sydney Harbour YHA",
    slug: "sydney-harbour-yha",
    description: "Quiet-ish YHA near The Rocks with harbour glimpses.",
    address: "110 Cumberland St, The Rocks NSW 2000",
    latitude: -33.859,
    longitude: 151.208,
    hero_image_url:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
    preferred_booking_url: "https://www.yha.com.au/",
    price_from_aud: 48,
    vibe: 62,
    scores: { cleanliness: 4.5, sleep: 4.2, social: 3.5, security: 4.6, location: 4.8 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000003",
    destination_id: ids.destinations.sydney,
    name: "Mad Monkey Bondi",
    slug: "mad-monkey-bondi",
    description: "Beach-adjacent party hostel for Bondi-bound travellers.",
    address: "28 Hall St, Bondi Beach NSW 2026",
    latitude: -33.891,
    longitude: 151.274,
    hero_image_url:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 45,
    vibe: 18,
    scores: { cleanliness: 3.7, sleep: 3.2, social: 4.8, security: 3.8, location: 4.6 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000004",
    destination_id: ids.destinations.sydney,
    name: "Base Sydney",
    slug: "base-sydney",
    description: "Social hostel with women-only dorm options near Chinatown.",
    address: "477 Kent St, Sydney NSW 2000",
    latitude: -33.874,
    longitude: 151.204,
    hero_image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 40,
    vibe: 28,
    scores: { cleanliness: 4.0, sleep: 3.5, social: 4.5, security: 4.1, location: 4.4 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000005",
    destination_id: ids.destinations.sydney,
    name: "Railway Square YHA",
    slug: "railway-square-yha",
    description: "Converted railway sheds — quirky rooms near Central.",
    address: "8-10 Lee St, Haymarket NSW 2000",
    latitude: -33.8835,
    longitude: 151.203,
    hero_image_url:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
    preferred_booking_url: "https://www.yha.com.au/",
    price_from_aud: 38,
    vibe: 55,
    scores: { cleanliness: 4.2, sleep: 3.9, social: 3.8, security: 4.3, location: 4.5 },
  },
  // Byron Bay
  {
    id: "h1000001-0000-4000-8000-000000000011",
    destination_id: ids.destinations.byron,
    name: "Nomads Byron Bay",
    slug: "nomads-byron-bay",
    description: "Central Byron hostel with a big social courtyard.",
    address: "1 Carlyle St, Byron Bay NSW 2481",
    latitude: -28.643,
    longitude: 153.612,
    hero_image_url:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 36,
    vibe: 30,
    scores: { cleanliness: 3.9, sleep: 3.4, social: 4.6, security: 3.9, location: 4.7 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000012",
    destination_id: ids.destinations.byron,
    name: "Aquarius Byron Bay",
    slug: "aquarius-byron-bay",
    description: "Poolside backpacker favourite a short walk from town.",
    address: "13 Lawson St, Byron Bay NSW 2481",
    latitude: -28.645,
    longitude: 153.61,
    hero_image_url:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 39,
    vibe: 40,
    scores: { cleanliness: 4.0, sleep: 3.7, social: 4.3, security: 4.0, location: 4.5 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000013",
    destination_id: ids.destinations.byron,
    name: "Arts Factory Lodge",
    slug: "arts-factory-lodge",
    description: "Creative, alternative stay with tipis and music vibes.",
    address: "1 Lawson St, Byron Bay NSW 2481",
    latitude: -28.648,
    longitude: 153.605,
    hero_image_url:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 34,
    vibe: 45,
    scores: { cleanliness: 3.6, sleep: 3.3, social: 4.4, security: 3.7, location: 4.2 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000014",
    destination_id: ids.destinations.byron,
    name: "Wake Up Byron Bay",
    slug: "wake-up-byron-bay",
    description: "Modern dorms near the beach with a lively common room.",
    address: "25 Fletcher St, Byron Bay NSW 2481",
    latitude: -28.642,
    longitude: 153.614,
    hero_image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 41,
    vibe: 32,
    scores: { cleanliness: 4.2, sleep: 3.8, social: 4.5, security: 4.1, location: 4.6 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000015",
    destination_id: ids.destinations.byron,
    name: "Byron Bay Rainforest Resort",
    slug: "byron-bay-rainforest-resort",
    description: "Quieter bush setting for chill travellers.",
    address: "249 Ewingsdale Rd, Byron Bay NSW 2481",
    latitude: -28.655,
    longitude: 153.58,
    hero_image_url:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80",
    preferred_booking_url: "https://www.booking.com/",
    price_from_aud: 44,
    vibe: 78,
    scores: { cleanliness: 4.4, sleep: 4.3, social: 3.2, security: 4.4, location: 3.8 },
  },
  // Gold Coast
  {
    id: "h1000001-0000-4000-8000-000000000021",
    destination_id: ids.destinations.goldCoast,
    name: "Surf & Sun Gold Coast",
    slug: "surf-and-sun-gold-coast",
    description: "Beachside dorms steps from Surfers Paradise.",
    address: "18 Orchid Ave, Surfers Paradise QLD 4217",
    latitude: -28.002,
    longitude: 153.429,
    hero_image_url:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 35,
    vibe: 22,
    scores: { cleanliness: 3.8, sleep: 3.3, social: 4.7, security: 3.8, location: 4.8 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000022",
    destination_id: ids.destinations.goldCoast,
    name: "Nomads Surfers Paradise",
    slug: "nomads-surfers-paradise",
    description: "Party-forward hostel on the main strip.",
    address: "68 Ferny Ave, Surfers Paradise QLD 4217",
    latitude: -28.004,
    longitude: 153.427,
    hero_image_url:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 33,
    vibe: 12,
    scores: { cleanliness: 3.5, sleep: 3.0, social: 4.9, security: 3.6, location: 4.7 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000023",
    destination_id: ids.destinations.goldCoast,
    name: "Coolangatta YHA",
    slug: "coolangatta-yha",
    description: "Southern Gold Coast chill with surf beach access.",
    address: "230 Coolangatta Rd, Bilinga QLD 4225",
    latitude: -28.165,
    longitude: 153.51,
    hero_image_url:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
    preferred_booking_url: "https://www.yha.com.au/",
    price_from_aud: 37,
    vibe: 68,
    scores: { cleanliness: 4.3, sleep: 4.1, social: 3.6, security: 4.4, location: 4.2 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000024",
    destination_id: ids.destinations.goldCoast,
    name: "Backpackers in Paradise",
    slug: "backpackers-in-paradise",
    description: "Social kitchen and rooftop hangouts near Cavill Ave.",
    address: "40 Woodroffe Ave, Surfers Paradise QLD 4217",
    latitude: -28.001,
    longitude: 153.425,
    hero_image_url:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 32,
    vibe: 25,
    scores: { cleanliness: 3.7, sleep: 3.4, social: 4.5, security: 3.9, location: 4.5 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000025",
    destination_id: ids.destinations.goldCoast,
    name: "Sleeping Whale Hostel",
    slug: "sleeping-whale-hostel",
    description: "Boutique-feeling backpacker stay with quieter dorms.",
    address: "26 Orchid Ave, Surfers Paradise QLD 4217",
    latitude: -28.003,
    longitude: 153.43,
    hero_image_url:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 46,
    vibe: 58,
    scores: { cleanliness: 4.4, sleep: 4.0, social: 3.9, security: 4.3, location: 4.6 },
  },
  // Brisbane
  {
    id: "h1000001-0000-4000-8000-000000000031",
    destination_id: ids.destinations.brisbane,
    name: "Base Brisbane Uptown",
    slug: "base-brisbane-uptown",
    description: "City hostel with big common spaces and weekly events.",
    address: "466 Ann St, Brisbane City QLD 4000",
    latitude: -27.462,
    longitude: 153.026,
    hero_image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 34,
    vibe: 30,
    scores: { cleanliness: 4.0, sleep: 3.6, social: 4.4, security: 4.0, location: 4.5 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000032",
    destination_id: ids.destinations.brisbane,
    name: "Bunk Brisbane",
    slug: "bunk-brisbane",
    description: "Fortitude Valley nightlife on your doorstep.",
    address: "11 Gibbon St, Bowen Hills QLD 4006",
    latitude: -27.445,
    longitude: 153.037,
    hero_image_url:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 31,
    vibe: 15,
    scores: { cleanliness: 3.6, sleep: 3.1, social: 4.8, security: 3.7, location: 4.3 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000033",
    destination_id: ids.destinations.brisbane,
    name: "Brisbane City YHA",
    slug: "brisbane-city-yha",
    description: "Reliable YHA near South Bank and the river.",
    address: "392 Upper Roma St, Brisbane City QLD 4000",
    latitude: -27.468,
    longitude: 153.015,
    hero_image_url:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
    preferred_booking_url: "https://www.yha.com.au/",
    price_from_aud: 36,
    vibe: 60,
    scores: { cleanliness: 4.4, sleep: 4.1, social: 3.5, security: 4.5, location: 4.4 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000034",
    destination_id: ids.destinations.brisbane,
    name: "Somewhere To Stay Hostel",
    slug: "somewhere-to-stay-hostel",
    description: "Friendly West End stay close to markets and cafés.",
    address: "47 Brighton Rd, West End QLD 4101",
    latitude: -27.482,
    longitude: 153.01,
    hero_image_url:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 33,
    vibe: 50,
    scores: { cleanliness: 4.1, sleep: 3.8, social: 4.0, security: 4.0, location: 4.1 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000035",
    destination_id: ids.destinations.brisbane,
    name: "Chili Pepper Backpackers",
    slug: "chili-pepper-backpackers",
    description: "Social kitchen and courtyard hangouts in Spring Hill.",
    address: "56 Astor Tce, Spring Hill QLD 4000",
    latitude: -27.46,
    longitude: 153.022,
    hero_image_url:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 30,
    vibe: 35,
    scores: { cleanliness: 3.8, sleep: 3.5, social: 4.3, security: 3.9, location: 4.2 },
  },
  // Noosa
  {
    id: "h1000001-0000-4000-8000-000000000041",
    destination_id: ids.destinations.noosa,
    name: "Halse Lodge Noosa",
    slug: "halse-lodge-noosa",
    description: "Heritage backpacker lodge near Noosa Heads beach.",
    address: "2 Halse Lane, Noosa Heads QLD 4567",
    latitude: -26.388,
    longitude: 153.092,
    hero_image_url:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 42,
    vibe: 55,
    scores: { cleanliness: 4.2, sleep: 4.0, social: 3.9, security: 4.2, location: 4.7 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000042",
    destination_id: ids.destinations.noosa,
    name: "Noosa Backpackers Resort",
    slug: "noosa-backpackers-resort",
    description: "Poolside dorms a short walk from Hastings Street.",
    address: "9 Scott St, Noosaville QLD 4566",
    latitude: -26.4,
    longitude: 153.06,
    hero_image_url:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 38,
    vibe: 48,
    scores: { cleanliness: 4.0, sleep: 3.8, social: 4.1, security: 4.0, location: 4.3 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000043",
    destination_id: ids.destinations.noosa,
    name: "Flashpackers Noosa",
    slug: "flashpackers-noosa",
    description: "Smaller, cleaner flashpacker rooms for chill stays.",
    address: "3 Quamby Pl, Noosa Heads QLD 4567",
    latitude: -26.39,
    longitude: 153.089,
    hero_image_url:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 48,
    vibe: 72,
    scores: { cleanliness: 4.6, sleep: 4.4, social: 3.4, security: 4.5, location: 4.4 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000044",
    destination_id: ids.destinations.noosa,
    name: "Koala Beach Resort Noosa",
    slug: "koala-beach-resort-noosa",
    description: "Social resort-style backpacker stay with events.",
    address: "44 Noosa Dr, Noosa Heads QLD 4567",
    latitude: -26.395,
    longitude: 153.085,
    hero_image_url:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 40,
    vibe: 38,
    scores: { cleanliness: 3.9, sleep: 3.6, social: 4.4, security: 3.9, location: 4.5 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000045",
    destination_id: ids.destinations.noosa,
    name: "Coral Tree Hostel",
    slug: "coral-tree-hostel",
    description: "Quiet leafy property popular with couples and solo chill travellers.",
    address: "12 Coral Tree Ave, Noosa Heads QLD 4567",
    latitude: -26.393,
    longitude: 153.088,
    hero_image_url:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
    preferred_booking_url: "https://www.booking.com/",
    price_from_aud: 45,
    vibe: 80,
    scores: { cleanliness: 4.5, sleep: 4.3, social: 3.1, security: 4.4, location: 4.2 },
  },
  // Airlie Beach
  {
    id: "h1000001-0000-4000-8000-000000000051",
    destination_id: ids.destinations.airlie,
    name: "Base Airlie Beach",
    slug: "base-airlie-beach",
    description: "Lagoon-side social hub for Whitsundays trips.",
    address: "16 Airlie Esplanade, Airlie Beach QLD 4802",
    latitude: -20.268,
    longitude: 148.715,
    hero_image_url:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 36,
    vibe: 20,
    scores: { cleanliness: 3.8, sleep: 3.3, social: 4.7, security: 3.8, location: 4.8 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000052",
    destination_id: ids.destinations.airlie,
    name: "Magnums Backpackers",
    slug: "magnums-backpackers",
    description: "Huge party hostel with onsite bars and nightly noise.",
    address: "366 Shute Harbour Rd, Airlie Beach QLD 4802",
    latitude: -20.27,
    longitude: 148.718,
    hero_image_url:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 28,
    vibe: 8,
    scores: { cleanliness: 3.4, sleep: 2.9, social: 4.9, security: 3.5, location: 4.6 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000053",
    destination_id: ids.destinations.airlie,
    name: "Airlie Beach YHA",
    slug: "airlie-beach-yha",
    description: "Calmer YHA option near the lagoon.",
    address: "394 Shute Harbour Rd, Airlie Beach QLD 4802",
    latitude: -20.271,
    longitude: 148.719,
    hero_image_url:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
    preferred_booking_url: "https://www.yha.com.au/",
    price_from_aud: 34,
    vibe: 58,
    scores: { cleanliness: 4.3, sleep: 4.0, social: 3.7, security: 4.4, location: 4.4 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000054",
    destination_id: ids.destinations.airlie,
    name: "Bushwackers Backpackers",
    slug: "bushwackers-backpackers",
    description: "Laid-back rooms and a communal kitchen for trip planning.",
    address: "34 Airlie Crescent, Airlie Beach QLD 4802",
    latitude: -20.269,
    longitude: 148.716,
    hero_image_url:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 32,
    vibe: 42,
    scores: { cleanliness: 3.9, sleep: 3.7, social: 4.2, security: 3.9, location: 4.3 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000055",
    destination_id: ids.destinations.airlie,
    name: "Beaches Backpackers",
    slug: "beaches-backpackers",
    description: "Central Airlie stay with mixed dorms and private rooms.",
    address: "356 Shute Harbour Rd, Airlie Beach QLD 4802",
    latitude: -20.2675,
    longitude: 148.717,
    hero_image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 35,
    vibe: 33,
    scores: { cleanliness: 4.0, sleep: 3.6, social: 4.4, security: 4.0, location: 4.5 },
  },
  // Cairns
  {
    id: "h1000001-0000-4000-8000-000000000061",
    destination_id: ids.destinations.cairns,
    name: "Gilligan's Backpackers",
    slug: "gilligans-backpackers",
    description: "Iconic Cairns party hostel with pool and nightlife.",
    address: "57-89 Grafton St, Cairns City QLD 4870",
    latitude: -16.923,
    longitude: 145.776,
    hero_image_url:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 30,
    vibe: 10,
    scores: { cleanliness: 3.5, sleep: 3.0, social: 4.9, security: 3.6, location: 4.6 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000062",
    destination_id: ids.destinations.cairns,
    name: "Cairns Central YHA",
    slug: "cairns-central-yha",
    description: "Cleaner, quieter base for reef day trips.",
    address: "20-26 McLeod St, Cairns City QLD 4870",
    latitude: -16.925,
    longitude: 145.77,
    hero_image_url:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
    preferred_booking_url: "https://www.yha.com.au/",
    price_from_aud: 35,
    vibe: 65,
    scores: { cleanliness: 4.5, sleep: 4.2, social: 3.5, security: 4.5, location: 4.3 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000063",
    destination_id: ids.destinations.cairns,
    name: "Northern Greenhouse",
    slug: "northern-greenhouse",
    description: "Boutique backpacker stay with tropical courtyard.",
    address: "117 Grafton St, Cairns City QLD 4870",
    latitude: -16.921,
    longitude: 145.777,
    hero_image_url:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 44,
    vibe: 52,
    scores: { cleanliness: 4.4, sleep: 4.0, social: 4.0, security: 4.3, location: 4.5 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000064",
    destination_id: ids.destinations.cairns,
    name: "Tropic Days Hostel",
    slug: "tropic-days-hostel",
    description: "Relaxed hostel with strong kitchen facilities.",
    address: "192 Esplanade, Cairns North QLD 4870",
    latitude: -16.91,
    longitude: 145.77,
    hero_image_url:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 33,
    vibe: 48,
    scores: { cleanliness: 4.1, sleep: 3.9, social: 4.0, security: 4.1, location: 4.2 },
  },
  {
    id: "h1000001-0000-4000-8000-000000000065",
    destination_id: ids.destinations.cairns,
    name: "Dreamtime Travellers Rest",
    slug: "dreamtime-travellers-rest",
    description: "Smaller social hostel popular with long-term travellers.",
    address: "4 Terminus St, Portsmith QLD 4870",
    latitude: -16.93,
    longitude: 145.765,
    hero_image_url:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
    preferred_booking_url: "https://www.hostelworld.com/",
    price_from_aud: 29,
    vibe: 40,
    scores: { cleanliness: 3.9, sleep: 3.6, social: 4.3, security: 3.9, location: 3.9 },
  },
];

export const seedHostels: Hostel[] = hostelDefs.map((h) => {
  const overall =
    (h.scores.cleanliness +
      h.scores.sleep +
      h.scores.social +
      h.scores.security +
      h.scores.location) /
    5;

  return {
    id: h.id,
    destination_id: h.destination_id,
    name: h.name,
    slug: h.slug,
    description: h.description,
    address: h.address,
    latitude: h.latitude,
    longitude: h.longitude,
    hero_image_url: h.hero_image_url,
    hostelworld_url: h.preferred_booking_url.includes("hostelworld")
      ? h.preferred_booking_url
      : null,
    booking_url: h.preferred_booking_url.includes("booking")
      ? h.preferred_booking_url
      : null,
    direct_url: h.preferred_booking_url.includes("yha")
      ? h.preferred_booking_url
      : null,
    preferred_booking_url: h.preferred_booking_url,
    price_from_aud: h.price_from_aud,
    active: true,
    avg_cleanliness: h.scores.cleanliness,
    avg_sleep: h.scores.sleep,
    avg_social: h.scores.social,
    avg_security: h.scores.security,
    avg_location: h.scores.location,
    avg_overall: Math.round(overall * 10) / 10,
    avg_vibe_score: h.vibe,
    video_count: 0,
    created_at: isoDaysAgo(200),
    updated_at: isoDaysAgo(2),
  };
});

const captions: Record<VideoCategory, string[]> = {
  dorm: [
    "8-bed dorm — lockers are under the beds",
    "Top bunks have curtains, bottom don't",
    "AC works but it's loud at night",
  ],
  bed: [
    "Mattress was fine, sheets smelled clean",
    "Power outlet right next to the bed",
    "Pillow is thin — bring your own if picky",
  ],
  bathroom: [
    "Shared bathroom — 4 showers for the floor",
    "Hot water was consistent this morning",
    "Clean enough, bring flip flops",
  ],
  kitchen: [
    "Kitchen gets busy around 7pm",
    "Plenty of fridge space if you label it",
    "Pans are okay, knives are dull",
  ],
  common_area: [
    "Common room fills up after sunset",
    "Couches are worn but comfy",
    "Good spot to meet people",
  ],
  social_nightlife: [
    "Bar at night — loud until midnight",
    "Pub crawl leaves from reception",
    "Pool area is the social hub",
  ],
  private_room: [
    "Private twin — quiet and clean",
    "Ensuite private room walkthrough",
    "Worth the upgrade if you need sleep",
  ],
  other: ["Quick walkthrough of the property"],
};

const userIds = Object.values(ids.users);

function buildVideosAndRatings(): {
  videos: Video[];
  ratings: Rating[];
  hostels: Hostel[];
} {
  const videos: Video[] = [];
  const ratings: Rating[] = [];
  let videoIndex = 0;

  const hostels = seedHostels.map((hostel) => {
    const videoCount = 3 + (videoIndex % 3);
    let localCount = 0;

    for (let i = 0; i < videoCount; i++) {
      const category = CATEGORIES[(videoIndex + i) % CATEGORIES.length];
      const userId = userIds[(videoIndex + i) % userIds.length];
      const filmedDays = 1 + ((videoIndex + i * 3) % 28);
      const videoId = `v1000001-0000-4000-8000-${String(videoIndex + 1).padStart(12, "0")}`;
      const captionOptions = captions[category];
      const helpful = 2 + ((videoIndex + i) % 40);

      videos.push({
        id: videoId,
        user_id: userId,
        hostel_id: hostel.id,
        mux_upload_id: null,
        mux_asset_id: null,
        mux_playback_id: null,
        placeholder_video_url: SAMPLE_VIDEOS[(videoIndex + i) % SAMPLE_VIDEOS.length],
        placeholder_poster_url: hostel.hero_image_url,
        category,
        caption: captionOptions[(videoIndex + i) % captionOptions.length],
        status: "approved",
        filmed_at: daysAgo(filmedDays),
        helpful_count: helpful,
        created_at: isoDaysAgo(filmedDays),
        approved_at: isoDaysAgo(filmedDays - 1),
        approved_by: null,
        rejected_reason: null,
        error_message: null,
        submitted_at: null,
      });

      const base = hostel;
      ratings.push({
        id: `r1000001-0000-4000-8000-${String(videoIndex + 1).padStart(12, "0")}`,
        user_id: userId,
        hostel_id: hostel.id,
        video_id: videoId,
        cleanliness: clampScore(base.avg_cleanliness ?? 4, videoIndex + i),
        sleep: clampScore(base.avg_sleep ?? 3.5, videoIndex + i + 1),
        social: clampScore(base.avg_social ?? 4, videoIndex + i + 2),
        security: clampScore(base.avg_security ?? 4, videoIndex + i + 3),
        location: clampScore(base.avg_location ?? 4.5, videoIndex + i + 4),
        vibe_score: Math.min(
          100,
          Math.max(0, Math.round((base.avg_vibe_score ?? 50) + ((videoIndex + i) % 11) - 5)),
        ),
        created_at: isoDaysAgo(filmedDays),
      });

      localCount += 1;
      videoIndex += 1;
    }

    return { ...hostel, video_count: localCount };
  });

  return { videos, ratings, hostels };
}

function clampScore(base: number, salt: number): number {
  const jitter = ((salt % 5) - 2) * 0.2;
  return Math.min(5, Math.max(1, Math.round((base + jitter) * 10) / 10));
}

const built = buildVideosAndRatings();

export const seedVideos = built.videos;
export const seedRatings = built.ratings;
export const seedHostelsWithCounts = built.hostels;

export const CATEGORY_LABELS: Record<VideoCategory, string> = {
  dorm: "Dorm",
  bed: "Bed",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  common_area: "Common area",
  social_nightlife: "Social/nightlife",
  private_room: "Private room",
  other: "Other",
};

export const SEARCH_EXAMPLES = ["Sydney", "Byron Bay", "Gold Coast", "Brisbane"] as const;
