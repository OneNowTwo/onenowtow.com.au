/**
 * Prototype dinner photography.
 *
 * Generic cuisine photos, not restaurant-owned dishes.
 * Pack photos are assigned by *dish* (chicken, fish, pizza…), not by
 * restaurant cuisine — a chicken pack must never receive a fish photo.
 * Every URL here was GET-verified as 200 and visually checked as that dish.
 */

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`;

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;

export type DishKind =
  | "pizza"
  | "pasta"
  | "burger"
  | "taco"
  | "sushi"
  | "fish"
  | "chicken"
  | "beef"
  | "steak"
  | "curry"
  | "veg"
  | "spread";

export const IMAGES = {
  thai: unsplash("1559314809-0d155014e29e"),
  thaiCurry: unsplash("1455619452474-d2be8b1e70cd"),
  italian: unsplash("1498579150354-977475b7ea0b"),
  pizza: unsplash("1513104890138-7c749659a591"),
  pasta: unsplash("1551183053-bf91a1d81141"),
  bowls: unsplash("1546069901-ba9599a7e63c"),
  protein: unsplash("1604908176997-125f25cc6f3d"),
  japanese: unsplash("1579871494447-9811cf80d66c"),
  ramen: unsplash("1569718212165-3a8278d5f624"),
  indian: unsplash("1585937421612-70a008356fbe"),
  naan: unsplash("1601050690597-df0568f70950"),
  vietnamese: unsplash("1582878826629-29b7ad1cdc43"),
  greek: pexels(2474660),
  salad: unsplash("1540420773420-3366772f4999"),
  mexican: unsplash("1565299585323-38d6b0865b47"),
  tacos: unsplash("1551504734-5ee1c4a1479b"),
  burger: unsplash("1568901346375-23c9450c58cd"),
  fries: unsplash("1573080496219-bb080dd4f877"),
  middleEastern: unsplash("1567188040759-fb8a883dc6d8"),
  modern: unsplash("1414235077428-338989a2e8c0"),
  steak: unsplash("1504674900247-0877df9cc836"),
  chinese: unsplash("1563245372-f21724e3856d"),
  dumplings: unsplash("1496116218417-1a781b1c416c"),
  family: unsplash("1476224203421-9ac39bcb3327"),
  fish: unsplash("1519708227418-c8fd9a32b7a2"),
  grill: unsplash("1555939594-58d7cb561ad1"),
  veg: unsplash("1512621776951-a57141f2eefd"),
} as const;

export type ImageKey = keyof typeof IMAGES;

const CHICKEN_JAPANESE = [
  pexels(2233729),
  pexels(2233730),
  pexels(1860204),
  pexels(1860205),
  pexels(1860207),
  pexels(1860208),
  pexels(1860202),
];

const CHICKEN_INDIAN = [
  pexels(1624487),
  pexels(1624485),
  pexels(1624489),
  pexels(2474661),
  pexels(32986472),
];

const CHICKEN_THAI = [pexels(35138087), pexels(5409016)];

const CHICKEN_RESERVED: Record<string, string[]> = {
  Japanese: CHICKEN_JAPANESE,
  Indian: CHICKEN_INDIAN,
  Thai: CHICKEN_THAI,
};

const DISH_POOLS: Record<DishKind, string[]> = {
  chicken: [
    ...CHICKEN_JAPANESE,
    ...CHICKEN_INDIAN,
    ...CHICKEN_THAI,
    IMAGES.protein,
    IMAGES.grill,
    pexels(2338407),
    pexels(6210747),
    pexels(5718073),
    pexels(5718071),
    pexels(5718070),
    pexels(5718069),
    pexels(5718072),
    pexels(5718075),
    pexels(2673353),
    pexels(6107787),
    pexels(6107788),
    pexels(6107789),
    pexels(6107790),
    pexels(616354),
    pexels(616353),
    pexels(616355),
    pexels(616352),
    pexels(616356),
    pexels(106343),
    pexels(34463131),
    pexels(8872309),
    pexels(5718076),
  ],
  fish: [
    IMAGES.fish,
    unsplash("1467003909585-2f8a72700288"),
    unsplash("1448043552756-e747b7a2b2b8"),
    unsplash("1604909052743-94e838986d24"),
    unsplash("1551248429-40975aa4de74"),
    pexels(725991),
    pexels(725992),
    pexels(566345),
    pexels(262959),
    pexels(842142),
    IMAGES.greek,
    pexels(16743486),
    pexels(16743485),
    pexels(1059943),
    pexels(699953),
    pexels(566343),
    pexels(566344),
    pexels(39022069),
    pexels(39022068),
    pexels(39022501),
    pexels(36616789),
  ],
  pizza: [
    IMAGES.pizza,
    pexels(905847),
    unsplash("1565299624946-b28f40a0ae38"),
    unsplash("1574071318508-1cdbab80d002"),
    unsplash("1593560708920-61dd98c46a4e"),
    unsplash("1604382354936-07c5d9983bd3"),
    pexels(845810),
    pexels(1146760),
    pexels(1566837),
    pexels(315755),
    pexels(845811),
    pexels(708587),
    pexels(825661),
    pexels(1653877),
    pexels(2619967),
    pexels(1049626),
    pexels(3762069),
    pexels(4109111),
    pexels(2147491),
    pexels(208537),
    pexels(3915857),
  ],
  pasta: [
    IMAGES.pasta,
    IMAGES.italian,
    unsplash("1724116382285-f4fcbe27f6a1"),
    unsplash("1555949258-eb67b1ef0ceb"),
    unsplash("1546833999-b9f581a1996d"),
    unsplash("1612874742237-6526221588e3"),
    unsplash("1625944525533-473f1a3d54e7"),
    unsplash("1574894709920-11b28e7367e3"),
    unsplash("1598866594230-a7c12756260f"),
    unsplash("1601924582970-9238bcb495d9"),
    pexels(1279330),
    pexels(1437267),
    pexels(1487511),
    pexels(1438672),
    pexels(1527603),
    pexels(803963),
    pexels(628776),
    pexels(628729),
    pexels(326279),
    pexels(4518843),
    pexels(725990),
    pexels(1256875),
  ],
  burger: [
    IMAGES.burger,
    IMAGES.fries,
    unsplash("1618040996337-56904b7850b9"),
    unsplash("1550547660-d9450f859349"),
    unsplash("1571091718767-18b5b1457add"),
    unsplash("1551782450-a2132b4ba21d"),
    unsplash("1572802419224-296b0aeee0d9"),
    unsplash("1553979459-d2229ba7433b"),
    pexels(1633578),
    pexels(1639565),
    pexels(1199957),
    pexels(1565982),
    pexels(1639557),
    pexels(5474836),
  ],
  taco: [
    IMAGES.mexican,
    IMAGES.tacos,
    unsplash("1606491956689-2ea866880c84"),
    unsplash("1624300629298-e9de39c13be5"),
    pexels(461198),
    pexels(4958641),
    pexels(5737247),
    pexels(2092507),
    pexels(2092508),
    pexels(4958792),
    pexels(8448323),
    pexels(7613564),
    pexels(1640774),
    pexels(2983101),
    pexels(1639562),
    pexels(3338681),
  ],
  sushi: [
    IMAGES.japanese,
    IMAGES.dumplings,
    unsplash("1579584425555-c3ce17fd4351"),
    unsplash("1553621042-f6e147245754"),
    IMAGES.ramen,
    unsplash("1562565652-a0d8f0c59eb4"),
    pexels(2098085),
    pexels(248444),
    pexels(357756),
    pexels(1148086),
    pexels(3655916),
    pexels(2323398),
    pexels(2098086),
    pexels(3147493),
    pexels(5409751),
    pexels(2664216),
  ],
  beef: [
    pexels(2313686),
    pexels(1907244),
    unsplash("1571407970349-bc81e7e96d47"),
  ],
  steak: [
    IMAGES.steak,
    unsplash("1600891964092-4316c288032e"),
    unsplash("1432139555190-58524dae6a55"),
    unsplash("1558030006-450675393462"),
    unsplash("1529692236671-f1f6cf9683ba"),
    pexels(769289),
    pexels(675951),
    pexels(3535380),
    pexels(4106483),
    pexels(1251208),
    pexels(323682),
    pexels(2491273),
  ],
  curry: [
    IMAGES.thaiCurry,
    IMAGES.indian,
    IMAGES.naan,
    IMAGES.middleEastern,
    unsplash("1565557623262-b51c2513a641"),
    unsplash("1505253758473-96b7015fcd40"),
    unsplash("1596797038530-2c107229654b"),
    pexels(958546),
    pexels(958547),
    pexels(2679501),
    pexels(941869),
    pexels(958545),
  ],
  veg: [
    IMAGES.veg,
    IMAGES.bowls,
    IMAGES.salad,
    pexels(1410235),
    pexels(2347311),
    pexels(1059905),
    pexels(1640772),
    pexels(1211887),
    pexels(1092730),
    pexels(257816),
    pexels(1109197),
    pexels(4193873),
    pexels(70497),
    pexels(262978),
    pexels(1640777),
    pexels(1640773),
    pexels(1640775),
    pexels(1640776),
    pexels(1099680),
    pexels(376464),
    pexels(1351238),
    unsplash("1540189549336-e6e99c3679fe"),
    unsplash("1490818387583-1baba5e638af"),
    unsplash("1490645935967-10de6ba17061"),
    unsplash("1511690656952-34342bb7c2f2"),
    pexels(3926124),
  ],
  spread: [
    IMAGES.thai,
    IMAGES.vietnamese,
    IMAGES.family,
    IMAGES.modern,
    unsplash("1564834724105-918b73d1b9e0"),
    unsplash("1526318896980-cf78c088247c"),
    unsplash("1512058564366-18510be2db19"),
    unsplash("1555126634-323283e090fa"),
    pexels(1833349),
    pexels(2097090),
    pexels(3184188),
    pexels(1267320),
    pexels(3184183),
    pexels(3184192),
    pexels(1482803),
    unsplash("1533777324565-a040eb52facd"),
    unsplash("1529042410759-befb1204b468"),
  ],
};

const RELATED: Record<DishKind, DishKind[]> = {
  chicken: [],
  fish: [],
  pizza: [],
  pasta: [],
  burger: [],
  taco: [],
  sushi: [],
  beef: ["steak"],
  steak: ["beef"],
  curry: ["veg"],
  veg: ["curry"],
  spread: ["veg"],
};

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function has(source: string, pattern: RegExp): boolean {
  return pattern.test(source);
}

export function inferDishKind(
  name: string,
  description: string,
  tags: string[] = [],
  dietaryTags: string[] = [],
): DishKind {
  const nameL = name.toLowerCase();
  const blob = `${name} ${description} ${tags.join(" ")}`.toLowerCase();
  const veg =
    dietaryTags.includes("vegetarian") ||
    dietaryTags.includes("vegan") ||
    tags.includes("vegetarian");

  if (has(nameL, /pizza|margherita/)) return "pizza";
  if (has(nameL, /taco|burrito|fiesta/)) return "taco";
  if (has(nameL, /burger/)) return "burger";
  if (has(nameL, /sushi|sashimi/)) return "sushi";
  if (has(nameL, /chicken|tandoori|robata/)) return "chicken";
  if (has(nameL, /prawn|shrimp|herring/)) return "fish";
  if (has(nameL, /fish|salmon|seafood|garfish/) && !veg) return "fish";
  if (has(nameL, /pasta|spaghetti|lasagn/)) return "pasta";
  if (has(nameL, /steak/) && !has(nameL, /chicken/)) return "steak";
  if (has(nameL, /beef/)) return "beef";

  if (has(blob, /pizza|margherita/)) return "pizza";
  if (has(blob, /taco|burrito/)) return "taco";
  if (has(blob, /burger/)) return "burger";
  if (has(blob, /sushi|sashimi/)) return "sushi";
  if (has(blob, /chicken|tandoori|robata/)) return "chicken";
  if (has(blob, /prawn|shrimp|herring|fish|salmon|seafood|shellfish/) && !veg) return "fish";
  if (has(blob, /pasta|spaghetti|lasagna/)) return "pasta";
  if (has(blob, /steak/) && !has(blob, /chicken/)) return "steak";
  if (has(blob, /beef/)) return "beef";
  if (veg || has(nameL, /tofu|vegetable|veggie|dal|chickpea|garden/)) {
    return has(nameL, /curry|dal/) || has(blob, /curry|dal/) ? "curry" : "veg";
  }
  if (has(blob, /curry/)) return "curry";
  return "spread";
}

function reservedForOtherCuisine(url: string, cuisine: string): boolean {
  for (const [owner, urls] of Object.entries(CHICKEN_RESERVED)) {
    if (owner !== cuisine && urls.includes(url)) return true;
  }
  return false;
}

function chickenOrder(cuisine: string): string[] {
  const prefer = CHICKEN_RESERVED[cuisine] ?? [];
  return unique([...prefer, ...DISH_POOLS.chicken]);
}

function poolOrder(kind: DishKind, cuisine: string): string[] {
  if (kind === "chicken") return chickenOrder(cuisine);
  return DISH_POOLS[kind];
}

export type PackImageInput = {
  name: string;
  description: string;
  tags: string[];
  dietaryTags: string[];
  cuisine: string;
};

export function createImageAssigner() {
  const claimed = new Set<string>();

  const takeFrom = (urls: string[], skip: (url: string) => boolean = () => false): string | null => {
    for (const url of unique(urls)) {
      if (claimed.has(url) || skip(url)) continue;
      claimed.add(url);
      return url;
    }
    return null;
  };

  return {
    claim(input: PackImageInput): string {
      const kind = inferDishKind(input.name, input.description, input.tags, input.dietaryTags);
      if (kind === "chicken") {
        const named = /chicken|tandoori|robata/i.test(input.name);
        const reserved = CHICKEN_RESERVED[input.cuisine] ?? [];
        const skipReserved = (url: string) =>
          named ? reservedForOtherCuisine(url, input.cuisine) : Object.values(CHICKEN_RESERVED).flat().includes(url);
        const chicken = named
          ? (takeFrom(reserved) ??
            takeFrom(chickenOrder(input.cuisine), skipReserved) ??
            takeFrom(DISH_POOLS.chicken))
          : (takeFrom(DISH_POOLS.chicken, skipReserved) ??
            takeFrom(reserved) ??
            takeFrom(DISH_POOLS.chicken));
        if (chicken) return chicken;
      } else {
        const search: DishKind[] = [kind, ...RELATED[kind]];
        for (const next of search) {
          const url = takeFrom(poolOrder(next, input.cuisine));
          if (url) return url;
        }
      }
      const leftover = takeFrom([...DISH_POOLS.spread, ...DISH_POOLS.veg]);
      if (leftover) return leftover;
      return IMAGES.bowls;
    },
  };
}

export const dishPhotoIndex: Map<string, DishKind> = (() => {
  const map = new Map<string, DishKind>();
  for (const [kind, urls] of Object.entries(DISH_POOLS) as [DishKind, string[]][]) {
    for (const url of urls) map.set(url, kind);
  }
  return map;
})();

export function assertUniquePoolUrls(): string[] {
  const seen = new Map<string, string>();
  const duplicates: string[] = [];
  for (const [kind, urls] of Object.entries(DISH_POOLS)) {
    for (const url of urls) {
      const previous = seen.get(url);
      if (previous) duplicates.push(`${url} in ${previous} and ${kind}`);
      else seen.set(url, kind);
    }
  }
  return duplicates;
}
