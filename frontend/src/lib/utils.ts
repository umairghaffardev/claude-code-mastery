import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui utility for merging Tailwind class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type-safe API client
export async function apiClient<T>(
  path: string,
  options?: RequestInit
): Promise<{ data: T; error: string | null }> {
  try {
    const res = await fetch(`/api/v1${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { data: null as unknown as T, error: body.message ?? res.statusText };
    }

    const json = await res.json();
    return { data: json.data ?? json, error: null };
  } catch (err) {
    return {
      data: null as unknown as T,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}
