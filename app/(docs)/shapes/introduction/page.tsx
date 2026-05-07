export default function ShapesIntroductionPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="flex flex-col gap-4">
        <p className="slice-eyebrow">Shapes</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.25rem)] leading-none text-foreground">
          Shapes Introduction
        </h1>
        <p className="max-w-[58rem] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-snug text-muted-foreground">
          Placeholder for our shape strategy and how geometric forms support
          the MoreYears visual language.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {["Placeholder", "Coming soon"].map((label) => (
            <span key={label} className="slice-chip">
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* Callout */}
      <section className="slice-card p-8">
        <p className="slice-eyebrow mb-3">Plan</p>
        <h2 className="font-display text-2xl leading-tight text-foreground">
          Planned content
        </h2>
        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            This section will explain our approach to shape consistency,
            rounded geometry, and product-level usage rules.
          </p>
          <p>
            For now, this page is intentionally a placeholder while icon
            documentation is the primary focus.
          </p>
        </div>
      </section>
    </div>
  );
}
