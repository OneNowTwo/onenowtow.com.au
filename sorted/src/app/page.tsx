import { DinnerCard } from "@/components/dinner/DinnerCard";
import { LandingCtas, LandingFooterCta } from "@/components/landing/LandingCtas";
import { PrototypeNotice } from "@/components/brand/PrototypeNotice";
import { ButtonLink } from "@/components/ui/Button";
import { IMAGES } from "@/lib/data/images";

const exampleDinners = [
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
      image_url: IMAGES.protein,
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

const weeknights = [
  { title: "Kids sport at 6.", body: "Something fast that still feeds everyone." },
  { title: "Late home from work.", body: "No scrolling. Three options and done." },
  { title: "Can't face cooking.", body: "A real Manly restaurant, without the faff." },
  { title: "Don't want to spend $100 on takeaway.", body: "Set a budget. We'll stay inside it." },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pt-28">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">Sorted</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Dinner, sorted.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
          Three good dinner options. No endless scrolling.
        </p>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Tell us who you&apos;re feeding, what you feel like and what you want to spend. We&apos;ll give
          you three good options from around Manly.
        </p>
        <LandingCtas />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:pb-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
          A typical Tuesday
        </p>
        <h2 className="mt-3 font-display text-4xl tracking-tight">Tonight for the Taylor family</h2>
        <ul className="mt-5 flex flex-wrap gap-2 text-sm text-ink-soft">
          {["4 people", "Manly", "Under $70", "Quick + healthy"].map((item) => (
            <li key={item} className="rounded-full bg-muted-bg px-3 py-1.5">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {exampleDinners.map((dinner) => (
            <DinnerCard
              key={dinner.bundle.name}
              variant="showcase"
              restaurant={dinner.restaurant}
              bundle={dinner.bundle}
            />
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-border bg-card/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-3">
            {[
              {
                step: "1",
                title: "Tell us what tonight looks like",
                body: "Who you're feeding, your budget and what you feel like.",
              },
              {
                step: "2",
                title: "We narrow it down",
                body: "Three dinner concepts from real Manly restaurants. That's it.",
              },
              {
                step: "3",
                title: "Pick one",
                body: "Choose dinner and get on with your evening.",
              },
            ].map((item) => (
              <div key={item.step} className="max-w-sm">
                <p className="font-display text-4xl text-accent/80">{item.step}</p>
                <h2 className="mt-3 font-display text-2xl tracking-tight">{item.title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <ButtonLink href="/how-it-works" variant="secondary" className="mt-10">
            See how Sorted works
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <h2 className="font-display text-4xl tracking-tight">Built for real weeknights.</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {weeknights.map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-2xl tracking-tight">{item.title}</h3>
              <p className="mt-2 text-muted leading-relaxed">{item.body}</p>
            </div>
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

      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
              What are we eating tonight?
            </h2>
            <p className="mt-3 max-w-lg text-background/70">
              Three good choices. That&apos;s the whole product.
            </p>
          </div>
          <LandingFooterCta />
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PrototypeNotice />
      </footer>
    </div>
  );
}
