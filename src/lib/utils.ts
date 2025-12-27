import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve media URLs coming from an external API that returns relative paths
 * like "/uploads/xyz.webp" or "/api/uploads/xyz.webp". 
 * If the path is absolute (http/https) it is returned unchanged. 
 * For leading-slash paths:
 * - If path starts with /api/, use NEXT_PUBLIC_API_BASE directly
 * - If path starts with /uploads/, convert to /api/uploads/ for backward compatibility
 * - Otherwise, use NEXT_PUBLIC_MEDIA_BASE with /api removed
 */
export function resolveMediaUrl(src: string | undefined | null): string {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";
    const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE || "";

    // For API routes, use the full API base URL
    if (src.startsWith("/api/")) {
      // If apiBase is absolute (starts with http), use it directly
      if (apiBase.startsWith("http")) {
        const baseWithoutApi = apiBase.replace(/\/api\/?$/, "");
        return `${baseWithoutApi}${src}`;
      }
      // If apiBase is relative or empty, return the path as-is (will be relative to current domain)
      return src;
    }

    // Convert old /uploads/ paths to /api/uploads/ for backward compatibility
    if (src.startsWith("/uploads/")) {
      const convertedPath = src.replace(/^\/uploads\//, "/api/uploads/");
      
      // If apiBase is absolute (starts with http), use it
      if (apiBase.startsWith("http")) {
        const baseWithoutApi = apiBase.replace(/\/api\/?$/, "");
        return `${baseWithoutApi}${convertedPath}`;
      }
      // If apiBase is relative or empty, return the converted path as-is
      return convertedPath;
    }

    // For other paths, use media base with /api removed
    if (mediaBase) {
      const cleanMediaBase = mediaBase.replace(/\/?api\/?$/, "").replace(/\/$/, "");
      if (cleanMediaBase) {
        return `${cleanMediaBase}${src}`;
      }
    } else if (apiBase && apiBase.startsWith("http")) {
      // Fallback to apiBase if mediaBase is not set
      const baseWithoutApi = apiBase.replace(/\/api\/?$/, "").replace(/\/$/, "");
      if (baseWithoutApi) {
        return `${baseWithoutApi}${src}`;
      }
    }
  }
  return src;
}
