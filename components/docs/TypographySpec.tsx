import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { typographySamples } from "@/lib/tokens/typography";

const sampleLine =
  "Years are meant to be celebrated — craft with clarity and warmth.";

export function TypographySpec() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">MoreYears (Display)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Use for headlines, brand moments, and hero copy.</p>
            <p>Weight: Regular</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">Poppins (Body)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Use for body copy, UI labels, and supporting text.</p>
            <p>Weights: 300–700</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {typographySamples.map((sample) => (
          <div
            key={sample.label}
            className="rounded-2xl border border-border/60 bg-background/70 px-6 py-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {sample.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {sample.size} / {sample.lineHeight}
              </p>
            </div>
            <p
              className={`${sample.className} mt-3 ${
                sample.font === "display" ? "font-display" : "font-sans"
              }`}
            >
              {sampleLine}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
