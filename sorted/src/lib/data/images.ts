/**
 * Prototype dinner photography.
 *
 * Generic cuisine photos, not restaurant-owned dishes.
 * Every URL here was GET-verified as 200. Do not add Unsplash IDs
 * without a GET check — HEAD responses are not reliable.
 */

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`;

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;

export type ImageFamily =
  | "thai"
  | "italian"
  | "pizza"
  | "japanese"
  | "mexican"
  | "indian"
  | "burgers"
  | "steak"
  | "pub"
  | "seafood"
  | "modern"
  | "veg"
  | "general";

/**
 * Stable named photos used by restaurant cards, homepage, and pack hints.
 * Dead originals (pasta / steak / middleEastern) were replaced with live URLs.
 * `family` used to be the same file as `grill`.
 */
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
  greek: unsplash("1544124499-58912cbddaad"),
  salad: unsplash("1540420773420-3366772f4999"),
  mexican: unsplash("1596797038530-2c107229654b"),
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

const IMAGE_POOLS: Record<ImageFamily, string[]> = {
  thai: [
    IMAGES.thai,
    IMAGES.thaiCurry,
    IMAGES.vietnamese,
    IMAGES.greek,
    unsplash("1558985250-27a406d64cb3"),
    unsplash("1564834724105-918b73d1b9e0"),
    unsplash("1526318896980-cf78c088247c"),
    unsplash("1512058564366-18510be2db19"),
    unsplash("1555126634-323283e090fa"),
    pexels(2474661),
    pexels(699953),
    pexels(2347311),
    pexels(1907244),
    pexels(1624487),
    pexels(958545),
    pexels(1410235),
    pexels(1833349),
    pexels(2097090),
  ],
  italian: [
    IMAGES.italian,
    IMAGES.pasta,
    IMAGES.chinese,
    unsplash("1555949258-eb67b1ef0ceb"),
    unsplash("1546833999-b9f581a1996d"),
    unsplash("1612874742237-6526221588e3"),
    unsplash("1625944525533-473f1a3d54e7"),
    unsplash("1574894709920-11b28e7367e3"),
    unsplash("1598866594230-a7c12756260f"),
    unsplash("1601924582970-9238bcb495d9"),
    unsplash("1571407970349-bc81e7e96d47"),
    unsplash("1582450871972-ab5ca641643d"),
    pexels(1279330),
    pexels(1437267),
    pexels(1487511),
    pexels(1438672),
    pexels(1527603),
    pexels(803963),
    pexels(628776),
    pexels(628729),
    pexels(326279),
    pexels(1351238),
  ],
  pizza: [
    IMAGES.pizza,
    unsplash("1565299585323-38d6b0865b47"),
    unsplash("1565299624946-b28f40a0ae38"),
    unsplash("1574071318508-1cdbab80d002"),
    unsplash("1593560708920-61dd98c46a4e"),
    unsplash("1604382354936-07c5d9983bd3"),
    pexels(214749),
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
  ],
  japanese: [
    IMAGES.japanese,
    IMAGES.ramen,
    IMAGES.dumplings,
    unsplash("1579584425555-c3ce17fd4351"),
    unsplash("1553621042-f6e147245754"),
    unsplash("1724116382285-f4fcbe27f6a1"),
    unsplash("1562565652-a0d8f0c59eb4"),
    pexels(2098085),
    pexels(248444),
    pexels(357756),
    pexels(1148086),
    pexels(3655916),
    pexels(8951242),
    pexels(2323398),
    pexels(2098086),
    pexels(3147493),
    pexels(5409751),
    pexels(2664216),
  ],
  mexican: [
    IMAGES.mexican,
    IMAGES.tacos,
    unsplash("1606491956689-2ea866880c84"),
    unsplash("1615876234886-fd9a39fda97f"),
    unsplash("1624300629298-e9de39c13be5"),
    unsplash("1504545102780-26774c1bb073"),
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
  indian: [
    IMAGES.indian,
    IMAGES.naan,
    IMAGES.middleEastern,
    unsplash("1565557623262-b51c2513a641"),
    unsplash("1505253758473-96b7015fcd40"),
    pexels(958546),
    pexels(2679501),
    pexels(941869),
  ],
  burgers: [
    IMAGES.burger,
    IMAGES.fries,
    IMAGES.grill,
    unsplash("1618040996337-56904b7850b9"),
    unsplash("1550547660-d9450f859349"),
    unsplash("1571091718767-18b5b1457add"),
    unsplash("1551782450-a2132b4ba21d"),
    unsplash("1572802419224-296b0aeee0d9"),
    unsplash("1553979459-d2229ba7433b"),
    pexels(1633578),
    pexels(1639565),
    pexels(1199957),
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
  ],
  pub: [
    IMAGES.family,
    unsplash("1517248135467-4c7edcad34c4"),
    unsplash("1533777324565-a040eb52facd"),
    unsplash("1529042410759-befb1204b468"),
    pexels(1267320),
    pexels(3184183),
    pexels(3184192),
    pexels(1482803),
    pexels(3738755),
    pexels(3915857),
  ],
  seafood: [
    IMAGES.fish,
    unsplash("1467003909585-2f8a72700288"),
    unsplash("1559339352-11d035aa65de"),
    unsplash("1448043552756-e747b7a2b2b8"),
    unsplash("1604909052743-94e838986d24"),
    unsplash("1551248429-40975aa4de74"),
    pexels(725991),
    pexels(566345),
    pexels(262959),
    pexels(1410236),
    pexels(566566),
    pexels(842142),
  ],
  modern: [
    IMAGES.bowls,
    IMAGES.protein,
    IMAGES.salad,
    IMAGES.modern,
    unsplash("1604503468506-a8da13d82791"),
    unsplash("1490645935967-10de6ba17061"),
    unsplash("1511690656952-34342bb7c2f2"),
    unsplash("1547592166-23ac45744acd"),
    unsplash("1505576399279-565b52d4ac71"),
    unsplash("1547592180-85f173990554"),
    unsplash("1540189549336-e6e99c3679fe"),
    unsplash("1490818387583-1baba5e638af"),
    pexels(1640777),
    pexels(1640773),
    pexels(1640775),
    pexels(1640776),
    pexels(1099680),
    pexels(376464),
  ],
  veg: [
    IMAGES.veg,
    pexels(1059905),
    pexels(1640772),
    pexels(1211887),
    pexels(1092730),
    pexels(257816),
    pexels(1109197),
    pexels(4193873),
    pexels(70497),
    pexels(262978),
  ],
  general: [
    pexels(1199960),
    pexels(1260968),
    pexels(106343),
    pexels(2338407),
    pexels(6210747),
    pexels(2338408),
    pexels(5718073),
  ],
};

const CUISINE_FAMILY: Record<string, ImageFamily> = {
  Thai: "thai",
  Italian: "italian",
  Pizza: "pizza",
  Japanese: "japanese",
  Mexican: "mexican",
  Indian: "indian",
  Burgers: "burgers",
  Steak: "steak",
  Pub: "pub",
  Seafood: "seafood",
  "Modern Australian": "modern",
};

const HINT_FAMILY: Record<ImageKey, ImageFamily> = {
  thai: "thai",
  thaiCurry: "thai",
  vietnamese: "thai",
  greek: "thai",
  italian: "italian",
  pasta: "italian",
  chinese: "italian",
  pizza: "pizza",
  mexican: "mexican",
  tacos: "mexican",
  japanese: "japanese",
  ramen: "japanese",
  dumplings: "japanese",
  indian: "indian",
  naan: "indian",
  middleEastern: "indian",
  burger: "burgers",
  fries: "burgers",
  grill: "burgers",
  steak: "steak",
  family: "pub",
  fish: "seafood",
  bowls: "modern",
  protein: "modern",
  salad: "veg",
  veg: "veg",
  modern: "modern",
};

const FALLBACKS: Record<ImageFamily, ImageFamily[]> = {
  thai: ["veg", "modern", "general"],
  italian: ["veg", "modern", "general"],
  pizza: ["italian", "general"],
  japanese: ["veg", "modern", "general"],
  mexican: ["veg", "modern", "general"],
  indian: ["veg", "modern", "general"],
  burgers: ["steak", "pub", "general"],
  steak: ["pub", "modern", "general"],
  pub: ["modern", "general"],
  seafood: ["modern", "veg", "general"],
  modern: ["veg", "general"],
  veg: ["modern", "general"],
  general: ["modern", "veg"],
};

const DISTINCTIVE_FAMILIES = new Set<ImageFamily>([
  "thai",
  "japanese",
  "mexican",
  "indian",
  "pizza",
  "burgers",
  "steak",
  "seafood",
]);

export function imageFamilyFor(cuisine: string, hint?: ImageKey): ImageFamily {
  return CUISINE_FAMILY[cuisine] ?? (hint ? HINT_FAMILY[hint] : undefined) ?? "general";
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function searchFamilies(cuisine: string, hint: ImageKey): ImageFamily[] {
  const cuisineFamily = imageFamilyFor(cuisine, hint);
  const hintFamily = HINT_FAMILY[hint];
  const head: ImageFamily[] = [];

  if (DISTINCTIVE_FAMILIES.has(cuisineFamily)) {
    head.push(cuisineFamily);
    if (hintFamily !== cuisineFamily) head.push(hintFamily);
  } else if (hintFamily === "seafood" || hintFamily === "pizza" || hintFamily === "burgers") {
    head.push(hintFamily, cuisineFamily);
  } else {
    head.push(cuisineFamily);
    if (hintFamily !== cuisineFamily) head.push(hintFamily);
  }

  return unique([...head, ...(FALLBACKS[cuisineFamily] ?? FALLBACKS.general)]);
}

export function createImageAssigner() {
  const claimed = new Set<string>();

  const takeFrom = (urls: string[]): string | null => {
    for (const url of unique(urls)) {
      if (!claimed.has(url)) {
        claimed.add(url);
        return url;
      }
    }
    return null;
  };

  return {
    claimedCount() {
      return claimed.size;
    },
    claim(hint: ImageKey, cuisine: string): string {
      for (const name of searchFamilies(cuisine, hint)) {
        const url = takeFrom(IMAGE_POOLS[name]);
        if (url) return url;
      }

      const leftover = takeFrom(Object.values(IMAGE_POOLS).flat());
      if (leftover) return leftover;

      const fallback = IMAGES[hint];
      claimed.add(fallback);
      return fallback;
    },
  };
}

export const namedImageUrls = Object.values(IMAGES);

export function assertUniquePoolUrls(): string[] {
  const seen = new Map<string, string>();
  const duplicates: string[] = [];
  for (const [family, urls] of Object.entries(IMAGE_POOLS)) {
    for (const url of urls) {
      const previous = seen.get(url);
      if (previous) duplicates.push(`${url} in ${previous} and ${family}`);
      else seen.set(url, family);
    }
  }
  return duplicates;
}
