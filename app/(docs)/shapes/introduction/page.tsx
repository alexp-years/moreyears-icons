import { Badge } from "@/components/ui/badge";

export default function ShapesIntroductionPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col gap-2 border-b border-[var(--years-purple-300)] pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[clamp(2.5rem,5vw,3rem)] leading-none text-foreground">
            Shapes Introduction
          </h1>
          <p className="max-w-[58rem] text-[clamp(1.1rem,2vw,1.25rem)] leading-snug text-foreground">
            Placeholder for our shape strategy and how geometric forms support
            the MoreYears visual language.
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
            Planned content
          </h2>
          <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-[var(--years-purple-800)]">
            <p>
              This section will explain our approach to shape consistency,
              rounded geometry, and product-level usage rules.
            </p>
            <p>
              For now, this page is intentionally a placeholder while icon
              documentation is the primary focus.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
