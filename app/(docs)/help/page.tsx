import { PageHeader } from "@/components/docs/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Help"
        description="Quick guidance for maintaining and updating this project in the future."
      />

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Update workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>1. Pull the latest icons package from npm.</p>
          <p>2. Sync local CDN assets and rebuild:</p>
          <pre className="overflow-x-auto rounded-xl border border-border/70 bg-muted/30 p-4 text-xs text-foreground">
{`npm i @moreyears/icons@latest
npm run icons:build
npm run lint
npm run build:poc`}
          </pre>
          <p>
            3. Validate that the explorer still works and copied CDN links resolve before shipping.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
