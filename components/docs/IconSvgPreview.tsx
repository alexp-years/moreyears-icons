"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type IconSvgPreviewProps = {
  url: string;
  color: string;
  strokeWidth: number;
  applyStrokeWidth: boolean;
  className?: string;
  onRawSvgLoaded?: (rawSvg: string | null) => void;
};

const svgRequestCache = new Map<string, Promise<string>>();

export function applySvgSettings(
  rawSvg: string,
  color: string,
  strokeWidth: number,
  applyStrokeWidth: boolean,
  dimensions: "fill" | number = "fill"
) {
  let svg = rawSvg;

  svg = svg.replace(/#896fca/gi, color).replace(/currentcolor/gi, color);

  if (applyStrokeWidth) {
    svg = svg.replace(/stroke-width="[^"]*"/gi, `stroke-width="${strokeWidth}"`);
  }

  svg = svg.replace(
    /<svg\b([^>]*)>/i,
    (_, attrs: string) => {
      const cleaned = attrs
        .replace(/\swidth="[^"]*"/gi, "")
        .replace(/\sheight="[^"]*"/gi, "")
        .replace(/\spreserveAspectRatio="[^"]*"/gi, "");

      if (dimensions === "fill") {
        return `<svg${cleaned} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">`;
      }

      return `<svg${cleaned} width="${dimensions}" height="${dimensions}" preserveAspectRatio="xMidYMid meet">`;
    }
  );

  return svg;
}

export async function fetchRawSvg(url: string) {
  if (!svgRequestCache.has(url)) {
    svgRequestCache.set(
      url,
      fetch(url).then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch SVG: ${res.status}`);
        }
        return res.text();
      })
    );
  }
  return svgRequestCache.get(url)!;
}

export async function downloadSvgFile(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

export async function downloadPngFile(
  svg: string,
  filename: string,
  size = 512
) {
  const encoded = encodeURIComponent(svg);
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encoded}`;

  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("PNG conversion failed"));
          return;
        }

        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
        resolve();
      }, "image/png");
    };
    img.onerror = () => reject(new Error("Failed to load SVG as image"));
    img.src = dataUrl;
  });
}

export function IconSvgPreview({
  url,
  color,
  strokeWidth,
  applyStrokeWidth,
  className,
  onRawSvgLoaded,
}: IconSvgPreviewProps) {
  const [rawSvg, setRawSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchRawSvg(url)
      .then((svg) => {
        if (cancelled) return;
        setRawSvg(svg);
        onRawSvgLoaded?.(svg);
      })
      .catch(() => {
        if (cancelled) return;
        setRawSvg(null);
        onRawSvgLoaded?.(null);
      });

    return () => {
      cancelled = true;
    };
  }, [url, onRawSvgLoaded]);

  const renderedSvg = useMemo(() => {
    if (!rawSvg) return null;
    return applySvgSettings(rawSvg, color, strokeWidth, applyStrokeWidth, "fill");
  }, [rawSvg, color, strokeWidth, applyStrokeWidth]);

  if (!renderedSvg) {
    return (
      <div
        className={cn(
          "size-full animate-pulse rounded-md bg-[var(--years-purple-100)]/50",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "size-full [&_svg]:size-full [&_svg]:max-w-none",
        className
      )}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: renderedSvg }}
    />
  );
}
