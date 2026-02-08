/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const getIconUrl = (id: string, weight: string, baseUrl: string, prefix: string) => {
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

  return (
    <div className="space-y-8">
      <Card className="border-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-lg">More Years Icon CDN (POC)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary">Solar-based template</Badge>
          <span>Swap in your real SVGs later without changing the API.</span>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/85 p-4">
        <div>
          <p className="text-sm font-medium text-foreground">Icon weight</p>
          <p className="text-xs text-muted-foreground">
            Missing weights fall back to the nearest available option.
          </p>
        </div>
        <Tabs value={weight} onValueChange={setWeight}>
          <TabsList className="flex flex-wrap border border-primary/20 bg-secondary/35">
            {(manifest.weights?.length ? manifest.weights : DEFAULT_WEIGHTS).map(
              (option) => (
                <TabsTrigger key={option} value={option}>
                  {option}
                </TabsTrigger>
              )
            )}
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-2 rounded-2xl border border-border bg-card/85 p-4">
        <p className="text-sm font-medium text-foreground">Search icons</p>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by icon name, ID, or category"
        />
        <p className="text-xs text-muted-foreground">
          {normalizedQuery
            ? `${filteredIcons.length} results`
            : `${manifest.icons.length} icons across ${categories.length} categories`}
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-card/85 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Category filters
            </p>
            <p className="text-xs text-muted-foreground">
              Toggle categories to focus the catalog.
            </p>
          </div>
          {selectedCategories.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategories([])}>
              Clear filters
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((group) => {
            const isActive = selectedCategories.includes(group.category);
            return (
              <Button
                key={group.category}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCategory(group.category)}
              >
                {group.category}
              </Button>
            );
          })}
        </div>
      </div>

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
              <div className="grid min-w-[720px] grid-cols-2 gap-4 pb-4 md:grid-cols-3 lg:grid-cols-6">
                {filteredIcons.map((icon) => {
                  const resolvedWeight = resolveWeight(
                    icon.weights,
                    weight,
                    fallbackWeights
                  );
                  const url = getIconUrl(
                    icon.id,
                    resolvedWeight,
                    baseUrl,
                    prefix
                  );
                  const copyKey = `${icon.id}-${resolvedWeight}`;
                  return (
                    <div
                      key={copyKey}
                      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-foreground">
                        <img
                          src={url}
                          alt={icon.name}
                          className="h-6 w-6"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground">
                          {icon.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {icon.category}
                        </p>
                        {resolvedWeight !== weight && (
                          <p className="text-[11px] text-amber-600">
                            Fallback: {resolvedWeight}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button asChild variant="secondary" size="sm">
                          <a href={url} download>
                            Download SVG
                          </a>
                        </Button>
                        <Button
                          variant={copiedKey === copyKey ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCopy(copyKey, url)}
                        >
                          {copiedKey === copyKey ? "Copied" : "Copy CDN URL"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
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
                <div className="grid min-w-[720px] grid-cols-2 gap-4 pb-4 md:grid-cols-3 lg:grid-cols-6">
                  {group.icons
                    .filter((icon) =>
                      selectedCategories.length === 0
                        ? true
                        : selectedCategories.includes(icon.category)
                    )
                    .map((icon) => {
                    const resolvedWeight = resolveWeight(
                      icon.weights,
                      weight,
                      fallbackWeights
                    );
                    const url = getIconUrl(
                      icon.id,
                      resolvedWeight,
                      baseUrl,
                      prefix
                    );
                    const copyKey = `${icon.id}-${resolvedWeight}`;
                    return (
                      <div
                        key={copyKey}
                        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-foreground">
                          <img
                            src={url}
                            alt={icon.name}
                            className="h-6 w-6"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-foreground">
                            {icon.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {icon.category}
                          </p>
                          {resolvedWeight !== weight && (
                            <p className="text-[11px] text-amber-600">
                              Fallback: {resolvedWeight}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button asChild variant="secondary" size="sm">
                            <a href={url} download>
                              Download SVG
                            </a>
                          </Button>
                          <Button
                            variant={copiedKey === copyKey ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCopy(copyKey, url)}
                          >
                            {copiedKey === copyKey ? "Copied" : "Copy CDN URL"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
