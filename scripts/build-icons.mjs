import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as SolarCategories from "@solar-icons/react/ssr/category";

const weights = [
  "Outline",
  "Linear",
  "Bold",
  "BoldDuotone",
  "LineDuotone",
  "Broken",
];

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageDir = path.join(rootDir, "packages", "icons");
const distDir = path.join(packageDir, "dist");
const publicIconsDir = path.join(rootDir, "public", "icons");

const formatCategoryName = (name) => name.replace(/([a-z])([A-Z])/g, "$1 $2");

const toKebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();

const toDisplayName = (name) =>
  name.replace(/([a-z])([A-Z])/g, "$1 $2");

const hasSvgContent = (markup) =>
  /<(path|circle|rect|polygon|line|polyline|ellipse|g|defs|use)\b/i.test(
    markup
  );

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const writeSvg = async (baseDir, weight, id, markup) => {
  const weightDir = path.join(baseDir, weight.toLowerCase());
  await ensureDir(weightDir);
  await fs.writeFile(path.join(weightDir, `${id}.svg`), markup, "utf8");
};

const iconEntries = Object.entries(SolarCategories).filter(
  ([, icons]) => icons && typeof icons === "object"
);

const manifest = {
  version: "0.1.0",
  generatedAt: new Date().toISOString(),
  weights,
  icons: [],
};

const usedIds = new Set();

const getUniqueId = (baseId, category) => {
  if (!usedIds.has(baseId)) {
    usedIds.add(baseId);
    return baseId;
  }
  const withCategory = `${baseId}-${toKebab(category)}`;
  if (!usedIds.has(withCategory)) {
    usedIds.add(withCategory);
    return withCategory;
  }
  let idx = 2;
  let nextId = `${withCategory}-${idx}`;
  while (usedIds.has(nextId)) {
    idx += 1;
    nextId = `${withCategory}-${idx}`;
  }
  usedIds.add(nextId);
  return nextId;
};

const build = async () => {
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.rm(publicIconsDir, { recursive: true, force: true });
  await ensureDir(distDir);
  await ensureDir(publicIconsDir);

  for (const [rawCategory, icons] of iconEntries) {
    const category = formatCategoryName(rawCategory);
    const entries = Object.entries(icons);

    for (const [iconName, Icon] of entries) {
      const baseId = toKebab(iconName);
      const id = getUniqueId(baseId, category);
      const availableWeights = [];

      for (const weight of weights) {
        const markup = renderToStaticMarkup(
          React.createElement(Icon, {
            size: 24,
            color: "currentColor",
            weight,
          })
        );

        if (!hasSvgContent(markup)) continue;

        availableWeights.push(weight);
        await writeSvg(path.join(distDir, "icons"), weight, id, markup);
        await writeSvg(publicIconsDir, weight, id, markup);
      }

      if (availableWeights.length === 0) continue;

      manifest.icons.push({
        id,
        name: toDisplayName(iconName),
        sourceName: iconName,
        category,
        weights: availableWeights,
      });
    }
  }

  const sortedIcons = manifest.icons.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  manifest.icons = sortedIcons;

  await fs.writeFile(
    path.join(distDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );
  await fs.writeFile(
    path.join(publicIconsDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  const manifestModule = `export const manifest = ${JSON.stringify(
    manifest,
    null,
    2
  )};\n`;

  const indexModule = `import { manifest } from "./manifest.mjs";\n\nexport const icons = manifest.icons;\nexport const weights = manifest.weights;\nexport const fallbackWeights = manifest.weights;\n\nexport function getIcon(nameOrId) {\n  return manifest.icons.find((icon) => icon.id === nameOrId || icon.sourceName === nameOrId || icon.name === nameOrId);\n}\n\nexport function resolveWeight(available, preferred = fallbackWeights[0], fallbackOrder = fallbackWeights) {\n  if (available.includes(preferred)) return preferred;\n  const fallback = fallbackOrder.find((weight) => available.includes(weight));\n  return fallback || available[0];\n}\n\nexport function getIconUrl({ baseUrl = \"\", prefix = \"/icons\", id, weight }) {\n  const normalizedBase = baseUrl.replace(/\\/$/, \"\");\n  const normalizedPrefix = prefix.startsWith(\"/\") ? prefix : \"/\" + prefix;\n  return normalizedBase + normalizedPrefix + \"/\" + weight.toLowerCase() + \"/\" + id + \".svg\";\n}\n`;

  const reactModule = `import React from \"react\";\nimport { getIcon, resolveWeight, getIconUrl } from \"./index.mjs\";\n\nexport function Icon({\n  name,\n  weight = \"Outline\",\n  size = 24,\n  color = \"currentColor\",\n  baseUrl = \"\",\n  prefix = \"/icons\",\n  className,\n  title,\n  mode = \"mask\",\n  style,\n  ...rest\n}) {\n  const icon = getIcon(name);\n  if (!icon) return null;\n  const resolvedWeight = resolveWeight(icon.weights, weight);\n  const url = getIconUrl({ baseUrl, prefix, id: icon.id, weight: resolvedWeight });\n\n  if (mode === \"img\") {\n    return (\n      <img\n        src={url}\n        width={size}\n        height={size}\n        alt={title ?? icon.name}\n        className={className}\n        style={style}\n        {...rest}\n      />\n    );\n  }\n\n  return (\n    <span\n      role=\"img\"\n      aria-label={title ?? icon.name}\n      className={className}\n      style={{\n        width: size,\n        height: size,\n        backgroundColor: color,\n        WebkitMaskImage: "url(" + url + ")",\n        maskImage: "url(" + url + ")",\n        WebkitMaskRepeat: \"no-repeat\",\n        maskRepeat: \"no-repeat\",\n        WebkitMaskPosition: \"center\",\n        maskPosition: \"center\",\n        WebkitMaskSize: \"contain\",\n        maskSize: \"contain\",\n        display: \"inline-block\",\n        ...style,\n      }}\n      {...rest}\n    />\n  );\n}\n`;

  const typesModule = `import * as React from "react";

export type IconWeight = ${weights
    .map((weight) => `"${weight}"`)
    .join(" | ")};\n\nexport type IconMeta = {\n  id: string;\n  name: string;\n  sourceName: string;\n  category: string;\n  weights: IconWeight[];\n};\n\nexport type IconManifest = {\n  version: string;\n  generatedAt: string;\n  weights: IconWeight[];\n  icons: IconMeta[];\n};\n\nexport const manifest: IconManifest;\nexport const icons: IconMeta[];\nexport const weights: IconWeight[];\nexport const fallbackWeights: IconWeight[];\n\nexport function getIcon(nameOrId: string): IconMeta | undefined;\nexport function resolveWeight(\n  available: IconWeight[],\n  preferred?: IconWeight,\n  fallbackOrder?: IconWeight[]\n): IconWeight;\n\nexport function getIconUrl(options: {\n  baseUrl?: string;\n  prefix?: string;\n  id: string;\n  weight: IconWeight;\n}): string;\n\nexport type IconProps = {\n  name: string;\n  weight?: IconWeight;\n  size?: number | string;\n  color?: string;\n  baseUrl?: string;\n  prefix?: string;\n  className?: string;\n  title?: string;\n  mode?: \"mask\" | \"img\";\n  style?: React.CSSProperties;\n};\n\nexport function Icon(props: IconProps & React.HTMLAttributes<HTMLSpanElement>): JSX.Element | null;\n`;

  await fs.writeFile(path.join(distDir, "manifest.mjs"), manifestModule, "utf8");
  await fs.writeFile(path.join(distDir, "index.mjs"), indexModule, "utf8");
  await fs.writeFile(path.join(distDir, "react.mjs"), reactModule, "utf8");
  await fs.writeFile(path.join(distDir, "index.d.ts"), typesModule, "utf8");
  await fs.writeFile(path.join(distDir, "react.d.ts"), typesModule, "utf8");
};

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
