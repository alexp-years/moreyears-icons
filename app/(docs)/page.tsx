import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/docs/PageHeader";
import { docsNav } from "@/lib/docs-nav";

export default function OverviewPage() {
  const navItems = docsNav.filter((item) => item.href !== "/");

  return (
    <div className="space-y-10">
      <PageHeader
        title="More Years Icon CDN"
        description="A proof of concept for our icon library: CDN-hosted SVGs, an npm package, and a searchable catalog for the team."
      >
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Local-first</Badge>
          <Badge variant="secondary">NPM package</Badge>
          <Badge variant="secondary">CDN-ready</Badge>
        </div>
      </PageHeader>

      <section className="grid gap-6 md:grid-cols-2">
        {navItems.map((item) => (
          <Card
            key={item.href}
            className="border-border/60 bg-card/80 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <Button asChild variant="secondary">
                <Link href={item.href}>Open {item.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>How to use this</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Use the Icons page to search, filter, copy CDN URLs, or download
              SVGs. This keeps non-designers aligned while the icon pack
              evolves.
            </p>
            <p>
              When the in-house icon set is finalized, we will swap the source
              SVGs without changing any consumer APIs.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Next up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Add the final icon SVGs and publish the npm package to deliver a
              production-ready icon CDN.
            </p>
            <p>
              We can later re-introduce the broader design system once the
              foundations are ready.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
