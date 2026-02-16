/**
 * Adaptive tile-color utilities for the icon explorer.
 *
 * Given an icon preview color, derive harmonious tile background / border
 * values so the tile never clashes with the icon sitting on top of it.
 */

/* ── Hex → HSL ── */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  ];
}

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l * 100];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return [h * 360, s * 100, l * 100];
}

/* ── WCAG relative luminance ── */

function linearize(c: number) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function getRelativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/* ── Tile color derivation ── */

export type TileColors = {
  bg: string;
  border: string;
  hoverBorder: string;
};

const DEFAULT_TILE: TileColors = {
  bg: "var(--years-purple-50)",
  border: "var(--years-purple-100)",
  hoverBorder: "var(--years-purple-200)",
};

export function getTileColors(
  iconColor: string,
  defaultColor: string
): TileColors {
  if (iconColor.toLowerCase() === defaultColor.toLowerCase()) {
    return DEFAULT_TILE;
  }

  const [h, s] = hexToHsl(iconColor);
  const lum = getRelativeLuminance(iconColor);

  if (lum >= 0.6) {
    // Light icon → dark tile
    const cs = Math.min(s, 25);
    return {
      bg: `hsl(${h}, ${cs}%, 15%)`,
      border: `hsl(${h}, ${cs}%, 22%)`,
      hoverBorder: `hsl(${h}, ${cs}%, 30%)`,
    };
  }

  // Dark / medium icon → light tile
  const cs = Math.min(s, 30);
  return {
    bg: `hsl(${h}, ${cs}%, 96%)`,
    border: `hsl(${h}, ${cs}%, 90%)`,
    hoverBorder: `hsl(${h}, ${cs}%, 84%)`,
  };
}
