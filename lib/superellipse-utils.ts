/**
 * Superellipse utilities
 *
 * Parametric form: |x/a|^n + |y/b|^n = 1
 *   x(t) = a · sign(cos t) · |cos t|^(2/n)
 *   y(t) = b · sign(sin t) · |sin t|^(2/n)
 */

/* ── Path generation ── */

export function generateSuperellipsePath(
  width: number,
  height: number,
  power: number,
  numPoints = 360
): string {
  const a = width / 2;
  const b = height / 2;
  const exp = 2 / power;

  const points: [number, number][] = [];

  for (let i = 0; i < numPoints; i++) {
    const t = (2 * Math.PI * i) / numPoints;
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);

    const x = a + a * Math.sign(cosT) * Math.pow(Math.abs(cosT), exp);
    const y = b + b * Math.sign(sinT) * Math.pow(Math.abs(sinT), exp);

    points.push([x, y]);
  }

  const [first, ...rest] = points;
  const parts = [`M ${first[0].toFixed(4)} ${first[1].toFixed(4)}`];
  for (const [px, py] of rest) {
    parts.push(`L ${px.toFixed(4)} ${py.toFixed(4)}`);
  }
  parts.push("Z");

  return parts.join(" ");
}

/* ── SVG generation ── */

export function generateSuperellipseSvg(
  width: number,
  height: number,
  power: number,
  color: string
): string {
  const path = generateSuperellipsePath(width, height, power);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <path d="${path}" fill="${color}"/>
</svg>`;
}

/* ── CSS clip-path generation ── */

export function generateClipPathPolygon(
  power: number,
  numPoints = 360
): string {
  const exp = 2 / power;
  const coords: string[] = [];

  for (let i = 0; i < numPoints; i++) {
    const t = (2 * Math.PI * i) / numPoints;
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);

    const x = 50 + 50 * Math.sign(cosT) * Math.pow(Math.abs(cosT), exp);
    const y = 50 + 50 * Math.sign(sinT) * Math.pow(Math.abs(sinT), exp);

    coords.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }

  return `polygon(${coords.join(", ")})`;
}

export function generateClipPathSvg(
  width: number,
  height: number,
  power: number
): string {
  const path = generateSuperellipsePath(width, height, power);
  const scaleX = (1 / width).toFixed(6);
  const scaleY = (1 / height).toFixed(6);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
  <defs>
    <clipPath id="superellipse-clip" clipPathUnits="objectBoundingBox" transform="scale(${scaleX}, ${scaleY})">
      <path d="${path}"/>
    </clipPath>
  </defs>
</svg>`;
}

/* ── Preview scaling ── */

export function calculatePreviewScale(
  width: number,
  height: number,
  containerSize = 400
): number {
  const maxDim = Math.max(width, height);
  if (maxDim <= containerSize) return 1;
  return containerSize / maxDim;
}

/* ── Filenames ── */

export function formatSuperellipseFilename(
  width: number,
  height: number,
  power: number,
  extension: "svg" | "png"
): string {
  return `superellipse-${width}x${height}-n${power}.${extension}`;
}

/* ── Download helpers ── */

export async function downloadSuperellipseSvg(
  svg: string,
  filename: string
): Promise<void> {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadSuperellipsePng(
  svg: string,
  filename: string,
  width: number,
  height: number
): Promise<void> {
  const encoded = encodeURIComponent(svg);
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encoded}`;

  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

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

/* ── Clipboard ── */

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
