"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/docs-nav";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-sidebar-border bg-sidebar/90 backdrop-blur md:sticky md:top-0 md:h-screen md:border-r">
      <div className="flex items-center justify-between px-6 py-6 md:flex-col md:items-start md:gap-4">
        <div>
          <p className="font-display text-2xl text-primary">More Years</p>
          <p className="text-sm text-muted-foreground">Icon CDN docs</p>
        </div>
        <Badge className="border-primary/20 text-[11px]" variant="secondary">
          Pre-release
        </Badge>
      </div>
      <ScrollArea className="md:h-[calc(100vh-140px)]">
        <nav className="flex gap-2 overflow-x-auto px-4 pb-6 md:flex-col md:gap-1 md:overflow-visible">
          {docsNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl border border-transparent px-4 py-3 text-sm transition",
                  "hover:border-primary/25 hover:bg-accent",
                  isActive
                    ? "border-primary/30 bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <div className="font-medium">{item.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
