import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@moreyears/icons";
import { Badge } from "@/components/ui/badge";
import { shapesSection } from "@/lib/docs-nav";

const featureIconMap: Record<string, string> = {
  "/shapes/introduction": "shapes",
  "/shapes/library": "shapes",
};

export default function ShapesOverviewPage() {
  const navItems = shapesSection?.items ?? [];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col gap-2 border-b border-[var(--years-purple-300)] pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[clamp(2.5rem,5vw,3rem)] leading-none text-foreground">
            Shapes
          </h1>
          <p className="max-w-[58rem] text-[clamp(1.1rem,2vw,1.25rem)] leading-snug text-foreground">
            Placeholder top-level space for shape primitives, rules, and reusable
            assets across the MoreYears system.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Placeholder", "Shape guidance", "Coming soon"].map((label) => (
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

      {/* Feature cards */}
      <section className="grid gap-2 pt-8 md:grid-cols-2 lg:grid-cols-3">
        {navItems.map((item) => {
          const iconId = featureIconMap[item.href] ?? "shapes";

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center justify-end gap-6 overflow-hidden rounded-3xl bg-[var(--years-purple-100)] p-8 transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Icon */}
              <div className="flex size-[90px] items-center justify-center">
                <div className="-rotate-[8deg]">
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
                  <h3 className="font-display text-2xl leading-tight text-[var(--years-purple-800)]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--years-purple-800)]">
                    {item.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center rounded-lg bg-[var(--years-purple-200)] p-2 transition group-hover:translate-x-0.5">
                  <ArrowRight className="size-6 text-[var(--years-purple-700)]" />
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
