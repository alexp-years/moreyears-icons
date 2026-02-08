import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

type PageHeaderProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
          More Years
        </p>
        <h1 className="text-4xl font-display text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
      <Separator />
    </div>
  );
}
