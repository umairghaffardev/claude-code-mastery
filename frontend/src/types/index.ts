// Shared TypeScript types used across the frontend.
// These mirror the Prisma models defined in backend/prisma/schema.prisma.

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

// API response envelope — all endpoints return this shape
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  meta: {
    timestamp: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    timestamp: string;
    total: number;
    page: number;
    pageSize: number;
  };
}
