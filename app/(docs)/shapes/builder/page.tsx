"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Copy, Download, Palette, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  generateSuperellipsePath,
  generateSuperellipseSvg,
  generateClipPathPolygon,
  calculatePreviewScale,
  formatSuperellipseFilename,
  downloadSuperellipseSvg,
  downloadSuperellipsePng,
  copyToClipboard,
} from "@/lib/superellipse-utils";

/* ── Constants ── */
const PRESET_COLORS = [
  { name: "Purple", value: "#896fca" },
  { name: "Yellow", value: "#ffd47a" },
  { name: "Green", value: "#448d7d" },
  { name: "Black", value: "#303030" },
];

const DEFAULT_COLOR = "#896fca";
const DEFAULT_WIDTH = 256;
const DEFAULT_HEIGHT = 256;
const DEFAULT_POWER = 5;

const MIN_DIM = 1;
const MAX_DIM = 2000;
const MIN_POWER = 0.3;
const MAX_POWER = 20;
const POWER_STEP = 0.1;
const PREVIEW_CONTAINER = 400;

const PRESETS = [
  { label: "Star", power: 0.5, width: 256, height: 256 },
  { label: "Diamond", power: 1, width: 256, height: 256 },
  { label: "Ellipse", power: 2, width: 256, height: 256 },
  { label: "Piet Hein", power: 2.5, width: 256, height: 256 },
  { label: "Squircle", power: 4, width: 256, height: 256 },
  { label: "iOS Icon", power: 5, width: 180, height: 180 },
];

/* ── Component ── */
export default function SuperellipseBuilderPage() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [widthRaw, setWidthRaw] = useState(String(DEFAULT_WIDTH));
  const [heightRaw, setHeightRaw] = useState(String(DEFAULT_HEIGHT));
  const [power, setPower] = useState(DEFAULT_POWER);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [customHex, setCustomHex] = useState(DEFAULT_COLOR);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const colorInputRef = useRef<HTMLInputElement>(null);

  /* Derived */
  const previewScale = useMemo(
    () => calculatePreviewScale(width, height, PREVIEW_CONTAINER),
    [width, height]
  );

  const previewPath = useMemo(
    () => generateSuperellipsePath(width, height, power),
    [width, height, power]
  );

  const isPresetColor = PRESET_COLORS.some((c) => c.value === color);

  /* Handlers */
  const handleDimension = (axis: "width" | "height", raw: string) => {
    if (axis === "width") setWidthRaw(raw);
    else setHeightRaw(raw);
    const n = parseInt(raw, 10);
    if (!isFinite(n) || n < MIN_DIM) return;
    const clamped = Math.min(MAX_DIM, n);
    if (axis === "width") setWidth(clamped);
    else setHeight(clamped);
  };

  const handleDimensionBlur = (axis: "width" | "height") => {
    const clamped = Math.max(MIN_DIM, Math.min(MAX_DIM, axis === "width" ? width : height));
    if (axis === "width") { setWidth(clamped); setWidthRaw(String(clamped)); }
    else { setHeight(clamped); setHeightRaw(String(clamped)); }
  };

  const handlePower = (raw: string) => {
    const n = parseFloat(raw);
    if (isNaN(n)) return;
    setPower(Math.max(MIN_POWER, Math.min(MAX_POWER, n)));
  };

  const handleColorPreset = (c: string) => {
    setColor(c);
    setCustomHex(c);
  };

  const handleCustomColor = (hex: string) => {
    setCustomHex(hex);
    if (/^#[0-9a-f]{6}$/i.test(hex)) setColor(hex);
  };

  const handleNativeColorPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    setCustomHex(e.target.value);
  };

  const handlePreset = (p: (typeof PRESETS)[number]) => {
    setWidth(p.width);
    setHeight(p.height);
    setWidthRaw(String(p.width));
    setHeightRaw(String(p.height));
    setPower(p.power);
  };

  const handleReset = () => {
    setWidth(DEFAULT_WIDTH);
    setHeight(DEFAULT_HEIGHT);
    setWidthRaw(String(DEFAULT_WIDTH));
    setHeightRaw(String(DEFAULT_HEIGHT));
    setPower(DEFAULT_POWER);
    setColor(DEFAULT_COLOR);
    setCustomHex(DEFAULT_COLOR);
  };

  const handleDownloadSvg = () => {
    const svg = generateSuperellipseSvg(width, height, power, color);
    downloadSuperellipseSvg(
      svg,
      formatSuperellipseFilename(width, height, power, "svg")
    );
  };

  const handleDownloadPng = () => {
    const svg = generateSuperellipseSvg(width, height, power, color);
    downloadSuperellipsePng(
      svg,
      formatSuperellipseFilename(width, height, power, "png"),
      width,
      height
    );
  };

  const handleCopyClipPath = async () => {
    const polygon = generateClipPathPolygon(power);
    await copyToClipboard(`clip-path: ${polygon};`);
    setCopied("clip-path");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="flex flex-col gap-2 border-b border-[var(--years-purple-300)] pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[clamp(2.5rem,5vw,3rem)] leading-none text-foreground">
            Superellipse Builder
          </h1>
          <p className="max-w-[58rem] text-[clamp(1.1rem,2vw,1.25rem)] leading-snug text-foreground">
            Create custom superellipses by adjusting the power exponent,
            dimensions, and color. Export as SVG, PNG, or copy the CSS
            clip-path.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Interactive tool", "Export ready", "CSS clip-path"].map(
            (label) => (
              <Badge
                key={label}
                className="rounded-full border-[var(--years-gray-200)] bg-[var(--years-gray-100)] px-3 py-1 text-sm font-normal text-[var(--years-gray-700)]"
                variant="secondary"
              >
                {label}
              </Badge>
            )
          )}
        </div>
      </section>

      {/* ── Builder ── */}
      <section className="flex flex-col gap-8 pt-8 lg:flex-row">
        {/* Controls */}
        <div className="flex flex-col gap-6 lg:w-[340px] lg:shrink-0">
          {/* Presets */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">
              Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePreset(p)}
                  className="cursor-pointer rounded-lg border border-[var(--years-purple-200)] bg-[var(--years-purple-100)] px-3 py-1.5 text-sm text-[var(--years-purple-800)] transition-colors hover:bg-[var(--years-purple-200)]"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">
              Dimensions
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="se-width"
                  className="text-xs text-muted-foreground"
                >
                  W
                </label>
                <div className="flex items-center gap-1 rounded-[10px] border border-[var(--years-purple-200)] bg-[var(--years-purple-50)] px-[5px] py-px">
                  <Input
                    id="se-width"
                    type="text"
                    inputMode="numeric"
                    value={widthRaw}
                    onChange={(e) => handleDimension("width", e.target.value)}
                    onBlur={() => handleDimensionBlur("width")}
                    className="h-7 w-20 border-0 bg-transparent text-center text-sm font-semibold shadow-none focus-visible:ring-0"
                  />
                  <span className="pr-1 text-xs text-muted-foreground">
                    px
                  </span>
                </div>
              </div>

              <span className="text-xs text-muted-foreground">&times;</span>

              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="se-height"
                  className="text-xs text-muted-foreground"
                >
                  H
                </label>
                <div className="flex items-center gap-1 rounded-[10px] border border-[var(--years-purple-200)] bg-[var(--years-purple-50)] px-[5px] py-px">
                  <Input
                    id="se-height"
                    type="text"
                    inputMode="numeric"
                    value={heightRaw}
                    onChange={(e) => handleDimension("height", e.target.value)}
                    onBlur={() => handleDimensionBlur("height")}
                    className="h-7 w-20 border-0 bg-transparent text-center text-sm font-semibold shadow-none focus-visible:ring-0"
                  />
                  <span className="pr-1 text-xs text-muted-foreground">
                    px
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Power (N) */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">
              Power (N)
            </span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={MIN_POWER}
                max={MAX_POWER}
                step={POWER_STEP}
                value={power}
                onChange={(e) => handlePower(e.target.value)}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--years-purple-200)] accent-[var(--years-purple-600)]"
              />
              <div className="flex items-center gap-1 rounded-lg border border-[var(--years-purple-200)] bg-[var(--years-purple-50)] p-1">
                <Input
                  type="number"
                  min={MIN_POWER}
                  max={MAX_POWER}
                  step={POWER_STEP}
                  value={power}
                  onChange={(e) => handlePower(e.target.value)}
                  className="h-7 w-16 border-0 bg-transparent text-center text-sm font-semibold shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              N=1 diamond, N=2 ellipse, N=4 squircle, N=5 iOS icon
            </p>
          </div>

          {/* Color */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Color</span>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleColorPreset(c.value)}
                  title={c.name}
                  className={cn(
                    "size-8 cursor-pointer rounded-full border-2 p-[2px] transition-all hover:scale-110",
                    color === c.value
                      ? "border-[var(--years-purple-500)] border-dashed"
                      : "border-[var(--years-purple-200)]"
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
                      "size-8 cursor-pointer rounded-full border-2 p-[2px] transition-all hover:scale-110 flex items-center justify-center",
                      !isPresetColor
                        ? "border-[var(--years-purple-500)] border-dashed"
                        : "border-[var(--years-purple-200)]"
                    )}
                  >
                    {!isPresetColor ? (
                      <div
                        className="size-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ) : (
                      <Palette className="size-3.5 text-muted-foreground" />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 space-y-3 p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Custom Color
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => colorInputRef.current?.click()}
                      className="size-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border transition-colors hover:border-foreground"
                      style={{ backgroundColor: color }}
                    />
                    <input
                      ref={colorInputRef}
                      type="color"
                      value={color}
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

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-[var(--years-purple-200)] pt-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-[var(--years-purple-200)] bg-[var(--years-purple-100)] text-sm font-medium text-[var(--years-purple-700)] transition-colors hover:bg-[var(--years-purple-200)]"
              >
                <Download className="size-4" />
                SVG
              </button>
              <button
                type="button"
                onClick={handleDownloadPng}
                className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-[var(--years-purple-200)] bg-[var(--years-purple-100)] text-sm font-medium text-[var(--years-purple-700)] transition-colors hover:bg-[var(--years-purple-200)]"
              >
                <Download className="size-4" />
                PNG
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyClipPath}
              className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-[var(--years-purple-200)] bg-[var(--years-purple-100)] text-sm font-medium text-[var(--years-purple-700)] transition-colors hover:bg-[var(--years-purple-200)]"
            >
              {copied === "clip-path" ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied === "clip-path" ? "Copied!" : "Copy CSS clip-path"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[var(--years-purple-100)] bg-[var(--years-purple-50)] text-sm text-[var(--years-purple-600)] transition-colors hover:bg-[var(--years-purple-100)] hover:text-[var(--years-purple-700)]"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-1 flex-col items-center gap-4">
          <div
            className="flex items-center justify-center rounded-2xl border-2 border-dashed border-[var(--years-purple-300)] bg-[var(--years-purple-50)]"
            style={{
              width: `${PREVIEW_CONTAINER}px`,
              height: `${PREVIEW_CONTAINER}px`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`0 0 ${width} ${height}`}
              width={width}
              height={height}
              fill="none"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                transform:
                  previewScale < 1 ? `scale(${previewScale})` : undefined,
                transformOrigin: "center",
              }}
            >
              <path d={previewPath} fill={color} />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            {width} &times; {height}px &middot; N={power}
            {previewScale < 1 && (
              <span className="ml-1 text-xs">
                ({Math.round(previewScale * 100)}% preview)
              </span>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
