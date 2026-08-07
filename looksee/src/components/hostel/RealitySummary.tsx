type Props = {
  lines: string[];
};

export function RealitySummary({ lines }: Props) {
  return (
    <section>
      <h2 className="text-lg font-bold tracking-tight">Travellers say</h2>
      {lines.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Not enough traveller ratings yet</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {lines.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2 text-sm leading-relaxed text-foreground/90"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {line}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
