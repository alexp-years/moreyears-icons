import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { colorFamilies, paletteNotice, semanticColors } from "@/lib/tokens/colors";

type ColorSectionProps = {
  title: string;
  colors: typeof colorFamilies;
};

function ColorSection({ title, colors }: ColorSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-display">{title}</h2>
        <Badge variant="secondary">11 shades · 50 → 950</Badge>
      </div>
      <div className="space-y-6">
        {colors.map((family) => (
          <Card key={family.name} className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">{family.name}</CardTitle>
              {family.description && (
                <p className="text-sm text-muted-foreground">
                  {family.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea>
                <div className="flex gap-4 pb-4">
                  {family.shades.map((shade) => (
                    <div key={shade.shade} className="min-w-[130px] space-y-2">
                      <div
                        className="h-16 rounded-xl border border-border/60"
                        style={{ backgroundColor: shade.hex }}
                      />
                      <div className="text-xs font-medium">
                        {family.name} {shade.shade}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {shade.hex}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="rounded-full border border-border/60 bg-background px-3 py-1">
                  Text on {family.name} 600
                </span>
                <span className="rounded-full border border-border/60 bg-background px-3 py-1">
                  Background {family.name} 50
                </span>
                <span className="rounded-full border border-border/60 bg-background px-3 py-1">
                  Border {family.name} 200
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ColorPalette() {
  return (
    <div className="space-y-10">
      <Card className="border-border/60 bg-muted/30">
        <CardContent className="space-y-2 py-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Palette status</p>
          <p>{paletteNotice}</p>
        </CardContent>
      </Card>

      <ColorSection title="Core Palette" colors={colorFamilies} />
      <ColorSection title="Semantic Colors" colors={semanticColors} />
    </div>
  );
}
