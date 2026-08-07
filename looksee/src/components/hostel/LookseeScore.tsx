import { vibeLabel, vibePosition } from "@/lib/utils/vibe";
import type { Hostel } from "@/lib/types/database";

type Props = {
  hostel: Pick<
    Hostel,
    | "avg_cleanliness"
    | "avg_sleep"
    | "avg_social"
    | "avg_security"
    | "avg_location"
    | "avg_overall"
    | "avg_vibe_score"
  >;
};

const dimensions = [
  { key: "avg_cleanliness", label: "Cleanliness" },
  { key: "avg_sleep", label: "Sleep" },
  { key: "avg_social", label: "Social" },
  { key: "avg_security", label: "Security" },
  { key: "avg_location", label: "Location" },
] as const;

export function LookseeScore({ hostel }: Props) {
  const overall = hostel.avg_overall;
  const vibe = hostel.avg_vibe_score;
  const position = vibePosition(vibe);

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Looksee score</h2>
          <p className="mt-1 text-sm text-muted">Average from traveller ratings</p>
        </div>
        {overall != null ? (
          <div className="text-right">
            <p className="text-3xl font-extrabold tabular-nums tracking-tight">
              {overall.toFixed(1)}
            </p>
            <p className="text-xs text-muted">out of 5</p>
          </div>
        ) : null}
      </div>

      <ul className="space-y-3">
        {dimensions.map((dim) => {
          const value = hostel[dim.key] ?? 0;
          const pct = (value / 5) * 100;
          return (
            <li key={dim.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{dim.label}</span>
                <span className="tabular-nums text-muted">{value.toFixed(1)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted-bg">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Vibe</span>
          <span className="font-semibold text-accent">{vibeLabel(vibe)}</span>
        </div>
        <div className="relative h-2 rounded-full bg-gradient-to-r from-party via-accent/40 to-chill">
          <span
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-foreground shadow"
            style={{ left: `calc(${position}% - 0.5rem)` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs font-medium text-muted">
          <span>Party</span>
          <span>Chill</span>
        </div>
      </div>
    </section>
  );
}
