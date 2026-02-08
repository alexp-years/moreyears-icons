import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { spacingScale } from "@/lib/tokens/spacing";

export function SpacingScale() {
  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-muted/30">
        <CardContent className="flex flex-wrap items-center gap-2 py-4 text-sm">
          <span className="font-medium text-foreground">Key reference:</span>
          <Badge variant="secondary">spacing-4 = 16px</Badge>
          <span className="text-muted-foreground">
            Matches the Tailwind spacing scale.
          </span>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {spacingScale.map((token) => {
          const isKey = token.name === "4";
          return (
            <div
              key={token.name}
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/70 px-4 py-3"
            >
              <div className="w-20 text-xs font-medium text-muted-foreground">
                spacing-{token.name}
              </div>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-foreground"
                    style={{ width: `${token.px}px`, maxWidth: "100%" }}
                  />
                </div>
              </div>
              <div className="w-24 text-right text-xs text-muted-foreground">
                {token.px}px · {token.rem}
              </div>
              {isKey && <Badge>Core</Badge>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
