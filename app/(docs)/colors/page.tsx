import { ColorPalette } from "@/components/docs/ColorPalette";
import { PageHeader } from "@/components/docs/PageHeader";

export default function ColorsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Colors"
        description="Primary and semantic palettes with hex values, intended usage, and swatches ready for quick reference."
      />
      <ColorPalette />
    </div>
  );
}
