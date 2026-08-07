export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse-soft px-4 py-8 sm:px-6">
      <div className="h-8 w-40 rounded-lg bg-muted-bg" />
      <div className="mt-4 h-4 w-64 rounded bg-muted-bg" />
      <div className="mt-8 h-12 rounded-2xl bg-muted-bg" />
      <div className="mt-8 flex gap-3 overflow-hidden">
        <div className="h-64 w-56 shrink-0 rounded-2xl bg-muted-bg" />
        <div className="h-64 w-56 shrink-0 rounded-2xl bg-muted-bg" />
        <div className="h-64 w-56 shrink-0 rounded-2xl bg-muted-bg" />
      </div>
      <div className="mx-auto mt-8 h-96 max-w-md rounded-2xl bg-muted-bg" />
    </div>
  );
}
