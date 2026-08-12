import { HOME_FAQS } from "@/lib/rewards/catalog";

export function FaqList({
  items = HOME_FAQS,
}: {
  items?: readonly { q: string; a: string }[];
}) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card ring-1 ring-border">
      {items.map((item) => (
        <details key={item.q} className="group px-4 py-1">
          <summary className="cursor-pointer list-none py-3 text-[15px] font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-3">
              {item.q}
              <span className="text-muted transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </span>
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
