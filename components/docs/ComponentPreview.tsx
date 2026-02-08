import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ComponentPreview() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">Component library preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          Components will live here once the system solidifies. This space will
          include ready-to-use patterns, states, and accessibility guidance.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </CardContent>
    </Card>
  );
}
