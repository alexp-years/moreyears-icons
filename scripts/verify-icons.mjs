import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const canonicalWeights = [
  "linear",
  "bold",
  "bold-duotone",
  "outline",
  "line-duotone",
  "broken",
];

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicIconsDir = path.join(rootDir, "public", "icons");
const legacyManifestPath = path.join(publicIconsDir, "manifest.json");
const previewLimit = 20;

const readJson = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
};

const exists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const printList = (title, values) => {
  if (values.length === 0) return;
  console.error(`- ${title} (${values.length})`);
  for (const value of values.slice(0, previewLimit)) {
    console.error(`  - ${value}`);
  }
  if (values.length > previewLimit) {
    console.error(`  - ...and ${values.length - previewLimit} more`);
  }
};

const verify = async () => {
  const errors = [];
  const missingLegacy = [];
  const missingVersioned = [];

  let manifest;
  try {
    manifest = await readJson(legacyManifestPath);
  } catch (error) {
    throw new Error(
      `Unable to read ${legacyManifestPath}. Run "npm run icons:build" first. (${error.message})`
    );
  }

  if (!manifest || typeof manifest !== "object") {
    errors.push("public/icons/manifest.json is not a valid JSON object.");
  }

  const manifestVersion =
    typeof manifest?.version === "string" ? manifest.version.trim() : "";
  if (!manifestVersion) {
    errors.push(
      "public/icons/manifest.json is missing a valid string 'version' field."
    );
  }

  const manifestWeights = Array.isArray(manifest?.weights)
    ? manifest.weights
    : [];
  const missingCanonicalWeights = canonicalWeights.filter(
    (weight) => !manifestWeights.includes(weight)
  );
  const unexpectedWeights = manifestWeights.filter(
    (weight) => !canonicalWeights.includes(weight)
  );
  const duplicateWeights = manifestWeights.filter(
    (weight, index) => manifestWeights.indexOf(weight) !== index
  );

  if (missingCanonicalWeights.length > 0) {
    errors.push(
      `Manifest is missing canonical weight(s): ${missingCanonicalWeights.join(", ")}`
    );
  }
  if (unexpectedWeights.length > 0) {
    errors.push(
      `Manifest has unexpected weight(s): ${unexpectedWeights.join(", ")}`
    );
  }
  if (duplicateWeights.length > 0) {
    errors.push(
      `Manifest has duplicate weight(s): ${Array.from(new Set(duplicateWeights)).join(", ")}`
    );
  }

  const icons = Array.isArray(manifest?.icons) ? manifest.icons : [];
  if (icons.length === 0) {
    errors.push("Manifest has no icons.");
  }

  const versionedIconsDir = manifestVersion
    ? path.join(publicIconsDir, `v${manifestVersion}`)
    : null;
  const versionedManifestPath = versionedIconsDir
    ? path.join(versionedIconsDir, "manifest.json")
    : null;

  if (versionedManifestPath && !(await exists(versionedManifestPath))) {
    errors.push(
      `Versioned manifest is missing: ${path.relative(rootDir, versionedManifestPath)}`
    );
  }

  if (versionedManifestPath && (await exists(versionedManifestPath))) {
    const versionedManifest = await readJson(versionedManifestPath);
    if (versionedManifest.version !== manifestVersion) {
      errors.push(
        `Versioned manifest version mismatch. Expected "${manifestVersion}" but found "${versionedManifest.version}".`
      );
    }
    const versionedCount = Array.isArray(versionedManifest.icons)
      ? versionedManifest.icons.length
      : 0;
    if (versionedCount !== icons.length) {
      errors.push(
        `Versioned manifest icon count mismatch. Legacy=${icons.length}, versioned=${versionedCount}.`
      );
    }
  }

  for (const icon of icons) {
    const iconId = typeof icon?.id === "string" ? icon.id : "";
    if (!iconId) {
      errors.push("Encountered icon entry with missing string 'id'.");
      continue;
    }

    const iconWeights = Array.isArray(icon?.weights) ? icon.weights : [];
    if (iconWeights.length === 0) {
      errors.push(`Icon "${iconId}" has no weights.`);
      continue;
    }

    for (const weight of iconWeights) {
      if (!canonicalWeights.includes(weight)) {
        errors.push(`Icon "${iconId}" uses unknown weight "${weight}".`);
        continue;
      }

      const legacyPath = path.join(publicIconsDir, weight, `${iconId}.svg`);
      if (!(await exists(legacyPath))) {
        missingLegacy.push(`${weight}/${iconId}.svg`);
      }

      if (versionedIconsDir) {
        const versionedPath = path.join(
          versionedIconsDir,
          weight,
          `${iconId}.svg`
        );
        if (!(await exists(versionedPath))) {
          missingVersioned.push(`${weight}/${iconId}.svg`);
        }
      }
    }
  }

  if (errors.length > 0 || missingLegacy.length > 0 || missingVersioned.length > 0) {
    console.error("Icon verification failed.");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    printList("Missing legacy SVG files (/icons/<weight>/<id>.svg)", missingLegacy);
    printList(
      "Missing versioned SVG files (/icons/v<version>/<weight>/<id>.svg)",
      missingVersioned
    );
    process.exit(1);
  }

  console.log(
    `Verified ${icons.length} icons across ${canonicalWeights.length} canonical weights in both legacy and versioned trees (v${manifestVersion}).`
  );
};

verify().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
