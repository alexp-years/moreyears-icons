import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomeIntroductionPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="flex flex-col gap-4">
        <p className="slice-eyebrow">More Years</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.25rem)] leading-none text-foreground">
          Introduction
        </h1>
        <p className="max-w-[58rem] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-snug text-muted-foreground">
          This project is a practical proof of concept for shipping and
          consuming brand icons through CDN-hosted SVGs and an npm package.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {["Proof of concept", "Icon-first", "NPM + CDN"].map((label) => (
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
        <p className="slice-eyebrow mb-3">Today</p>
        <h2 className="font-display text-2xl leading-tight text-foreground">
          What this includes
        </h2>
        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            A searchable icon explorer, a stable CDN URL contract, and
            generated package outputs for downstream teams.
          </p>
          <p>
            Most non-icon sections are placeholders for now, but the project
            structure is ready to scale as more documentation and assets are
            added.
          </p>
        </div>
        <Link
          href="/home/explore-icons"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--years-yellow-300)] px-4 py-2 text-sm font-semibold text-[var(--years-purple-950)] transition-all duration-200 hover:bg-[var(--years-yellow-400)] hover:shadow-[var(--slice-card-shadow)]"
        >
          Explore icons
          <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
