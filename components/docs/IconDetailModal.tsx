"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Copy,
  Palette,
  RotateCcw,
  FileCode2,
  FileImage,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getTileColors } from "@/lib/color-utils";
import {
  applySvgSettings,
  downloadPngFile,
  downloadSvgFile,
  IconSvgPreview,
} from "@/components/docs/IconSvgPreview";

type IconMeta = {
  id: string;
  name: string;
  sourceName: string;
  category: string;
  weights: string[];
};

type IconDetailModalProps = {
  icon: IconMeta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialWeight: string;
  initialColor: string;
  initialStrokeWidth: number;
  getIconUrl: (id: string, weight: string) => string;
};

const PRESET_COLORS = [
  { name: "Purple", value: "#896fca" },
  { name: "Yellow", value: "#ffd47a" },
  { name: "Green", value: "#448d7d" },
  { name: "Black", value: "#303030" },
];

const formatWeightLabel = (w: string) =>
  w
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

async function copyToClipboard(value: string) {
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
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
}

export function IconDetailModal({
  icon,
  open,
  onOpenChange,
  initialWeight,
  initialColor,
  initialStrokeWidth,
  getIconUrl,
}: IconDetailModalProps) {
  const [localColor, setLocalColor] = useState(initialColor);
  const [customHex, setCustomHex] = useState(initialColor);
  const [localStrokeWidth, setLocalStrokeWidth] = useState(initialStrokeWidth);
  const [localWeight, setLocalWeight] = useState(initialWeight);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [rawSvg, setRawSvg] = useState<string | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalColor(initialColor);
    setCustomHex(initialColor);
    setLocalStrokeWidth(initialStrokeWidth);
    setLocalWeight(initialWeight);
    setCopiedField(null);
    setRawSvg(null);
  }, [icon, initialColor, initialStrokeWidth, initialWeight]);

  const resolveWeight = useCallback(
    (available: string[], preferred: string) => {
      if (available.includes(preferred)) return preferred;
      return available[0];
    },
    []
  );

  const handleCopy = useCallback(
    async (field: string, value: string) => {
      const ok = await copyToClipboard(value);
      if (ok) {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      }
    },
    []
  );

  const handleColorPreset = (color: string) => {
    setLocalColor(color);
    setCustomHex(color);
  };

  const handleCustomColor = (hex: string) => {
    setCustomHex(hex);
    if (/^#[0-9a-f]{6}$/i.test(hex)) {
      setLocalColor(hex);
    }
  };

  const handleNativeColorPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setLocalColor(hex);
    setCustomHex(hex);
  };

  const handleStrokeWidthChange = (val: string) => {
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 0.5 && n <= 4) {
      setLocalStrokeWidth(n);
    }
  };

  const handleReset = () => {
    setLocalColor(initialColor);
    setCustomHex(initialColor);
    setLocalStrokeWidth(initialStrokeWidth);
    setLocalWeight(initialWeight);
  };

  const handleDownloadSvg = async () => {
    if (!icon || !rawSvg) return;
    setDownloading("svg");
    try {
      const transformed = applySvgSettings(
        rawSvg,
        localColor,
        localStrokeWidth,
        resolvedWeight === "linear",
        512
      );
      await downloadSvgFile(
        transformed,
        `${icon.id}-${resolvedWeight}.svg`,
      );
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadPng = async () => {
    if (!icon || !rawSvg) return;
    setDownloading("png");
    try {
      const transformed = applySvgSettings(
        rawSvg,
        localColor,
        localStrokeWidth,
        resolvedWeight === "linear",
        512
      );
      await downloadPngFile(transformed, `${icon.id}-${resolvedWeight}.png`);
    } finally {
      setDownloading(null);
    }
  };

  const tileColors = useMemo(
    () => getTileColors(localColor, PRESET_COLORS[0].value),
    [localColor]
  );

  if (!icon) {
    return null;
  }

  const resolvedWeight = resolveWeight(icon.weights, localWeight);
  const previewUrl = getIconUrl(icon.id, resolvedWeight);
  const isPresetColor = PRESET_COLORS.some((c) => c.value === localColor);
  const reactSnippet = `<Icon name="${icon.id}" weight="${resolvedWeight}" />`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden rounded-2xl border-[var(--years-purple-100)] p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="font-display text-xl">
            {icon.name}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2">
            <span>{icon.category}</span>
            <span className="text-muted-foreground/40">·</span>
            <Badge variant="outline" className="text-[10px] font-normal">
              {formatWeightLabel(resolvedWeight)}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        {/* Preview */}
        <div
          className="mx-6 flex items-center justify-center rounded-2xl border p-10 transition-colors duration-200"
          style={{
            backgroundColor: tileColors.bg,
            borderColor: tileColors.border,
          }}
        >
          <IconSvgPreview
            url={previewUrl}
            color={localColor}
            strokeWidth={localStrokeWidth}
            applyStrokeWidth={resolvedWeight === "linear"}
            onRawSvgLoaded={setRawSvg}
            className="size-24 transition-all duration-200"
          />
        </div>

        {/* Settings + Actions */}
        <div className="flex flex-col gap-5 px-6 pt-5 pb-6">
          {/* Preview Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                Preview Settings
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-3" />
                Reset
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {/* Color */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Color
                </span>
                <div className="flex items-center gap-1.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => handleColorPreset(c.value)}
                      title={c.name}
                      className={cn(
                        "size-6 cursor-pointer rounded-full border-2 p-[2px] transition-all hover:scale-110",
                        localColor === c.value
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
                            style={{ backgroundColor: localColor }}
                          />
                        ) : (
                          <Palette className="size-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-56 space-y-3 p-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => colorInputRef.current?.click()}
                          className="size-9 shrink-0 rounded-lg border border-border overflow-hidden cursor-pointer transition-colors hover:border-foreground"
                          style={{ backgroundColor: localColor }}
                        />
                        <input
                          ref={colorInputRef}
                          type="color"
                          value={localColor}
                          onChange={handleNativeColorPick}
                          className="sr-only"
                        />
                        <Input
                          value={customHex}
                          onChange={(e) =>
                            handleCustomColor(e.target.value)
                          }
                          placeholder="#000000"
                          className="h-9 font-mono text-xs"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {resolvedWeight === "linear" && (
                <>
                  <Separator orientation="vertical" className="h-5 hidden sm:block" />
                  {/* Stroke Width */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Stroke
                    </span>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0.5}
                        max={4}
                        step={0.5}
                        value={localStrokeWidth}
                        onChange={(e) =>
                          handleStrokeWidthChange(e.target.value)
                        }
                        className="h-8 w-16 text-center text-xs font-medium"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                </>
              )}

              <Separator orientation="vertical" className="h-5 hidden sm:block" />

              {/* Weight */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Weight
                </span>
                <select
                  value={localWeight}
                  onChange={(e) => setLocalWeight(e.target.value)}
                  className="h-8 cursor-pointer rounded-md border border-input bg-transparent px-2 text-xs font-medium outline-none transition-colors hover:bg-muted/50 focus:ring-2 focus:ring-ring/50"
                >
                  {icon.weights.map((w) => (
                    <option key={w} value={w}>
                      {formatWeightLabel(w)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Download */}
          <div className="space-y-2.5">
            <p className="text-sm font-semibold text-foreground">Download</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 flex-1"
                onClick={handleDownloadSvg}
                disabled={!rawSvg || downloading === "svg"}
              >
                <FileCode2 className="size-3.5" />
                {downloading === "svg" ? "Downloading..." : "SVG"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 flex-1"
                onClick={handleDownloadPng}
                disabled={!rawSvg || downloading === "png"}
              >
                <FileImage className="size-3.5" />
                {downloading === "png" ? "Downloading..." : "PNG"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Developer */}
          <div className="space-y-2.5">
            <p className="text-sm font-semibold text-foreground">
              For Developers
            </p>
            <div className="space-y-2">
              {/* Icon name */}
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
                <code className="flex-1 truncate text-xs font-mono text-foreground">
                  {icon.id}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy("name", icon.id)}
                  className="shrink-0 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                  title="Copy icon name"
                >
                  {copiedField === "name" ? (
                    <Check className="size-3.5 text-green-600" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>

              {/* React usage */}
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
                <code className="flex-1 truncate text-xs font-mono text-foreground">
                  {reactSnippet}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy("react", reactSnippet)}
                  className="shrink-0 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                  title="Copy React usage"
                >
                  {copiedField === "react" ? (
                    <Check className="size-3.5 text-green-600" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Install with{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-[10px]">
                npm i @moreyears/icons
              </code>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
