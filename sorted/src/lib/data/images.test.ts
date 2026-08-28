import { describe, expect, it } from "vitest";
import {
  IMAGES,
  assertUniquePoolUrls,
  createImageAssigner,
  imageFamilyFor,
} from "@/lib/data/images";

describe("food photo library", () => {
  it("keeps named photos unique and live-shaped", () => {
    const urls = Object.values(IMAGES);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.startsWith("https://images."))).toBe(true);
    expect(IMAGES.family).not.toBe(IMAGES.grill);
    expect(IMAGES.mexican).not.toContain("1565299585323");
  });

  it("does not put the same URL in two cuisine pools", () => {
    expect(assertUniquePoolUrls()).toEqual([]);
  });

  it("assigns cuisine-appropriate photos before generic ones", () => {
    const assigner = createImageAssigner();
    const indian = assigner.claim("protein", "Indian");
    const thaiSeafood = assigner.claim("fish", "Thai");
    const hugosFish = assigner.claim("fish", "Italian");
    const bistroFish = assigner.claim("fish", "Modern Australian");
    expect(new Set([indian, thaiSeafood, hugosFish, bistroFish]).size).toBe(4);
    expect(indian).not.toBe(IMAGES.protein);
    expect(thaiSeafood).not.toBe(IMAGES.fish);
    expect(hugosFish).not.toBe(thaiSeafood);
    expect(imageFamilyFor("Indian", "protein")).toBe("indian");
    expect(imageFamilyFor("Thai", "fish")).toBe("thai");
    expect(imageFamilyFor("Seafood", "fish")).toBe("seafood");
  });
});
