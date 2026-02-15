import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);

const preferredWeightOrder = [
  "linear",
  "bold",
  "bold-duotone",
  "outline",
  "line-duotone",
  "broken",
];

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageDir = path.join(rootDir, "packages", "icons");
const distDir = path.join(packageDir, "dist");
const packageIconsDir = path.join(distDir, "icons");
const publicIconsDir = path.join(rootDir, "public", "icons");

const toKebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1-$2")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const toDisplayName = (name) =>
  name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatCategoryName = (slug) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const sortWeights = (weights) =>
  [...weights].sort((a, b) => {
    const aIndex = preferredWeightOrder.indexOf(a);
    const bIndex = preferredWeightOrder.indexOf(b);

    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

const copySvg = async (sourcePath, baseDir, weightSlug, id) => {
  const weightDir = path.join(baseDir, weightSlug);
  await ensureDir(weightDir);
  await fs.copyFile(sourcePath, path.join(weightDir, `${id}.svg`));
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

const writeModules = async (manifest) => {
  const manifestModule = `export const manifest = ${JSON.stringify(
    manifest,
    null,
    2
  )};\n`;

  const indexModule = `import { manifest } from "./manifest.mjs";\n\nexport const icons = manifest.icons;\nexport const weights = manifest.weights;\nexport const fallbackWeights = manifest.weights;\n\nexport function getIcon(nameOrId) {\n  return manifest.icons.find((icon) => icon.id === nameOrId || icon.sourceName === nameOrId || icon.name === nameOrId);\n}\n\nexport function resolveWeight(available, preferred = fallbackWeights[0], fallbackOrder = fallbackWeights) {\n  if (available.includes(preferred)) return preferred;\n  const fallback = fallbackOrder.find((weight) => available.includes(weight));\n  return fallback || available[0];\n}\n\nexport function getIconUrl({ baseUrl = "", prefix = "/icons", id, weight }) {\n  const normalizedBase = baseUrl.replace(/\\/$/, "");\n  const normalizedPrefix = prefix.startsWith("/") ? prefix : "/" + prefix;\n  return normalizedBase + normalizedPrefix + "/" + weight.toLowerCase() + "/" + id + ".svg";\n}\n`;

  const reactModule = `import React from "react";\nimport { getIcon, resolveWeight, getIconUrl, fallbackWeights } from "./index.mjs";\n\nexport function Icon({\n  name,\n  weight = fallbackWeights[0],\n  size = 24,\n  color = "currentColor",\n  baseUrl = "",\n  prefix = "/icons",\n  className,\n  title,\n  mode = "mask",\n  style,\n  ...rest\n}) {\n  const icon = getIcon(name);\n  if (!icon) return null;\n  const resolvedWeight = resolveWeight(icon.weights, weight);\n  const url = getIconUrl({ baseUrl, prefix, id: icon.id, weight: resolvedWeight });\n\n  if (mode === "img") {\n    return (\n      <img\n        src={url}\n        width={size}\n        height={size}\n        alt={title ?? icon.name}\n        className={className}\n        style={style}\n        {...rest}\n      />\n    );\n  }\n\n  return (\n    <span\n      role="img"\n      aria-label={title ?? icon.name}\n      className={className}\n      style={{\n        width: size,\n        height: size,\n        backgroundColor: color,\n        WebkitMaskImage: "url(" + url + ")",\n        maskImage: "url(" + url + ")",\n        WebkitMaskRepeat: "no-repeat",\n        maskRepeat: "no-repeat",\n        WebkitMaskPosition: "center",\n        maskPosition: "center",\n        WebkitMaskSize: "contain",\n        maskSize: "contain",\n        display: "inline-block",\n        ...style,\n      }}\n      {...rest}\n    />\n  );\n}\n`;

  const iconWeightUnion = manifest.weights.length
    ? manifest.weights.map((weight) => `"${weight}"`).join(" | ")
    : "string";

  const typesModule = `import * as React from "react";\n\nexport type IconWeight = ${iconWeightUnion};\n\nexport type IconMeta = {\n  id: string;\n  name: string;\n  sourceName: string;\n  category: string;\n  weights: IconWeight[];\n};\n\nexport type IconManifest = {\n  version: string;\n  generatedAt: string;\n  weights: IconWeight[];\n  icons: IconMeta[];\n};\n\nexport const manifest: IconManifest;\nexport const icons: IconMeta[];\nexport const weights: IconWeight[];\nexport const fallbackWeights: IconWeight[];\n\nexport function getIcon(nameOrId: string): IconMeta | undefined;\nexport function resolveWeight(\n  available: IconWeight[],\n  preferred?: IconWeight,\n  fallbackOrder?: IconWeight[]\n): IconWeight;\n\nexport function getIconUrl(options: {\n  baseUrl?: string;\n  prefix?: string;\n  id: string;\n  weight: IconWeight;\n}): string;\n\nexport type IconProps = {\n  name: string;\n  weight?: IconWeight;\n  size?: number | string;\n  color?: string;\n  baseUrl?: string;\n  prefix?: string;\n  className?: string;\n  title?: string;\n  mode?: "mask" | "img";\n  style?: React.CSSProperties;\n};\n\nexport function Icon(props: IconProps & React.HTMLAttributes<HTMLSpanElement>): JSX.Element | null;\n`;

  await fs.writeFile(path.join(distDir, "manifest.mjs"), manifestModule, "utf8");
  await fs.writeFile(path.join(distDir, "index.mjs"), indexModule, "utf8");
  await fs.writeFile(path.join(distDir, "react.mjs"), reactModule, "utf8");
  await fs.writeFile(path.join(distDir, "index.d.ts"), typesModule, "utf8");
  await fs.writeFile(path.join(distDir, "react.d.ts"), typesModule, "utf8");
};

const build = async () => {
  const upstreamEntryPath = require.resolve("@moreyears/icons");
  const upstreamDistRoot = path.dirname(upstreamEntryPath);
  const upstreamRoot = path.resolve(upstreamDistRoot, "..");
  const upstreamPackageJsonPath = path.join(upstreamRoot, "package.json");
  const upstreamPackage = JSON.parse(
    await fs.readFile(upstreamPackageJsonPath, "utf8")
  );
  const upstreamManifestPath = path.join(upstreamRoot, "dist", "manifest.json");
  const upstreamManifest = JSON.parse(
    await fs.readFile(upstreamManifestPath, "utf8")
  );

  await fs.rm(distDir, { recursive: true, force: true });
  await fs.rm(publicIconsDir, { recursive: true, force: true });
  await ensureDir(distDir);
  await ensureDir(packageIconsDir);
  await ensureDir(publicIconsDir);

  const manifest = {
    version: upstreamManifest.version ?? upstreamPackage.version,
    generatedAt: new Date().toISOString(),
    weights: [],
    icons: [],
  };

  const availableWeights = new Set();
  const iconEntries = Object.entries(upstreamManifest.icons ?? {});

  for (const [sourceId, icon] of iconEntries) {
    const baseId = toKebab(icon.slug || sourceId.split("/").pop() || sourceId);
    const category =
      icon.categoryName ||
      formatCategoryName(icon.category || "General");
    const id = getUniqueId(baseId, category);

    const iconWeights = [];

    for (const weightEntry of icon.weights ?? []) {
      const weightSlug = toKebab(weightEntry.weightSlug || weightEntry.weight || "");
      if (!weightSlug || !weightEntry.path) continue;

      const sourceSvgPath = path.join(upstreamRoot, weightEntry.path);
      try {
        await fs.access(sourceSvgPath);
      } catch {
        continue;
      }

      await copySvg(sourceSvgPath, packageIconsDir, weightSlug, id);
      await copySvg(sourceSvgPath, publicIconsDir, weightSlug, id);

      if (!iconWeights.includes(weightSlug)) {
        iconWeights.push(weightSlug);
      }
      availableWeights.add(weightSlug);
    }

    if (iconWeights.length === 0) continue;

    manifest.icons.push({
      id,
      name: icon.name || toDisplayName(baseId),
      sourceName: sourceId,
      category,
      weights: sortWeights(iconWeights),
    });
  }

  manifest.icons.sort((a, b) => a.name.localeCompare(b.name));
  manifest.weights = sortWeights(availableWeights);

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

  await writeModules(manifest);

  console.log(
    `Synced ${manifest.icons.length} icons from @moreyears/icons@${upstreamPackage.version}`
  );
};

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
