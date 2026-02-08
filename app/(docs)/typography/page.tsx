import { PageHeader } from "@/components/docs/PageHeader";
import { TypographySpec } from "@/components/docs/TypographySpec";

export default function TypographyPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Typography"
        description="MoreYears delivers the brand voice for headlines, while Poppins keeps body copy clear and approachable."
      />
      <TypographySpec />
    </div>
  );
}
