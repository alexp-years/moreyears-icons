import Link from "next/link";
import { ArrowRight, BookText, FileText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { homeSection } from "@/lib/docs-nav";

const featureIconMap = {
  "/home/introduction": BookText,
  "/home/explore-icons": Search,
  "/home/documentation": FileText,
};

export default function OverviewPage() {
  const navItems = homeSection?.items ?? [];

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h1 className="font-display text-[clamp(3.6rem,8.3vw,5.4rem)] leading-[0.95] text-foreground">
          More Years CDN
        </h1>
        <p className="max-w-[58rem] text-[clamp(1.28rem,2.35vw,2.02rem)] leading-snug text-foreground/90">
          A proof of concept for our icon library: CDN-hosted SVGs, an npm package,
          and a searchable catalog for the team.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Badge
            className="border-[var(--years-gray-300)] bg-[var(--years-gray-100)] px-4 py-1.5 text-[0.9rem] font-medium text-[var(--years-gray-700)]"
            variant="secondary"
          >
            Local-first
          </Badge>
          <Badge
            className="border-[var(--years-gray-300)] bg-[var(--years-gray-100)] px-4 py-1.5 text-[0.9rem] font-medium text-[var(--years-gray-700)]"
            variant="secondary"
          >
            NPM package
          </Badge>
          <Badge
            className="border-[var(--years-gray-300)] bg-[var(--years-gray-100)] px-4 py-1.5 text-[0.9rem] font-medium text-[var(--years-gray-700)]"
            variant="secondary"
          >
            CDN-ready
          </Badge>
        </div>
        <Separator className="bg-[var(--years-purple-200)]" />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {navItems.map((item) => {
          const Icon =
            featureIconMap[item.href as keyof typeof featureIconMap] ?? BookText;

          return (
            <Link key={item.href} href={item.href} className="group block">
              <Card className="h-full min-h-[300px] rounded-[2rem] border-[var(--years-purple-200)] bg-[color:color-mix(in_srgb,var(--years-purple-100)_84%,white)] py-0 shadow-none transition hover:-translate-y-1 hover:shadow-md">
                <CardHeader className="px-8 pt-8 pb-0">
                  <div className="mx-auto mb-6 flex size-[3.75rem] items-center justify-center rounded-2xl bg-[var(--years-purple-300)] text-[var(--years-purple-800)]">
                    <Icon className="size-8" />
                  </div>
                  <CardTitle className="font-display text-[clamp(2.2rem,3.6vw,3.1rem)] leading-[0.95] text-[var(--years-purple-800)]">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pt-4 pb-7">
                  <div className="flex items-end justify-between gap-4">
                    <p className="max-w-[18ch] text-[1.03rem] leading-relaxed text-[var(--years-purple-800)]/88">
                      {item.description}
                    </p>
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--years-purple-300)] text-[var(--years-purple-800)] transition group-hover:translate-x-0.5">
                      <ArrowRight className="size-5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
