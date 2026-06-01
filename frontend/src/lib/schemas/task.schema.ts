import { z } from "zod";

// Single source of truth for Task form validation.
// CONVENTION: zod schemas live in `lib/schemas/<entity>.schema.ts` and the
// inferred input type is exported alongside the schema.
// These enums mirror the Prisma enums in backend/prisma/schema.prisma.

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or fewer"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .or(z.literal("")),
  status: z.enum(TASK_STATUSES).default("TODO"),
  priority: z.enum(TASK_PRIORITIES).default("MEDIUM"),
});

// Form-side input type (what react-hook-form manages).
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
