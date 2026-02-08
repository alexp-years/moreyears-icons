import { PageHeader } from "@/components/docs/PageHeader";
import { SpacingScale } from "@/components/docs/SpacingScale";

export default function SpacingPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Spacing"
        description="A Tailwind-based spacing scale for padding, margin, and layout rhythm. Use spacing-4 (16px) as the core reference."
      />
      <SpacingScale />
    </div>
  );
}
