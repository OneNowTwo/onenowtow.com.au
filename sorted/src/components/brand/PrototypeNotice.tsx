export function PrototypeNotice({ className }: { className?: string }) {
  return (
    <p className={className ?? "text-xs leading-relaxed text-muted"}>
      Sorted is currently a prototype being tested in Manly. Restaurant names are real; Sorted Packs
      and indicative prices are concepts for testing and are not official restaurant offers.
    </p>
  );
}
