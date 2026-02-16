import { Badge } from "@/components/ui/badge";

export default function ShapesLibraryPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col gap-2 border-b border-[var(--years-purple-300)] pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[clamp(2.5rem,5vw,3rem)] leading-none text-foreground">
            Shape Library
          </h1>
          <p className="max-w-[58rem] text-[clamp(1.1rem,2vw,1.25rem)] leading-snug text-foreground">
            Placeholder for squircles and other future reusable shape assets.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Placeholder", "Coming soon"].map((label) => (
            <Badge
              key={label}
              className="rounded-full border-[var(--years-gray-200)] bg-[var(--years-gray-100)] px-3 py-1 text-sm font-normal text-[var(--years-gray-700)]"
              variant="secondary"
            >
              {label}
            </Badge>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="flex flex-col gap-6 pt-8">
        <div className="rounded-2xl bg-[var(--years-purple-100)] p-8">
          <h2 className="font-display text-2xl leading-tight text-[var(--years-purple-800)]">
            Coming soon
          </h2>
          <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-[var(--years-purple-800)]">
            <p>
              This area will eventually host shape primitives, usage guidance,
              and downloadable assets.
            </p>
            <p>
              Initial focus remains on stabilizing icon CDN workflows before
              shape primitives are added.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
