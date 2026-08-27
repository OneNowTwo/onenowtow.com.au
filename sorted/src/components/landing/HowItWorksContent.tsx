"use client";

import { useState } from "react";
import { DinnerCard } from "@/components/dinner/DinnerCard";
import { ButtonLink } from "@/components/ui/Button";
import { PrototypeNotice } from "@/components/brand/PrototypeNotice";
import { IMAGES } from "@/lib/data/images";
import { cn } from "@/lib/cn";

const example = [
  {
    restaurant: { name: "Manly Thai Gourmet", suburb: "Manly", cuisine: "Thai" },
    bundle: {
      name: "Vegetable Thai Table",
      description: "Tofu larb, vegetable curry, greens and jasmine rice create a vegetable-forward spread.",
      price: 52,
      feeds_people: 4,
      estimated_minutes: 30,
      image_url: IMAGES.veg,
      tags: ["Healthy", "Quick", "Vegetarian"],
    },
  },
  {
    restaurant: { name: "Jipang", suburb: "Manly", cuisine: "Japanese" },
    bundle: {
      name: "Jipang Family Rice Table",
      description: "Grilled chicken, vegetable rice bowls, edamame and miso make a balanced family spread.",
      price: 56,
      feeds_people: 4,
      estimated_minutes: 30,
      image_url: IMAGES.japanese,
      tags: ["Healthy", "Quick", "Family"],
    },
  },
  {
    restaurant: { name: "Ripples Little Manly", suburb: "Manly", cuisine: "Modern Australian" },
    bundle: {
      name: "Cove Vegetable Bowls",
      description: "Grains, beans, roast vegetables and leafy greens make colourful plant-based bowls.",
      price: 52,
      feeds_people: 4,
      estimated_minutes: 30,
      image_url: IMAGES.bowls,
      tags: ["Healthy", "Quick", "Vegetarian"],
    },
  },
];

const faqs = [
  {
    q: "Why only three choices?",
    a: "Because the point of Sorted is to remove decision fatigue rather than give you another endless restaurant list.",
  },
  {
    q: "Are these real restaurants?",
    a: "Yes. The Manly prototype uses real local restaurants so the experience feels realistic.",
  },
  {
    q: "Are the Sorted dinner packs real restaurant offers?",
    a: "Not yet. During the prototype stage, the dinner packs and indicative prices are concepts created to test the Sorted experience. They should not be represented as official restaurant offers.",
  },
  {
    q: "Does Sorted deliver the food?",
    a: "Not currently. The MVP is testing dinner discovery and recommendation first.",
  },
  {
    q: "Can I tell Sorted what my family doesn't eat?",
    a: "Yes. Household preferences include cuisines, dietary requirements and foods to avoid.",
  },
  {
    q: "What if I don't like the three options?",
    a: "Select Give me three more and Sorted will replace the current recommendations with three new options.",
  },
  {
    q: "Can I save dinners we like?",
    a: "Yes. Save favourites so good options are easy to find again.",
  },
  {
    q: "What is Sorted 3?",
    a: "Sorted 3 is the planned weekly version of Sorted: three restaurant dinners organised for your household each week, with the ability to review and swap them before ordering.",
  },
];

export function HowItWorksContent() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">How it works</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
          Dinner without the scroll.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
          Tell Sorted what tonight looks like and we&apos;ll narrow it down to three good options from
          around Manly.
        </p>
        <ButtonLink href="/sort" size="lg" className="mt-8">
          Sort tonight&apos;s dinner
        </ButtonLink>
      </section>

      <section className="border-y border-border bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3">
          {[
            {
              n: "1",
              title: "Tell us what tonight looks like",
              body: "Who you're feeding, what you feel like and what you want to spend.",
            },
            {
              n: "2",
              title: "We narrow it down",
              body: "Sorted matches tonight with dinner concepts from local Manly restaurants.",
            },
            {
              n: "3",
              title: "Pick dinner",
              body: "Choose one of three recommendations and get on with your evening.",
            },
          ].map((step) => (
            <div key={step.n}>
              <p className="font-display text-4xl text-accent/80">{step.n}</p>
              <h2 className="mt-3 font-display text-2xl tracking-tight">{step.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-ink-soft">4 people · Manly · Healthy · Under $70</p>
        <p className="mt-2 text-sm text-muted">↓</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {example.map((dinner) => (
            <DinnerCard
              key={dinner.bundle.name}
              variant="showcase"
              restaurant={dinner.restaurant}
              bundle={dinner.bundle}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-4xl tracking-tight">Three options. Not three hundred.</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Sorted is designed to remove choice, not create more of it. Instead of scrolling through
            endless restaurants and menus, we show you the three dinners that best fit tonight.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-4xl tracking-tight">Questions</h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className="font-display text-xl tracking-tight">{item.q}</span>
                  <span className="text-muted">{isOpen ? "–" : "+"}</span>
                </button>
                <div
                  className={cn(
                    "overflow-hidden pb-5 pr-8 text-muted leading-relaxed",
                    !isOpen && "hidden",
                  )}
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
        <PrototypeNotice className="mt-10 text-sm leading-relaxed text-muted" />
      </section>
    </div>
  );
}
