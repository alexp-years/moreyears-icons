"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleHelp,
  Home,
  Shapes,
} from "lucide-react";
import { docsNav, type DocNavSection } from "@/lib/docs-nav";
import { cn } from "@/lib/utils";
import {
  Sidebar as SidebarShell,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

const sectionIcons = {
  home: Home,
  shapes: Shapes,
  help: CircleHelp,
};

const matchesPath = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

const isSectionActive = (pathname: string, section: DocNavSection) => {
  const sectionMatch = section.href ? matchesPath(pathname, section.href) : false;
  const itemMatch = section.items?.some((item) => matchesPath(pathname, item.href));
  return sectionMatch || Boolean(itemMatch);
};

export function Sidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      docsNav.map((section) => [section.id, section.id === "home"])
    )
  );

  const closeMobileSidebar = () => setOpenMobile(false);

  return (
    <SidebarShell className="m-2.5 h-[calc(100vh-1.25rem)] rounded-2xl border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] md:m-3 md:h-[calc(100vh-1.5rem)]">
      <SidebarHeader>
        <div className="flex items-center gap-3 rounded-xl px-1 py-1">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[color:rgba(53,39,104,0.58)] text-white">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[22px] leading-none font-medium text-sidebar-foreground">
              MoreYears
            </p>
            <p className="mt-1 truncate text-[13px] text-sidebar-foreground/72">
              Internal project
            </p>
          </div>
          <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/70" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {docsNav.map((section) => {
                const Icon = sectionIcons[section.id];
                const hasChildren = Boolean(section.items?.length);
                const topLevelActive = section.href
                  ? matchesPath(pathname, section.href)
                  : false;
                const active = isSectionActive(pathname, section);
                const expanded =
                  hasChildren &&
                  ((openSections[section.id] ?? section.id === "home") || active);

                return (
                  <SidebarMenuItem key={section.id}>
                    <div className="flex items-center gap-1">
                      {section.href ? (
                        <SidebarMenuButton
                          asChild
                          isActive={false}
                          className={cn(
                            "flex-1 rounded-lg px-2.5 py-2",
                            topLevelActive
                              ? "text-[var(--years-yellow-500)]"
                              : "text-sidebar-foreground"
                          )}
                        >
                          <Link href={section.href} onClick={closeMobileSidebar}>
                            <Icon
                              className={cn(
                                "size-4",
                                active
                                  ? "text-[var(--years-yellow-500)]"
                                  : "text-sidebar-foreground/78"
                              )}
                            />
                            <span>{section.title}</span>
                            {!hasChildren && (
                              <ChevronRight className="ml-auto size-4 text-sidebar-foreground/68" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          type="button"
                          isActive={false}
                          className={cn(
                            "justify-between rounded-lg px-2.5 py-2",
                            active ? "text-sidebar-foreground" : "text-sidebar-foreground/92"
                          )}
                          onClick={() =>
                            setOpenSections((previous) => ({
                              ...previous,
                              [section.id]: !expanded,
                            }))
                          }
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="size-4 text-sidebar-foreground/78" />
                            <span>{section.title}</span>
                          </span>
                          {hasChildren ? (
                            <ChevronDown
                              className={cn(
                                "size-4 text-sidebar-foreground/70 transition-transform",
                                expanded && "rotate-180"
                              )}
                            />
                          ) : (
                            <ChevronRight className="size-4 text-sidebar-foreground/70" />
                          )}
                        </SidebarMenuButton>
                      )}

                      {section.href && hasChildren && (
                        <button
                          type="button"
                          onClick={() =>
                            setOpenSections((previous) => ({
                              ...previous,
                              [section.id]: !expanded,
                            }))
                          }
                          aria-label={`Toggle ${section.title}`}
                          className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/70 transition hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
                        >
                          <ChevronDown
                            className={cn("size-4 transition-transform", expanded && "rotate-180")}
                          />
                        </button>
                      )}
                    </div>

                    {hasChildren && expanded && (
                      <SidebarMenuSub className="mt-0.5">
                        {section.items?.map((item) => {
                          const childActive = matchesPath(pathname, item.href);
                          return (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={false}
                                className={cn(
                                  "rounded-md px-2 py-1.5",
                                  childActive
                                    ? "text-sidebar-foreground"
                                    : "text-sidebar-foreground/78"
                                )}
                              >
                                <Link href={item.href} onClick={closeMobileSidebar}>
                                  {item.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-xl bg-white/12 px-2.5 py-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-white/22 text-xs font-semibold text-white">
            MY
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">MoreYears</p>
            <p className="truncate text-xs text-sidebar-foreground/72">
              internal@moreyears.local
            </p>
          </div>
          <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/70" />
        </div>
      </SidebarFooter>
    </SidebarShell>
  );
}
