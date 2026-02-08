import { manifest } from "./manifest.mjs";

export const icons = manifest.icons;
export const weights = manifest.weights;
export const fallbackWeights = manifest.weights;

export function getIcon(nameOrId) {
  return manifest.icons.find((icon) => icon.id === nameOrId || icon.sourceName === nameOrId || icon.name === nameOrId);
}

export function resolveWeight(available, preferred = fallbackWeights[0], fallbackOrder = fallbackWeights) {
  if (available.includes(preferred)) return preferred;
  const fallback = fallbackOrder.find((weight) => available.includes(weight));
  return fallback || available[0];
}

export function getIconUrl({ baseUrl = "", prefix = "/icons", id, weight }) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPrefix = prefix.startsWith("/") ? prefix : "/" + prefix;
  return normalizedBase + normalizedPrefix + "/" + weight.toLowerCase() + "/" + id + ".svg";
}
