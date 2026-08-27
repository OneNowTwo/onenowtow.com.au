"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { useHousehold } from "@/components/providers/HouseholdProvider";
import { track } from "@/lib/analytics";
import {
  BUDGET_OPTIONS,
  CUISINES,
  DIETARY_OPTIONS,
} from "@/lib/constants";
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
      <legend className="text-sm font-semibold">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip key={option} selected={value === option} onClick={() => onChange(option)}>
            {option >= 4 && label !== "Children" ? "4+" : option >= 4 ? "4+" : option}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

export function HouseholdForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { household, saveHousehold } = useHousehold();
  const next = searchParams.get("next") || "/sort";

  const [name, setName] = useState(household?.household_name || "The Taylors");
  const [postcode, setPostcode] = useState(household?.postcode || "2089");
  const [adults, setAdults] = useState(household?.adults ?? 2);
  const [children, setChildren] = useState(household?.children ?? 2);
  const [dietary, setDietary] = useState<string[]>(household?.dietary_requirements ?? []);
  const [cuisines, setCuisines] = useState<string[]>(household?.favourite_cuisines ?? ["Thai", "Italian"]);
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
      postcode: postcode.trim() || "2089",
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
    router.push(asGuest && next === "/login" ? "/sort" : next);
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault();
        submit(true);
      }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Household name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-border bg-card px-4 outline-none"
            placeholder="The Taylors"
            autoComplete="organization"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Postcode</span>
          <input
            value={postcode}
            onChange={(event) => setPostcode(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-border bg-card px-4 outline-none"
            placeholder="2089"
            inputMode="numeric"
          />
          {suburb ? <p className="mt-2 text-sm text-muted">{suburb}</p> : null}
        </label>
      </div>

      <Stepper label="Adults" value={adults} options={[1, 2, 3, 4]} onChange={setAdults} />
      <Stepper label="Children" value={children} options={[0, 1, 2, 3, 4]} onChange={setChildren} />

      <fieldset>
        <legend className="text-sm font-semibold">Dietary requirements</legend>
        <div className="mt-3 flex flex-wrap gap-2">
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

      <fieldset>
        <legend className="text-sm font-semibold">Favourite cuisines</legend>
        <div className="mt-3 flex flex-wrap gap-2">
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

      <label className="block">
        <span className="text-sm font-semibold">Foods we avoid</span>
        <input
          value={avoided}
          onChange={(event) => setAvoided(event.target.value)}
          className="mt-2 h-12 w-full rounded-2xl border border-border bg-card px-4 outline-none"
          placeholder="Olives, extra spicy, coriander"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold">Typical dinner budget</legend>
        <div className="mt-3 flex flex-wrap gap-2">
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg">
          Save household
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => submit(true)}>
          Continue as guest
        </Button>
      </div>
      <p className="text-sm text-muted">
        Guest profiles stay on this device. You can add email later from Profile.
      </p>
    </form>
  );
}
