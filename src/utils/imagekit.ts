/**
 * Dynamically updates ImageKit asset URLs with optimization and sizing queries
 * to ensure quick page loads and eliminate CLS.
 */
export function getTransformedImage(url: string, width?: number, height?: number, quality = 80): string {
  if (!url) {
    // Return a black canvas SVG placeholder if no image URL is provided.
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width || 600}" height="${height || 800}" viewBox="0 0 600 800"><rect width="100%" height="100%" fill="%230b0b0b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%23444444">PREMIUM BLACK LABEL</text></svg>`;
  }

  // If it's an ImageKit URL, append transformations as query parameters
  if (url.includes("ik.imagekit.io")) {
    const separator = url.includes("?") ? "&" : "?";
    let tr = `tr=q-${quality},c-at_max`;
    if (width) tr += `,w-${width}`;
    if (height) tr += `,h-${height}`;
    return `${url}${separator}${tr}`;
  }

  return url;
}
