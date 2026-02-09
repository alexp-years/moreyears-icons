/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { Squircle } from "@squircle-js/react";
import { ChevronDown, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type IconMeta = {
  id: string;
  name: string;
  sourceName: string;
  category: string;
  weights: string[];
};

type IconManifest = {
  version: string;
  generatedAt: string;
  weights: string[];
  icons: IconMeta[];
};

type IconGridProps = {
  manifest: IconManifest;
  baseUrl?: string;
  prefix?: string;
};

const DEFAULT_WEIGHTS = [
  "Outline",
  "Linear",
  "Bold",
  "BoldDuotone",
  "LineDuotone",
  "Broken",
];

const resolveWeight = (
  available: string[],
  preferred: string,
  fallback: string[]
) => {
  if (available.includes(preferred)) return preferred;
  const next = fallback.find((weight) => available.includes(weight));
  return next ?? available[0];
};

const getIconUrl = (
  id: string,
  weight: string,
  baseUrl: string,
  prefix: string
) => {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPrefix = prefix.startsWith("/") ? prefix : `/${prefix}`;
  return `${normalizedBase}${normalizedPrefix}/${weight.toLowerCase()}/${id}.svg`;
};

const copyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
};

export function IconGrid({
  manifest,
  baseUrl = "",
  prefix = "/icons",
}: IconGridProps) {
  const [weight, setWeight] = useState<string>(
    manifest.weights?.[0] ?? DEFAULT_WEIGHTS[0]
  );
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const isSearchActive = searchFocused;

  const categories = useMemo(() => {
    const grouped = new Map<string, IconMeta[]>();
    for (const icon of manifest.icons) {
      const list = grouped.get(icon.category) ?? [];
      list.push(icon);
      grouped.set(icon.category, list);
    }
    return Array.from(grouped.entries())
      .map(([category, icons]) => ({
        category,
        icons: icons.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [manifest.icons]);

  const normalizedQuery = query.trim().toLowerCase();
  const categoryFilteredIcons = useMemo(() => {
    if (!selectedCategories.length) return manifest.icons;
    return manifest.icons.filter((icon) =>
      selectedCategories.includes(icon.category)
    );
  }, [manifest.icons, selectedCategories]);

  const filteredIcons = useMemo(() => {
    if (!normalizedQuery) return categoryFilteredIcons;
    return categoryFilteredIcons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(normalizedQuery) ||
        icon.id.toLowerCase().includes(normalizedQuery) ||
        icon.category.toLowerCase().includes(normalizedQuery)
    );
  }, [categoryFilteredIcons, normalizedQuery]);

  const fallbackWeights = manifest.weights?.length
    ? manifest.weights
    : DEFAULT_WEIGHTS;

  const weights = manifest.weights?.length ? manifest.weights : DEFAULT_WEIGHTS;

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleCopy = async (key: string, url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  const renderIconCard = (icon: IconMeta): ReactNode => {
    const resolvedWeight = resolveWeight(icon.weights, weight, fallbackWeights);
    const url = getIconUrl(icon.id, resolvedWeight, baseUrl, prefix);
    const copyKey = `${icon.id}-${resolvedWeight}`;

    return (
      <Squircle
        key={copyKey}
        cornerRadius={24}
        cornerSmoothing={1}
        className="group relative aspect-square overflow-hidden rounded-[22%] bg-card transition-shadow duration-200 hover:shadow-lg"
      >
        {/* Icon preview */}
        <div className="flex h-full items-center justify-center px-4 pb-10 pt-4">
          <div
            className="size-12"
            style={{
              backgroundColor: "var(--years-purple-700)",
              WebkitMaskImage: `url(${url})`,
              maskImage: `url(${url})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </div>

        {/* Label area */}
        <div className="absolute inset-x-0 bottom-0 px-3 pb-3 text-center">
          <p className="truncate text-[11px] font-medium text-foreground">
            {icon.name}
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            {icon.category}
          </p>
          {resolvedWeight !== weight && (
            <p className="text-[10px] text-amber-600">
              FB: {resolvedWeight}
            </p>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end justify-center bg-[var(--years-gray-900)]/10 pb-3 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
          <div className="flex gap-1.5">
            <a
              href={url}
              download
              className="inline-flex h-7 items-center justify-center rounded-lg bg-[var(--years-gray-800)] px-3 text-[11px] font-medium text-white shadow-sm transition-colors hover:bg-[var(--years-gray-700)]"
            >
              Save
            </a>
            <button
              type="button"
              onClick={() => handleCopy(copyKey, url)}
              className="inline-flex h-7 items-center justify-center rounded-lg bg-[var(--years-gray-800)] px-3 text-[11px] font-medium text-white shadow-sm transition-colors hover:bg-[var(--years-gray-700)]"
            >
              {copiedKey === copyKey ? "Copied!" : "CDN"}
            </button>
          </div>
        </div>
      </Squircle>
    );
  };

  return (
    <div className="space-y-8">
      {/* Info card */}
      <Card className="border-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-lg">More Years Icon CDN (POC)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary">Solar-based template</Badge>
          <span>Swap in your real SVGs later without changing the API.</span>
        </CardContent>
      </Card>

      {/* ── Unified toolbar ── */}
      <div className="space-y-2.5">
        {/* Toolbar row */}
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card/85 p-2.5">
          {/* Icon weight dropdown */}
          <div
            className={cn(
              "shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
              isSearchActive
                ? "max-w-0 opacity-0 pointer-events-none ml-0"
                : "max-w-[280px] opacity-100"
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 whitespace-nowrap"
                >
                  <span className="text-muted-foreground text-xs font-normal">
                    Weight:
                  </span>
                  {weight}
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[160px]">
                <DropdownMenuLabel>Icon Weight</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={weight}
                  onValueChange={setWeight}
                >
                  {weights.map((w) => (
                    <DropdownMenuRadioItem key={w} value={w}>
                      {w}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search input */}
          <div
            className={cn(
              "relative min-w-0 transition-all duration-300 ease-in-out",
              isSearchActive ? "flex-[1_0_100%]" : "flex-[1_1_0%]"
            )}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setSearchFocused(true);
                setCategoryOpen(false);
              }}
              onBlur={() => setSearchFocused(false)}
              placeholder={
                isSearchActive
                  ? "Search by icon name, ID, or category\u2026"
                  : "Search icons\u2026"
              }
              className="h-8 pl-9 pr-8 text-sm"
            />
            {query && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Category filter dropdown */}
          <div
            className={cn(
              "shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
              isSearchActive
                ? "max-w-0 opacity-0 pointer-events-none mr-0"
                : "max-w-[280px] opacity-100"
            )}
          >
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 whitespace-nowrap"
                >
                  Categories
                  {selectedCategories.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-0.5 h-5 min-w-5 px-1.5 text-[10px]"
                    >
                      {selectedCategories.length}
                    </Badge>
                  )}
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-60 max-h-[340px] overflow-y-auto p-1.5"
              >
                <div className="space-y-0.5">
                  {categories.map((group) => {
                    const isChecked = selectedCategories.includes(
                      group.category
                    );
                    return (
                      <label
                        key={group.category}
                        className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() =>
                            toggleCategory(group.category)
                          }
                        />
                        <span className="flex-1 truncate">
                          {group.category}
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {group.icons.length}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Filter chips */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-1">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className="rounded-sm p-0.5 transition-colors hover:bg-secondary-foreground/10"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
            <Button
              variant="ghost"
              size="xs"
              className="h-6 text-xs text-muted-foreground"
              onClick={() => setSelectedCategories([])}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Result count */}
        <p className="px-1 text-xs text-muted-foreground">
          {normalizedQuery
            ? `${filteredIcons.length} result${filteredIcons.length !== 1 ? "s" : ""}`
            : `${manifest.icons.length} icons across ${categories.length} categories`}
        </p>
      </div>

      {/* ── Icon grid ── */}
      {normalizedQuery ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display">Search results</h3>
            <Badge variant="outline">{filteredIcons.length} icons</Badge>
          </div>
          {filteredIcons.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="py-6 text-sm text-muted-foreground">
                No icons matched that search. Try a different keyword.
              </CardContent>
            </Card>
          ) : (
            <ScrollArea>
              <div className="grid min-w-[720px] grid-cols-3 gap-3 pb-4 md:grid-cols-4 lg:grid-cols-6">
                {filteredIcons.map(renderIconCard)}
              </div>
            </ScrollArea>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {categories
            .filter(
              (group) =>
                selectedCategories.length === 0 ||
                selectedCategories.includes(group.category)
            )
            .map((group) => (
              <div key={group.category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display">{group.category}</h3>
                  <Badge variant="outline">{group.icons.length} icons</Badge>
                </div>
                <ScrollArea>
                  <div className="grid min-w-[720px] grid-cols-3 gap-3 pb-4 md:grid-cols-4 lg:grid-cols-6">
                    {group.icons
                      .filter((icon) =>
                        selectedCategories.length === 0
                          ? true
                          : selectedCategories.includes(icon.category)
                      )
                      .map(renderIconCard)}
                  </div>
                </ScrollArea>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
