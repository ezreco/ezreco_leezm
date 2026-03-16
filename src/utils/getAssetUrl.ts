// Vite asset URL resolver utility
// This function converts src/assets/... paths to proper bundled asset URLs

const assetModules = import.meta.glob<{ default: string }>(
  "/src/assets/**/*.{png,jpg,jpeg,svg,gif,webp}",
  { eager: true }
);

/**
 * Converts a src/assets/... path to a bundled asset URL
 * @param path - Path starting with "src/assets/..."
 * @returns The bundled asset URL
 */
export function getAssetUrl(path: string): string {
  // Normalize the path to start with /src/assets/
  const normalizedPath = path.startsWith("/")
    ? path
    : path.startsWith("src/")
    ? `/${path}`
    : `/src/${path}`;

  // Find the matching module
  const module = assetModules[normalizedPath];

  if (module && module.default) {
    return module.default;
  }

  // Fallback: return the original path (for development)
  console.warn(`Asset not found: ${normalizedPath}`);
  return path;
}

/**
 * Process an object recursively to convert all src/assets paths
 * @param obj - Object to process
 * @returns Processed object with resolved asset URLs
 */
export function resolveAssetUrls<T>(obj: T): T {
  if (typeof obj === "string") {
    if (obj.includes("src/assets/")) {
      return getAssetUrl(obj) as T;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => resolveAssetUrls(item)) as T;
  }

  if (obj !== null && typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = resolveAssetUrls(value);
    }
    return result;
  }

  return obj;
}
