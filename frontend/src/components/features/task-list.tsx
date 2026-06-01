"use client";

import { useCallback, useState } from "react";
import { apiClient } from "@/lib/utils";
import { TaskCard } from "./task-card";
import { TaskForm } from "./task-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Task } from "@/types";

interface TaskListProps {
  initialTasks: Task[];
  initialError: string | null;
}

/**
 * Client orchestrator: owns the task list state, renders the create form, and
 * re-fetches the list when a task is created. The initial data is fetched on
 * the server (see app/tasks/page.tsx) and hydrated here.
 */
export function TaskList({ initialTasks, initialError }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [error, setError] = useState<string | null>(initialError);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const { data, error } = await apiClient<Task[]>("/tasks", {
      cache: "no-store",
    });
    if (error) {
      setError(error);
    } else {
      setError(null);
      setTasks(data ?? []);
    }
    setIsRefreshing(false);
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm onSuccess={refresh} />
        </CardContent>
      </Card>

      <section aria-label="Task list" className="space-y-4">
        {isRefreshing && (
          <p className="text-sm text-muted-foreground">Refreshing…</p>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            Couldn&apos;t load tasks: {error}
          </div>
        )}

        {!error && tasks.length === 0 && (
          <div className="rounded-md border-2 border-dashed border-muted p-12 text-center text-muted-foreground">
            No tasks yet. Create your first one →
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>
    </div>
  );
}
