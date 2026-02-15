import { PageHeader } from "@/components/docs/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShapesLibraryPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Shape Library"
        description="Placeholder for squircles and other future reusable shape assets."
      />

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            This area will eventually host shape primitives, usage guidance, and downloadable assets.
          </p>
          <p>
            Initial focus remains on stabilizing icon CDN workflows before shape primitives are added.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
