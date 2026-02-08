import tailwindColors from "tailwindcss/colors";

export type ShadeToken = {
  shade: string;
  hex: string;
};

export type ColorFamily = {
  name: string;
  description?: string;
  shades: ShadeToken[];
};

const shadeOrder = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
];

const buildShades = (color: Record<string, string>): ShadeToken[] =>
  shadeOrder
    .filter((shade) => Boolean(color[shade]))
    .map((shade) => ({ shade, hex: color[shade] }));

export const paletteNotice =
  "Palette values are temporary Tailwind defaults until the More Years palette is finalized.";

export const colorFamilies: ColorFamily[] = [
  {
    name: "Purple",
    description: "Primary creative accent and headline emphasis.",
    shades: buildShades(tailwindColors.purple),
  },
  {
    name: "Yellow",
    description: "Warm accent for highlights and celebratory moments.",
    shades: buildShades(tailwindColors.amber),
  },
  {
    name: "Pink",
    description: "Soft supporting accent for secondary highlights.",
    shades: buildShades(tailwindColors.pink),
  },
  {
    name: "Green",
    description: "Fresh accent for positive feedback and focus states.",
    shades: buildShades(tailwindColors.emerald),
  },
  {
    name: "Blue",
    description: "Trustworthy accent for interactive elements.",
    shades: buildShades(tailwindColors.blue),
  },
  {
    name: "Gray",
    description: "Neutral foundation for layouts and typography.",
    shades: buildShades(tailwindColors.gray),
  },
];

export const semanticColors: ColorFamily[] = [
  {
    name: "Success",
    description: "Positive confirmations and completion states.",
    shades: buildShades(tailwindColors.green),
  },
  {
    name: "Warning",
    description: "Cautionary messaging and validation.",
    shades: buildShades(tailwindColors.yellow),
  },
  {
    name: "Danger",
    description: "Errors, destructive actions, and critical alerts.",
    shades: buildShades(tailwindColors.red),
  },
];
