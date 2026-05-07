export default function ShapesLibraryPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="flex flex-col gap-4">
        <p className="slice-eyebrow">Shapes</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.25rem)] leading-none text-foreground">
          Shape Library
        </h1>
        <p className="max-w-[58rem] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-snug text-muted-foreground">
          Placeholder for squircles and other future reusable shape assets.
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
        <p className="slice-eyebrow mb-3">Roadmap</p>
        <h2 className="font-display text-2xl leading-tight text-foreground">
          Coming soon
        </h2>
        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            This area will eventually host shape primitives, usage guidance,
            and downloadable assets.
          </p>
          <p>
            Initial focus remains on stabilizing icon CDN workflows before
            shape primitives are added.
          </p>
        </div>
      </section>
    </div>
  );
}
