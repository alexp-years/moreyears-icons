import * as React from "react";

export type IconWeight = "Outline" | "Linear" | "Bold" | "BoldDuotone" | "LineDuotone" | "Broken";

export type IconMeta = {
  id: string;
  name: string;
  sourceName: string;
  category: string;
  weights: IconWeight[];
};

export type IconManifest = {
  version: string;
  generatedAt: string;
  weights: IconWeight[];
  icons: IconMeta[];
};

export const manifest: IconManifest;
export const icons: IconMeta[];
export const weights: IconWeight[];
export const fallbackWeights: IconWeight[];

export function getIcon(nameOrId: string): IconMeta | undefined;
export function resolveWeight(
  available: IconWeight[],
  preferred?: IconWeight,
  fallbackOrder?: IconWeight[]
): IconWeight;

export function getIconUrl(options: {
  baseUrl?: string;
  prefix?: string;
  id: string;
  weight: IconWeight;
}): string;

export type IconProps = {
  name: string;
  weight?: IconWeight;
  size?: number | string;
  color?: string;
  baseUrl?: string;
  prefix?: string;
  className?: string;
  title?: string;
  mode?: "mask" | "img";
  style?: React.CSSProperties;
};

export function Icon(props: IconProps & React.HTMLAttributes<HTMLSpanElement>): JSX.Element | null;
