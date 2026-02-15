import { PageHeader } from "@/components/docs/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShapesIntroductionPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Shapes Introduction"
        description="Placeholder for our shape strategy and how geometric forms support the MoreYears visual language."
      />

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Planned content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            This section will explain our approach to shape consistency, rounded geometry, and
            product-level usage rules.
          </p>
          <p>
            For now, this page is intentionally a placeholder while icon documentation is the primary
            focus.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
