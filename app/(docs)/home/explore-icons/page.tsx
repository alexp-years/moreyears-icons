import fs from "fs/promises";
import path from "path";
import { Package } from "lucide-react";
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
  const prefix =
    manifest && typeof manifest.version === "string" && manifest.version.trim()
      ? `/icons/v${manifest.version.trim()}`
      : "/icons";

  return (
    <div className="space-y-8">
      {/* Package notice — soft pill chip */}
      <div className="slice-chip bg-[var(--years-green-200)] text-[var(--years-green-950)]">
        <Package className="size-4" />
        <span>
          <span className="font-semibold">@moreyears/icons</span> — synced from
          the published npm package with stable CDN URLs.
        </span>
      </div>

      {manifest ? (
        <IconGrid manifest={manifest} baseUrl={baseUrl} prefix={prefix} />
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
