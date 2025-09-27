import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve media URLs coming from an external API that returns relative paths
 * like "/uploads/xyz.webp". If the path is absolute (http/https) it is
 * returned unchanged. For leading-slash paths, it prefixes with
 * NEXT_PUBLIC_MEDIA_BASE, or falls back to NEXT_PUBLIC_API_BASE with trailing
 * "/api" removed.
 */
export function resolveMediaUrl(src: string | undefined | null): string {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";
    const mediaBase = (process.env.NEXT_PUBLIC_MEDIA_BASE || apiBase).replace(
      /\/?api\/?$/,
      ""
    );
    if (mediaBase) {
      return `${mediaBase.replace(/\/$/, "")}${src}`;
    }
  }
  return src;
}
