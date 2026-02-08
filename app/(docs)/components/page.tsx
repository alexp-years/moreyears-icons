import { ComponentPreview } from "@/components/docs/ComponentPreview";
import { PageHeader } from "@/components/docs/PageHeader";

export default function ComponentsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Components"
        description="This is the future home for reusable UI components, states, and accessibility guidance."
      />
      <ComponentPreview />
    </div>
  );
}
