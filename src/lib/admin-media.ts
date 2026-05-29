import type { AdminMediaItem } from "@/components/admin-media-picker";

export function adminMediaAlt(value: unknown): AdminMediaItem["altText"] {
  return value && typeof value === "object" && !Array.isArray(value) ? value as NonNullable<AdminMediaItem["altText"]> : null;
}
