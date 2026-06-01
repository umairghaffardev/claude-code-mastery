import { TaskList } from "@/components/features";
import type { ApiResponse, Task } from "@/types";

// Server component: fetches the initial task list on the server (no client JS
// for the fetch) and hands it to the client <TaskList/> for interactivity.
export const dynamic = "force-dynamic";

async function getTasks(): Promise<{ tasks: Task[]; error: string | null }> {
  // Server-side fetch needs an absolute URL (relative URLs only work in the
  // browser, where next.config rewrites proxy /api/v1/* to the backend).
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  try {
    const res = await fetch(`${baseUrl}/api/v1/tasks`, { cache: "no-store" });
    if (!res.ok) {
      // 401 is expected until auth is wired (no login flow exists yet).
      return { tasks: [], error: `API responded ${res.status}` };
    }
    const json: ApiResponse<Task[]> = await res.json();
    return { tasks: json.data ?? [], error: null };
  } catch (err) {
    return {
      tasks: [],
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export default async function TasksPage() {
  const { tasks, error } = await getTasks();

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="mt-1 text-muted-foreground">
          Create, prioritize, and track your work.
        </p>
      </div>

      <TaskList initialTasks={tasks} initialError={error} />
    </div>
  );
}
