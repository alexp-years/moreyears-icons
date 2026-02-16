import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HomeIntroductionPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col gap-2 border-b border-[var(--years-purple-300)] pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[clamp(2.5rem,5vw,3rem)] leading-none text-foreground">
            Introduction
          </h1>
          <p className="max-w-[58rem] text-[clamp(1.1rem,2vw,1.25rem)] leading-snug text-foreground">
            This project is a practical proof of concept for shipping and
            consuming brand icons through CDN-hosted SVGs and an npm package.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Proof of concept", "Icon-first", "NPM + CDN"].map((label) => (
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
            What this includes today
          </h2>
          <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-[var(--years-purple-800)]">
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
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--years-purple-200)] px-4 py-2.5 text-sm font-medium text-[var(--years-purple-800)] transition hover:bg-[var(--years-purple-300)]"
          >
            Explore icons
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
