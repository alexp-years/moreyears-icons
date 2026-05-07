import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@moreyears/icons";
import { shapesSection } from "@/lib/docs-nav";

const featureIconMap: Record<string, string> = {
  "/shapes/introduction": "shapes",
  "/shapes/library": "shapes",
  "/shapes/builder": "shapes",
};

export default function ShapesOverviewPage() {
  const navItems = shapesSection?.items ?? [];

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="flex flex-col gap-4">
        <p className="slice-eyebrow">More Years</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.25rem)] leading-none text-foreground">
          Shapes
        </h1>
        <p className="max-w-[58rem] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-snug text-muted-foreground">
          Placeholder top-level space for shape primitives, rules, and reusable
          assets across the MoreYears system.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {["Placeholder", "Shape guidance", "Coming soon"].map((label) => (
            <span
              key={label}
              className="slice-chip"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {navItems.map((item) => {
          const iconId = featureIconMap[item.href] ?? "shapes";

          return (
            <Link
              key={item.href}
              href={item.href}
              className="slice-card group flex flex-col items-center justify-end gap-6 overflow-hidden p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--slice-card-shadow-hover)]"
            >
              {/* Icon */}
              <div className="flex size-[90px] items-center justify-center">
                <div className="-rotate-[8deg] transition-transform duration-300 group-hover:rotate-0">
                  <Icon
                    name={iconId}
                    weight="bold-duotone"
                    size={80}
                    color="var(--years-purple-700)"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex w-full items-end gap-6">
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="font-display text-2xl leading-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center rounded-full bg-[var(--slice-inset-bg)] p-2 transition-all duration-200 group-hover:translate-x-1 group-hover:bg-[var(--years-yellow-200)]">
                  <ArrowRight className="size-5 text-[var(--years-purple-700)]" />
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
