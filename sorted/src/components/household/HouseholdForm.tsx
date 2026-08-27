"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { useHousehold } from "@/components/providers/HouseholdProvider";
import { track } from "@/lib/analytics";
import { BUDGET_OPTIONS, CUISINES, DIETARY_OPTIONS } from "@/lib/constants";
import { suburbForPostcode } from "@/lib/postcodes";

function Stepper({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink-soft">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip key={option} selected={value === option} onClick={() => onChange(option)}>
            {option >= 4 ? "4+" : option}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

export function HouseholdForm() {
  const router = useRouter();
  const { household, saveHousehold } = useHousehold();

  const [name, setName] = useState(household?.household_name || "The Taylors");
  const [postcode, setPostcode] = useState(household?.postcode || "2095");
  const [adults, setAdults] = useState(household?.adults ?? 2);
  const [children, setChildren] = useState(household?.children ?? 2);
  const [dietary, setDietary] = useState<string[]>(household?.dietary_requirements ?? []);
  const [cuisines, setCuisines] = useState<string[]>(
    household?.favourite_cuisines ?? ["Thai", "Italian"],
  );
  const [avoided, setAvoided] = useState(household?.avoided_foods ?? "");
  const [budget, setBudget] = useState(household?.typical_budget ?? "60-80");

  const suburb = useMemo(() => suburbForPostcode(postcode), [postcode]);

  function toggleDietary(id: string) {
    if (id === "none") {
      setDietary((current) => (current.includes("none") ? [] : ["none"]));
      return;
    }
    setDietary((current) => {
      const withoutNone = current.filter((item) => item !== "none");
      return withoutNone.includes(id)
        ? withoutNone.filter((item) => item !== id)
        : [...withoutNone, id];
    });
  }

  function toggleCuisine(nameValue: string) {
    setCuisines((current) =>
      current.includes(nameValue)
        ? current.filter((item) => item !== nameValue)
        : [...current, nameValue],
    );
  }

  function submit(asGuest: boolean) {
    const profile = saveHousehold({
      household_name: name.trim() || "Our household",
      postcode: postcode.trim() || "2095",
      adults,
      children,
      dietary_requirements: dietary,
      favourite_cuisines: cuisines,
      avoided_foods: avoided,
      typical_budget: budget,
      user_id: null,
    });
    track("household_created", {
      guest: asGuest,
      postcode: profile.postcode,
      adults: profile.adults,
      children: profile.children,
    });
    router.push("/sort");
  }

  return (
    <form
      className="space-y-10"
      onSubmit={(event) => {
        event.preventDefault();
        submit(true);
      }}
    >
      <section className="space-y-5">
        <h2 className="font-display text-2xl tracking-tight">Who are we feeding?</h2>
        <label className="block">
          <span className="text-sm font-medium text-ink-soft">Household name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-border bg-card px-4 outline-none"
            placeholder="The Taylors"
            autoComplete="organization"
          />
        </label>
        <div className="grid gap-6 sm:grid-cols-2">
          <Stepper label="Adults" value={adults} options={[1, 2, 3, 4]} onChange={setAdults} />
          <Stepper label="Children" value={children} options={[0, 1, 2, 3, 4]} onChange={setChildren} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-tight">Where are you?</h2>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-ink-soft">Postcode</span>
          <input
            value={postcode}
            onChange={(event) => setPostcode(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-border bg-card px-4 outline-none"
            placeholder="2095"
            inputMode="numeric"
          />
          {suburb ? <p className="mt-2 text-sm text-muted">{suburb}</p> : null}
        </label>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-tight">Any food rules?</h2>
        <fieldset className="mt-4">
          <legend className="sr-only">Dietary requirements</legend>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                selected={dietary.includes(option.id)}
                onClick={() => toggleDietary(option.id)}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-tight">What does your family actually like?</h2>
        <fieldset className="mt-4">
          <legend className="sr-only">Favourite cuisines</legend>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((cuisine) => (
              <Chip
                key={cuisine}
                selected={cuisines.includes(cuisine)}
                onClick={() => toggleCuisine(cuisine)}
              >
                {cuisine}
              </Chip>
            ))}
          </div>
        </fieldset>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-tight">Anything you avoid?</h2>
        <label className="mt-4 block">
          <span className="sr-only">Foods we avoid</span>
          <input
            value={avoided}
            onChange={(event) => setAvoided(event.target.value)}
            className="h-12 w-full rounded-2xl border border-border bg-card px-4 outline-none"
            placeholder="Olives, extra spicy, coriander"
          />
        </label>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-tight">What do you normally spend?</h2>
        <fieldset className="mt-4">
          <legend className="sr-only">Typical dinner budget</legend>
          <div className="flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                selected={budget === option.id}
                onClick={() => setBudget(option.id)}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg">
          Save & sort dinner
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => submit(true)}>
          Continue as guest
        </Button>
      </div>
      <p className="text-sm text-muted">
        Guest profiles stay on this device. You can add an email later from You.
      </p>
    </form>
  );
}
