export default function HelpPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="flex flex-col gap-4">
        <p className="slice-eyebrow">More Years</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.25rem)] leading-none text-foreground">
          Help
        </h1>
        <p className="max-w-[58rem] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-snug text-muted-foreground">
          Quick guidance for maintaining and updating this project in the
          future.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {["Maintenance", "Quick start"].map((label) => (
            <span
              key={label}
              className="slice-chip"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* Callout */}
      <section className="slice-card p-8">
        <p className="slice-eyebrow mb-3">Workflow</p>
        <h2 className="font-display text-2xl leading-tight text-foreground">
          Update workflow
        </h2>
        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>1. Pull the latest icons package from npm.</p>
          <p>2. Sync local CDN assets and rebuild:</p>
          <pre className="slice-code">
{`npm i @moreyears/icons@latest
npm run icons:build
npm run lint
npm run build:poc`}
          </pre>
          <p>
            3. Validate that the explorer still works and copied CDN links
            resolve before shipping.
          </p>
        </div>
      </section>
    </div>
  );
}
