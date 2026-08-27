import { DinnerCard } from "@/components/dinner/DinnerCard";
import { LandingCtas, LandingFooterCta } from "@/components/landing/LandingCtas";
import { IMAGES } from "@/lib/data/images";

const exampleDinners = [
  {
    restaurant: { name: "Bangkok Local", suburb: "Neutral Bay" },
    bundle: {
      name: "Family Thai Night",
      description: "Green curry, pad see ew, jasmine rice and spring rolls.",
      price: 58,
      feeds_people: 4,
      estimated_minutes: 35,
      image_url: IMAGES.thai,
      tags: ["Quick", "Family favourite", "Thai"],
    },
  },
  {
    restaurant: { name: "Via Napoli Kitchen", suburb: "Crows Nest" },
    bundle: {
      name: "Italian Family Table",
      description: "Two pizzas, pasta, garlic bread and rocket salad.",
      price: 64,
      feeds_people: 4,
      estimated_minutes: 30,
      image_url: IMAGES.pizza,
      tags: ["Italian", "Comfort", "Kids love it"],
    },
  },
  {
    restaurant: { name: "Green Bowl Co", suburb: "North Sydney" },
    bundle: {
      name: "Family Protein Bowls",
      description: "Grilled chicken, rice, vegetables, sauces and kids bowls.",
      price: 61,
      feeds_people: 4,
      estimated_minutes: 40,
      image_url: IMAGES.protein,
      tags: ["Healthy", "High protein", "Family"],
    },
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:pt-28">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">Sorted</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Dinner, sorted.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
          Three dinner options. No endless scrolling.
        </p>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Tell us who you&apos;re feeding, what you feel like and what you want to spend.
          We&apos;ll give you three good options.
        </p>
        <LandingCtas />
      </section>

      <section id="how-it-works" className="border-y border-border bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:py-20">
          {[
            {
              step: "1",
              title: "Tell us what tonight looks like",
              body: "Who you're feeding, your budget and what you feel like.",
            },
            {
              step: "2",
              title: "Get three options",
              body: "We narrow down the noise and show you three suitable dinners.",
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
              <p className="mt-3 text-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
          A typical Tuesday
        </p>
        <h2 className="mt-3 font-display text-4xl tracking-tight">Tonight for the Taylor family</h2>
        <ul className="mt-5 flex flex-wrap gap-2 text-sm text-ink-soft">
          {["4 people", "Neutral Bay", "Under $70", "Quick + healthy"].map((item) => (
            <li key={item} className="rounded-full bg-muted-bg px-3 py-1.5">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {exampleDinners.map((dinner) => (
            <DinnerCard
              key={dinner.bundle.name}
              restaurant={dinner.restaurant}
              bundle={dinner.bundle}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
              What are we having tonight?
            </h2>
            <p className="mt-3 max-w-lg text-background/70">
              Three good choices. That&apos;s the whole product.
            </p>
          </div>
          <LandingFooterCta />
        </div>
      </section>
    </div>
  );
}
