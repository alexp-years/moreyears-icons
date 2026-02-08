import fs from "fs/promises";
import path from "path";
import { IconGrid } from "@/components/docs/IconGrid";
import { PageHeader } from "@/components/docs/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

async function getManifest() {
  try {
    const manifestPath = path.join(
      process.cwd(),
      "public",
      "icons",
      "manifest.json"
    );
    const data = await fs.readFile(manifestPath, "utf8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export default async function IconsPage() {
  const manifest = await getManifest();
  const baseUrl = process.env.NEXT_PUBLIC_ICON_CDN_BASE ?? "";

  return (
    <div className="space-y-10">
      <PageHeader
        title="Icons"
        description="Preview and download the icon CDN pack. Swap the source SVGs later without changing the site structure."
      />
      {manifest ? (
        <IconGrid manifest={manifest} baseUrl={baseUrl} />
      ) : (
        <Card className="border-border/60">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Icon manifest not found. Run <code>npm run icons:build</code> to
            generate the CDN assets.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
