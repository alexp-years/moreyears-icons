import fs from "fs/promises";
import path from "path";
import { IconGrid } from "@/components/docs/IconGrid";
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

export default async function ExploreIconsPage() {
  const manifest = await getManifest();
  const baseUrl = process.env.NEXT_PUBLIC_ICON_CDN_BASE ?? "";

  return (
    <div className="space-y-6">
      {/* Package notice bar */}
      <div className="inline-flex rounded-[4px] bg-[var(--years-green-100)] px-3 py-2">
        <p className="text-base text-[var(--years-green-950)]">
          <span className="font-bold italic">@moreyears/icons package</span>{" "}
          Synced from the published npm package while keeping stable CDN-style
          URLs.
        </p>
      </div>

      {manifest ? (
        <IconGrid manifest={manifest} baseUrl={baseUrl} />
      ) : (
        <Card className="border-border/60">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Icon manifest not found. Run{" "}
            <code>npm run icons:build</code> to sync assets from
            <code> @moreyears/icons</code>.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
