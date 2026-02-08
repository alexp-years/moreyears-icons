export type SpacingToken = {
  name: string;
  px: number;
  rem: string;
};

const rawSpacing = [
  { name: "0", px: 0 },
  { name: "0.5", px: 2 },
  { name: "1", px: 4 },
  { name: "1.5", px: 6 },
  { name: "2", px: 8 },
  { name: "2.5", px: 10 },
  { name: "3", px: 12 },
  { name: "3.5", px: 14 },
  { name: "4", px: 16 },
  { name: "5", px: 20 },
  { name: "6", px: 24 },
  { name: "7", px: 28 },
  { name: "8", px: 32 },
  { name: "9", px: 36 },
  { name: "10", px: 40 },
  { name: "11", px: 44 },
  { name: "12", px: 48 },
  { name: "14", px: 56 },
  { name: "16", px: 64 },
  { name: "20", px: 80 },
  { name: "24", px: 96 },
  { name: "28", px: 112 },
  { name: "32", px: 128 },
  { name: "36", px: 144 },
  { name: "40", px: 160 },
  { name: "44", px: 176 },
  { name: "48", px: 192 },
  { name: "52", px: 208 },
  { name: "56", px: 224 },
  { name: "60", px: 240 },
  { name: "64", px: 256 },
  { name: "72", px: 288 },
  { name: "80", px: 320 },
  { name: "96", px: 384 },
];

export const spacingScale: SpacingToken[] = rawSpacing.map((token) => ({
  ...token,
  rem: `${token.px / 16}rem`,
}));
