"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  Copy,
  Palette,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconDetailModal } from "@/components/docs/IconDetailModal";
import {
  applySvgSettings,
  copyPngToClipboard,
  fetchRawSvg,
  IconSvgPreview,
} from "@/components/docs/IconSvgPreview";
import { cn } from "@/lib/utils";
import { getTileColors } from "@/lib/color-utils";

/* ── Types ── */
type IconMeta = {
  id: string;
  name: string;
  sourceName: string;
  category: string;
  weights: string[];
  tags: string[];
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

/* ── Constants ── */
const PRESET_COLORS = [
  { name: "Purple", value: "#896fca" },
  { name: "Yellow", value: "#ffd47a" },
  { name: "Green", value: "#448d7d" },
  { name: "Black", value: "#303030" },
];

const DEFAULT_COLOR = "#896fca";
const DEFAULT_STROKE_WIDTH = 1.5;
const ICONS_PER_BATCH = 54;

const formatWeightLabel = (weight: string) =>
  weight
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const resolveWeight = (
  available: string[],
  preferred: string,
  fallback: string[]
) => {
  if (available.includes(preferred)) return preferred;
  const next = fallback.find((w) => available.includes(w));
  return next ?? available[0];
};

/* ── Component ── */
export function IconGrid({
  manifest,
  baseUrl = "",
  prefix = "/icons",
}: IconGridProps) {
  /* Display order: Outline first, Linear last; rest follow manifest order */
  const orderedWeights = useMemo(() => {
    const source = manifest.weights?.length
      ? manifest.weights
      : ["outline", "bold", "bold-duotone", "line-duotone", "broken", "linear"];
    const middle = source.filter((w) => w !== "outline" && w !== "linear");
    return [
      ...(source.includes("outline") ? ["outline"] : []),
      ...middle,
      ...(source.includes("linear") ? ["linear"] : []),
    ];
  }, [manifest.weights]);

  /* State */
  const [weight, setWeight] = useState<string>(orderedWeights[0] ?? "outline");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewColor, setPreviewColor] = useState(DEFAULT_COLOR);
  const [customHex, setCustomHex] = useState(DEFAULT_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_STROKE_WIDTH);
  const [visibleCount, setVisibleCount] = useState(ICONS_PER_BATCH);
  const [selectedIcon, setSelectedIcon] = useState<IconMeta | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  /* Derived data */
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

  const filteredIcons = useMemo(() => {
    let icons = manifest.icons;
    if (selectedCategory !== "all") {
      icons = icons.filter((icon) => icon.category === selectedCategory);
    }
    if (normalizedQuery) {
      icons = icons.filter(
        (icon) =>
          icon.name.toLowerCase().includes(normalizedQuery) ||
          icon.id.toLowerCase().includes(normalizedQuery) ||
          icon.category.toLowerCase().includes(normalizedQuery) ||
          icon.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    }
    return icons;
  }, [manifest.icons, selectedCategory, normalizedQuery]);

  const displayedIcons = useMemo(
    () => filteredIcons.slice(0, visibleCount),
    [filteredIcons, visibleCount]
  );

  const hasMore = visibleCount < filteredIcons.length;
  const weights = orderedWeights;
  const fallbackWeights = weights;

  /* Reset visible count when filters change */
  useEffect(() => {
    setVisibleCount(ICONS_PER_BATCH);
  }, [weight, query, selectedCategory]);

  /* Infinite scroll via IntersectionObserver */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          setVisibleCount((prev) =>
            Math.min(prev + ICONS_PER_BATCH, filteredIcons.length)
          );
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, filteredIcons.length]);

  /* Helpers */
  const getIconUrl = useCallback(
    (id: string, w: string) => {
      const normalizedBase = baseUrl.replace(/\/$/, "");
      const normalizedPrefix = prefix.startsWith("/")
        ? prefix
        : `/${prefix}`;
      return `${normalizedBase}${normalizedPrefix}/${w.toLowerCase()}/${id}.svg`;
    },
    [baseUrl, prefix]
  );

  const handleColorPreset = (color: string) => {
    setPreviewColor(color);
    setCustomHex(color);
  };

  const handleCustomColor = (hex: string) => {
    setCustomHex(hex);
    if (/^#[0-9a-f]{6}$/i.test(hex)) {
      setPreviewColor(hex);
    }
  };

  const handleNativeColorPick = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hex = e.target.value;
    setPreviewColor(hex);
    setCustomHex(hex);
  };

  const handleStrokeWidthChange = (val: string) => {
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 0.5 && n <= 4) {
      setStrokeWidth(n);
    }
  };

  const handleReset = () => {
    setPreviewColor(DEFAULT_COLOR);
    setCustomHex(DEFAULT_COLOR);
    setStrokeWidth(DEFAULT_STROKE_WIDTH);
  };

  const isPresetColor = PRESET_COLORS.some(
    (c) => c.value === previewColor
  );

  const tileColors = useMemo(
    () => getTileColors(previewColor, DEFAULT_COLOR),
    [previewColor]
  );

  return (
    <div className="space-y-6">
      {/* ── Title ── */}
      <h2 className="font-display text-2xl text-foreground">All icons</h2>

      {/* ── Filters Row ── */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {/* Style dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-base text-muted-foreground">Style:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-40 cursor-pointer items-center justify-between rounded-lg border border-[var(--years-purple-100)] bg-[var(--years-purple-50)] px-3 text-base text-foreground outline-none transition-colors hover:bg-[var(--years-purple-100)]/60 focus:ring-2 focus:ring-[var(--years-purple-200)]"
              >
                <span>{formatWeightLabel(weight)}</span>
                <ChevronDown className="size-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-40">
              <DropdownMenuRadioGroup
                value={weight}
                onValueChange={setWeight}
              >
                {weights.map((w) => (
                  <DropdownMenuRadioItem key={w} value={w}>
                    {formatWeightLabel(w)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-base text-muted-foreground">Category:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-72 cursor-pointer items-center justify-between rounded-lg border border-[var(--years-purple-100)] bg-[var(--years-purple-50)] px-3 text-base text-foreground outline-none transition-colors hover:bg-[var(--years-purple-100)]/60 focus:ring-2 focus:ring-[var(--years-purple-200)]"
              >
                <span className="truncate">
                  {selectedCategory === "all"
                    ? "All categories"
                    : selectedCategory}
                </span>
                <ChevronDown className="size-5 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="max-h-72 min-w-72 overflow-y-auto"
            >
              <DropdownMenuRadioGroup
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <DropdownMenuRadioItem value="all">
                  All categories
                </DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                {categories.map((group) => (
                  <DropdownMenuRadioItem
                    key={group.category}
                    value={group.category}
                  >
                    {group.category}
                    <span className="ml-auto pl-4 text-xs tabular-nums text-muted-foreground">
                      {group.icons.length}
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for an icon..."
            className="h-10 rounded-lg border-[var(--years-purple-100)] bg-[var(--years-purple-50)] pr-10 text-base transition-colors placeholder:text-[var(--years-gray-400)] hover:border-[var(--years-purple-200)]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : (
            <Search className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[var(--years-purple-600)]" />
          )}
        </div>
      </div>

      {/* ── Icon Preview Settings Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--years-purple-400)] bg-[var(--years-purple-300)] px-6 py-4">
        <p className="whitespace-nowrap text-sm font-semibold text-[var(--years-purple-700)]">
          Icon Preview Settings
        </p>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {/* Color swatches */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--years-gray-900)]">
              Color
            </span>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleColorPreset(c.value)}
                  title={c.name}
                  className={cn(
                    "size-6 cursor-pointer rounded-full border-2 p-[2px] transition-all hover:scale-110",
                    previewColor === c.value
                      ? "border-[var(--years-purple-500)] border-dashed"
                      : "border-white"
                  )}
                >
                  <div
                    className="size-full rounded-full"
                    style={{ backgroundColor: c.value }}
                  />
                </button>
              ))}

              {/* Custom color picker */}
              <Popover
                open={colorPickerOpen}
                onOpenChange={setColorPickerOpen}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    title="Custom color"
                    className={cn(
                      "size-6 cursor-pointer rounded-full border-2 p-[2px] transition-all hover:scale-110 flex items-center justify-center",
                      !isPresetColor
                        ? "border-[var(--years-purple-500)] border-dashed"
                        : "border-white"
                    )}
                  >
                    {!isPresetColor ? (
                      <div
                        className="size-full rounded-full"
                        style={{ backgroundColor: previewColor }}
                      />
                    ) : (
                      <Palette className="size-3.5 text-muted-foreground" />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-56 space-y-3 p-3"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    Custom Color
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => colorInputRef.current?.click()}
                      className="size-9 shrink-0 rounded-lg border border-border overflow-hidden cursor-pointer transition-colors hover:border-foreground"
                      style={{ backgroundColor: previewColor }}
                    />
                    <input
                      ref={colorInputRef}
                      type="color"
                      value={previewColor}
                      onChange={handleNativeColorPick}
                      className="sr-only"
                    />
                    <Input
                      value={customHex}
                      onChange={(e) => handleCustomColor(e.target.value)}
                      placeholder="#000000"
                      className="h-9 font-mono text-xs"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {weight === "linear" && (
            <Separator
              orientation="vertical"
              className="h-8 hidden sm:block"
            />
          )}

          {/* Stroke Width (Linear only) */}
          {weight === "linear" && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                Stroke Width
              </span>
              <div className="flex items-center gap-1 rounded-lg border border-[var(--years-purple-100)] bg-[var(--years-purple-50)] p-1">
                <Input
                  type="number"
                  min={0.5}
                  max={4}
                  step={0.5}
                  value={strokeWidth}
                  onChange={(e) => handleStrokeWidthChange(e.target.value)}
                  className="h-7 w-16 border-0 bg-transparent text-center text-sm font-semibold shadow-none focus-visible:ring-0"
                />
                <span className="pr-1 text-sm text-muted-foreground">px</span>
              </div>
            </div>
          )}

          {/* Reset */}
          <button
            type="button"
            onClick={handleReset}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--years-purple-200)] bg-[var(--years-purple-100)] px-4 py-2.5 text-sm text-[var(--years-gray-600)] transition-colors hover:bg-[var(--years-purple-200)] hover:text-[var(--years-gray-900)]"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* ── Result summary ── */}
      {(normalizedQuery || selectedCategory !== "all") && (
        <p className="text-xs text-muted-foreground">
          {filteredIcons.length} icon
          {filteredIcons.length !== 1 ? "s" : ""} found
          {selectedCategory !== "all" && (
            <>
              {" "}
              in <span className="font-medium">{selectedCategory}</span>
            </>
          )}
          {normalizedQuery && (
            <>
              {" "}
              matching &ldquo;
              <span className="font-medium">{query}</span>&rdquo;
            </>
          )}
        </p>
      )}

      {/* ── Icon Grid ── */}
      {filteredIcons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No icons found. Try a different search or category.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9">
            {displayedIcons.map((icon) => {
              const resolvedWeight = resolveWeight(
                icon.weights,
                weight,
                fallbackWeights
              );
              const url = getIconUrl(icon.id, resolvedWeight);

              return (
                <IconTile
                  key={`${icon.id}-${resolvedWeight}`}
                  icon={icon}
                  resolvedWeight={resolvedWeight}
                  url={url}
                  previewColor={previewColor}
                  strokeWidth={strokeWidth}
                  tileColors={tileColors}
                  onOpen={() => setSelectedIcon(icon)}
                />
              );
            })}
          </div>

          {/* Sentinel for infinite scroll */}
          {hasMore && (
            <div
              ref={sentinelRef}
              className="flex items-center justify-center py-8"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
                Loading more icons...
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Detail Modal ── */}
      <IconDetailModal
        icon={selectedIcon}
        open={selectedIcon !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedIcon(null);
        }}
        initialWeight={weight}
        initialColor={previewColor}
        initialStrokeWidth={strokeWidth}
        getIconUrl={getIconUrl}
      />
    </div>
  );
}

/* ── Icon Tile ── */
type IconTileProps = {
  icon: IconMeta;
  resolvedWeight: string;
  url: string;
  previewColor: string;
  strokeWidth: number;
  tileColors: ReturnType<typeof getTileColors>;
  onOpen: () => void;
};

function IconTile({
  icon,
  resolvedWeight,
  url,
  previewColor,
  strokeWidth,
  tileColors,
  onOpen,
}: IconTileProps) {
  const [copying, setCopying] = useState(false);

  const handleCopy = useCallback(
    async (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (copying) return;
      setCopying(true);
      try {
        const rawSvg = await fetchRawSvg(url);
        const transformed = applySvgSettings(
          rawSvg,
          previewColor,
          strokeWidth,
          resolvedWeight === "linear",
          512
        );
        const ok = await copyPngToClipboard(transformed, 512);
        if (ok) {
          toast.success(`Copied ${icon.name} to clipboard`);
        } else {
          toast.error("Couldn't copy to clipboard", {
            description: "Your browser may not support PNG clipboard writes.",
          });
        }
      } catch {
        toast.error("Couldn't copy to clipboard");
      } finally {
        setCopying(false);
      }
    },
    [copying, url, previewColor, strokeWidth, resolvedWeight, icon.name]
  );

  const handleTileKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleTileKeyDown}
      title={icon.name}
      className="group relative aspect-square cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:scale-[1.03] hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      style={{
        backgroundColor: tileColors.bg,
        borderColor: tileColors.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = tileColors.hoverBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = tileColors.border;
      }}
    >
      <IconSvgPreview
        url={url}
        color={previewColor}
        strokeWidth={strokeWidth}
        applyStrokeWidth={resolvedWeight === "linear"}
        className="transition-all duration-200"
      />

      <button
        type="button"
        onClick={handleCopy}
        disabled={copying}
        title="Copy as PNG"
        className={cn(
          "absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-md border border-[var(--years-purple-200)] bg-white/95 px-2 py-1 text-[10px] font-medium text-[var(--years-gray-700)] shadow-sm transition-all duration-150 cursor-pointer",
          "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100",
          "hover:bg-white focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
          "disabled:cursor-wait"
        )}
      >
        <Copy className="size-3" />
        {copying ? "Copying" : "Copy"}
      </button>
    </div>
  );
}
