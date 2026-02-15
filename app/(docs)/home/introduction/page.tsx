import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/docs/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomeIntroductionPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Introduction"
        description="This project is a practical proof of concept for shipping and consuming brand icons through CDN-hosted SVGs and an npm package."
      />

      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <CardTitle>What this includes today</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            A searchable icon explorer, a stable CDN URL contract, and generated package outputs
            for downstream teams.
          </p>
          <p>
            Most non-icon sections are placeholders for now, but the project structure is ready to
            scale as more documentation and assets are added.
          </p>
          <Button asChild className="w-fit">
            <Link href="/home/explore-icons">
              Explore icons
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
