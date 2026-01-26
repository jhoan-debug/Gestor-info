import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

// Util: combina clases CSS usando clsx y twMerge.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
