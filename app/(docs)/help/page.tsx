import { Badge } from "@/components/ui/badge";

export default function HelpPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col gap-2 border-b border-[var(--years-purple-300)] pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[clamp(2.5rem,5vw,3rem)] leading-none text-foreground">
            Help
          </h1>
          <p className="max-w-[58rem] text-[clamp(1.1rem,2vw,1.25rem)] leading-snug text-foreground">
            Quick guidance for maintaining and updating this project in the
            future.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Maintenance", "Quick start"].map((label) => (
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
            Update workflow
          </h2>
          <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-[var(--years-purple-800)]">
            <p>1. Pull the latest icons package from npm.</p>
            <p>2. Sync local CDN assets and rebuild:</p>
            <pre className="overflow-x-auto rounded-xl bg-[var(--years-purple-200)] p-4 text-xs text-[var(--years-purple-900)]">
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
        </div>
      </section>
    </div>
  );
}
