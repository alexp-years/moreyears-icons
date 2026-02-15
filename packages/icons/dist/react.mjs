import React from "react";
import { getIcon, resolveWeight, getIconUrl, fallbackWeights } from "./index.mjs";

export function Icon({
  name,
  weight = fallbackWeights[0],
  size = 24,
  color = "currentColor",
  baseUrl = "",
  prefix = "/icons",
  className,
  title,
  mode = "mask",
  style,
  ...rest
}) {
  const icon = getIcon(name);
  if (!icon) return null;
  const resolvedWeight = resolveWeight(icon.weights, weight);
  const url = getIconUrl({ baseUrl, prefix, id: icon.id, weight: resolvedWeight });

  if (mode === "img") {
    return (
      <img
        src={url}
        width={size}
        height={size}
        alt={title ?? icon.name}
        className={className}
        style={style}
        {...rest}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={title ?? icon.name}
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: "url(" + url + ")",
        maskImage: "url(" + url + ")",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        display: "inline-block",
        ...style,
      }}
      {...rest}
    />
  );
}
